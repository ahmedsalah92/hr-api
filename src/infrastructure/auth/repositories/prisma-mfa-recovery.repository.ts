// src/infrastructure/auth/repositories/prisma-mfa-recovery.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaMfaRecoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listHashes(userId: string): Promise<readonly string[]> {
    const rows = await this.prisma.mfaRecoveryCode.findMany({
      where: { userId, usedAt: null },
      select: { codeHash: true },
    });
    return rows.map((r) => r.codeHash);
  }

  async consumeByHash(userId: string, hash: string): Promise<boolean> {
    const res = await this.prisma.mfaRecoveryCode.updateMany({
      where: { userId, codeHash: hash, usedAt: null },
      data: { usedAt: new Date() },
    });
    return res.count === 1;
  }

  async addHashes(userId: string, hashes: readonly string[]): Promise<void> {
    if (hashes.length === 0) return;
    await this.prisma.mfaRecoveryCode.createMany({
      data: hashes.map((h) => ({ userId, codeHash: h })),
      skipDuplicates: false,
    });
  }

  async count(userId: string): Promise<number> {
    return this.prisma.mfaRecoveryCode.count({
      where: { userId, usedAt: null },
    });
  }
}
