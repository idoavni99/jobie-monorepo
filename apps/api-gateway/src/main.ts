/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { baseBootstrap } from '@jobie/nestjs-core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { authConfigKey, AuthConfigType } from './config/auth.config';
import { gatewayConfigKey, GatewayConfigType } from './config/gateway.config';
import { setupProxyToService } from './proxy/setup-proxy';

baseBootstrap(AppModule, async (app) => {
  const { authCookiesSecret } = app.get<AuthConfigType>(authConfigKey);

  const { serviceDiscovery, appDomain } =
    app.get<GatewayConfigType>(gatewayConfigKey);

  app.use(cookieParser(authCookiesSecret));
  await Promise.all(
    Object.entries(serviceDiscovery).map((service) =>
      setupProxyToService(app, service, appDomain)
    )
  );
});
