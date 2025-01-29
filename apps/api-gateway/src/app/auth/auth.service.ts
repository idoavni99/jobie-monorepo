import { commonConfigKey, type CommonConfigType } from '@jobie/nestjs-core';
import { CreateUserDto, UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types/user.type';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { authConfigKey, type AuthConfigType } from '../../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType,
    @Inject(commonConfigKey) private readonly commonConfig: CommonConfigType
  ) {}
  async isLoggedIn(accessToken?: string, refreshToken?: string) {
    const result = Boolean(
      (accessToken && (await this.parseAccessToken(accessToken))) ||
        (refreshToken && (await this.parseRefreshToken(refreshToken)))
    );
    if (!result) {
      throw new UnauthorizedException();
    }

    return result;
  }

  async register(user: CreateUserDto) {
    return this.usersRepository.create(
      Object.assign(user, {
        password: await this.hashPassword(user.password),
      })
    );
  }

  async login(username: string, password: string) {
    const hashedPassword =
      await this.usersRepository.findPasswordByUsernameOrEmail({ username });

    if (!hashedPassword) throw new UnauthorizedException();

    if (!(await compare(password, hashedPassword)))
      throw new UnauthorizedException();

    const user = await this.usersRepository.findByUsername(username);

    if (!user) throw new InternalServerErrorException();

    const [access, refresh] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);

    return { id: user._id, ...access, ...refresh };
  }

  async refreshAccess(refreshToken: string) {
    const { _id } = await this.parseRefreshToken(refreshToken);

    const user = await this.usersRepository.findById(_id);
    if (!user) throw new NotFoundException('User has been deleted');
    return this.signAccessToken(user);
  }

  async parseAccessToken(accessToken: string): Promise<TUser | undefined> {
    try {
      return this.jwtService.verifyAsync<TUser>(accessToken, {
        secret: this.commonConfig.accessTokenSecret,
      });
    } catch {
      return undefined;
    }
  }

  async parseRefreshToken(refreshToken: string): Promise<Pick<TUser, '_id'>> {
    try {
      return this.jwtService.verifyAsync<Pick<TUser, '_id'>>(refreshToken, {
        secret: this.authConfig.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Refresh Token missing');
    }
  }

  private async signAccessToken(user: TUser) {
    const accessToken = await this.jwtService.signAsync(user, {
      secret: this.commonConfig.accessTokenSecret,
      expiresIn: this.authConfig.accessTokenLifetime,
    });
    return {
      accessToken,
      accessTokenLifetime: this.authConfig.accessTokenLifetime,
    };
  }

  private async signRefreshToken(user: TUser) {
    const refreshToken = await this.jwtService.signAsync(
      { _id: user._id },
      {
        secret: this.authConfig.refreshTokenSecret,
        expiresIn: this.authConfig.refreshTokenLifetime,
      }
    );
    return {
      refreshToken,
      refreshTokenLifetime: this.authConfig.refreshTokenLifetime,
    };
  }

  private hashPassword(password: string) {
    return hash(password, this.authConfig.passwordHashSaltRound);
  }
}
