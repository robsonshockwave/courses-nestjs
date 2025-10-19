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

  describe('/courses (GET)', () => {
    it('should list all courses', async () => {
      await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/courses/list')
        .expect(200);

      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].name).toEqual(data.name);
      expect(response.body[0].description).toEqual(data.description);
      expect(response.body[0].created_at).toBeDefined();
      response.body.map((course) =>
        expect(course).toEqual({
          id: course.id,
          name: data.name,
          description: data.description,
          created_at: course.created_at,
          tags: [...course.tags],
        }),
      );
    });

    it('should find a course by id', async () => {
      const course = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/courses/${course.body.id}`)
        .expect(200);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(data.name);
      expect(response.body.description).toEqual(data.description);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.tags[0].name).toEqual(data.tags[0]);
      expect(response.body.tags[1].name).toEqual(data.tags[1]);
    });
  });

  describe('/courses (PUT)', () => {
    it('should update a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      const updatedData = {
        name: 'Node.js Updated',
        description: 'Node.js Updated',
        tags: ['nodejs', 'nestjs', 'backend'],
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/courses/${response.body.id}`)
        .send(updatedData)
        .expect(200);

      expect(updateResponse.body.id).toEqual(response.body.id);
      expect(updateResponse.body.name).toEqual(updatedData.name);
      expect(updateResponse.body.description).toEqual(updatedData.description);
      expect(updateResponse.body.tags).toHaveLength(3);
      expect(updateResponse.body.tags[0].name).toEqual(updatedData.tags[0]);
      expect(updateResponse.body.tags[1].name).toEqual(updatedData.tags[1]);
      expect(updateResponse.body.tags[2].name).toEqual(updatedData.tags[2]);
    });
  });

  describe('/courses (DELETE)', () => {
    it('should delete a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/courses/${response.body.id}`)
        .expect(204)
        .expect({});
    });
  });
});
