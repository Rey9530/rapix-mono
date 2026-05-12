// Evento emitido cuando un usuario debe recibir un correo de verificación
// (registro inicial o reenvío manual). El manejador en NotificacionesModulo
// construye el mensaje y lo envía. tokenClaro NO se persiste — solo viaja en
// este evento y en el correo.
export class VerificacionCorreoSolicitadaEvento {
  constructor(
    public readonly usuarioId: string,
    public readonly email: string,
    public readonly nombreCompleto: string,
    public readonly tokenClaro: string,
    public readonly expiraEn: Date,
  ) {}
}
