import { ConfigType, registerAs } from '@nestjs/config';
export const commonConfig = registerAs('common', () => ({
  port: Number(process.env['PORT']) || 3000,
  useAuth: Boolean(process.env['USE_AUTH'] === 'true'),
  useHttps: Boolean(process.env['USE_HTTPS'] === 'true'),
  accessTokenSecret: process.env['ACCESS_TOKEN_SECRET'] ?? 'Avnizzz',
}));
export const commonConfigKey = commonConfig.KEY;
export type CommonConfigType = ConfigType<typeof commonConfig>;
