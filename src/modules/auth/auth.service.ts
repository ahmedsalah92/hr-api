import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenResponseDto } from './dto/token-response.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { employee: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Incorrect password');

    return user;
  }

  async login(user: { id: string; role: Role }): Promise<TokenResponseDto> {
    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // TEMP
      },
    });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  }

  async refreshToken(oldToken: string): Promise<TokenResponseDto> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Optional: check if expired
    if (storedToken.expiresAt.getTime() < Date.now()) {
      await this.prisma.refreshToken.delete({ where: { token: oldToken } });
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = storedToken.user;

    const payload = { sub: user.id, role: user.role };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    // Rotate: delete old, insert new
    await this.prisma.refreshToken.delete({ where: { token: oldToken } });
    await this.prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
