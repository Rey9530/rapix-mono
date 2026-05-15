// Evento emitido cuando un usuario solicita recuperar su contraseña.
// El manejador en NotificacionesModulo construye el mensaje con el código
// y lo envía. El código en claro NO se persiste — solo viaja en este
// evento y en el correo. La BD guarda únicamente el SHA256.
export class RecuperacionContrasenaSolicitadaEvento {
  constructor(
    public readonly usuarioId: string,
    public readonly email: string,
    public readonly nombreCompleto: string,
    public readonly codigo: string,
    public readonly expiraEn: Date,
  ) {}
}
