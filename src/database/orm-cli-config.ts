import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1760740796481 } from 'src/migrations/1760740796481-CreateCoursesTable';
import { CreateTagsTable1760742118124 } from 'src/migrations/1760742118124-CreateTagsTable';
import { CreateCoursesTagsTable1760746292249 } from 'src/migrations/1760746292249-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1760747551912 } from 'src/migrations/1760747551912-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1760748149206 } from 'src/migrations/1760748149206-AddTagsIdToCoursesTagsTable';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1760740796481,
    CreateTagsTable1760742118124,
    CreateCoursesTagsTable1760746292249,
    AddCoursesIdToCoursesTagsTable1760747551912,
    AddTagsIdToCoursesTagsTable1760748149206,
  ],
});
