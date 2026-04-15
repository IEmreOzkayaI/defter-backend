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
      if (!ENV_VAR.MONGO_DATABASE) throw new Error('MONGO_DATABASE environment variable is required');

      const [noQuery, ...queryParts] = ENV_VAR.MONGO_URL.split('?');
      const querySuffix = queryParts.length > 0 ? `?${queryParts.join('?')}` : '';

      const trimmed = noQuery.trim().replace(/\/+$/, '');
      const database = ENV_VAR.MONGO_DATABASE.replace(/^\/+/, '').replace(/\/+$/, '');
      if (!database) throw new Error('MONGO_DATABASE is empty');

      const schemeMatch = trimmed.match(/^(mongodb(?:\+srv)?:\/\/)/i);
      if (!schemeMatch) {
        throw new Error('MONGO_URL must start with mongodb:// or mongodb+srv://');
      }

      const afterScheme = trimmed.slice(schemeMatch[1].length);
      const pathSlash = afterScheme.indexOf('/');
      const authority = pathSlash === -1 ? afterScheme : afterScheme.slice(0, pathSlash);

      // ...host:port + "/" + db — asla ...36463defter gibi birleştirme
      return `${schemeMatch[1]}${authority}/${database}${querySuffix}`;
    };

    const authSource = ENV_VAR.MONGO_AUTH_SOURCE?.trim();

    return {
      uri: mongoUrl(), // The connection URI for MongoDB, including database and any query parameters.
      ...(authSource ? { authSource } : {}),
      connectTimeoutMS: Number(ENV_VAR.MONGO_CONNECT_TIMEOUT_MS), // Maximum time in ms to establish a connection to the MongoDB server.
      socketTimeoutMS: Number(ENV_VAR.MONGO_SOCKET_TIMEOUT_MS), // Maximum time in ms for TCP socket inactivity before closing the connection.
      maxPoolSize: Number(ENV_VAR.MONGO_MAX_POOL_SIZE), // Maximum number of connections that can be created in the connection pool.
      minPoolSize: Number(ENV_VAR.MONGO_MIN_POOL_SIZE), // Minimum number of connections that must always be maintained in the connection pool.
      ...mongoDbOptions,
    };
  }
}
