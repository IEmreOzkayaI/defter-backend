import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession, Connection } from 'mongoose';

const transactionStorage = new AsyncLocalStorage<ClientSession>();

@Injectable()
export class TransactionManager {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  static getSession(): ClientSession | undefined {
    return transactionStorage.getStore();
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (TransactionManager.getSession()) {
      return fn();
    }

    const session = await this.connection.startSession();

    return transactionStorage.run(session, async () => {
      try {
        session.startTransaction();
        const result = await fn();
        await session.commitTransaction();
        return result;
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        await session.endSession();
      }
    });
  }
}
