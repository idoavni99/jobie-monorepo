import { type AuthorizedRequest } from '@jobie/auth-core';
import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  use = async (
    request: AuthorizedRequest,
    response: Response,
    next: (error?: Error) => void
  ) => {
    // Allow preflight to run before actually sending the request
    if (request.method === 'OPTIONS') return next();

    const accessToken = request.signedCookies['accessToken'];
    if (!accessToken)
      return next(new UnauthorizedException('Missing access token'));
    const authenticatedUser = await this.authService.parseAccessToken(
      accessToken
    );

    if (!authenticatedUser) {
      const { accessToken: newToken, accessTokenLifetime } =
        await this.authService.refreshAccess(
          request.signedCookies['refreshToken']
        );
      response.cookie('accessToken', newToken, {
        httpOnly: true,
        maxAge: accessTokenLifetime,
      });
      request.authToken = newToken;
      return next();
    }

    request.authToken = accessToken;

    next();
  };
}
