import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3002);
  console.log(`File upload server is running on: ${await app.getUrl()}`);
}
bootstrap();
