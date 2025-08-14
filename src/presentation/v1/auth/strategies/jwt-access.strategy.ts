import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtFromRequestFunction } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { RequestUser } from '../types/request-user.type';

type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService) {
    const jwtFromRequest: JwtFromRequestFunction =
      ExtractJwt.fromAuthHeaderAsBearerToken();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest,
      secretOrKey: cfg.getOrThrow<string>('JWT_ACCESS_SECRET', { infer: true }),
      algorithms: ['HS512'],
      issuer: 'hr-api',
      ignoreExpiration: false,
    });
  }
  validate(payload: {
    sub: string;
    email: string;
    role: Role;
    jti: string;
  }): RequestUser {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
