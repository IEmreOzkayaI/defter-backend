import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AdminAuthServiceV1 } from '../admin-auth.service';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(private readonly adminAuthServiceV1: AdminAuthServiceV1) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer authorization header is required');

    const token = authorization.replace('Bearer ', '').trim();
    if (!token) throw new UnauthorizedException('Invalid bearer token');

    await this.adminAuthServiceV1.verifyTokenOrFail(token);
    return true;
  }
}
