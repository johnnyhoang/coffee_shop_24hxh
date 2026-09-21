import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import express, { Express, Request, Response } from 'express';
import { AppModule } from '../apps/api/src/app.module';
import { configSwagger } from '../apps/api/src/configs/api-docs.config';
import { AllExceptionsFilter } from '../apps/api/src/common/filters/all-exceptions.filter';
import moduleAlias from 'module-alias';
import { join } from 'path';

// Register module aliases for serverless environment
moduleAlias.addAliases({
  '@configs': join(__dirname, '../apps/api/src/configs'),
  '@modules': join(__dirname, '../apps/api/src/modules'),
});

let cachedServer: Express;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    configSwagger(app);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    const extraOrigins = (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const allowedOrigins = [
      'http://localhost:5001',
      'http://localhost:5000',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://minkoi.io.vn',
      'http://123.30.136.246',
      ...extraOrigins,
    ];

    app.enableCors({
      origin: (origin, callback) => {
        const vercelPreview =
          !!origin && /^https:\/\/[^/]+\.vercel\.app$/i.test(origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || vercelPreview) {
          callback(null, true);
          return;
        }
        callback(null, true);
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

export default async function handler(req: Request, res: Response) {
  const server = await bootstrapServer();
  server(req, res);
}
