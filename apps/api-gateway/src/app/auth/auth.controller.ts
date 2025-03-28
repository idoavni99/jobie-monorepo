import { CreateUserDto } from '@jobie/users/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dtos/login.payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  isLoggedIn(@Req() { signedCookies }: Request) {
    if (!signedCookies.accessToken)
      throw new UnauthorizedException('User is not authorized');
    return this.authService.getMyIdentity(signedCookies.accessToken);
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.clearCookie('accessToken', { signed: true });
    response.clearCookie('refreshToken', { signed: true });
    response.sendStatus(HttpStatus.OK);
  }

  @Post('login')
  async login(
    @Body() { password, email }: LoginPayloadDto,
    @Res() response: Response
  ) {
    const { accessTokenData, refreshTokenData, ...userData } =
      await this.authService.login(email, password);

    response
      .cookie('accessToken', accessTokenData.accessToken, {
        httpOnly: true,
        maxAge: accessTokenData.accessTokenLifetime,
        signed: true,
      })
      .cookie('refreshToken', refreshTokenData.refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenData.refreshTokenLifetime,
        signed: true,
      });
    response.status(HttpStatus.CREATED).json(userData);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
