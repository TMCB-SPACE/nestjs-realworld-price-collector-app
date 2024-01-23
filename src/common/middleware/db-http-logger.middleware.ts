import HttpLoggerMiddleware from './http-logger.middleware';
import { Inject, Logger, Injectable } from '@nestjs/common';
import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { NextFunction, Request, Response } from 'express';
import ApiConfig from '../../config/api.config';
import { ConfigType } from '@nestjs/config';

export interface HttpLog {
  id?: string;
  complete: boolean;
  startTime: number;
  duration: number;
  statusCode: number;
  statusMessage: string;
  reqId: string;
  hostname: string;
  protocol: string;
  ip?: string;
  method: string;
  originalUrl: string;
  query: string;
  headers: string;
  summary: string;
}

@Injectable()
export class DbHttpLoggerMiddleware extends HttpLoggerMiddleware {
  protected logger = new Logger(`DB_HTTP`);

  constructor(
    @Inject(CLICKHOUSE_ASYNC_INSTANCE_TOKEN)
    private readonly logConnection: ClickHouseClient,

    @Inject(ApiConfig.KEY)
    private apiConfig: ConfigType<typeof ApiConfig>,
  ) {
    super();
  }

  use(request: Request, response: Response, next: NextFunction) {
    if (!this.apiConfig.test) {
      const startTime = Date.now();

      response.on('finish', () => {
        const { complete, headers, id, method, originalUrl, hostname, protocol, ip, query } = request;
        const { statusCode, statusMessage } = response;

        const summary = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
        const duration = Date.now() - startTime;

        const log = {
          complete,
          startTime,
          duration,
          statusCode,
          statusMessage,
          reqId: String(id),
          hostname,
          protocol,
          ip,
          method,
          originalUrl,
          query: JSON.stringify(query),
          headers: JSON.stringify(headers),
          summary,
        };

        this.logConnection
          .insertPromise<HttpLog>('http_logs_buffer', [log])
          .then(() => true)
          .catch((error) => {
            this.logger.error('Inserting log broke', error);
          });
      });
    }

    return super.use(request, response, next);
  }
}
