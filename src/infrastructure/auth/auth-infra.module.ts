// src/infrastructure/auth/auth-infra.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  PrismaUserRepository,
  PrismaRefreshTokenRepository,
  PrismaMfaRecoveryRepository,
} from './repositories';

// If Step 1 defined custom injection tokens, replace `provide` with those tokens.
@Module({
  providers: [
    PrismaService,
    { provide: PrismaUserRepository, useClass: PrismaUserRepository },
    {
      provide: PrismaRefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: PrismaMfaRecoveryRepository,
      useClass: PrismaMfaRecoveryRepository,
    },
  ],
  exports: [
    PrismaUserRepository,
    PrismaRefreshTokenRepository,
    PrismaMfaRecoveryRepository,
  ],
})
export class AuthInfraModule {}
