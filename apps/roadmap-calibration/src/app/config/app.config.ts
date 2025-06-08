import { ConfigType, registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  milestoneManagementUrl:
    process.env.MILESTONE_MANAGEMENT_URL ?? 'http://localhost:3003',
}));
export const APP_CONFIG_KEY = appConfig.KEY;

export type AppConfigType = ConfigType<typeof appConfig>;
