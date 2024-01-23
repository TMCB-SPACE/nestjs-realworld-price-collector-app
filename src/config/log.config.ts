import { registerAs } from '@nestjs/config';

export interface ILogConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export const LogConfig = registerAs(
  'log',
  (): ILogConfig => ({
    host: String(process.env.CLICKHOUSE_HOST ?? '127.0.0.1'),
    port: String(process.env.CLICKHOUSE_PORT ?? '28123'),
    username: String(process.env.CLICKHOUSE_USERNAME ?? 'root'),
    password: String(process.env.CLICKHOUSE_PASSWORD ?? 'root'),
    database: String(process.env.CLICKHOUSE_DATABASE ?? 'logging'),
  }),
);

export default LogConfig;
