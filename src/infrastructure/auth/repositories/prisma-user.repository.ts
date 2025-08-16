// src/infrastructure/auth/repositories/prisma-user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  userAuthSelect,
  mapUserAuthRow,
  type UserAuthProjection,
  userMeSelect,
  mapUserMeRow,
  type UserMeProjection,
} from '../mappers/auth.mappers';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAuthByEmail(email: string): Promise<UserAuthProjection | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: userAuthSelect,
    });
    return row ? mapUserAuthRow(row) : null;
  }

  async findAuthById(id: string): Promise<UserAuthProjection | null> {
    const row = await this.prisma.user.findUnique({
      where: { id },
      select: userAuthSelect,
    });
    return row ? mapUserAuthRow(row) : null;
  }

  async incrementFailedAuth(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLogins: { increment: 1 } },
      select: { id: true },
    });
  }

  async lockAccountUntil(userId: string, until: Date | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: until },
      select: { id: true },
    });
  }

  async clearFailedAuth(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLogins: 0, lockedUntil: null },
      select: { id: true },
    });
  }

  async findByIdForMe(userId: string): Promise<UserMeProjection | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userMeSelect,
    });
    return row ? mapUserMeRow(row) : null;
  }
}
