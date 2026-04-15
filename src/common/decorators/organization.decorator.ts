import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';
import { throwInternalServerException } from '../utils/error.util';

export interface Organization {
  fiscalId: string;
  branchId: string;
  merchantId: string;
  distributionCompanyId: string;
}

export const OrganizationHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext): Organization => {
  const request = ctx.switchToHttp().getRequest();
  const headers = request.headers;

  const fiscalId = headers['x-fiscal-id'];
  const branchId = headers['x-branch-id'];
  const merchantId = headers['x-merchant-id'];
  const distributionCompanyId = headers['x-distribution-company-id'];

  if (!fiscalId || !branchId || !merchantId || !distributionCompanyId) {
    throwInternalServerException(ERROR_DEFINITIONS.ORGANIZATION_HEADERS_NOT_FOUND.reason);
  }

  return {
    fiscalId,
    branchId,
    merchantId,
    distributionCompanyId,
  };
});
