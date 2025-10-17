import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1760740796481 } from 'src/migrations/1760740796481-CreateCoursesTable';
import { CreateTagsTable1760742118124 } from 'src/migrations/1760742118124-CreateTagsTable';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateCoursesTable1760740796481, CreateTagsTable1760742118124],
});
