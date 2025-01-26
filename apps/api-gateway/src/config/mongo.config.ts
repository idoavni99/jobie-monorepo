import { ConfigType, registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongoConfig = registerAs<MongooseModuleOptions>('mongo', () => ({
  uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017',
  dbName: process.env.MONGO_DB_NAME ?? 'jobie',
  lazyConnection: Boolean(process.env.MONGO_LAZY_CONNECT) || false,
  connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT) || 5000,
}));
export type MongoConfigType = ConfigType<typeof mongoConfig>;
