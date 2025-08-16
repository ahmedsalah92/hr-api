// src/infrastructure/auth/repositories/prisma-refresh-token.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  refreshTokenSelect,
  mapRefreshRow,
  type RefreshTokenProjection,
} from '../mappers/auth.mappers';

export type CreateRefreshInput = {
  userId: string;
  jti: string; // JWT ID (unique)
  family: string; // stable family id
  hashedToken: string; // hash of the opaque refresh token
  issuedAt: Date; // maps to createdAt
  expiresAt: Date;
  ip?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class PrismaRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRefreshInput): Promise<RefreshTokenProjection> {
    const row = await this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        jti: input.jti,
        family: input.family,
        hashedToken: input.hashedToken,
        createdAt: input.issuedAt,
        expiresAt: input.expiresAt,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
      select: refreshTokenSelect,
    });
    return mapRefreshRow(row);
  }

  /** Look up by JTI (preferred, it's unique). */
  async findByJti(jti: string): Promise<RefreshTokenProjection | null> {
    const row = await this.prisma.refreshToken.findUnique({
      where: { jti },
      select: refreshTokenSelect,
    });
    return row ? mapRefreshRow(row) : null;
  }

  /**
   * Fallback: look up by hashed token. Since not unique, use findFirst.
   * (Consider @@index on `hashedToken` for perf.)
   */
  async findByHashedToken(
    hashed: string,
  ): Promise<RefreshTokenProjection | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { hashedToken: hashed },
      select: refreshTokenSelect,
    });
    return row ? mapRefreshRow(row) : null;
  }

  async revokeByJti(jti: string, at: Date): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { jti },
      data: { revokedAt: at },
      select: { jti: true },
    });
  }

  async revokeFamily(
    userId: string,
    family: string,
    at: Date,
  ): Promise<number> {
    const res = await this.prisma.refreshToken.updateMany({
      where: { userId, family, revokedAt: null },
      data: { revokedAt: at },
    });
    return res.count;
  }

  async purgeExpired(now: Date): Promise<number> {
    const res = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return res.count;
  }
}
