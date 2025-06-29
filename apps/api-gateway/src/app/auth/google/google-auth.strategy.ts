import { CreateUserDto } from '@jobie/users/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  googleOauthConfigKey,
  GoogleOauthConfigType,
} from '../../../config/google.config';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(googleOauthConfigKey) config: GoogleOauthConfigType) {
    super({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackEndpoint,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: { displayName: string; emails: { value: string }[] },
    done: VerifyCallback
  ): Promise<void> {
    const user: CreateUserDto = {
      fullName: profile.displayName,
      email: profile.emails[0].value,
      password: randomUUID(),
    };
    done(undefined, user);
  }
}
