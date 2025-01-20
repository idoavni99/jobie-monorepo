import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
export const setupProxyToService = async (
  app: INestApplication,
  [serviceName, serviceUrl]: [string, string]
) => {
  try {
    const swaggerJson = await fetch(`${serviceUrl}/api`).then((res) =>
      res.json()
    );
    app.use(
      `/api/${serviceName}`,
      SwaggerModule.createDocument(app, swaggerJson)
    );

    const proxy = createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
      secure: false,
      pathRewrite: (path) => {
        return path.replace(`/${serviceName}`, '')
      }
    });

    app.use(`/${serviceName}`, proxy);
    Logger.log(`Routing requests to ${serviceName} at /${serviceName}`);
  } catch (error) {
    Logger.error(
      `${serviceName} is unavailable at the moment, will not route requests`,
      error.stack,
      { message: error.message }
    );
  }
};
