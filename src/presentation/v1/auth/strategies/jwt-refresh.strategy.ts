// src/presentation/v1/auth/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtFromRequestFunction, StrategyOptions } from 'passport-jwt';

export const REFRESH_COOKIE = 'refresh_token';

type RequestWithCookies = Omit<Request, 'cookies'> & {
  cookies?: Record<string, unknown>;
};

type JwtRefreshPayload = Readonly<{
  sub: string; // user id (cuid)
  family: string; // refresh token family id
  jti: string; // token id
}>;

const jwtFromRefreshCookie: JwtFromRequestFunction = (
  req: Request,
): string | null => {
  const r = req as RequestWithCookies;

  const raw = r.cookies?.[REFRESH_COOKIE];
  if (typeof raw === 'string' && raw.length > 0) return raw;

  // fallback: Authorization: Bearer <token>
  const auth = req.get('authorization');
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length);
  }
  return null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(cfg: ConfigService) {
    const secret = cfg.getOrThrow<string>('JWT_REFRESH_SECRET', {
      infer: true,
    });

    const options: StrategyOptions = {
      jwtFromRequest: jwtFromRefreshCookie,
      secretOrKey: secret,
      algorithms: ['HS512'],
      issuer: 'hr-api',
      ignoreExpiration: false,
      // NOTE: validate() does not receive req because passReqToCallback is false
    };

    super(options);
  }

  // Keep raw payload; use case will check family/jti against the DB
  validate(payload: JwtRefreshPayload): JwtRefreshPayload {
    return payload;
  }
}
