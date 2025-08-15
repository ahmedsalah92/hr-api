import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import type { RequestUser } from '../types/request-user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly roles: Array<'ADMIN' | 'MANAGER' | 'EMPLOYEE'>,
  ) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = req.user;
    if (!user) throw new ForbiddenException('Unauthenticated');
    return this.roles.includes(user.role);
  }
}
