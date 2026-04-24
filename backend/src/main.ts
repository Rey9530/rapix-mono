import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { HttpExcepcionFiltro } from './comun/filtros/http-excepcion.filtro.js';
import { configurarSwagger } from './config/swagger.js';

async function arrancar() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExcepcionFiltro());

  configurarSwagger(app);

  await app.listen(Number(process.env.PORT ?? 3000));
}

void arrancar();
