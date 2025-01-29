import { CreateUserDto } from '@jobie/users/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dtos/login.payload.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'is the user logged in',
    type: Boolean,
  })
  @Get('isLoggedIn')
  isLoggedIn(@Req() { signedCookies }: Request) {
    return this.authService.isLoggedIn(
      signedCookies.accessToken,
      signedCookies.refreshToken
    );
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.clearCookie('accessToken', { signed: true });
    response.clearCookie('refreshToken', { signed: true });
    response.sendStatus(HttpStatus.OK);
  }

  @Post('login')
  async login(
    @Body() { username, password }: LoginPayloadDto,
    @Res() response: Response
  ) {
    const {
      accessToken,
      accessTokenLifetime,
      refreshToken,
      refreshTokenLifetime,
      ...userData
    } = await this.authService.login(username, password);

    response
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: accessTokenLifetime,
        signed: true,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenLifetime,
        signed: true,
      });
    response.status(HttpStatus.CREATED).json(userData);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
