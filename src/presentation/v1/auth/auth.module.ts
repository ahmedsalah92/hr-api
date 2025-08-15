import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtTokenService } from 'src/infrastructure/adapters/jwt-token.service';
import { Argon2PasswordHasher } from 'src/infrastructure/adapters/argon2-password-hasher';
import { AesGcmMfaCipher } from 'src/infrastructure/adapters/aes-gcm-mfa-cipher';
import { OtplibTotpAdapter } from 'src/infrastructure/adapters/otplib-totp.adapter';
import { InMemoryRateLimiter } from 'src/infrastructure/adapters/rate-limiter.adapter';
import { SystemTimeAdapter } from 'src/infrastructure/adapters/time.adapter';
import { CryptoUuidAdapter } from 'src/infrastructure/adapters/uuid.adapter';
import { CryptoRandomAdapter } from 'src/infrastructure/adapters/random.adapter';

@Module({
  imports: [ConfigModule.forFeature(() => ({}))],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtTokenService,
    Argon2PasswordHasher,
    AesGcmMfaCipher,
    OtplibTotpAdapter,
    InMemoryRateLimiter,
    SystemTimeAdapter,
    CryptoUuidAdapter,
    CryptoRandomAdapter,
  ],
  exports: [
    JwtTokenService,
    Argon2PasswordHasher,
    AesGcmMfaCipher,
    OtplibTotpAdapter,
    InMemoryRateLimiter,
    SystemTimeAdapter,
    CryptoUuidAdapter,
    CryptoRandomAdapter,
  ],
})
export class AuthModule {}
