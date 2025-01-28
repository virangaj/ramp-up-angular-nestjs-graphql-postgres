import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import express from 'express';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    cors: true,
  });
  app.enableCors({
    origin: "http://localhost:4200",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT ?? 3002);
  console.log(`File upload server is running on: ${await app.getUrl()}`);
}
bootstrap();
