import 'dotenv/config';

import { Course } from './courses/entities/courses.entity';
import { Tag } from './courses/entities/tags.entity';
import { CreateCoursesTable1760740796481 } from 'src/migrations/1760740796481-CreateCoursesTable';
import { CreateTagsTable1760742118124 } from 'src/migrations/1760742118124-CreateTagsTable';
import { CreateCoursesTagsTable1760746292249 } from 'src/migrations/1760746292249-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1760747551912 } from 'src/migrations/1760747551912-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1760748149206 } from 'src/migrations/1760748149206-AddTagsIdToCoursesTagsTable';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [Course, Tag],
        synchronize: false,
      });
      return dataSource.initialize();
    },
  },
];

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Course, Tag],
  synchronize: false,
  migrations: [
    CreateCoursesTable1760740796481,
    CreateTagsTable1760742118124,
    CreateCoursesTagsTable1760746292249,
    AddCoursesIdToCoursesTagsTable1760747551912,
    AddTagsIdToCoursesTagsTable1760748149206,
  ],
});
