import { type AuthorizedRequest } from '@jobie/auth-core';
import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(
    request: AuthorizedRequest,
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
      const user = await this.authService.parseAccessToken(newToken);
      if (user) {
        request.authUser = user;
      }
      return;
    }

    request.authUser = authenticatedUser;

    next();
  }
}
