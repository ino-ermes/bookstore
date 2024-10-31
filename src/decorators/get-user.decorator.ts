import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export class RequestUser {
  id: string;
  role: Role;
}
