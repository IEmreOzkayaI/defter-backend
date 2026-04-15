import { Module } from '@nestjs/common';

import { VersionModule } from './common/modules/version/version.module';
import { AdminAuthModule } from './modules/internal/admin-auth/admin-auth.module';
import { WaitlistModule } from './modules/internal/waitlist/waitlist.module';
import { DatabaseModule } from './modules/shared/database/database.module';

@Module({
  imports: [DatabaseModule, AdminAuthModule, WaitlistModule, VersionModule],
})
export class AppModule {}
