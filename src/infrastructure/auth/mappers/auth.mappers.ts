import type { Prisma, Role } from '@prisma/client';

/** --- USER --- */
export const userAuthSelect = {
  id: true,
  email: true,
  role: true,
  passwordHash: true,
  mfaEnabled: true,
  failedLogins: true,
  lockedUntil: true,
  status: true,
  deletedAt: true,
  employee: { select: { id: true } },
} satisfies Prisma.UserSelect;

export type UserAuthRow = Prisma.UserGetPayload<{
  select: typeof userAuthSelect;
}>;

export type UserStatus = 'ACTIVE' | 'LOCKED' | 'INVITED' | 'SUSPENDED';

export type UserAuthProjection = {
  id: string;
  email: string;
  role: Role; // 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  passwordHash: string;
  mfaEnabled: boolean;
  failedLogins: number;
  lockedUntil: Date | null;
  status: UserStatus;
  employeeId: string | null;
  isDeleted: boolean;
};

export function mapUserAuthRow(r: UserAuthRow): UserAuthProjection {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    passwordHash: r.passwordHash,
    mfaEnabled: r.mfaEnabled,
    failedLogins: r.failedLogins,
    lockedUntil: r.lockedUntil,
    status: r.status as UserStatus,
    employeeId: r.employee?.id ?? null,
    isDeleted: r.deletedAt !== null,
  };
}

/** Minimal /me projection */
export const userMeSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  employee: { select: { id: true } },
} satisfies Prisma.UserSelect;

export type UserMeRow = Prisma.UserGetPayload<{ select: typeof userMeSelect }>;
export type UserMeProjection = {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  employeeId: string | null;
};

export function mapUserMeRow(r: UserMeRow): UserMeProjection {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    status: r.status as UserStatus,
    employeeId: r.employee?.id ?? null,
  };
}

/** --- REFRESH TOKEN --- */
export const refreshTokenSelect = {
  id: true,
  userId: true,
  jti: true,
  family: true,
  hashedToken: true,
  expiresAt: true,
  revokedAt: true,
  createdAt: true,
  ip: true,
  userAgent: true,
} satisfies Prisma.RefreshTokenSelect;

export type RefreshTokenRow = Prisma.RefreshTokenGetPayload<{
  select: typeof refreshTokenSelect;
}>;

export type RefreshTokenProjection = {
  id: string; // db pk (not jti)
  userId: string;
  jti: string; // unique
  family: string;
  hashedToken: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  ip: string | null;
  userAgent: string | null;
};

export function mapRefreshRow(r: RefreshTokenRow): RefreshTokenProjection {
  return {
    id: r.id,
    userId: r.userId,
    jti: r.jti,
    family: r.family,
    hashedToken: r.hashedToken,
    expiresAt: r.expiresAt,
    revokedAt: r.revokedAt,
    createdAt: r.createdAt,
    ip: r.ip ?? null,
    userAgent: r.userAgent ?? null,
  };
}
