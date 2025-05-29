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
  private isProduction = process.env.NODE_ENV === 'production';
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType
  ) {}

  @Get('me')
  async isLoggedIn(
    @Req() { signedCookies }: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    if (!signedCookies.accessToken && !signedCookies.refreshToken)
      throw new UnauthorizedException('User is not authorized');

    if (signedCookies.accessToken)
      return this.authService.getMyIdentity(signedCookies.accessToken);

    if (signedCookies.refreshToken) {
      const accessToken = await this.authService.refreshAccess(
        signedCookies.refreshToken
      );
      this.setTokenCookies(response, accessToken, signedCookies.refreshToken);
      return this.authService.getMyIdentity(accessToken);
    }
  }

  @Post('logout')
  logout(@Res() response: Response) {
    this.clearTokenCookies(response);
    response.sendStatus(HttpStatus.OK);
  }

  @Post('login')
  async login(
    @Body() { password, email }: LoginPayloadDto,
    @Res() response: Response
  ) {
    const { accessToken, refreshToken, ...userData } =
      await this.authService.login(email, password);

    this.setTokenCookies(response, accessToken, refreshToken);
    response.status(HttpStatus.CREATED).json(userData);
  }

  @Post('register')
  async register(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, refreshToken, ...createdUser } =
      await this.authService.register(user);
    this.setTokenCookies(response, accessToken, refreshToken);
    return createdUser;
  }

  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string
  ) {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: this.authConfig.accessTokenLifetime,
      signed: true,
      secure: true,
      sameSite: this.isProduction ? 'strict' : 'none',
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.authConfig.refreshTokenLifetime,
      signed: true,
      secure: true,
      sameSite: this.isProduction ? 'strict' : 'none',
    });
  }

  private clearTokenCookies(response: Response) {
    response.clearCookie('accessToken', {
      signed: true,
      secure: true,
      httpOnly: true,
      sameSite: this.isProduction ? 'strict' : 'none',
    });
    response.clearCookie('refreshToken', {
      signed: true,
      secure: true,
      httpOnly: true,
      sameSite: this.isProduction ? 'strict' : 'none',
    });
  }
}
