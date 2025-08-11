process.env['SKIP_DB_CONNECT'] = '1';

import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import type { Server } from 'http';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', async () => {
    type HealthResponse = { status: 'ok'; db: 'up' | 'down' };

    const server = app.getHttpServer() as unknown as Server;
    const res = await request(server).get('/api/v1/health').expect(200);
    const body = res.body as HealthResponse;

    expect(body.status).toBe('ok');
    expect(['up', 'down']).toContain(body.db);
  });
});
