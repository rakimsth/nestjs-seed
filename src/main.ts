import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './utils/exceptions/exception.filter';
import { setupSwagger } from './swagger';
import { AuthGuard } from './auth/guards/auth.global.guard';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const reflector = app.get(Reflector);
  const port = process.env.PORT || 3000;
  await app.register(helmet);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // Custom Exception Filter
  app.useGlobalFilters(new CustomExceptionFilter());
  // set Global Guard
  app.useGlobalGuards(new AuthGuard(reflector));
  // Api Docs
  setupSwagger(app);
  await app.listen(port, '0.0.0.0');
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
