import { UserDto } from '@jobie/users/nestjs';
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
  async logout(@Res() response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
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
    } = await this.authService.login(username, password);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: accessTokenLifetime,
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenLifetime,
    });
  }

  @Post('register')
  register(@Body() user: UserDto) {
    return this.authService.register(user);
  }
}
