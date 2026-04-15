import { Module } from '@nestjs/common';

import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { WaitlistControllerV1 } from './waitlist.controller';
import { WaitlistRepositoryV1 } from './waitlist.repository';
import { WaitlistServiceV1 } from './waitlist.service';

@Module({
  imports: [AdminAuthModule],
  controllers: [WaitlistControllerV1],
  providers: [WaitlistRepositoryV1, WaitlistServiceV1],
})
export class WaitlistModule {}
