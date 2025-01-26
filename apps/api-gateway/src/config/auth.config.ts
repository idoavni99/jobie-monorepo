import { ConfigType, registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  passwordHashSalt: process.env.AUTH_PASSWORD_HASH_SALT ?? 'Avnizzz',
}));
export type AuthConfigType = ConfigType<typeof authConfig>;
export const authConfigKey = authConfig.KEY;
