import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }), // turn on/off for production
  );
  const port = process.env.PORT || 3333;
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false, // Turn on for Production,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const options = new DocumentBuilder()
    .setTitle('NestJS Todo App')
    .setDescription('The Realworld API description')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        type: 'apiKey',
        name: 'access_token',
        description: 'Enter access token here',
        in: 'header',
      },
      'access_token',
    ) // This name here is important for matching up with @ApiBearerAuth() in your controller!)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/documentation', app, document);
  logger.log(
    `Swagger Documentation running on the url http://localhost:${port}/documentation`,
  );
  await app.listen(port, '0.0.0.0');
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
