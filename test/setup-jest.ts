import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

beforeEach(async () => {
  process.env.TYPEORM_CONNECTION = 'postgres';
  process.env.TYPEORM_PORT = '25432';

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule], // Import the actual module
  }).compile();

  global.__APP__ = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  global.__APP__.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  await global.__APP__.init();
  await global.__APP__.getHttpAdapter().getInstance().ready();
});

afterAll(async () => {
  await global.__APP__.close();
});
