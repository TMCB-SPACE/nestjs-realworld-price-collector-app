import { CacheConfig, ICacheConfig } from './cache.config';

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
    // delete process.env.NODE_ENV; // don't delete testing environment
    delete process.env.REDIS_DISABLED;
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_USERNAME;
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_TTL;
    delete process.env.REDIS_MAX;

    const config: ICacheConfig = CacheConfig();
    expect(config.enabled).toBe(false);
    expect(config.host).toBe('localhost');
    expect(config.port).toBe('26379');
    expect(config.username).toBe('default');
    expect(config.password).toBe('eYVX7EwVmmxKPCDmwMtyKVge8oLd2t82');
    expect(config.ttl).toBe(5000);
    expect(config.max).toBe(1000);
  });

  it('should use environment variables when they are set', () => {
    process.env.NODE_ENV = 'production';
    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '6379';
    process.env.REDIS_USERNAME = 'admin';
    process.env.REDIS_PASSWORD = 'admin123';
    process.env.REDIS_TTL = '30000'; // 5 * 60 * 1000
    process.env.REDIS_MAX = '50';

    const config: ICacheConfig = CacheConfig();
    expect(config.enabled).toBe(true);
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe('6379');
    expect(config.username).toBe('admin');
    expect(config.password).toBe('admin123');
    expect(config.ttl).toBe(30000);
    expect(config.max).toBe(50);
  });
});
