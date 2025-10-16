import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove todos os campos que não estão no DTO
      forbidNonWhitelisted: true, // throw an error - lançar um erro se um campo não estiver no DTO
      transform: true, // transformar os dados para o tipo do DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
