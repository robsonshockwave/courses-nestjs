import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from 'src/app.module';
import request from 'supertest';
import { dataSource } from 'src/database.providers';

describe('CoursesController e2e tests', () => {
  let app: INestApplication;
  let data: any;

  beforeAll(async () => {
    await dataSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    data = {
      name: 'Node.js',
      description: 'Node.js',
      tags: ['nodejs', 'nestjs'],
    };
  });

  beforeEach(async () => {
    // Limpa as tabelas antes de cada teste
    await dataSource.query('TRUNCATE TABLE courses_tags_tags CASCADE');
    await dataSource.query('TRUNCATE TABLE tags CASCADE');
    await dataSource.query('TRUNCATE TABLE courses CASCADE');
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('/courses (POST)', () => {
    it('should create a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(data.name);
      expect(response.body.description).toEqual(data.description);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.tags[0].name).toEqual(data.tags[0]);
      expect(response.body.tags[1].name).toEqual(data.tags[1]);
    });
  });
});
