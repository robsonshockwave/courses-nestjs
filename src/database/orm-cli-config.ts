import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';
import { CreateCoursesTable1760740796481 } from 'src/migrations/1760740796481-CreateCoursesTable';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateCoursesTable1760740796481],
});
