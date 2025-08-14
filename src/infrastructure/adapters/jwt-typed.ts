// src/infrastructure/adapters/jwt-typed.ts
import {
  sign as _sign,
  verify as _verify,
  type SignOptions,
  type VerifyOptions,
} from 'jsonwebtoken';

// Local, explicit union (no external type bleed)
export type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

export type SignInput = {
  payload: object;
  secret: string;
  alg: JwtAlgorithm;
  expiresInSec: number;
  issuer: string;
};

export function signJwt({
  payload,
  secret,
  alg,
  expiresInSec,
  issuer,
}: SignInput): string {
  const opts: SignOptions = {
    algorithm: alg,
    expiresIn: expiresInSec,
    issuer,
    notBefore: 0,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return _sign(payload, secret, opts) as string;
}

export function verifyJwt(
  token: string,
  secret: string,
  alg: JwtAlgorithm,
  issuer: string,
): unknown {
  const opts: VerifyOptions = { algorithms: [alg], issuer };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return _verify(token, secret, opts) as unknown;
}
