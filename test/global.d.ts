import { NestFastifyApplication } from '@nestjs/platform-fastify';

export declare global {
  declare module globalThis {
    var __APP__: NestFastifyApplication;
    var __VU: string;
    var __ITER: string;
    var __ENV: {
      [key: string]: string | undefined;
    };
  }
}
