import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPumpNo(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPumpNo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^#\d+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must start with # followed by a number`;
        },
      },
    });
  };
}
