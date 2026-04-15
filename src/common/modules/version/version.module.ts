import { Global, Module } from '@nestjs/common';

import { VersionController } from './version.controller';
import { VersionService } from './version.service';

@Global()
@Module({
  imports: [],
  controllers: [VersionController],
  providers: [VersionService],
})
export class VersionModule {}
