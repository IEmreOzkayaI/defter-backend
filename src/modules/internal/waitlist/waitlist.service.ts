import { Injectable } from '@nestjs/common';

import { CreateWaitlistRequestBodyDTOV1 } from './dto/create-waitlist-request.dto';
import { UpdateWaitlistRequestBodyDTOV1 } from './dto/update-waitlist-request.dto';
import { WaitlistRepositoryV1 } from './waitlist.repository';
import { Waitlist } from './waitlist.schema';

@Injectable()
export class WaitlistServiceV1 {
  constructor(private readonly waitlistRepositoryV1: WaitlistRepositoryV1) {}

  create(dto: CreateWaitlistRequestBodyDTOV1): Promise<Waitlist> {
    return this.waitlistRepositoryV1.create(dto);
  }

  findAll(): Promise<Waitlist[]> {
    return this.waitlistRepositoryV1.findAll();
  }

  updateById(id: string, dto: UpdateWaitlistRequestBodyDTOV1): Promise<Waitlist> {
    return this.waitlistRepositoryV1.updateByIdOrFail(id, dto);
  }

  deleteById(id: string): Promise<void> {
    return this.waitlistRepositoryV1.deleteByIdOrFail(id);
  }
}
