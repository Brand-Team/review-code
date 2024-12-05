import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn']
  });
  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  app.useGlobalFilters(new CustomExceptionFilter(httpAdapterHost))

  const config = new DocumentBuilder()
    .setTitle('Content Management System')
    .setDescription('Content Management System APIs for intern')
    .setVersion('1.0')
    .addTag('CMS')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3001);
}

bootstrap();
