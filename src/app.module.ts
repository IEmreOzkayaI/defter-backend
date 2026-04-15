import { Module } from '@nestjs/common';
import { VersionModule } from '@token-org/tokenx-energy-util';

import { DatabaseModule } from './modules/shared/database/database.module';
import { AdminAuthModule } from './modules/internal/admin-auth/admin-auth.module';
import { WaitlistModule } from './modules/internal/waitlist/waitlist.module';

@Module({
  imports: [DatabaseModule, AdminAuthModule, WaitlistModule, VersionModule],
})
export class AppModule {}
