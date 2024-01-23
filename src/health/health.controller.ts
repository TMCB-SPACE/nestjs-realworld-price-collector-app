import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ConfigType } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import ApiConfig from '../config/api.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
@ApiTags('Health check service')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private database: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,

    @Inject(ApiConfig.KEY)
    private apiConfig: ConfigType<typeof ApiConfig>,

    @InjectDataSource('DbConnection')
    private readonly dbConnection: DataSource,
  ) {}

  @Get('/')
  @ApiOperation({
    operationId: 'healthStatusService',
    summary: 'Check the health of API service endpoints',
  })
  @HealthCheck()
  @ApiOkResponse()
  async service() {
    return this.health.check([
      async () =>
        this.database.pingCheck('db', {
          connection: this.dbConnection,
          timeout: 1500,
        }),
      async () => this.memory.checkHeap('memory.heap', this.apiConfig.memory_heap),
      async () => this.memory.checkRSS('memory.rss', this.apiConfig.memory_rss),
      async () =>
        this.disk.checkStorage('disk.usage', {
          thresholdPercent: this.apiConfig.disk_percentage,
          path: '/',
        }),
      async () =>
        this.disk.checkStorage('disk.storage', {
          thresholdPercent: this.apiConfig.disk_size,
          path: '/',
        }),
    ]);
  }
}
