export interface SignedToken {
  token: string;
  expiresAt: Date;
  jti: string;
}
export interface TokenServicePort {
  signAccess(payload: {
    sub: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    jti: string;
  }): SignedToken;
  signRefresh(payload: {
    sub: string;
    family: string;
    jti: string;
  }): SignedToken;
  signMfa(payload: { sub: string; jti: string }): SignedToken; // short-lived, single-use
  verifyAccess(token: string): {
    sub: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    jti: string;
  };
  verifyRefresh(token: string): { sub: string; family: string; jti: string };
  verifyMfa(token: string): { sub: string; jti: string };
}
