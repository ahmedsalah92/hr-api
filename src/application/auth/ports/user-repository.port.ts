export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type FailedAuth = {
  count: number;
  lockedUntil: Date | null;
};

export type UserAuthProjection = {
  id: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  mfaEnabled: boolean;
  failedAuth: FailedAuth;
  employeeId: string | null;
  deletedAt: Date | null;
};

export type EmployeeSnapshot = {
  id: string;
  displayName: string;
  departmentId: string | null;
  managerId: string | null;
};

export type UserMeProjection = {
  id: string;
  email: string;
  role: UserRole;
  employee: EmployeeSnapshot | null;
};

export interface UserRepositoryPort {
  findByEmailForAuth(email: string): Promise<UserAuthProjection | null>;

  // Update failed attempts and possibly set lockout
  setFailedAuth(userId: string, next: FailedAuth): Promise<void>;

  // Reset counters after successful auth
  clearFailedAuth(userId: string): Promise<void>;

  // For /auth/me minimal view
  findByIdForMe(userId: string): Promise<UserMeProjection | null>;

  // Optional audit touch (no business logic inside repository)
  touchLastLogin(
    userId: string,
    at: Date,
    ip: string | null,
    ua: string | null,
  ): Promise<void>;
}
