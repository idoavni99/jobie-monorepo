import { UserDto, UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types/user.type';
import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import type { Request, Response } from 'express';
import { authConfigKey, type AuthConfigType } from '../../config/auth.config';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType
  ) {}
  isLoggedIn(request: Request) {
    return Boolean(request.signedCookies['accessToken']);
  }

  logout(response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }

  register(user: UserDto) {
    return this.usersRepository.create(user);
  }

  async login(username: string, password: string): Promise<TUser | undefined> {
    const user = await this.usersRepository.findByUsername(username);
    if (user) {
      const hashedPassword = await this.hashPassword(password);
      if (hashedPassword === user.password) {
        return user;
      }
    }

    return undefined;
  }

  private hashPassword(password: string) {
    return hash(password, this.authConfig.passwordHashSalt);
  }
}
