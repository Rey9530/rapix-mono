export const EventosDominio = {
  PedidoCreado: 'pedido.creado',
  PedidoAsignado: 'pedido.asignado',
  PedidoTransicionado: 'pedido.transicionado',
  PedidoEntregado: 'pedido.entregado',
  PedidoFallido: 'pedido.fallido',
  PedidoCancelado: 'pedido.cancelado',
  UsuarioRegistrado: 'usuario.registrado',
} as const;

export type NombreEvento = (typeof EventosDominio)[keyof typeof EventosDominio];
