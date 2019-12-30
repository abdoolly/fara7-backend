let result = require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/Response.interceptor';
if (result.error) {
  throw result.error;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // this will let the class-validator use the nest js DI (dependency injection)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({
    validationError: { target: false },
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.useGlobalInterceptors(new ResponseInterceptor<any>());

  const options = new DocumentBuilder()
    .setTitle('Fara7')
    .setDescription('What you need to make the start of your begining')
    .setVersion('1.0')
    .setHost('localhost:3000')
    .setBasePath('/')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`App is listening on http://localhost:3000/`);
  return app;
}
export const app = bootstrap();
