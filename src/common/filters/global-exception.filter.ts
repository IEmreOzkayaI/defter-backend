import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';

/* ============================================================
 * Global Exception Filter
 * ============================================================ */

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (response.headersSent) return;

    this.log(exception, request);

    const { statusCode, body } = ExceptionResponseFactory.from(exception);
    response.status(statusCode).json(body);
  }

  private log(exception: any, request: any): void {
    const status = typeof exception?.getStatus === 'function' ? exception.getStatus() : (exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    this.logger.error(
      JSON.stringify({
        name: exception?.name,
        message: exception?.message,
        reason: exception?.reason,
        status,
        method: request.method,
        path: request.url,
      }),
    );
  }
}

/* ============================================================
 * Exception Response Factory (routing brain)
 * ============================================================ */

class ExceptionResponseFactory {
  static from(exception: any): { statusCode: number; body: any } {
    if (this.isBadRequest(exception)) {
      return this.validation(exception);
    }

    if (this.isNotFound(exception)) {
      const reason = exception?.reason ?? ERROR_DEFINITIONS.ROUTE_NOT_FOUND.reason;
      return error(HttpStatus.NOT_FOUND, reason, exception?.field ?? null);
    }

    if (this.isEntityNotFound(exception)) {
      return error(HttpStatus.NOT_FOUND, ERROR_DEFINITIONS.NOT_FOUND.reason, null);
    }

    if (PostgresExceptionHandler.canHandle(exception)) {
      return PostgresExceptionHandler.handle(exception);
    }

    if (MongoExceptionHandler.canHandle(exception)) {
      return MongoExceptionHandler.handle(exception);
    }

    if (exception?.reason) {
      return error(exception.status ?? HttpStatus.UNPROCESSABLE_ENTITY, exception.reason, exception.field ?? null);
    }

    if (typeof exception?.getStatus === 'function') {
      return error(exception.getStatus(), ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.reason, null);
    }

    return error(HttpStatus.INTERNAL_SERVER_ERROR, ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.reason, null);
  }

  private static validation(exception: any): { statusCode: number; body: any } {
    const response = typeof exception?.getResponse === 'function' ? (exception.getResponse() as any) : undefined;
    const reason = response?.reason ?? exception?.reason;
    const field = response?.field ?? exception?.field;

    if (typeof reason === 'string' && reason.length > 0) {
      return error(HttpStatus.BAD_REQUEST, reason, field ?? null);
    }

    const messages = Array.isArray(response) ? response : response?.message;
    if (Array.isArray(messages) && messages.length > 0) {
      const parsed = validationErrorsToReasonAndField(messages);
      return error(HttpStatus.BAD_REQUEST, parsed.reason, parsed.field);
    }

    return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.INVALID.reason, null);
  }

  private static isBadRequest(exception: any): boolean {
    return exception?.name === 'BadRequestException' || (typeof exception?.getStatus === 'function' && exception.getStatus() === HttpStatus.BAD_REQUEST);
  }

  private static isNotFound(exception: any): boolean {
    return exception?.name === 'NotFoundException' || (typeof exception?.getStatus === 'function' && exception.getStatus() === HttpStatus.NOT_FOUND);
  }

  private static isEntityNotFound(exception: any): boolean {
    return exception?.name === 'EntityNotFoundError';
  }
}

/* ============================================================
 * Postgres / TypeORM handler
 * ============================================================ */

class PostgresExceptionHandler {
  static canHandle(exception: any): boolean {
    return exception?.name === 'QueryFailedError' && !!exception?.driverError?.code;
  }

  static handle(exception: any): { statusCode: number; body: any } {
    const code = exception.driverError.code as string;

    switch (code) {
      case '23505':
        return error(HttpStatus.CONFLICT, ERROR_DEFINITIONS.ALREADY_EXISTS.reason);
      case '23503':
        return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.FOREIGN_KEY_VIOLATION.reason);
      case '23502':
        return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.NOT_NULL_VIOLATION.reason);
      case '23514':
        return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.CHECK_VIOLATION.reason);
      case '22P02':
        return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.INVALID_TEXT_REPRESENTATION.reason);
      case '57014': // query_canceled — statement_timeout veya query_timeout
        return error(HttpStatus.REQUEST_TIMEOUT, ERROR_DEFINITIONS.DATABASE_ERROR.reason);
      default:
        return error(HttpStatus.UNPROCESSABLE_ENTITY, ERROR_DEFINITIONS.DATABASE_ERROR.reason);
    }
  }
}

/* ============================================================
 * Mongo / Mongoose handler
 * ============================================================ */

class MongoExceptionHandler {
  static canHandle(exception: any): boolean {
    const isValidationOrDuplicate = exception?.name === 'ValidationError' || exception?.name === 'CastError' || exception?.code === 11000;

    const message: string | undefined = typeof exception?.message === 'string' ? exception.message : undefined;

    const isTimeout = exception?.code === 50 || exception?.name === 'MongoNetworkTimeoutError' || exception?.name === 'MongoOperationTimeoutError' || (exception?.name === 'MongoNetworkError' && !!message && /timed out/i.test(message)) || (!!message && /timed out/i.test(message));

    return isValidationOrDuplicate || isTimeout;
  }

