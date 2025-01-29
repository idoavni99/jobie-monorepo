import { ArgumentsHost, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
@Injectable()
export class CrashPreventionExceptionFilter extends BaseExceptionFilter {
  override catch(exception: Error, host: ArgumentsHost) {
    return host.getType() === 'http' ? super.catch(exception, host) : true;
  }
}
