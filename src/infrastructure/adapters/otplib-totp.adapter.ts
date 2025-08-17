import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';

@Injectable()
export class OtplibTotpAdapter {
  private readonly issuer: string;
  private readonly totp = authenticator.clone();

  constructor(private readonly cfg: ConfigService) {
    // issuer
    const rawIssuer: unknown = this.cfg.get('MFA_ISSUER', { infer: true });
    this.issuer =
      typeof rawIssuer === 'string' && rawIssuer.trim() ? rawIssuer : 'HR API';

    // window (drift)
    const rawWin: unknown = this.cfg.get('MFA_TOTP_WINDOW', { infer: true });
    const n = Number(rawWin);
    const window = Number.isFinite(n) ? Math.trunc(n) : 1;

    // configure drift on our local instance (NOT global)
    this.totp.options = { ...this.totp.options, window };
  }

  generateSecret(): string {
    return this.totp.generateSecret();
  }

  keyUri(email: string, issuer: string = this.issuer, secret: string): string {
    return this.totp.keyuri(email, issuer, secret);
  }

  verify(token: string, secret: string, window?: number): boolean {
    const current = this.totp.options.window as number;
    const win = window ?? current;
    // fast path: use preconfigured instance
    if (win === current) {
      return this.totp.verify({ token, secret });
    }
    // per-call override without touching shared state
    const tmp = authenticator.clone();
    tmp.options = { ...this.totp.options, window: win };
    return tmp.verify({ token, secret });
  }
}
