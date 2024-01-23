import { HttpLoggerMiddleware } from './http-logger.middleware';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { mock } from 'jest-mock-extended';
import { ParsedQs } from 'qs';

describe('HttpLoggerMiddleware', () => {
  let middleware: HttpLoggerMiddleware;
  let loggerMock: Logger;
  let requestMock: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
  let responseMock: Response<any, Record<string, any>>;
  let nextFunction: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpLoggerMiddleware],
    }).compile();

    middleware = module.get<HttpLoggerMiddleware>(HttpLoggerMiddleware);
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
    expect(middleware).toBeDefined();
  });

  it('should log error for status code 500', () => {
    const logErrorSpy = jest.spyOn(loggerMock, 'error');

    responseMock.statusCode = 500;
    responseMock.statusMessage = 'Internal Server Error';

    middleware.use(requestMock, responseMock, nextFunction);
    responseMock.emit('finish');

    expect(logErrorSpy).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should log warning for status code 400', () => {
    const logWarnSpy = jest.spyOn(loggerMock, 'warn');

    responseMock.statusCode = 400;
    responseMock.statusMessage = 'Bad Request';

    middleware.use(requestMock, responseMock, nextFunction);
    responseMock.emit('finish');

    expect(logWarnSpy).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should log a request', () => {
    const logSpy = jest.spyOn(loggerMock, 'log');

    middleware.use(requestMock, responseMock, nextFunction);
    responseMock.emit('finish');

    expect(logSpy).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});
