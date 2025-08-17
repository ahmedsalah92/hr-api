import { Injectable } from '@nestjs/common';
import type {
  UserRepositoryPort,
  UserAuthProjection,
  UserMeProjection,
  FailedAuth,
} from 'src/application/auth/ports/user-repository.port';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  userAuthSelect,
  userMeSelect,
  mapUserAuthRow,
  mapUserMeRow,
} from '../mappers/auth.mappers';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  // Port: findByEmailForAuth(email): Promise<UserAuthProjection | null>
  async findByEmailForAuth(email: string): Promise<UserAuthProjection | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: userAuthSelect,
    });
    return row ? mapUserAuthRow(row) : null;
  }

  // Port: findByIdForMe(userId): Promise<UserMeProjection | null>
  async findByIdForMe(userId: string): Promise<UserMeProjection | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userMeSelect,
    });
    return row ? mapUserMeRow(row) : null;
  }

  // Port: setFailedAuth(userId, next: FailedAuth): Promise<void>
  async setFailedAuth(userId: string, next: FailedAuth): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLogins: next.count, lockedUntil: next.lockedUntil },
      select: { id: true },
    });
  }

  // Port: clearFailedAuth(userId): Promise<void>
  async clearFailedAuth(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLogins: 0, lockedUntil: null },
      select: { id: true },
    });
  }
}
