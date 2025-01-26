import { UserDto, UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types/user.type';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { authConfigKey, type AuthConfigType } from '../../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    @Inject(authConfigKey) private readonly authConfig: AuthConfigType
  ) {}
  async isLoggedIn(accessToken?: string, refreshToken?: string) {
    return (
      accessToken &&
      refreshToken &&
      ((await this.parseAccessToken(accessToken)) &&
        (await this.parseRefreshToken(refreshToken))) !== undefined
    );
  }

  register(user: UserDto) {
    return this.usersRepository.create(user);
  }

  async login(username: string, password: string) {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) throw new UnauthorizedException();

    const hashedPassword = await this.hashPassword(password);

    if (hashedPassword !== user.password) throw new UnauthorizedException();

    const [access, refresh] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);

    return { ...access, ...refresh };
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
        secret: this.authConfig.accessTokenSecret,
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
      secret: this.authConfig.accessTokenSecret,
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
    return hash(password, this.authConfig.passwordHashSalt);
  }
}
