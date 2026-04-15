import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';

/**
 * Custom exception class that works with GlobalExceptionFilter
 * The filter checks for exception.reason property to handle custom domain errors
 */
export class CustomException extends HttpException {
  public readonly reason: string;
  public readonly field: string | null;

  constructor(reason: string, status: number = HttpStatus.UNPROCESSABLE_ENTITY, field: string | null = null) {
    super({ reason, field }, status);
    this.reason = reason;
    this.field = field;
  }
}

// ======================
// VALIDATION ERRORS (400)
// ======================

export const throwBadRequestException = (reason?: string, field?: string | null): never => {
  throw new CustomException(reason ?? ERROR_DEFINITIONS.INVALID.reason, HttpStatus.BAD_REQUEST, field ?? null);
};

// ======================
// AUTH ERRORS (401/403)
// ======================

export const throwUnauthorizedException = (reason?: string, field?: string | null): never => {
  throw new CustomException(reason ?? ERROR_DEFINITIONS.UNAUTHORIZED.reason, HttpStatus.UNAUTHORIZED, field ?? null);
};

export const throwForbiddenException = (reason?: string, field?: string | null): never => {
  throw new CustomException(reason ?? ERROR_DEFINITIONS.FORBIDDEN.reason, HttpStatus.FORBIDDEN, field ?? null);
};

// ======================
// NOT FOUND (404)
// ======================

export const throwNotFoundException = (reason?: string, field?: string | null): never => {
  throw new CustomException(reason ?? ERROR_DEFINITIONS.NOT_FOUND.reason, HttpStatus.NOT_FOUND, field ?? null);
};

// ======================
// CONFLICT (409)
// ======================

export const throwConflictException = (reason?: string, field?: string | null): never => {
  throw new CustomException(reason ?? ERROR_DEFINITIONS.ALREADY_EXISTS.reason, HttpStatus.CONFLICT, field ?? null);
};

// ======================
// UNPROCESSABLE ENTITY (422)
// ======================

export const throwUnprocessableEntityException = (reason: string, field?: string | null): never => {
  throw new CustomException(reason, HttpStatus.UNPROCESSABLE_ENTITY, field ?? null);
};

// ======================
// FAILED DEPENDENCY (423)
// ======================

export const throwFailedDependencyException = (reason: string, field?: string | null): never => {
  throw new CustomException(reason, HttpStatus.FAILED_DEPENDENCY, field ?? null);
};

// ======================
// METHOD NOT ALLOWED (405)
// ======================

export const throwMethodNotAllowedException = (reason: string, field?: string | null): never => {
  throw new CustomException(reason, HttpStatus.METHOD_NOT_ALLOWED, field ?? null);
};

// ======================
// INTERNAL SERVER ERROR (500)
// ======================

export const throwInternalServerException = (reason: string, field?: string | null): never => {
  throw new CustomException(reason, HttpStatus.INTERNAL_SERVER_ERROR, field ?? null);
};
