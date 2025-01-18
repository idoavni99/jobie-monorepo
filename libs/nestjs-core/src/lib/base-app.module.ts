import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { CrashPreventionExceptionFilter } from './crash-prevention-exception-filter';
@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [],
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
  exports: [],
})
export class BaseAppModule {}
