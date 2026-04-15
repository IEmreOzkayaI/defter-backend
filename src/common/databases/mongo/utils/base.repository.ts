import { ClientSession, Model } from 'mongoose';

import { TransactionManager } from './transaction.manager';

export type MongooseSession = { session?: ClientSession };

export abstract class BaseRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}

  protected currentSession(): ClientSession | undefined {
    return TransactionManager.getSession();
  }
}
