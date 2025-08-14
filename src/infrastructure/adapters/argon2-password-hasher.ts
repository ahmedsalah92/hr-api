import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../application/auth/ports/password-hasher.port';

@Injectable()
export class Argon2PasswordHasher implements PasswordHasherPort {
  private readonly memKiB = 65536; // ~64MB
  private readonly timeCost = 3;
  private readonly parallelism = 1;

  // constructor(_: ConfigService) {} // Reserved for future env tuning

  async hash(plain: string): Promise<string> {
    return argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: this.memKiB,
      timeCost: this.timeCost,
      parallelism: this.parallelism,
    });
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}
