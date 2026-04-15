import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ENV_VAR } from 'src/common/env.config';

import { CreateWaitlistRequestBodyDTOV1 } from './dto/create-waitlist-request.dto';
import { UpdateWaitlistRequestBodyDTOV1 } from './dto/update-waitlist-request.dto';
import { Waitlist, WaitlistDocument } from './waitlist.schema';

@Injectable()
export class WaitlistRepositoryV1 {
  constructor(@InjectModel(Waitlist.name) private readonly model: Model<WaitlistDocument>) {}

  private queryOptions(): Record<string, number> {
    return { maxTimeMS: Number(ENV_VAR.MONGO_MAX_TIME_MS) };
  }

  async create(dto: CreateWaitlistRequestBodyDTOV1): Promise<Waitlist> {
    const created = await this.model.create(dto);
    return created.toObject();
  }

  async findAll(): Promise<Waitlist[]> {
    return this.model.find({}, undefined, this.queryOptions()).sort({ created_at: -1 }).lean().exec();
  }

  async updateByIdOrFail(id: string, dto: UpdateWaitlistRequestBodyDTOV1): Promise<Waitlist> {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { ...this.queryOptions(), new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Waitlist item not found');
    return updated;
  }

  async deleteByIdOrFail(id: string): Promise<void> {
    const result = await this.model.deleteOne({ _id: id }, this.queryOptions()).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Waitlist item not found');
  }
}
