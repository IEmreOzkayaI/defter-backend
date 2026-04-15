import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionManager } from '@token-org/tokenx-energy-util/dist/databases/mongo';

import { DatabaseConfig } from './database.config';
import { DATABASE_ENTITIES } from './database.entities';

@Global()
@Module({
  imports: [MongooseModule.forRootAsync({ useClass: DatabaseConfig }), MongooseModule.forFeature(DATABASE_ENTITIES)],
  providers: [DatabaseConfig, TransactionManager],
  exports: [MongooseModule, TransactionManager],
})
export class DatabaseModule {}
