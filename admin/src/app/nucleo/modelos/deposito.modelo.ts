export interface VendedorOpcion {
  id: string;
  nombreNegocio: string;
  usuario: {
    nombreCompleto: string;
    email: string;
    telefono: string;
  };
}

export interface CuentaBancariaOpcion {
  id: string;
  tipoCuenta: "AHORRO" | "CORRIENTE";
  numeroCuenta: string;
  alias: string | null;
  esPrincipal: boolean;
  banco: { id: string; nombre: string };
}

export interface PaquetePendiente {
  id: string;
  codigoSeguimiento: string;
  nombreCliente: string;
  direccionDestino: string;
  montoContraEntrega: string; // Decimal serializado como string
  entregadoEn: string | null;
}

export interface SaldoPendienteVendedor {
  totalPendiente: string;
  cantidad: number;
  paquetes: PaquetePendiente[];
}

export interface DepositoVendedor {
  id: string;
  vendedorId: string;
  cuentaBancariaId: string | null;
  monto: string;
  fechaDeposito: string;
  referencia: string | null;
  notas: string | null;
  urlComprobante: string | null;
  creadoEn: string;
  actualizadoEn: string;
  vendedor?: { id: string; nombreNegocio: string };
  cuentaBancaria?: {
    id: string;
    numeroCuenta: string;
    alias: string | null;
    banco: { nombre: string };
  } | null;
  _count?: { pedidos: number };
}

export interface PedidoEnDeposito {
  id: string;
  codigoSeguimiento: string;
  nombreCliente: string;
  telefonoCliente: string;
  emailCliente: string | null;
  direccionDestino: string;
  montoContraEntrega: string | null;
  entregadoEn: string | null;
  zonaDestino: { id: string; codigo: string; nombre: string } | null;
  repartidorEntrega: {
    id: string;
    usuario: { nombreCompleto: string; telefono: string };
  } | null;
}

export interface DepositoVendedorDetalle {
  id: string;
  vendedorId: string;
  cuentaBancariaId: string | null;
  monto: string;
  fechaDeposito: string;
  referencia: string | null;
  notas: string | null;
  urlComprobante: string | null;
  creadoEn: string;
  actualizadoEn: string;
  vendedor: {
    id: string;
    nombreNegocio: string;
    rfc: string | null;
    direccion: string;
    usuario: {
      id: string;
      nombreCompleto: string;
      email: string;
      telefono: string;
    };
  };
  cuentaBancaria: {
    id: string;
    tipoCuenta: "AHORRO" | "CORRIENTE";
    numeroCuenta: string;
    alias: string | null;
    esPrincipal: boolean;
    banco: { id: string; codigo: string; nombre: string };
  } | null;
  pedidos: PedidoEnDeposito[];
}

export interface FiltrosDepositosAdmin {
  pagina?: number;
  limite?: number;
  vendedorId?: string;
  desde?: string;
  hasta?: string;
}

export interface CrearDepositoPayload {
  vendedorId: string;
  pedidoIds: string[];
  cuentaBancariaId?: string;
  fechaDeposito?: string;
  referencia?: string;
  notas?: string;
  comprobante: File;
}
