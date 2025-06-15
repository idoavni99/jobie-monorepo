import { ConfigType, registerAs } from '@nestjs/config';

export const googleOauthConfig = registerAs('googleOauth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackEndpoint: process.env.GOOGLE_CALLBACK_ENDPOINT ?? '',
}));

export const googleOauthConfigKey = googleOauthConfig.KEY;
export type GoogleOauthConfigType = ConfigType<typeof googleOauthConfig>;
