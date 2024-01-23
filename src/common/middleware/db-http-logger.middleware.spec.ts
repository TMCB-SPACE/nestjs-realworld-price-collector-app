import { DbHttpLoggerMiddleware } from './db-http-logger.middleware';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { mock } from 'jest-mock-extended';
import { ParsedQs } from 'qs';
import { CLICKHOUSE_ASYNC_INSTANCE_TOKEN, ClickHouseClient } from '@depyronick/nestjs-clickhouse';
import { ApiConfig, IApiConfig } from '../../config/api.config';

describe('DbHttpLoggerMiddleware', () => {
  let middleware: DbHttpLoggerMiddleware;
  let loggerMock: Logger;
  let requestMock: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
  let responseMock: Response<any, Record<string, any>>;
  let nextFunction: NextFunction;
  let apiConfig: IApiConfig;
  let clickhouseConnection: ClickHouseClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CLICKHOUSE_ASYNC_INSTANCE_TOKEN,
          useValue: {
            insertPromise: jest.fn(() => Promise.resolve(true)),
          },
        },
        {
          provide: ApiConfig.KEY,
          useValue: {
            test: false,
          },
        },
        DbHttpLoggerMiddleware,
      ],
    }).compile();

    middleware = module.get<DbHttpLoggerMiddleware>(DbHttpLoggerMiddleware);
    apiConfig = module.get<IApiConfig>(ApiConfig.KEY);
    clickhouseConnection = module.get<ClickHouseClient>(CLICKHOUSE_ASYNC_INSTANCE_TOKEN);
    middleware['logger'] = mock<Logger>({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    });
    loggerMock = middleware['logger'];
    requestMock = mock<Request>({
      method: 'GET',
      originalUrl: '/test',
    });
    responseMock = mock<Response>({
      statusCode: 200,
      statusMessage: 'OK',
      on: jest.fn().mockImplementation((event: string, callback: () => void) => {
        if (event === 'finish') {
          callback();
        }
        return responseMock;
      }),
    });
    nextFunction = jest.fn();
  });

  it('should be defined', () => {
    apiConfig.test = true;
    expect(middleware).toBeDefined();
  });

  it('should log a request if not in testing mode', () => {
    const logSpy = jest.spyOn(loggerMock, 'log');

    middleware.use(requestMock, responseMock, nextFunction);
    responseMock.emit('finish');

    expect(logSpy).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should fail to log when clickhouse is unavailable', () => {
    clickhouseConnection.insertPromise = jest.fn(() => Promise.reject(new Error('test')));

    middleware.use(requestMock, responseMock, nextFunction);
    responseMock.emit('finish');

    expect(nextFunction).toHaveBeenCalled();
  });
});
