import { ConfigType, registerAs } from '@nestjs/config';
export const gatewayConfig = registerAs('gateway', () => ({
  serviceDiscovery: (process.env.SERVICE_DISCOVERY
    ? JSON.parse(process.env.SERVICE_DISCOVERY)
    : {
        'user-profile-enrichment': 'http://localhost:3001',
        'roadmap-calibration': 'http://localhost:3002',
        'milestone-management': 'http://localhost:3003',
      }) as Record<string, string>,
  appDomain: process.env.APP_DOMAIN ?? 'localhost',
}));
export const gatewayConfigKey = gatewayConfig.KEY;
export type GatewayConfigType = ConfigType<typeof gatewayConfig>;
