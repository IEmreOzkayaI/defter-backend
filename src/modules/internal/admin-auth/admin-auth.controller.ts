import { Body, Controller, Post } from '@nestjs/common';

import { AdminAuthServiceV1 } from './admin-auth.service';
import { AdminLoginRequestBodyDTOV1 } from './dto/admin-login-request.dto';

@Controller({ version: '1', path: 'admin/auth' })
export class AdminAuthControllerV1 {
  constructor(private readonly adminAuthServiceV1: AdminAuthServiceV1) {}

  @Post('login')
  async login(@Body() body: AdminLoginRequestBodyDTOV1): Promise<{ accessToken: string }> {
    this.adminAuthServiceV1.validateCredentials(body.username, body.password);
    const accessToken = await this.adminAuthServiceV1.signAdminToken(body.username);
    return { accessToken };
  }
}
