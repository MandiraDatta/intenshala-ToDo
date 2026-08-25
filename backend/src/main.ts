import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload limit for base64 avatar uploads
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin or any web origin
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Global DTO validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NestJS Backend server is running on http://0.0.0.0:${port}/api/v1`);
}
bootstrap();