  static handle(exception: any): { statusCode: number; body: any } {
    if (exception?.name === 'ValidationError') {
      const firstKey = Object.keys(exception.errors)[0];
      return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.INVALID.reason, exception.errors[firstKey]?.path ?? null);
    }

    if (exception?.name === 'CastError') {
      return error(HttpStatus.BAD_REQUEST, ERROR_DEFINITIONS.INVALID.reason, exception?.path ?? null);
    }

    if (exception?.code === 11000) {
      const field = exception.keyPattern ? Object.keys(exception.keyPattern)[0] : null;

      return error(HttpStatus.CONFLICT, ERROR_DEFINITIONS.ALREADY_EXISTS.reason, field === '_id' ? 'id' : field);
    }

    const message: string | undefined = typeof exception?.message === 'string' ? exception.message : undefined;

    const isMaxTimeMsExpired = exception?.code === 50; // MongoServerError MaxTimeMSExpired
    const isNetworkTimeout = exception?.name === 'MongoNetworkTimeoutError' || exception?.name === 'MongoOperationTimeoutError' || (exception?.name === 'MongoNetworkError' && !!message && /timed out/i.test(message)) || (!!message && /timed out/i.test(message));

    if (isMaxTimeMsExpired || isNetworkTimeout) {
      return error(HttpStatus.REQUEST_TIMEOUT, ERROR_DEFINITIONS.DATABASE_ERROR.reason, null);
    }

    return error(HttpStatus.UNPROCESSABLE_ENTITY, ERROR_DEFINITIONS.DATABASE_ERROR.reason, null);
  }
}

/* ============================================================
 * Validation utilities (shared)
 * ============================================================ */

export function validationErrorsToReasonAndField(
  errors: Array<{
    property?: string;
    constraints?: Record<string, string>;
    children?: any[];
  }>,
): { reason: string; field: string | null } {
  for (const error of errors) {
    const found = findFirstConstraint(error, []);
    if (found) {
      return {
        reason: mapConstraintToReason(found.constraintKey),
        field: found.field,
      };
    }
  }
  return {
    reason: ERROR_DEFINITIONS.INVALID.reason,
    field: null,
  };
}

function findFirstConstraint(error: any, path: Array<string | number>): { field: string; constraintKey: string } | null {
  if (!error) return null;

  const nextPath = error.property !== undefined ? [...path, error.property] : path;

  const constraints = error.constraints;
  if (constraints) {
    const key = Object.keys(constraints)[0];
    return {
      field: formatPath(nextPath),
      constraintKey: key,
    };
  }

  if (Array.isArray(error.children)) {
    for (const child of error.children) {
      const found = findFirstConstraint(child, nextPath);
      if (found) return found;
    }
  }

  return null;
}

function formatPath(path: Array<string | number>): string {
  return path
    .map((p) => {
      if (typeof p === 'number') return `[${p}]`;
      // class-validator uses string "0", "1" for array indices
      if (typeof p === 'string' && /^\d+$/.test(p)) return `[${p}]`;
      return p;
    })
    .reduce((acc, cur) => {
      if (cur.startsWith?.('[')) return acc + cur;
      return acc ? `${acc}.${cur}` : cur;
    }, '');
}

function mapConstraintToReason(constraintKey: string): string {
  const map: Record<string, string> = {
    isNotEmpty: ERROR_DEFINITIONS.REQUIRED.reason,
    isDefined: ERROR_DEFINITIONS.REQUIRED.reason,
    arrayMinSize: ERROR_DEFINITIONS.ARRAY_MIN_SIZE.reason,
    minLength: ERROR_DEFINITIONS.MIN_LENGTH.reason,
    maxLength: ERROR_DEFINITIONS.MAX_LENGTH.reason,
    isUuid: ERROR_DEFINITIONS.INVALID_UUID.reason,
    isInt: ERROR_DEFINITIONS.INVALID_INTEGER.reason,
    isString: ERROR_DEFINITIONS.INVALID_STRING.reason,
    isNumber: ERROR_DEFINITIONS.INVALID_INTEGER.reason,
    isValidBoolean: ERROR_DEFINITIONS.INVALID_BOOLEAN.reason,
    isArray: ERROR_DEFINITIONS.INVALID_ARRAY.reason,
    isEnum: ERROR_DEFINITIONS.INVALID_ENUM.reason,
    isObject: ERROR_DEFINITIONS.INVALID_OBJECT.reason,
    isDate: ERROR_DEFINITIONS.INVALID_DATE.reason,
    isPumpNo: ERROR_DEFINITIONS.INVALID_PUMP_NO.reason,
    isFiscalIdValid: ERROR_DEFINITIONS.INVALID_FISCAL_ID.reason,
    isBase64: ERROR_DEFINITIONS.INVALID_BASE64.reason,
  };

  return map[constraintKey] ?? ERROR_DEFINITIONS.INVALID.reason;
}

/* ============================================================
 * Response helper
 * ============================================================ */

function error(statusCode: number, reason: string, field: string | null = null): { statusCode: number; body: any } {
  return {
    statusCode,
    body: {
      success: false,
      error: {
        reason,
        field,
      },
    },
  };
}
