import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export interface PayloadGoogle {
  sub: string;
  email: string;
  emailVerificado: boolean;
  nombre: string;
  urlFoto: string | null;
}

@Injectable()
export class GoogleVerificadorServicio {
  private readonly logger = new Logger(GoogleVerificadorServicio.name);
  private readonly cliente = new OAuth2Client();

  private audiences(): string[] {
    const ids = [
      process.env.GOOGLE_CLIENT_ID_WEB,
      process.env.GOOGLE_CLIENT_ID_ANDROID,
      process.env.GOOGLE_CLIENT_ID_IOS,
    ].filter((v): v is string => typeof v === 'string' && v.length > 0);
    if (ids.length === 0) {
      throw new Error(
        'GOOGLE_CLIENT_ID_WEB/ANDROID/IOS no configurados en variables de entorno',
      );
    }
    return ids;
  }

  async verificar(idToken: string): Promise<PayloadGoogle> {
    let payload;
    try {
      // verifyIdToken valida la firma, expiracion e iss (accounts.google.com).
      const ticket = await this.cliente.verifyIdToken({
        idToken,
        audience: this.audiences(),
      });
      payload = ticket.getPayload();
    } catch (e) {
      this.logger.warn(`idToken de Google invalido: ${(e as Error).message}`);
      throw new UnauthorizedException('Token de Google invalido');
    }

    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Token de Google sin datos suficientes');
    }

    return {
      sub: payload.sub,
      email: payload.email.toLowerCase(),
      emailVerificado: payload.email_verified === true,
      nombre: payload.name ?? payload.email.split('@')[0]!,
      urlFoto: payload.picture ?? null,
    };
  }
}
