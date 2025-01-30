import { AuthorizedRequest } from '@jobie/auth-core';
import { INestApplication, Logger, NestMiddleware } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
export const setupProxyToService = async (
  app: INestApplication,
  authMiddleware: NestMiddleware,
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

    const proxy = createProxyMiddleware<AuthorizedRequest>({
      target: serviceUrl,
      changeOrigin: true,
      cookieDomainRewrite: domain,
      secure: false,
      pathRewrite: (path) => {
        return path.replace(`/${serviceName}`, '');
      },
      on: {
        proxyReq: (proxyRequest, request) => {
          if (request.authToken) {
            proxyRequest.setHeader('Authorization', request.authToken);
          }
        },
      },
    });

    app.use(`/${serviceName}`, authMiddleware.use, proxy);
    Logger.log(`Routing requests to ${serviceName} at /${serviceName}`);
  } catch (error) {
    Logger.error(
      `${serviceName} is unavailable at the moment, will not route requests`,
      error.stack,
      { message: error.message }
    );
  }
};
