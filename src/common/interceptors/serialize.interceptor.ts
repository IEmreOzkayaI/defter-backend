import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { CommonUtil } from '../utils';

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<unknown>) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: unknown) => {
        const instance = plainToInstance(this.dto, data, { excludeExtraneousValues: true });
        return CommonUtil.stripUndefinedOnly(instance);
      }),
    );
  }
}

export const Serialize = (dto: ClassConstructor<unknown>) => UseInterceptors(new SerializeInterceptor(dto));
