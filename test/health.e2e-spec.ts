import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

let app: NestFastifyApplication;

describe('HealthModule (e2e)', () => {
  beforeEach(() => {
    app = global.__APP__;
  });

  it('healthStatusService /health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        const { info } = body;

        expect(body).toHaveProperty('status', 'ok');
        expect(body).toHaveProperty('info');

        expect(info).toHaveProperty('db');
        expect(info).toHaveProperty(['memory.heap']);
        expect(info).toHaveProperty(['memory.rss']);
        expect(info).toHaveProperty(['disk.usage']);
        expect(info).toHaveProperty(['disk.storage']);
      });
  });
});
