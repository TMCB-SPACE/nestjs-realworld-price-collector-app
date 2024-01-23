import { DatabaseLoggerMiddleware } from './database-logger.middleware';
import { Logger as NestLogger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
}));

describe('DatabaseLoggerMiddleware', () => {
  let databaseLogger: DatabaseLoggerMiddleware;
  let loggerMock: NestLogger;
  let queryRunnerMock: QueryRunner;

  beforeEach(() => {
    databaseLogger = new DatabaseLoggerMiddleware();
    loggerMock = databaseLogger['logger'];
    queryRunnerMock = { data: {} } as QueryRunner;
  });

  describe('logQuery', () => {
    it('should log a query', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'log');

      const query = 'SELECT * FROM users';
      const parameters = ['param1', 'param2'];
      databaseLogger.logQuery(query, parameters, queryRunnerMock);
      expect(logQuerySpy).toHaveBeenCalledWith(`${query} -- Parameters: ${JSON.stringify(parameters)}`);
    });

    it('should not log a query if isCreatingLogs is true', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'log');
      queryRunnerMock.data.isCreatingLogs = true;

      const query = 'SELECT * FROM users';
      const parameters = ['param1', 'param2'];
      databaseLogger.logQuery(query, parameters, queryRunnerMock);
      expect(logQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('logQueryError', () => {
    it('should log a query error', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'error');

      const error = 'Error message';
      const query = 'SELECT * FROM users WHERE id = ?';
      const parameters = ['1'];
      databaseLogger.logQueryError(error, query, parameters, queryRunnerMock);
      expect(logQuerySpy).toHaveBeenCalledWith(`${query} -- Parameters: ${JSON.stringify(parameters)} -- ${error}`);
    });

    it('should not log a query error if isCreatingLogs is true', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'error');
      queryRunnerMock.data.isCreatingLogs = true;

      const error = 'Error message';
      const query = 'SELECT * FROM users WHERE id = ?';
      const parameters = ['1'];
      databaseLogger.logQueryError(error, query, parameters, queryRunnerMock);
      expect(logQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('logQuerySlow', () => {
    it('should log a slow query', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'error');

      const time = 5000; // 5000ms
      const query = 'SELECT * FROM users';
      const parameters = ['param1', 'param2'];
      databaseLogger.logQuerySlow(time, query, parameters, queryRunnerMock);
      expect(logQuerySpy).toHaveBeenCalledWith(
        expect.stringContaining(`${query} -- Parameters: ${JSON.stringify(parameters)}`),
      );
    });

    it('should not log a slow query if isCreatingLogs is true', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'error');
      queryRunnerMock.data.isCreatingLogs = true;

      const time = 5000; // 5000ms
      const query = 'SELECT * FROM users';
      const parameters = ['param1', 'param2'];
      databaseLogger.logQuerySlow(time, query, parameters, queryRunnerMock);
      expect(logQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('logMigration', () => {
    it('should log a migration', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'warn');

      const message = 'Migration started';
      databaseLogger.logMigration(message);
      expect(logQuerySpy).toHaveBeenCalledWith(message);
    });
  });

  describe('logSchemaBuild', () => {
    it('should log schema build', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'warn');

      const message = 'Schema build';
      databaseLogger.logSchemaBuild(message);
      expect(logQuerySpy).toHaveBeenCalledWith(message);
    });
  });

  describe('log', () => {
    it('should log a message based on the level', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'log');
      const debugQuerySpy = jest.spyOn(loggerMock, 'debug');
      const warnQuerySpy = jest.spyOn(loggerMock, 'warn');
      const message = 'General log message';

      databaseLogger.log('log', message, queryRunnerMock);
      expect(logQuerySpy).toHaveBeenCalledWith(message);

      databaseLogger.log('info', message, queryRunnerMock);
      expect(debugQuerySpy).toHaveBeenCalledWith(message);

      databaseLogger.log('warn', message, queryRunnerMock);
      expect(warnQuerySpy).toHaveBeenCalledWith(message);
    });

    it('should not log a message if isCreatingLogs is true', () => {
      const logQuerySpy = jest.spyOn(loggerMock, 'log');
      queryRunnerMock.data.isCreatingLogs = true;
      const message = 'General log message';

      databaseLogger.log('log', message, queryRunnerMock);
      expect(logQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('stringifyParameters', () => {
    it('should stringify parameters', () => {
      const parameters = ['param1', 'param2'];
      const result = databaseLogger['stringifyParameters'](parameters);
      expect(result).toEqual(JSON.stringify(parameters));
    });

    it('should return an empty string if parameters are not JSON serializable', () => {
      const jsonStringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation(() => {
        throw new Error();
      });

      const parameters = ['invalidJson'];
      const result = databaseLogger['stringifyParameters'](parameters);
      expect(result).toEqual('');
      expect(jsonStringifySpy).toHaveBeenCalledWith(parameters);
    });
  });
});
