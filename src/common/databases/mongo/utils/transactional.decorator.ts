import { TransactionManager } from './transaction.manager';

export function Transactional(): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (TransactionManager.getSession()) {
        return original.apply(this, args);
      }

      const tm: TransactionManager = this.transactionManager;
      if (!tm) {
        throw new Error('@Transactional requires "transactionManager" property on the class');
      }

      return tm.run(() => original.apply(this, args));
    };

    return descriptor;
  };
}
