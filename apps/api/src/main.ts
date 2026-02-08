import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import * as compression from 'compression';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/http-exception.filter';

function resolveAssetsPath(): string {
  if (process.env.ASSETS_PATH && existsSync(process.env.ASSETS_PATH)) return process.env.ASSETS_PATH;
  const candidates = [
    join(__dirname, 'assets'),
    join(process.cwd(), 'apps', 'api', 'assets'),
    join(process.cwd(), 'assets'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      process.env.ASSETS_PATH = p;
      return p;
    }
  }
  return join(__dirname, 'assets');
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(compression.default());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: ['http://localhost:3000', 'http://localhost:4200'], credentials: true });
  const assetsPath = resolveAssetsPath();
  app.useStaticAssets(assetsPath, { prefix: '/assets', index: false });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}`);
  Logger.log(`Assets served from: ${assetsPath}`);
}

bootstrap();
