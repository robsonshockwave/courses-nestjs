import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Course } from './courses/entities/courses.entity';
import { Tag } from './courses/entities/tags.entity';
import { CreateCoursesTable1760740796481 } from './migrations/1760740796481-CreateCoursesTable';
import { CreateTagsTable1760742118124 } from './migrations/1760742118124-CreateTagsTable';
import { CreateCoursesTagsTable1760746292249 } from './migrations/1760746292249-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1760747551912 } from './migrations/1760747551912-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1760748149206 } from './migrations/1760748149206-AddTagsIdToCoursesTagsTable';

// ==========================================================
// Provider usado dentro do NestJS (injeção de dependência)
// ==========================================================
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const isTest = process.env.NODE_ENV === 'test';

      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [Course, Tag],
        migrations: [
          CreateCoursesTable1760740796481,
          CreateTagsTable1760742118124,
          CreateCoursesTagsTable1760746292249,
          AddCoursesIdToCoursesTagsTable1760747551912,
          AddTagsIdToCoursesTagsTable1760748149206,
        ],
        synchronize: isTest, // ⚙️ cria tabelas automaticamente nos testes
        dropSchema: isTest, // ⚙️ apaga o schema antes de cada suite de teste
      });

      return dataSource.initialize();
    },
  },
];

// ==========================================================
// DataSource usado pelo TypeORM CLI (ex: migration:run)
// ==========================================================
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Course, Tag],
  migrations: [
    CreateCoursesTable1760740796481,
    CreateTagsTable1760742118124,
    CreateCoursesTagsTable1760746292249,
    AddCoursesIdToCoursesTagsTable1760747551912,
    AddTagsIdToCoursesTagsTable1760748149206,
  ],
  synchronize: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
});
