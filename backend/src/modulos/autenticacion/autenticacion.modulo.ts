import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AutenticacionControlador } from './autenticacion.controlador.js';
import { AutenticacionServicio } from './autenticacion.servicio.js';
import { JwtEstrategia } from './estrategias/jwt.estrategia.js';

@Module({
  imports: [
    PassportModule,
    // Config por defecto (access token). El refresh se firma pasando `secret`
    // explícito en cada llamada a `jwtService.signAsync` / `verifyAsync`.
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_ACCESS_SECRET as string,
        signOptions: {
          expiresIn: (process.env.JWT_ACCESS_EXPIRES ?? '15m') as unknown as number,
        },
      }),
    }),
  ],
  controllers: [AutenticacionControlador],
  providers: [AutenticacionServicio, JwtEstrategia],
  exports: [AutenticacionServicio, JwtModule],
})
export class AutenticacionModulo {}
