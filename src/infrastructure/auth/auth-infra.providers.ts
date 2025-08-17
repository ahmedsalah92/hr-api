import { Provider } from '@nestjs/common';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  MFA_RECOVERY_REPOSITORY,
  TOKEN_SERVICE,
  PASSWORD_HASHER,
  MFA_CIPHER,
  TOTP,
  RATE_LIMITER,
  TIME,
  UUID,
  RANDOM,
} from 'src/application/auth/ports/tokens';

import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository';
import { PrismaMfaRecoveryRepository } from './repositories/prisma-mfa-recovery.repository';

import { JwtTokenService } from 'src/infrastructure/adapters/jwt-token.service';
import { Argon2PasswordHasher } from 'src/infrastructure/adapters/argon2-password-hasher';
import { AesGcmMfaCipher } from 'src/infrastructure/adapters/aes-gcm-mfa-cipher';
import { OtplibTotpAdapter } from 'src/infrastructure/adapters/otplib-totp.adapter';
import { InMemoryRateLimiter } from 'src/infrastructure/adapters/rate-limiter.adapter';
import { SystemTimeAdapter } from 'src/infrastructure/adapters/time.adapter';
import { CryptoUuidAdapter } from 'src/infrastructure/adapters/uuid.adapter';
import { CryptoRandomAdapter } from 'src/infrastructure/adapters/random.adapter';

export const AUTH_INFRA_PROVIDERS: Provider[] = [
  { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  { provide: REFRESH_TOKEN_REPOSITORY, useClass: PrismaRefreshTokenRepository },
  { provide: MFA_RECOVERY_REPOSITORY, useClass: PrismaMfaRecoveryRepository },

  { provide: TOKEN_SERVICE, useClass: JwtTokenService },
  { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
  { provide: MFA_CIPHER, useClass: AesGcmMfaCipher },
  { provide: TOTP, useClass: OtplibTotpAdapter },
  { provide: RATE_LIMITER, useClass: InMemoryRateLimiter },
  { provide: TIME, useClass: SystemTimeAdapter },
  { provide: UUID, useClass: CryptoUuidAdapter },
  { provide: RANDOM, useClass: CryptoRandomAdapter },
];
