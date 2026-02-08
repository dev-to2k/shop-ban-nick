import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors({ origin: ['http://localhost:3000', 'http://localhost:4200'], credentials: true });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}`);
}

bootstrap();
