import { DbConfig, IDbConfig } from './db.config';

describe('DbConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...originalEnv }; // Reset to original environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should use default values if environment variables are not set', () => {
    const config: IDbConfig = DbConfig();
    expect(config.connection).toBe('cockroachdb');
    expect(config.host).toBe('localhost');
    expect(config.port).toBe('22625');
    expect(config.username).toBe('root');
    expect(config.password).toBe('');
    expect(config.database).toBe('pricing');
    expect(config.maxQueryExecutionTime).toBe(10000);
  });

  it('should use environment variables when they are set', () => {
    process.env.TYPEORM_CONNECTION = 'postgres';
    process.env.TYPEORM_HOST = '127.0.0.1';
    process.env.TYPEORM_PORT = '5432';
    process.env.TYPEORM_USERNAME = 'admin';
    process.env.TYPEORM_PASSWORD = 'admin123';
    process.env.TYPEORM_DATABASE = 'mydatabase';
    process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME = '5000';

    const config: IDbConfig = DbConfig();
    expect(config.connection).toBe('postgres');
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe('5432');
    expect(config.username).toBe('admin');
    expect(config.password).toBe('admin123');
    expect(config.database).toBe('mydatabase');
    expect(config.maxQueryExecutionTime).toBe(5000);
  });
});
