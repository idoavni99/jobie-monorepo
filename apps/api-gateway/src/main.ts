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

baseBootstrap(AppModule).then(async (app) => {
  const { port, serviceDiscovery } = app.get<ConfigType<typeof gatewayConfig>>(
    gatewayConfig.KEY
  );
  for (const [serviceName, serviceUrl] of Object.entries(serviceDiscovery)) {
    const proxy = createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/${serviceName}`]: '',
      },
      on: {
        proxyRes: (proxyRes, req, res) => {
          // Forward cookie being set from outside
          if (proxyRes.headers['set-cookie']) {
            res.setHeader('set-cookie', proxyRes.headers['set-cookie']);
          }

          // Forward auth header if being set from outside
          if (proxyRes.headers['authorization']) {
            res.setHeader('authorization', proxyRes.headers['authorization']);
          }
        },
      },
    });
    app.use(`/${serviceName}`, proxy);
    Logger.log(`Routing requests to ${serviceName} at /${serviceName}`);
  }
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
});
