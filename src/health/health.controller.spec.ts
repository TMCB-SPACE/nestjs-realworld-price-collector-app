import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { TERMINUS_LOGGER } from '@nestjs/terminus/dist/health-check/logger/logger.provider';
import { HealthController } from './health.controller';
import ApiConfig from '../config/api.config';
import { LoggerService } from '@nestjs/common';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

const loggerMock: Partial<LoggerService> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const healthCheckExecutorMock: Partial<HealthCheckExecutor> = {
  execute: jest.fn(),
};

const successResponse = {
  status: 'ok',
  info: {
    db: { status: 'up' },
    'memory.heap': { status: 'up' },
    'memory.rss': { status: 'up' },
    'disk.usage': { status: 'up' },
    'disk.storage': { status: 'up' },
  },
  error: {},
  details: {
    db: { status: 'up' },
    'memory.heap': { status: 'up' },
    'memory.rss': { status: 'up' },
    'disk.usage': { status: 'up' },
    'disk.storage': { status: 'up' },
  },
};

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  // let dbService: TypeOrmHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckExecutor,
          useValue: healthCheckExecutorMock,
        },
        {
          provide: 'TERMINUS_ERROR_LOGGER',
          useValue: loggerMock,
        },
        {
          provide: TERMINUS_LOGGER,
          useValue: loggerMock,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockReturnValue(
              Promise.resolve({
                db: successResponse.info.db,
              }),
            ),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn().mockReturnValue(
              Promise.resolve({
                'memory.heap': successResponse.info['memory.heap'],
              }),
            ),
            checkRSS: jest.fn().mockReturnValue(
              Promise.resolve({
                'memory.rss': successResponse.info['memory.rss'],
              }),
            ),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest
              .fn()
              .mockReturnValueOnce(
                Promise.resolve({
                  'disk.usage': successResponse.info['disk.usage'],
                }),
              )
              .mockReturnValue(
                Promise.resolve({
                  'disk.storage': successResponse.info['disk.storage'],
                }),
              ),
          },
        },
        {
          provide: ApiConfig.KEY,
          useValue: {
            memory_heap: 0,
            memory_rss: 0,
            disk_percentage: 0,
            disk_size: 0,
          },
        },
        {
          provide: 'DbConnectionDataSource',
          useValue: {
            dataSource: jest.fn(),
            connect: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  describe('controller exists', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('service', () => {
    it('should check the health of the service', async () => {
      const healthCheck = jest.spyOn(healthCheckService, 'check');
      const result = await controller.service();

      expect(healthCheck).toHaveBeenCalled();
      expect(result).toStrictEqual(successResponse);
    });
  });
});
