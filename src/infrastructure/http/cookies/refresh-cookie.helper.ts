import { Response } from 'express';

export const REFRESH_COOKIE = 'refresh_token';

export function setRefreshCookie(res: Response, token: string, ttlSec: number) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ttlSec * 1000,
    path: '/api/v1/auth', // refresogout live here
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}
