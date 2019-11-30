import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ResponseInterceptor } from './interceptors/Response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // this will let the class-validator use the nest js DI (dependency injection)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ validationError: { target: false } }));
  app.useGlobalInterceptors(new ResponseInterceptor<any>());

  await app.listen(3000);
  console.log(`App is listening on http://localhost:3000/`);
}
bootstrap();
