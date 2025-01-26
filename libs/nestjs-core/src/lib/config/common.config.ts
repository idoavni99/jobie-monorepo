import { ConfigType, registerAs } from '@nestjs/config';
export const commonConfig = registerAs('common', () => ({
  port: Number(process.env['PORT']) || 3000,
  useAuth: Boolean(process.env['USE_AUTH']) || false,
  useHttps: Boolean(process.env['USE_HTTPS']) || false,
}));
export const commonConfigKey = commonConfig.KEY;
export type CommonConfigType = ConfigType<typeof commonConfig>;
