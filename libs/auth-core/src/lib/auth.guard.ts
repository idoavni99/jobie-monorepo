import { type CanActivate, type ExecutionContext } from '@nestjs/common';
import { type AuthorizedRequest } from './types/authorized.request.type';
export class AuthGuard implements CanActivate {
  constructor(private readonly useAuth: boolean) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.useAuth) return true;

    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const stringifiedAuthUser = request.headers['authorization'];
    if (!stringifiedAuthUser) return false;

    const authUser = JSON.parse(stringifiedAuthUser);
    request.authUser = authUser;
    return true;
  }
}
