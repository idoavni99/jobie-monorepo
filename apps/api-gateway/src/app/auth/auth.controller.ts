import { CreateUserDto } from '@jobie/users/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthConfigType, authConfigKey } from '../../config/auth.config';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dtos/login.payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType,
  ) { }

  /* ------------------------------------------------------------------ */
  @Get('me')
  async isLoggedIn(
    @Req() { signedCookies }: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('[auth/me] cookies =>', signedCookies);

    if (!signedCookies.accessToken && !signedCookies.refreshToken)
      throw new UnauthorizedException('User is not authorized');

    if (signedCookies.accessToken) {
      console.log('[auth/me] using access-token path');
      return this.authService.getMyIdentity(signedCookies.accessToken);
    }

    if (signedCookies.refreshToken) {
      console.log('[auth/me] refresh-token flow');
      const accessToken = await this.authService.refreshAccess(
        signedCookies.refreshToken,
      );
      this.setTokenCookies(response, accessToken, signedCookies.refreshToken);
      return this.authService.getMyIdentity(accessToken);
    }
  }

  /* ------------------------------------------------------------------ */
  @Post('logout')
  logout(@Res() response: Response) {
    console.log('[auth/logout]');
    response.clearCookie('accessToken', { signed: true });
    response.clearCookie('refreshToken', { signed: true });
    response.sendStatus(HttpStatus.OK);
  }

  /* ------------------------------------------------------------------ */
  @Post('login')
  async login(
    @Body() { password, email }: LoginPayloadDto,
    @Res() response: Response,
  ) {
    console.log('[auth/login] body =>', { email, pwLength: password?.length });

    const { accessToken, refreshToken, ...userData } =
      await this.authService.login(email, password);

    console.log('[auth/login] success – userId:', userData._id);

    this.setTokenCookies(response, accessToken, refreshToken);
    response.status(HttpStatus.CREATED).json(userData);
  }

  /* ------------------------------------------------------------------ */
  @Post('register')
  register(@Body() user: CreateUserDto) {
    console.log('[auth/register] email =>', user.email);
    return this.authService.register(user);
  }

  /* ------------------------------------------------------------------ */
  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    console.log('[set-cookies] access =', accessToken.slice(0, 10) + '…');
    console.log('[set-cookies] refresh =', refreshToken.slice(0, 10) + '…');

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: this.authConfig.accessTokenLifetime,
      signed: true,
      secure: true,
      sameSite: 'strict',
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.authConfig.refreshTokenLifetime,
      signed: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}