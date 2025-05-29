import { AuthGuard } from '@jobie/auth-core';
import { DynamicModule, Module, ValidationPipe } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import {
  commonConfig,
  commonConfigKey,
  type CommonConfigType,
} from './config/common.config';
import { CrashPreventionExceptionFilter } from './crash-prevention-exception-filter';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CrashPreventionExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useFactory: (config: CommonConfigType, jwtService: JwtService) =>
        new AuthGuard(config.useAuth, config.accessTokenSecret, jwtService),
      inject: [commonConfigKey, JwtService],
    },
  ],
})
export class BaseAppModule {
  static forRoot(options: { rootConfigs?: ConfigFactory[] }): DynamicModule {
    return {
      module: BaseAppModule,
      global: true,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [...(options.rootConfigs ?? []), commonConfig],
        }),
        JwtModule.register({
          global: true,
        }),
        LoggerModule.forRoot({
          ...(process.env['NODE_ENV'] !== 'production' && {
            pinoHttp: {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  ignore: 'pid,hostname,req.headers',
                },
              },
            },
          }),
        }),
      ],
    };
  }
}
