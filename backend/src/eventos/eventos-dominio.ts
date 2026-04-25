// Nombres canónicos de los eventos de dominio (in-process via @nestjs/event-emitter).
// Los servicios emisores usan estos string-literales; los manejadores los consumen vía @OnEvent.
export const EventosDominio = {
  // Pedidos (Fase 3)
  PedidoCreado: 'pedido.creado',
  PedidoEstadoCambiado: 'pedido.estado_cambiado',

  // Cierres financieros (Fase 5)
  CierreEnviado: 'cierre.enviado',
  CierreAprobado: 'cierre.aprobado',
  CierreRechazado: 'cierre.rechazado',

  // Paquetes prepago (Fase 4)
  PaqueteComprado: 'paquete.comprado',
  PaqueteAgotado: 'paquete.agotado',
  PaqueteSaldoBajo: 'paquete.saldo_bajo',

  // Usuarios
  UsuarioRegistrado: 'usuario.registrado',
} as const;

export type NombreEvento = (typeof EventosDominio)[keyof typeof EventosDominio];
