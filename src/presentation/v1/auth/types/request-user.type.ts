export interface RequestUser {
  sub: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  jti: string;
}
