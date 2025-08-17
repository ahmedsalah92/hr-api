import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodecrypto from 'crypto';
import type { MfaCipherPort } from 'src/application/auth/ports/mfa-cipher.port';

@Injectable()
export class AesGcmMfaCipher implements MfaCipherPort {
  private readonly key: Buffer;
  constructor(cfg: ConfigService) {
    const b64 = cfg.get<string>('MFA_ENC_KEY', { infer: true })!;
    this.key = Buffer.from(b64, 'base64');
    if (this.key.length !== 32)
      throw new Error('MFA_ENC_KEY must be 32 bytes base64');
  }

  encrypt(plain: string): string {
    const iv = nodecrypto.randomBytes(12);
    const cipher = nodecrypto.createCipheriv('aes-256-gcm', this.key, iv);
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${ct.toString('base64')}:${tag.toString('base64')}`;
  }

  decrypt(payload: string): string {
    const [ivB, ctB, tagB] = payload.split(':');
    if (!ivB || !ctB || !tagB) {
      throw new Error('Invalid encrypted MFA payload format');
    }

    const iv = Buffer.from(ivB, 'base64');
    const ct = Buffer.from(ctB, 'base64');
    const tag = Buffer.from(tagB, 'base64');
    const decipher = nodecrypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString('utf8');
  }
}
