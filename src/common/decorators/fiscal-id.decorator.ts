import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';
import { throwBadRequestException } from '../utils/error.util';

export const FiscalId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const fiscalId = req.headers['x-fiscal-id'] as string;
  if (!fiscalId) return throwBadRequestException(ERROR_DEFINITIONS.REQUIRED.reason, 'x-fiscal-id');

  return fiscalId;
});
