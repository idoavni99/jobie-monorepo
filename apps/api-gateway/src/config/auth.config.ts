import { ConfigType, registerAs } from '@nestjs/config';
import { hoursToMilliseconds } from 'date-fns/hoursToMilliseconds';
import { minutesToMilliseconds } from 'date-fns/minutesToMilliseconds';

export const authConfig = registerAs('auth', () => ({
  passwordHashSaltRound:
    Number(process.env.AUTH_PASSWORD_HASH_SALT_ROUNDS) || 8,
  refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET ?? 'Avnizzz',
  accessTokenLifetime: minutesToMilliseconds(
    Number(process.env.AUTH_ACCESS_TOKEN_LIFETIME_MINUTES) || 60
  ),
  refreshTokenLifetime: hoursToMilliseconds(
    Number(process.env.AUTH_REFRESH_TOKEN_LIFETIME_HOURS) || 24
  ),
  authCookiesSecret: process.env.AUTH_COOKIES_SECRET ?? 'Avnizzz',
}));
export type AuthConfigType = ConfigType<typeof authConfig>;
export const authConfigKey = authConfig.KEY;
