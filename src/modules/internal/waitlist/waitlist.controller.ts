import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { AdminJwtAuthGuard } from '../admin-auth/guards/admin-jwt-auth.guard';
import { CreateWaitlistRequestBodyDTOV1 } from './dto/create-waitlist-request.dto';
import { UpdateWaitlistRequestBodyDTOV1 } from './dto/update-waitlist-request.dto';
import { WaitlistIdRequestParamDTOV1 } from './dto/waitlist-id-param.dto';
import { WaitlistServiceV1 } from './waitlist.service';

@Controller({ version: '1', path: 'admin/waitlist' })
export class WaitlistControllerV1 {
  constructor(private readonly waitlistServiceV1: WaitlistServiceV1) {}

  @Post()
  create(@Body() body: CreateWaitlistRequestBodyDTOV1) {
    return this.waitlistServiceV1.create(body);
  }

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  findAll() {
    return this.waitlistServiceV1.findAll();
  }

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  updateById(@Param() param: WaitlistIdRequestParamDTOV1, @Body() body: UpdateWaitlistRequestBodyDTOV1) {
    return this.waitlistServiceV1.updateById(param.id, body);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  deleteById(@Param() param: WaitlistIdRequestParamDTOV1): Promise<void> {
    return this.waitlistServiceV1.deleteById(param.id);
  }
}
