// src/infrastructure/adapters/jwt-token.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  signJwt,
  verifyJwt,
  type JwtAlgorithm,
  type SignInput,
} from 'src/infrastructure/adapters/jwt-typed';

import { randomUUID } from 'node:crypto';
import type {
  TokenServicePort,
  SignedToken,
} from 'src/application/auth/ports/token-service.port';

type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
const ALG: JwtAlgorithm = 'HS512';
const ISSUER = 'hr-api';

/** ----- helpers ----- */
function parseTtlSeconds(input: string): number {
  const m = /^(\d+)([smhd])?$/.exec(input);
  if (!m) throw new Error(`Bad TTL: ${input}`);
  const n = Number(m[1]);
  const unit = m[2] ?? 's';
  const mult =
    unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
  return n * mult;
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function isRole(v: unknown): v is Role {
  return v === 'ADMIN' || v === 'MANAGER' || v === 'EMPLOYEE';
}

/** ----- payload types + guards ----- */
type AccessPayload = {
  sub: string;
  email: string;
  role: Role;
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
};
type RefreshPayload = {
  sub: string;
  family: string;
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
};
type MfaPayload = {
  sub: string;
  kind: 'mfa';
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
};

function isAccessPayload(u: unknown): u is AccessPayload {
  if (!isRecord(u)) return false;
  const sub = u['sub'];
  const email = u['email'];
  const role = u['role'];
  const jti = u['jti'];
  return isString(sub) && isString(email) && isRole(role) && isString(jti);
}
function isRefreshPayload(u: unknown): u is RefreshPayload {
  if (!isRecord(u)) return false;
  const sub = u['sub'];
  const family = u['family'];
  const jti = u['jti'];
  return isString(sub) && isString(family) && isString(jti);
}
function isMfaPayload(u: unknown): u is MfaPayload {
  if (!isRecord(u)) return false;
  const sub = u['sub'];
  const kind = u['kind'];
  const jti = u['jti'];
  return isString(sub) && kind === 'mfa' && isString(jti);
}

/** strict config retrieval */
function mustGetString(cfg: ConfigService, key: string): string {
  const val = cfg.get<string>(key, { infer: true });
  if (typeof val !== 'string' || val.length === 0) {
    throw new Error(`Missing or invalid config: ${key}`);
  }
  return val;
}

/** ----- service ----- */
@Injectable()
export class JwtTokenService implements TokenServicePort {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtlSec: number;
  private readonly refreshTtlSec: number;

  constructor(private readonly cfg: ConfigService) {
    this.accessSecret = mustGetString(cfg, 'JWT_ACCESS_SECRET');
    this.refreshSecret = mustGetString(cfg, 'JWT_REFRESH_SECRET');
    this.accessTtlSec = parseTtlSeconds(mustGetString(cfg, 'JWT_ACCESS_TTL'));
    this.refreshTtlSec = parseTtlSeconds(mustGetString(cfg, 'JWT_REFRESH_TTL'));
  }

  private make(
    payload: Record<string, unknown>,
    secret: string,
    ttlSec: number,
  ): SignedToken {
    const jti = randomUUID();
    const input: SignInput = {
      payload: { ...payload, jti },
      secret,
      alg: ALG,
      expiresInSec: ttlSec,
      issuer: ISSUER,
    };
    const token = signJwt(input);
    return { token, jti, expiresAt: new Date(Date.now() + ttlSec * 1000) };
  }

  // Note: incoming jti on payload is ignored for access tokens; we mint a fresh one.
  signAccess(payload: {
    sub: string;
    email: string;
    role: Role;
    jti: string;
  }): SignedToken {
    const { sub, email, role } = payload;
    return this.make(
      { sub, email, role },
      this.accessSecret,
      this.accessTtlSec,
    );
  }

  signRefresh(payload: {
    sub: string;
    family: string;
    jti: string;
  }): SignedToken {
    const { sub, family } = payload;
    return this.make({ sub, family }, this.refreshSecret, this.refreshTtlSec);
  }

  signMfa(payload: { sub: string; jti: string }): SignedToken {
    const { sub } = payload;
    return this.make({ sub, kind: 'mfa' as const }, this.accessSecret, 300); // 5 minutes
  }

  verifyAccess(token: string): {
    sub: string;
    email: string;
    role: Role;
    jti: string;
  } {
    const decoded = verifyJwt(token, this.accessSecret, ALG, ISSUER);

    if (!isAccessPayload(decoded))
      throw new Error('Invalid access token payload');
    const { sub, email, role, jti } = decoded;
    return { sub, email, role, jti };
  }

  verifyRefresh(token: string): { sub: string; family: string; jti: string } {
    const decoded = verifyJwt(token, this.refreshSecret, ALG, ISSUER);

    if (!isRefreshPayload(decoded))
      throw new Error('Invalid refresh token payload');
    const { sub, family, jti } = decoded;
    return { sub, family, jti };
  }

  verifyMfa(token: string): { sub: string; jti: string } {
    const decoded = verifyJwt(token, this.accessSecret, ALG, ISSUER);
    if (!isMfaPayload(decoded)) throw new Error('Invalid MFA token payload');
    const { sub, jti } = decoded;
    return { sub, jti };
  }
}
