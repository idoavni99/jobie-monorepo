import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
export const setupProxyToService = async (
  app: INestApplication,
  [serviceName, serviceUrl]: [string, string],
  domain: string
) => {
  try {
    const swaggerJson: OpenAPIObject = await fetch(`${serviceUrl}/api`).then(
      (response) => response.json()
    );
    const modifiedPaths = Object.fromEntries(
      Object.entries(swaggerJson.paths).map(([currentPathPrefix, path]) => [
        `${serviceName}${currentPathPrefix}`,
        path,
      ])
    );
    swaggerJson.paths = modifiedPaths;
    SwaggerModule.setup(`api/${serviceName}`, app, swaggerJson);

    const proxy = createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      cookieDomainRewrite: domain,
      secure: false,
      pathRewrite: (path) => {
        return path.replace(`/${serviceName}`, '');
      },
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
