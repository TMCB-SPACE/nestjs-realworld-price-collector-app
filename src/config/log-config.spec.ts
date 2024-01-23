import { LogConfig, ILogConfig } from './log.config';

describe('LogConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...originalEnv }; // Reset to original environment variables
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original environment
  });

  it('should use default values if environment variables are not set', () => {
    delete process.env.CLICKHOUSE_HOST;
    delete process.env.CLICKHOUSE_PORT;
    delete process.env.CLICKHOUSE_USERNAME;
    delete process.env.CLICKHOUSE_PASSWORD;
    delete process.env.CLICKHOUSE_DATABASE;

    const config: ILogConfig = LogConfig();
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe('28123');
    expect(config.username).toBe('root');
    expect(config.password).toBe('root');
    expect(config.database).toBe('logging');
  });

  it('should use environment variables if set', () => {
    process.env.CLICKHOUSE_HOST = 'localhost';
    process.env.CLICKHOUSE_PORT = '9000';
    process.env.CLICKHOUSE_USERNAME = 'test';
    process.env.CLICKHOUSE_PASSWORD = 'password';
    process.env.CLICKHOUSE_DATABASE = 'test';

    const config: ILogConfig = LogConfig();
    expect(config.host).toBe('localhost');
    expect(config.port).toBe('9000');
    expect(config.username).toBe('test');
    expect(config.password).toBe('password');
    expect(config.database).toBe('test');
  });
});
