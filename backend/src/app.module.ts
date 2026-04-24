import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { esquemaValidacionEnv } from './config/esquema-validacion.js';
import { PrismaModulo } from './prisma/prisma.modulo.js';
import { SaludModulo } from './modulos/salud/salud.modulo.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: esquemaValidacionEnv,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        autoLogging: true,
        customProps: () => ({ correlationId: crypto.randomUUID() }),
      },
    }),
    EventEmitterModule.forRoot({ wildcard: true }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL ?? 60) * 1000,
        limit: Number(process.env.THROTTLE_LIMIT ?? 100),
      },
    ]),
    PrismaModulo,
    SaludModulo,
  ],
})
export class AppModule {}
