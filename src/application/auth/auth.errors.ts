import type { Problem } from '../common/problem.types';

export const AuthErrorCodes = {
  INVALID_CREDENTIALS: 'auth.invalid_credentials',
  MFA_REQUIRED: 'auth.mfa_required',
  MFA_INVALID_CODE: 'auth.mfa_invalid_code',
  ACCOUNT_LOCKED: 'auth.account_locked',
  ADMIN_MFA_REQUIRED: 'auth.admin_mfa_required',
  REFRESH_INVALID: 'auth.refresh_invalid',
  REFRESH_REVOKED: 'auth.refresh_revoked',
  REFRESH_REUSE_DETECTED: 'auth.refresh_reuse_detected',
  UNAUTHORIZED: 'auth.unauthorized',
} as const;

export type AuthErrorCode =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  readonly status: number;
  readonly meta?: Record<string, unknown> | undefined;
  private constructor(
    code: AuthErrorCode,
    message: string,
    status: number,
    meta?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.meta = meta;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // Factory helpers keep messages consistent & safe
  static invalidCredentials() {
    return new AuthError(
      AuthErrorCodes.INVALID_CREDENTIALS,
      'Invalid email or password.',
      401,
    );
  }
  static mfaRequired(mfaToken: string) {
    return new AuthError(
      AuthErrorCodes.MFA_REQUIRED,
      'Multi-factor authentication is required.',
      401,
      { mfaToken },
    );
  }
  static mfaInvalidCode() {
    return new AuthError(
      AuthErrorCodes.MFA_INVALID_CODE,
      'Invalid or expired MFA code.',
      401,
    );
  }
  static accountLocked(until: Date) {
    return new AuthError(
      AuthErrorCodes.ACCOUNT_LOCKED,
      'Account is temporarily locked due to failed attempts.',
      423,
      { until: until.toISOString() },
    );
  }
  static adminMfaRequired() {
    return new AuthError(
      AuthErrorCodes.ADMIN_MFA_REQUIRED,
      'Admin accounts must have MFA enabled.',
      403,
    );
  }
  static refreshInvalid() {
    return new AuthError(
      AuthErrorCodes.REFRESH_INVALID,
      'Invalid refresh token.',
      401,
    );
  }
  static refreshRevoked() {
    return new AuthError(
      AuthErrorCodes.REFRESH_REVOKED,
      'Refresh token has been revoked.',
      401,
    );
  }
  static refreshReuseDetected(familyId: string) {
    return new AuthError(
      AuthErrorCodes.REFRESH_REUSE_DETECTED,
      'Refresh token reuse detected; session family revoked.',
      401,
      { familyId },
    );
  }
  static unauthorized() {
    return new AuthError(
      AuthErrorCodes.UNAUTHORIZED,
      'Authentication required.',
      401,
    );
  }

  toProblem(): Problem {
    // Map codes to canonical problem URIs and titles
    const map: Record<
      AuthErrorCode,
      { type: string; title: string; status: number }
    > = {
      [AuthErrorCodes.INVALID_CREDENTIALS]: {
        type: 'urn:problem:auth:invalid-credentials',
        title: 'Invalid credentials',
        status: 401,
      },
      [AuthErrorCodes.MFA_REQUIRED]: {
        type: 'urn:problem:auth:mfa-required',
        title: 'MFA required',
        status: 401,
      },
      [AuthErrorCodes.MFA_INVALID_CODE]: {
        type: 'urn:problem:auth:mfa-invalid-code',
        title: 'Invalid MFA code',
        status: 401,
      },
      [AuthErrorCodes.ACCOUNT_LOCKED]: {
        type: 'urn:problem:auth:account-locked',
        title: 'Account locked',
        status: 423,
      },
      [AuthErrorCodes.ADMIN_MFA_REQUIRED]: {
        type: 'urn:problem:auth:admin-mfa-required',
        title: 'Admin MFA required',
        status: 403,
      },
      [AuthErrorCodes.REFRESH_INVALID]: {
        type: 'urn:problem:auth:refresh-invalid',
        title: 'Invalid refresh',
        status: 401,
      },
      [AuthErrorCodes.REFRESH_REVOKED]: {
        type: 'urn:problem:auth:refresh-revoked',
        title: 'Refresh revoked',
        status: 401,
      },
      [AuthErrorCodes.REFRESH_REUSE_DETECTED]: {
        type: 'urn:problem:auth:refresh-reuse-detected',
        title: 'Refresh reuse',
        status: 401,
      },
      [AuthErrorCodes.UNAUTHORIZED]: {
        type: 'urn:problem:auth:unauthorized',
        title: 'Unauthorized',
        status: 401,
      },
    };
    const m = map[this.code];
    return {
      type: m.type,
      title: m.title,
      status: m.status,
      detail: this.message,
      ...(this.meta !== undefined ? { meta: this.meta } : {}),
    };
  }
}
