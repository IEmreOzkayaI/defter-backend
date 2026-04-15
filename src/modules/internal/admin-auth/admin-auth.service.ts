import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VAR } from 'src/common/env.config';

@Injectable()
export class AdminAuthServiceV1 {
  constructor(private readonly jwtService: JwtService) {}

  validateCredentials(username: string, password: string): void {
    const isValid = username === ENV_VAR.ADMIN_USERNAME && password === ENV_VAR.ADMIN_PASSWORD;
    if (!isValid) throw new UnauthorizedException('Invalid admin credentials');
  }

  async signAdminToken(username: string): Promise<string> {
    return this.jwtService.signAsync({ sub: 'admin', username });
  }

  async verifyTokenOrFail(token: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload?.sub !== 'admin') throw new UnauthorizedException('Invalid admin token');
    } catch {
      throw new UnauthorizedException('Invalid admin token');
    }
  }
}
