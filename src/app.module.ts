import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import ApiConfig from './config/api.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DbConfig from './config/db.config';
import { InjectDataSource, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import DatabaseLoggerMiddleware from './common/middleware/database-logger.middleware';
import { DataSource } from 'typeorm';
import { LoggerModule } from 'nestjs-pino';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { DbCurrency } from './currency/entities/currency.entity';
import { CurrencyModule } from './currency/currency.module';
import { DbExchangeRate } from './currency/entities/exchange-rate.entity';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import LogConfig from './config/log.config';
import { DbHttpLoggerMiddleware } from './common/middleware/db-http-logger.middleware';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import CacheConfig from './config/cache.config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          connectionName: 'CacheConnection',
          host: configService.get('cache.host'),
          port: configService.get('cache.port'),
          username: configService.get('cache.username'),
          password: configService.get('cache.password'),
          ttl: configService.get('cache.ttl'),
        }),
        max: configService.get('cache.max'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    ClickHouseModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('log.host'),
        port: configService.get('log.port'),
        username: configService.get('log.username'),
        password: configService.get('log.password'),
        database: configService.get('log.database'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [ApiConfig, CacheConfig, DbConfig, LogConfig],
      isGlobal: true,
    }),
    CurrencyModule,
    HealthModule,
    HttpModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          name: `api`,
          level: configService.get('api.logging'),
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'UTC:hh:MM:ss.l',
              singleLine: true,
              messageFormat: `${clc.yellow(`[{context}]`)} ${clc.green(`{msg}`)}`,
              ignore: 'pid,hostname,context',
            },
          },
          autoLogging: !configService.get('api.test'),
          customProps: () => ({ context: 'HTTP' }),
        },
        exclude: [{ method: RequestMethod.ALL, path: 'check' }],
      }),
    }),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'DbConnection',
      useFactory: (configService: ConfigService) =>
        ({
          name: 'DbConnection',
          parseInt8: true,
          type: configService.get('db.connection'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          autoLoadEntities: false,
          entities: [DbCurrency, DbExchangeRate],
          synchronize: false,
          logger: configService.get('api.test') ? false : new DatabaseLoggerMiddleware('DB'),
          maxQueryExecutionTime: configService.get('db.maxQueryExecutionTime'),
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {
  constructor(
    @InjectDataSource('DbConnection')
    private readonly dbConnection: DataSource,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DbHttpLoggerMiddleware).forRoutes('*');
  }
}
