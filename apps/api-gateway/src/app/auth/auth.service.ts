import { commonConfigKey, type CommonConfigType } from '@jobie/nestjs-core';
import {
  CreateUserDto,
  UserEntity,
  UsersRepository,
} from '@jobie/users/nestjs';
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
  ) { }
  async getMyIdentity(accessToken: string) {
    const user = await this.parseAccessToken(accessToken);

    return user?._id ? this.usersRepository.findById(user._id) : user;
  }

  async register(user: CreateUserDto) {
    return this.usersRepository.create(
      Object.assign(user, {
        password: await this.hashPassword(user.password),
      })
    );
  }

  async login(email: string, password: string) {
    const hashedPassword = await this.usersRepository.findPasswordByEmail(
      email
    );

    if (!hashedPassword) throw new UnauthorizedException();

    if (!(await compare(password, hashedPassword)))
      throw new UnauthorizedException();

    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new InternalServerErrorException();

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);

    return { ...user, accessToken, refreshToken };
  }

  async refreshAccess(refreshToken: string) {
    const { _id } = await this.parseRefreshToken(refreshToken);

    const user = await this.usersRepository.findById(_id);
    if (!user) throw new NotFoundException('User has been deleted');
    return this.signAccessToken(user);
  }

  async parseAccessToken(accessToken: string): Promise<UserEntity | undefined> {
    try {
      return this.jwtService.verifyAsync<UserEntity>(accessToken, {
        secret: this.commonConfig.accessTokenSecret,
      });
    } catch {
      return undefined;
    }
  }

  async parseRefreshToken(
    refreshToken: string
  ): Promise<Pick<UserEntity, '_id'>> {
    try {
      return this.jwtService.verifyAsync<Pick<UserEntity, '_id'>>(
        refreshToken,
        {
          secret: this.authConfig.refreshTokenSecret,
        }
      );
    } catch {
      throw new UnauthorizedException('Refresh Token missing');
    }
  }

  private async signAccessToken(user: UserEntity) {
    const accessToken = await this.jwtService.signAsync(user, {
      secret: this.commonConfig.accessTokenSecret,
      expiresIn: this.authConfig.accessTokenLifetime,
    });
    return accessToken;
  }

  private async signRefreshToken(user: UserEntity) {
    const refreshToken = await this.jwtService.signAsync(
      { _id: user._id },
      {
        secret: this.authConfig.refreshTokenSecret,
        expiresIn: this.authConfig.refreshTokenLifetime,
      }
    );
    return refreshToken;
  }

  private hashPassword(password: string) {
    return hash(password, this.authConfig.passwordHashSaltRound);
  }
}
