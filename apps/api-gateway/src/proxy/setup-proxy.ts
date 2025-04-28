import { AuthorizedRequest } from '@jobie/auth-core';
import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from '../app/auth/middleware/auth.middleware';
export const setupProxyToService = async (
  app: INestApplication,
  [serviceName, serviceUrl]: [string, string],
  domain: string
) => {
  try {
    const swaggerJson: OpenAPIObject = await fetch(
      `${serviceUrl}/api-json`
    ).then((response) => response.json());
    const modifiedPaths = Object.fromEntries(
      Object.entries(swaggerJson.paths).map(([currentPathPrefix, path]) => [
        `/${serviceName}${currentPathPrefix}`,
        path,
      ])
    );
    swaggerJson.paths = modifiedPaths;
    SwaggerModule.setup(`api/${serviceName}`, app, swaggerJson);
  } catch (error) {
    Logger.error(
      `${serviceName} is unavailable at the moment, Swagger will not be available but requests will route when it's up`,
      error.stack,
      { message: error.message }
    );
  }

  const authMiddleware = await app.resolve(AuthMiddleware);

  const proxy = createProxyMiddleware<AuthorizedRequest>({
    target: serviceUrl,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: domain,
    pathRewrite: (path) => {
      return path.replace(`/${serviceName}`, '');
    },
    logger: {
      info: Logger.log,
      warn: Logger.warn,
      debug: Logger.debug,
      error: Logger.error,
    },
    on: {
      proxyReq: (proxyRequest, request) => {
        if (request.authToken) {
          proxyRequest.setHeader('x-jobie-authorization', request.authToken);
        }
      },
    },
  });

  app.use(`/${serviceName}`, authMiddleware.use, proxy);
  Logger.log(`Routing requests to ${serviceName} at /${serviceName}`);
};
