import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 when body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 when credentials are wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'notexist', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.data).toBeNull();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app.getHttpServer()).get('/api/auth/me');
      expect(response.status).toBe(401);
    });
  });
});
