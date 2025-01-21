import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'is the user logged in',
    type: Boolean,
  })
  @Get('isLoggedIn')
  isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  @Post('logout')
  logout() {
    return this.loginService.logout();
  }
}
