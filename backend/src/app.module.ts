import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { esquemaValidacionEnv } from './config/esquema-validacion.js';
import { JwtAutenticacionGuardia } from './comun/guardias/jwt-autenticacion.guardia.js';
import { RolesGuardia } from './comun/guardias/roles.guardia.js';
import { PrismaModulo } from './prisma/prisma.modulo.js';
import { RedisModulo } from './redis/redis.modulo.js';
import { SaludModulo } from './modulos/salud/salud.modulo.js';
import { AutenticacionModulo } from './modulos/autenticacion/autenticacion.modulo.js';
import { UsuariosModulo } from './modulos/usuarios/usuarios.modulo.js';
import { ZonasModulo } from './modulos/zonas/zonas.modulo.js';
import { RepartidoresModulo } from './modulos/repartidores/repartidores.modulo.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: esquemaValidacionEnv,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL ?? 60) * 1000,
        limit: Number(process.env.THROTTLE_LIMIT ?? 100),
      },
    ]),
    EventEmitterModule.forRoot({ wildcard: true }),
    PrismaModulo,
    RedisModulo,
    SaludModulo,
    AutenticacionModulo,
    RepartidoresModulo,
    UsuariosModulo,
    ZonasModulo,
  ],
  providers: [
    // Orden: Throttler primero, JWT, luego Roles.
    // @Publico() evita la autenticación; Throttler corre para todos los endpoints.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAutenticacionGuardia },
    { provide: APP_GUARD, useClass: RolesGuardia },
  ],
})
export class AppModule {}
