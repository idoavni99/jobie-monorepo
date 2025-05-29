import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type AuthorizedRequest } from './types/authorized.request.type';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly useAuth: boolean,
    private readonly jwtSecret: string,
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.useAuth) return true;

    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const accessToken = request.headers['x-jobie-authorization'] as string;
    if (!accessToken) return false;

    const authUser = await this.jwtService.verifyAsync(accessToken, {
      secret: this.jwtSecret,
    });

    request.user = authUser;
    return true;
  }
}
