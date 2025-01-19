/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { baseBootstrap } from '@jobie/nestjs-core';
import { AppModule } from './app/app.module';
import { gatewayConfig } from './config/gateway.config';
import { ConfigType } from '@nestjs/config';
import { setupProxyToService } from './proxy/setupProxy';

baseBootstrap(AppModule).then(async (app) => {
  const { port, serviceDiscovery } = app.get<ConfigType<typeof gatewayConfig>>(
    gatewayConfig.KEY
  );
  for (const service of Object.entries(serviceDiscovery)) {
    await setupProxyToService(app, service);
  }
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
});
