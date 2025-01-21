import { registerAs } from '@nestjs/config';
export const gatewayConfig = registerAs('gateway', () => ({
  port: process.env.PORT || 3000,
  serviceDiscovery: (process.env.SERVICE_DISCOVERY
    ? JSON.parse(process.env.SERVICE_DISCOVERY)
    : {
        'registration-service': 'http://localhost:3001',
      }) as Record<string, string>,
  appDomain: process.env.APP_DOMAIN ?? 'localhost',
}));
