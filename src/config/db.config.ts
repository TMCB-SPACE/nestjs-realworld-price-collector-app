import { registerAs } from '@nestjs/config';

export interface IDbConfig {
  connection: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  maxQueryExecutionTime: number;
}

export const DbConfig = registerAs(
  'db',
  (): IDbConfig => ({
    connection: String(process.env.TYPEORM_CONNECTION ?? 'cockroachdb'),
    host: String(process.env.TYPEORM_HOST ?? 'localhost'),
    port: String(process.env.TYPEORM_PORT ?? '22625'),
    username: String(process.env.TYPEORM_USERNAME ?? 'root'),
    password: String(process.env.TYPEORM_PASSWORD ?? ''),
    database: String(process.env.TYPEORM_DATABASE ?? 'pricing'),
    maxQueryExecutionTime: Number(parseInt(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME ?? '10000', 10)),
  }),
);

export default DbConfig;
