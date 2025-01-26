import { TUser } from '@jobie/users/types/user.type';
import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

declare module 'express' {
  interface Request {
    authUser?: TUser;
  }
}

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(
    request: Request,
    response: Response,
    next: (error?: Error) => void
  ) {
    const accessToken = request.signedCookies['accessToken'];
    if (!accessToken) throw new UnauthorizedException('Missing access token');
    const authenticatedUser = await this.authService.parseAccessToken(
      accessToken
    );

    if (!authenticatedUser) {
      const { accessToken: newToken, accessTokenLifetime } =
        await this.authService.refreshAccess(accessToken);
      response.cookie('accessToken', newToken, {
        httpOnly: true,
        maxAge: accessTokenLifetime,
      });
      request.authUser = await this.authService.parseAccessToken(newToken);
      return;
    }

    request.authUser = authenticatedUser;

    next();
  }
}
