import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { ENV_VAR } from '../../../common/env.config';

@Injectable()
export class DatabaseConfig {
  createMongooseOptions(): MongooseModuleOptions {
    const mongoDbOptions = ENV_VAR.MONGO_SSLCA
      ? {
          tls: true,
          tlsCAFile: ENV_VAR.MONGO_SSLCA,
        }
      : {};

    const mongoUrl = (): string => {
      if (!ENV_VAR.MONGO_URL) throw new Error('MONGO_URL environment variable is required');
      const [base, queryParams] = ENV_VAR.MONGO_URL.split('?');
      const dbUrl = `${base}${ENV_VAR.MONGO_DATABASE}`;
      return queryParams ? `${dbUrl}?${queryParams}` : dbUrl;
    };

    return {
      uri: mongoUrl(), // The connection URI for MongoDB, including database and any query parameters.
      connectTimeoutMS: Number(ENV_VAR.MONGO_CONNECT_TIMEOUT_MS), // Maximum time in ms to establish a connection to the MongoDB server.
      socketTimeoutMS: Number(ENV_VAR.MONGO_SOCKET_TIMEOUT_MS), // Maximum time in ms for TCP socket inactivity before closing the connection.
      maxPoolSize: Number(ENV_VAR.MONGO_MAX_POOL_SIZE), // Maximum number of connections that can be created in the connection pool.
      minPoolSize: Number(ENV_VAR.MONGO_MIN_POOL_SIZE), // Minimum number of connections that must always be maintained in the connection pool.
      ...mongoDbOptions,
    };
  }
}
