import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const ENV_VAR = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  TOKENX_LOGGER_LOG_LEVEL: process.env.TOKENX_LOGGER_LOG_LEVEL,

  MONGO_SSLCA: process.env.MONGO_SSLCA,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  MONGO_URL: process.env.MONGO_URL,

  MONGO_CONNECT_TIMEOUT_MS: process.env.MONGO_CONNECT_TIMEOUT_MS ?? '3000',
  MONGO_SOCKET_TIMEOUT_MS: process.env.MONGO_SOCKET_TIMEOUT_MS ?? '10000',
  MONGO_MAX_TIME_MS: process.env.MONGO_MAX_TIME_MS ?? '10000',
  MONGO_MAX_POOL_SIZE: process.env.MONGO_MAX_POOL_SIZE ?? '100',
  MONGO_MIN_POOL_SIZE: process.env.MONGO_MIN_POOL_SIZE ?? '0',

  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
};

export const ENV_SCHEMA = {
  PORT: { required: true },
  NODE_ENV: { required: true },
  TOKENX_LOGGER_LOG_LEVEL: { required: true },

  MONGO_URL: { required: true },
  MONGO_DATABASE: { required: true },
  MONGO_SSLCA: { required: false },

  MONGO_CONNECT_TIMEOUT_MS: { required: true },
  MONGO_SOCKET_TIMEOUT_MS: { required: true },
  MONGO_MAX_TIME_MS: { required: true },
  MONGO_MAX_POOL_SIZE: { required: true },
  MONGO_MIN_POOL_SIZE: { required: true },

  ADMIN_USERNAME: { required: true },
  ADMIN_PASSWORD: { required: true },
  ADMIN_JWT_SECRET: { required: true },
} as const;
