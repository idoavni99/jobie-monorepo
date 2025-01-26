/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { baseBootstrap } from '@jobie/nestjs-core';
import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { gatewayConfig } from './config/gateway.config';
import { setupProxyToService } from './proxy/setup-proxy';

baseBootstrap(AppModule).then(async (app) => {
  const { port, serviceDiscovery, appDomain } = app.get<
    ConfigType<typeof gatewayConfig>
  >(gatewayConfig.KEY);

  await Promise.all(
    Object.entries(serviceDiscovery).map((service) =>
      setupProxyToService(app, service, appDomain)
    )
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
});
