import type { Prisma } from '@prisma/client';
import type {
  UserAuthProjection,
  UserMeProjection,
} from 'src/application/auth/ports/user-repository.port';

/** -------- USER (auth) -------- */
export const userAuthSelect = {
  id: true,
  email: true,
  role: true,
  passwordHash: true,
  mfaEnabled: true,
  failedLogins: true,
  lockedUntil: true,
  deletedAt: true,
  employee: { select: { id: true } }, // auth needs only id reference
} satisfies Prisma.UserSelect;

type UserAuthRow = Prisma.UserGetPayload<{ select: typeof userAuthSelect }>;

export function mapUserAuthRow(r: UserAuthRow): UserAuthProjection {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    passwordHash: r.passwordHash,
    mfaEnabled: r.mfaEnabled,
    failedAuth: { count: r.failedLogins, lockedUntil: r.lockedUntil },
    employeeId: r.employee?.id ?? null,
    deletedAt: r.deletedAt,
  };
}

/** -------- USER (/me) -------- */
export const userMeSelect = {
  id: true,
  email: true,
  role: true,
  employee: {
    select: {
      id: true,
      displayName: true,
      departmentId: true,
      managerId: true,
    },
  },
} satisfies Prisma.UserSelect;

type UserMeRow = Prisma.UserGetPayload<{ select: typeof userMeSelect }>;

export function mapUserMeRow(r: UserMeRow): UserMeProjection {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    employee: r.employee
      ? {
          id: r.employee.id,
          displayName: r.employee.displayName,
          departmentId: r.employee.departmentId,
          managerId: r.employee.managerId,
        }
      : null,
  };
}
