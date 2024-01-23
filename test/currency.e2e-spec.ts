import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

let app: NestFastifyApplication;

describe('CurrencyModule (e2e)', () => {
  beforeEach(() => {
    app = global.__APP__;
  });

  describe('findAllCurrencies /currency (GET)', () => {
    const endpoint = '/currency';

    it('should list all currencies', async () => {
      return request(app.getHttpServer())
        .get(endpoint)
        .expect(200)
        .expect(({ body }) => {
          const {
            data,
            meta: { page, limit },
          } = body;

          expect(data).toBeInstanceOf(Array);
          expect(page).toBe(1);
          expect(limit).toBe(50);
        });
    });
  });

  describe('createCurrency /currency (POST) ', () => {
    const endpoint = '/currency';
    const createCurrencyDto = {
      code: 'JPY',
      name: 'Japanese Yen',
    };

    it('should create a new currency', async () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(createCurrencyDto)
        .expect(201)
        .expect(({ body }) => {
          const { code, name } = body;

          expect(code).toBe(createCurrencyDto.code);
          expect(name).toBe(createCurrencyDto.name);
        });
    });

    it('should error trying to create existing currency', async () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(createCurrencyDto)
        .expect(409)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toBe('Currency already exists');
          expect(error).toBe('Conflict');
          expect(statusCode).toBe(409);
        });
    });

    it('should error trying to create currency with invalid data', async () => {
      createCurrencyDto.code = '';
      createCurrencyDto.name = '';

      return request(app.getHttpServer())
        .post(endpoint)
        .send(createCurrencyDto)
        .expect(400)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toStrictEqual(['code should not be empty', 'name should not be empty']);
          expect(error).toBe('Bad Request');
          expect(statusCode).toBe(400);
        });
    });
  });

  describe('findOneCurrency /currency/:code (GET)', () => {
    const endpointExisting = '/currency/JPY';
    const endpointNonExisting = '/currency/000';
    const endpointInvalid = '/currency/invalid';

    it('should find one existing currency', async () => {
      return request(app.getHttpServer())
        .get(endpointExisting)
        .expect(200)
        .expect(({ body }) => {
          const { code, name } = body;

          expect(code).toBe('JPY');
          expect(name).toBe('Japanese Yen');
        });
    });

    it('should error trying to find non existing currency', async () => {
      return request(app.getHttpServer())
        .get(endpointNonExisting)
        .expect(404)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toBe('Currency not found');
          expect(error).toBe('Not Found');
          expect(statusCode).toBe(404);
        });
    });
  });

  describe('deleteCurrency /currency/:code (DELETE)', () => {
    const endpointExisting = '/currency/JPY';
    const endpointNonExisting = '/currency/000';

    it('should delete existing currency', async () => {
      return request(app.getHttpServer())
        .delete(endpointExisting)
        .expect(200)
        .expect(({ body }) => {
          const { code, name } = body;

          expect(code).toBe('JPY');
          expect(name).toBe('Japanese Yen');
        });
    });

    it('should error trying to delete non existing currency', async () => {
      return request(app.getHttpServer())
        .delete(endpointNonExisting)
        .expect(404)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toBe('Currency not found');
          expect(error).toBe('Not Found');
          expect(statusCode).toBe(404);
        });
    });

    it('should error trying to delete already removed currency', async () => {
      return request(app.getHttpServer())
        .delete(endpointExisting)
        .expect(409)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toBe('Currency was already removed');
          expect(error).toBe('Conflict');
          expect(statusCode).toBe(409);
        });
    });
  });

  describe('updateCurrency /currency/:code (PUT)', () => {
    const endpointExisting = '/currency/USD';
    const endpointNonExisting = '/currency/000';
    const updateCurrencyDto = {
      name: 'Japanese Yen',
    };

    it('should update existing currency', async () => {
      return request(app.getHttpServer())
        .patch(endpointExisting)
        .send(updateCurrencyDto)
        .expect(200)
        .expect(({ body }) => {
          const { code, name } = body;

          expect(code).toBe('USD');
          expect(name).toBe(updateCurrencyDto.name);
        });
    });

    it('should error trying to update non existing currency', async () => {
      return request(app.getHttpServer())
        .patch(endpointNonExisting)
        .send(updateCurrencyDto)
        .expect(404)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toBe('Currency not found');
          expect(error).toBe('Not Found');
          expect(statusCode).toBe(404);
        });
    });

    it('should error trying to update currency with invalid data', async () => {
      updateCurrencyDto.name = '';

      return request(app.getHttpServer())
        .patch(endpointExisting)
        .send(updateCurrencyDto)
        .expect(400)
        .expect(({ body }) => {
          const { message, error, statusCode } = body;

          expect(message).toStrictEqual(['name should not be empty']);
          expect(error).toBe('Bad Request');
          expect(statusCode).toBe(400);
        });
    });
  });
});
