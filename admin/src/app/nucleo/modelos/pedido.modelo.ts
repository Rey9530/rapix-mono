export type EstadoPedido =
  | "PENDIENTE_ASIGNACION"
  | "ASIGNADO"
  | "RECOGIDO"
  | "EN_TRANSITO"
  | "EN_PUNTO_INTERCAMBIO"
  | "EN_REPARTO"
  | "ENTREGADO"
  | "CANCELADO"
  | "FALLIDO"
  | "DEVUELTO";

export type MetodoPago =
  | "CONTRA_ENTREGA"
  | "PREPAGADO"
  | "TARJETA"
  | "TRANSFERENCIA";

export interface Pedido {
  id: string;
  codigoSeguimiento: string;
  vendedorId: string;
  estado: EstadoPedido;
  nombreCliente: string;
  telefonoCliente: string;
  emailCliente?: string | null;
  direccionOrigen: string;
  latitudOrigen: number;
  longitudOrigen: number;
  zonaOrigenId?: string | null;
  direccionDestino: string;
  latitudDestino: number;
  longitudDestino: number;
  zonaDestinoId?: string | null;
  descripcionPaquete?: string | null;
  metodoPago: MetodoPago;
  costoEnvio: string;
  montoContraEntrega?: string | null;
  repartidorRecogidaId?: string | null;
  repartidorEntregaId?: string | null;
  programadoPara?: string | null;
  recogidoEn?: string | null;
  entregadoEn?: string | null;
  canceladoEn?: string | null;
  motivoCancelado?: string | null;
  motivoFallo?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface EventoPedido {
  id: string;
  pedidoId: string;
  estado: EstadoPedido;
  actorId?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  notas?: string | null;
  creadoEn: string;
}

export interface ComprobanteEntrega {
  id: string;
  pedidoId: string;
  urlFoto: string;
  urlFirma?: string | null;
  recibidoPor?: string | null;
  notas?: string | null;
  creadoEn: string;
}

export interface PedidoDetalle extends Pedido {
  eventos: EventoPedido[];
  comprobantes: ComprobanteEntrega[];
  zonaOrigen?: { id: string; codigo: string; nombre: string } | null;
  zonaDestino?: { id: string; codigo: string; nombre: string } | null;
  repartidorRecogida?: {
    id: string;
    usuario: { nombreCompleto: string };
  } | null;
  repartidorEntrega?: {
    id: string;
    usuario: { nombreCompleto: string };
  } | null;
}

export interface FiltrosPedido {
  pagina?: number;
  limite?: number;
  estado?: EstadoPedido;
  vendedorId?: string;
  repartidorId?: string;
  zonaId?: string;
  desde?: string;
  hasta?: string;
  busqueda?: string;
}
