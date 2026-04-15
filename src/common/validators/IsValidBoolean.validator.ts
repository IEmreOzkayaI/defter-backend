import { Transform } from 'class-transformer';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { ERROR_DEFINITIONS } from '../configs/error-definitions.config';

export function IsValidBoolean(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidBoolean',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (value === undefined || value === null || value === '') return true;
          if (typeof value === 'boolean') return true;
          if (value === 'true' || value === 'false') return true;
          return false;
        },
        defaultMessage(): string {
          return ERROR_DEFINITIONS.INVALID_BOOLEAN.reason;
        },
      },
    });

    Transform(({ value }) => {
      if (value === undefined || value === null || value === '') return undefined;
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })(object, propertyName);
  };
}
