import { DynamicModule, Module, ValidationPipe } from '@nestjs/common';
import { ConfigFactory, ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { commonConfig } from './config/common.config';
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
  ],
})
export class BaseAppModule {
  static forRoot(options: { rootConfigs?: ConfigFactory[] }): DynamicModule {
    return {
      module: BaseAppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [...(options.rootConfigs ?? []), commonConfig],
        }),
        LoggerModule.forRoot({
          ...(process.env['NODE_ENV'] !== 'production' && {
            pinoHttp: {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                },
              },
            },
          }),
        }),
      ],
    };
  }
}
