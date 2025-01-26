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
import { LoginPayloadDto } from './dtos/login.payload.dto';
import { LoginService } from './login.service';

@Controller('/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'is the user logged in',
    type: Boolean,
  })
  @Get('isLoggedIn')
  isLoggedIn(@Req() request: Request) {
    return this.loginService.isLoggedIn(request);
  }

  @Post('logout')
  logout(@Res() response: Response) {
    return this.loginService.logout(response);
  }

  @Post('login')
  async login(@Body() { username, password }: LoginPayloadDto) {
    const user = await this.loginService.login(username, password);
    if (user) {
      // Set Access and refresh on cookie
    }
  }

  @Post('register')
  register(@Body() user: UserDto) {
    return this.loginService.register(user);
  }
}
