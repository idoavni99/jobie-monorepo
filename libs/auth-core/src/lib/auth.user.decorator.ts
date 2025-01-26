import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedRequest } from './types/authorized.request.type';

export const AuthUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    return request.authUser;
  }
);
