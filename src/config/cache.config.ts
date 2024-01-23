import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface ICacheConfig {
  enabled: boolean;
  host: string;
  port: string;
  username: string;
  password: string;
  ttl: number;
  max: number;
}

export const CacheConfig = registerAs(
  'cache',
  (): ICacheConfig => ({
    enabled: !!process.env.REDIS_DISABLED || process.env.NODE_ENV !== 'test',
    host: String(process.env.REDIS_HOST ?? 'localhost'),
    port: String(process.env.REDIS_PORT ?? '26379'),
    username: String(process.env.REDIS_USERNAME ?? 'default'),
    password: String(process.env.REDIS_PASSWORD ?? 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t82'),
    ttl: parseInt(process.env.REDIS_TTL ?? '5000'),
    max: parseInt(process.env.REDIS_MAX ?? '1000'),
  }),
);

export default CacheConfig;
