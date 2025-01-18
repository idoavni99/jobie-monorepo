import { ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

export class CrashPreventionExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: Logger) {
    super();
  }

  override catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      this.logger.warn(
        'Http Exception in server, bubbling up in response',
        'CrashPreventionExceptionFilter',
        {
          message: exception.message,
          stack: exception.stack,
          statusCode: exception.getStatus(),
          cause: exception.cause,
        }
      );
      return super.catch(exception, host);
    }

    this.logger.error(
      'Unexpected Error in the server',
      'CrashPreventionExceptionFilter',
      {
        message: exception.message,
        stack: exception.stack,
      }
    );
    return true;
  }
}
