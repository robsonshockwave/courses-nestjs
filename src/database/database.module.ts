import { Module } from '@nestjs/common';
import { Course } from 'src/courses/entities/courses.entity';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/courses/entities/tags.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'devtraining',
  entities: [Course, Tag],
  synchronize: false,
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
