import { type AuthorizedRequest } from '@jobie/auth-core';
import { Inject, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { authConfigKey, AuthConfigType } from '../../../config/auth.config';
import { AuthService } from '../auth.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType
  ) {}
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
      const accessToken = await this.authService.refreshAccess(
        request.signedCookies['refreshToken']
      );
      response.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: this.authConfig.accessTokenLifetime,
      });
      request.authToken = accessToken;
      return next();
    }

    request.authToken = accessToken;

    next();
  };
}
