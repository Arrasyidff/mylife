import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../middleware/auth.middleware';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
