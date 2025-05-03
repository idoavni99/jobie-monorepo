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
    console.log('[getMyIdentity] Trying to parse accessToken...');
    const user = await this.parseAccessToken(accessToken);

    if (user?._id) {console.log('[getMyIdentity] User ID from token:', user._id);}
    else {console.log('[getMyIdentity] No user found from token.');}

    return user?._id ? this.usersRepository.findById(user._id) : user;
  }

  async register(user: CreateUserDto) {
    console.log('[register] Registering user:', user.email);
    return this.usersRepository.create(
      Object.assign(user, {
        password: await this.hashPassword(user.password),
      })
    );
  }

  async login(email: string, password: string) {
    console.log('[login] Trying login with email:', email);

    const hashedPassword =
      await this.usersRepository.findPasswordByUsernameOrEmail({
        email,
      });

    console.log('[login] Hashed password exists?', !!hashedPassword);

    if (!hashedPassword) {
      console.log('[login] No password found, throwing Unauthorized');
      throw new UnauthorizedException();
    }

    const passwordMatches = await compare(password, hashedPassword);

    console.log('[login] Password matches?', passwordMatches);

    if (!passwordMatches) {
      console.log('[login] Password does not match, throwing Unauthorized');
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findByEmail(email);

    console.log('[login] User found?', !!user);

    if (!user) {
      console.log('[login] No user found, throwing InternalServerError');
      throw new InternalServerErrorException();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);

    console.log('[login] Access and refresh tokens generated');

    return { ...user, accessToken, refreshToken };
  }

  async refreshAccess(refreshToken: string) {
    console.log('[refreshAccess] Refreshing access token...');
    const { _id } = await this.parseRefreshToken(refreshToken);

    const user = await this.usersRepository.findById(_id);
    if (!user) {
      console.log('[refreshAccess] No user found for refresh token.');
      throw new NotFoundException('User has been deleted');
    }
    return this.signAccessToken(user);
  }

  async parseAccessToken(accessToken: string): Promise<UserEntity | undefined> {
    try {
      return this.jwtService.verifyAsync<UserEntity>(accessToken, {
        secret: this.commonConfig.accessTokenSecret,
      });
    } catch {
      console.log('[parseAccessToken] Invalid access token.');
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
      console.log('[parseRefreshToken] Invalid refresh token.');
      throw new UnauthorizedException('Refresh Token missing');
    }
  }

  private async signAccessToken(user: UserEntity) {
    console.log('[signAccessToken] Signing access token for user:', user._id);
    const accessToken = await this.jwtService.signAsync(user, {
      secret: this.commonConfig.accessTokenSecret,
      expiresIn: this.authConfig.accessTokenLifetime,
    });
    return accessToken;
  }

  private async signRefreshToken(user: UserEntity) {
    console.log('[signRefreshToken] Signing refresh token for user:', user._id);
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
    console.log('[hashPassword] Hashing password...');
    return hash(password, this.authConfig.passwordHashSaltRound);
  }
}
