import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

export class AuthMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: (error?: Error) => void) {
    if (!request.signedCookies['accessToken'])
      throw new UnauthorizedException('Not Authenticated');

    if (!request.signedCookies['refreshToken'])
      throw new UnauthorizedException('Not Authenticated');

    next();
  }
}
