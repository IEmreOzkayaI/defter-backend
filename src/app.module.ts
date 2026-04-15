import { Module } from '@nestjs/common';
import { TokenXLoggerV2Module } from '@token-org/token-x-common-util/dist/nest-helpers/modules';
import { LoggerV2Config } from '@token-org/token-x-common-util/dist/nest-helpers/modules/loggerv2/config';
import { VersionModule } from '@token-org/tokenx-energy-util';

import { DatabaseModule } from './modules/shared/database/database.module';
import { AdminAuthModule } from './modules/internal/admin-auth/admin-auth.module';
import { WaitlistModule } from './modules/internal/waitlist/waitlist.module';

@Module({
  imports: [DatabaseModule, AdminAuthModule, WaitlistModule, TokenXLoggerV2Module.forRoot(LoggerV2Config), VersionModule],
})
export class AppModule {}
