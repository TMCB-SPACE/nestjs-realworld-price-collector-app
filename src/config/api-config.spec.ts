import { ApiConfig } from './api.config';

describe('ApiConfig', () => {
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
    delete process.env.API_HOST;
    delete process.env.API_PORT;
    delete process.env.CI;
    delete process.env.MEMORY_HEAP;
    delete process.env.MEMORY_RSS;
    delete process.env.DISK_PERCENTAGE;
    delete process.env.DISK_SIZE;

    const config = ApiConfig();
    expect(config.test).toBe(true);
    expect(config.logging).toBe('debug');
    expect(config.host).toBe('0.0.0.0');
    expect(config.port).toBe('3002');
    expect(config.development).not.toBe(undefined);
    expect(config.memory_heap).toBe(500 * 1024 * 1024);
    expect(config.memory_rss).toBe(3000 * 1024 * 1024);
    expect(config.disk_percentage).toBe(0.95);
    expect(config.disk_size).toBe(1000 * 1024 * 1024 * 1024);
  });

  it('should use environment variables when they are set', () => {
    process.env.NODE_ENV = 'production';
    process.env.API_HOST = '127.0.0.1';
    process.env.API_PORT = '8080';
    process.env.CI = 'true';
    process.env.MEMORY_HEAP = '300';
    process.env.MEMORY_RSS = '4000';
    process.env.DISK_PERCENTAGE = '0.80';
    process.env.DISK_SIZE = '2000';

    const config = ApiConfig();
    expect(config.test).toBe(false);
    expect(config.logging).toBe('info');
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe('8080');
    expect(config.development).toBe(false);
    expect(config.memory_heap).toBe(300 * 1024 * 1024);
    expect(config.memory_rss).toBe(4000 * 1024 * 1024);
    expect(config.disk_percentage).toBe(0.8);
    expect(config.disk_size).toBe(2000 * 1024 * 1024 * 1024);
  });
});
