import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseConfig } from './database.config';
import { DATABASE_ENTITIES } from './database.entities';
import { TransactionManager } from 'src/common/databases/mongo';

@Global()
@Module({
  imports: [MongooseModule.forRootAsync({ useClass: DatabaseConfig }), MongooseModule.forFeature(DATABASE_ENTITIES)],
  providers: [DatabaseConfig, TransactionManager],
  exports: [MongooseModule, TransactionManager],
})
export class DatabaseModule {}
