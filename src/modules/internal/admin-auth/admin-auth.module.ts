import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ENV_VAR } from 'src/common/env.config';

import { AdminAuthControllerV1 } from './admin-auth.controller';
import { AdminAuthServiceV1 } from './admin-auth.service';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: ENV_VAR.ADMIN_JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AdminAuthControllerV1],
  providers: [AdminAuthServiceV1, AdminJwtAuthGuard],
  exports: [AdminAuthServiceV1, AdminJwtAuthGuard],
})
export class AdminAuthModule {}
