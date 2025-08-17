import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import type {
  RefreshTokenRepositoryPort,
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshRevokeReason,
} from 'src/application/auth/ports/refresh-token-repository.port';
import type { Prisma } from '@prisma/client';

type Row = Prisma.RefreshTokenGetPayload<{
  select: typeof refreshSelect;
}>;

const refreshSelect = {
  userId: true,
  jti: true, // unique
  family: true, // if your column is familyId, change here to familyId: true
  hashedToken: true,
  createdAt: true,
  expiresAt: true,
  revokedAt: true,
  userAgent: true,
  ip: true,
} as const;

function toRecord(r: Row): RefreshTokenRecord {
  return {
    id: r.jti, // port id === db jti
    userId: r.userId,
    familyId: r.family, // map to familyId for the port
    issuedAt: r.createdAt,
    expiresAt: r.expiresAt,
    revokedAt: r.revokedAt,
    replacedBy: null, // no column in schema yet
    userAgentHash: r.userAgent ?? null,
    ipHash: r.ip ?? null,
  };
}

@Injectable()
export class PrismaRefreshTokenRepository
  implements RefreshTokenRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  // Port expects: Promise<void>
  async create(input: CreateRefreshTokenInput): Promise<void> {
    // NOTE: your port uses tokenHash (not hashedToken)
    await this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        jti: input.id, // id === jti in the port
        family: input.familyId, // change to familyId: input.familyId if your column is familyId
        hashedToken: input.tokenHash, // <-- match port field
        createdAt: input.issuedAt,
        expiresAt: input.expiresAt,
        userAgent: input.userAgentHash ?? null,
        ip: input.ipHash ?? null,
      },
      select: { jti: true }, // minimal roundtrip
    });
  }

  async findById(id: string): Promise<RefreshTokenRecord | null> {
    const row = await this.prisma.refreshToken.findUnique({
      where: { jti: id },
      select: refreshSelect,
    });
    return row ? toRecord(row) : null;
  }

  async findByHashedToken(hashed: string): Promise<RefreshTokenRecord | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { hashedToken: hashed },
      select: refreshSelect,
    });
    return row ? toRecord(row) : null;
  }

  async revoke(
    id: string,
    at: Date,
    reason: RefreshRevokeReason,
  ): Promise<void> {
    // mark 'reason' as used for eslint without schema column
    void reason;
    await this.prisma.refreshToken.update({
      where: { jti: id },
      data: { revokedAt: at },
      select: { jti: true },
    });
  }

  async revokeFamily(
    userId: string,
    familyId: string,
    at: Date,
    reason: RefreshRevokeReason,
  ): Promise<number> {
    void reason;
    const res = await this.prisma.refreshToken.updateMany({
      where: { userId, family: familyId, revokedAt: null }, // change family→familyId if your column is familyId
      data: { revokedAt: at },
    });
    return res.count;
  }

  // Port requires Promise<void>, but there's no column; avoid require-await
  linkRotation(oldId: string, newId: string): Promise<void> {
    void oldId;
    void newId;
    return Promise.resolve();
  }

  // Include only if your port declares it (harmless if unused)
  async purgeExpired(now: Date): Promise<number> {
    const res = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return res.count;
  }
}
