import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

import { VersionService } from './version.service';

@Controller({ path: 'version', version: VERSION_NEUTRAL })
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  version() {
    return this.versionService.findVersion();
  }
}
