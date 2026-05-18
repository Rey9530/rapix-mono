// Plantillas de notificaciones en español. Soporte de interpolación
// vía marcadores `{{1}}`, `{{2}}`, ... — se aplican en orden con
// `renderizarPlantilla(clave, params)`.
//
// Para añadir un idioma: replicar este archivo (`en.ts`, etc.) y
// re-exportar desde `plantillas/index.ts`.

export interface Plantilla {
  titulo: string;
  cuerpo: string;
}

export const PLANTILLAS_ES = {
  // ── Pedidos ────────────────────────────────────────────
  PEDIDO_CREADO_VENDEDOR: {
    titulo: 'Pedido {{1}} creado',
    cuerpo: 'Tu pedido {{1}} fue creado y está pendiente de asignación.',
  },
  PEDIDO_CREADO_CLIENTE: {
    titulo: 'Tu pedido fue creado',
    cuerpo: 'Hemos recibido tu pedido {{1}}. Te avisaremos cuando esté en camino.',
  },
  PEDIDO_ASIGNADO_VENDEDOR: {
    titulo: 'Pedido {{1}} asignado',
    cuerpo: 'Un repartidor irá por tu pedido {{1}}.',
  },
  PEDIDO_ASIGNADO_REPARTIDOR: {
    titulo: 'Nuevo pedido para recoger',
    cuerpo: 'Tienes un nuevo pedido asignado: {{1}}.',
  },
  PEDIDO_RECOGIDO_VENDEDOR: {
    titulo: 'Pedido {{1}} recogido',
    cuerpo: 'El repartidor ya tiene tu pedido y va al punto de intercambio.',
  },
  PEDIDO_CLIENTE_SIN_RESPUESTA_VENDEDOR: {
    titulo: 'Cliente sin responder',
    cuerpo: 'El cliente {{2}} del pedido {{1}} no respondió a la confirmación de entrega.',
  },
  PEDIDO_CLIENTE_SIN_CONTACTO_VENDEDOR: {
    titulo: 'No pudimos contactar al cliente',
    cuerpo: 'No pudimos contactar por WhatsApp al cliente del pedido {{1}}. Motivo: {{2}}.',
  },
  PEDIDO_CLIENTE_RECHAZO_VENDEDOR: {
    titulo: 'Cliente rechazó la entrega',
    cuerpo: 'El cliente del pedido {{1}} no podrá recibir el envío. Motivo: {{2}}.',
  },
  PEDIDO_EN_TRANSITO_CLIENTE: {
    titulo: 'Pedido {{1}} en tránsito',
    cuerpo: 'Tu pedido {{1}} va camino al punto de intercambio.',
  },
  PEDIDO_EN_REPARTO_VENDEDOR: {
    titulo: 'Pedido {{1}} en reparto',
    cuerpo: 'Un repartidor salió a entregar tu pedido {{1}}.',
  },
  PEDIDO_EN_REPARTO_CLIENTE: {
    titulo: 'Pedido {{1}} en reparto',
    cuerpo: 'El repartidor está en camino con tu pedido {{1}}.',
  },
  PEDIDO_ENTREGADO_VENDEDOR: {
    titulo: 'Pedido {{1}} entregado',
    cuerpo: 'Tu pedido {{1}} fue entregado correctamente.',
  },
  PEDIDO_ENTREGADO_CLIENTE: {
    titulo: 'Pedido {{1}} entregado',
    cuerpo: 'Tu paquete fue entregado. ¡Gracias por tu compra!',
  },
  PEDIDO_FALLIDO_VENDEDOR: {
    titulo: 'Pedido {{1}} fallido',
    cuerpo: 'No pudimos entregar el pedido {{1}}. Motivo: {{2}}.',
  },
  PEDIDO_FALLIDO_CLIENTE: {
    titulo: 'No pudimos entregar tu pedido',
    cuerpo: 'No pudimos entregar el pedido {{1}}. Te contactaremos para reagendar.',
  },
  PEDIDO_FALLIDO_ADMIN: {
    titulo: 'Entrega fallida: {{1}}',
    cuerpo: 'El pedido {{1}} falló. Motivo: {{2}}.',
  },
  PEDIDO_CANCELADO_VENDEDOR: {
    titulo: 'Pedido {{1}} cancelado',
    cuerpo: 'El pedido {{1}} fue cancelado.',
  },
  PEDIDO_CANCELADO_REPARTIDOR: {
    titulo: 'Pedido {{1}} cancelado',
    cuerpo: 'El pedido {{1}} fue cancelado; ya no es necesario continuar.',
  },
  PEDIDO_CANCELADO_CLIENTE: {
    titulo: 'Pedido {{1}} cancelado',
    cuerpo: 'Tu pedido {{1}} fue cancelado.',
  },
  PEDIDO_ACTUALIZADO_REPARTIDOR: {
    titulo: 'Pedido {{1}} modificado',
    cuerpo: 'El vendedor actualizó datos del pedido {{1}}: {{2}}.',
  },
  PEDIDO_REPARTO_ASIGNADO_REPARTIDOR: {
    titulo: 'Nuevo pedido para entregar',
    cuerpo: 'Tienes un nuevo pedido para entregar: {{1}}.',
  },
  PEDIDO_DESASIGNADO_REPARTIDOR: {
    titulo: 'Pedido {{1}} reasignado',
    cuerpo: 'El pedido {{1}} fue reasignado a otro repartidor.',
  },
  PEDIDO_EN_INTERCAMBIO_VENDEDOR: {
    titulo: 'Pedido {{1}} en punto de intercambio',
    cuerpo: 'Tu pedido {{1}} llegó al punto de intercambio.',
  },
  PEDIDO_EN_INTERCAMBIO_CLIENTE: {
    titulo: 'Pedido {{1}} en punto de intercambio',
    cuerpo: 'Tu pedido {{1}} llegó al punto de intercambio y será reenviado pronto.',
  },
  PEDIDO_DEVUELTO_VENDEDOR: {
    titulo: 'Pedido {{1}} devuelto',
    cuerpo: 'El pedido {{1}} fue devuelto. Coordina la recepción con el repartidor.',
  },
  PEDIDO_REINTENTANDO_VENDEDOR: {
    titulo: 'Reintentando entrega del pedido {{1}}',
    cuerpo: 'El repartidor está reintentando entregar el pedido {{1}}.',
  },
  PEDIDO_REINTENTANDO_CLIENTE: {
    titulo: 'Reintentando tu entrega',
    cuerpo: 'Estamos reintentando entregar tu pedido {{1}}.',
  },

  // ── Cierres financieros ────────────────────────────────
  CIERRE_ENVIADO_ADMIN: {
    titulo: 'Cierre pendiente de revisión',
    cuerpo: 'El repartidor envió un cierre {{1}}{{2}}.',
  },
  CIERRE_APROBADO_REPARTIDOR: {
    titulo: 'Cierre aprobado',
    cuerpo: 'Tu cierre del {{1}} fue aprobado.',
  },
  CIERRE_RECHAZADO_REPARTIDOR: {
    titulo: 'Cierre rechazado',
    cuerpo: 'Tu cierre del {{1}} fue rechazado. Motivo: {{2}}.',
  },

  // ── Paquetes prepago ───────────────────────────────────
  PAQUETE_COMPRADO_VENDEDOR: {
    titulo: 'Paquete comprado',
    cuerpo: 'Compraste un paquete de {{1}} envíos por ${{2}}.',
  },
  PAQUETE_SALDO_BAJO_VENDEDOR: {
    titulo: 'Saldo bajo en paquete',
    cuerpo: 'Quedan solo {{1}} envíos en tu paquete activo. Considera recargar.',
  },
  PAQUETE_AGOTADO_VENDEDOR: {
    titulo: 'Paquete agotado',
    cuerpo: 'Se agotaron los envíos de tu paquete prepago. Recarga para seguir enviando.',
  },
  PAQUETE_AUTORIZADO_VENDEDOR: {
    titulo: 'Pago de paquete autorizado',
    cuerpo: 'El admin confirmó tu pago. Tu paquete de {{1}} envíos por ${{2}} ya está activo.',
  },
  PAQUETE_RECHAZADO_VENDEDOR: {
    titulo: 'Pago de paquete rechazado',
    cuerpo: 'El admin no aprobó el comprobante de tu paquete por ${{1}}. Motivo: {{2}}.',
  },

  // ── Depósitos a vendedores ─────────────────────────────
  DEPOSITO_REGISTRADO_VENDEDOR: {
    titulo: 'Depósito registrado',
    cuerpo: 'Se te depositó ${{1}} por {{2}} paquete(s). Revisa el comprobante en la app.',
  },
} as const satisfies Record<string, Plantilla>;

export type ClavePlantilla = keyof typeof PLANTILLAS_ES;

/**
 * Renderiza una plantilla aplicando los parámetros posicionalmente.
 * Los marcadores son `{{1}}`, `{{2}}`, etc.
 */
export function renderizarPlantilla(
  clave: ClavePlantilla,
  params: Array<string | number> = [],
): Plantilla {
  const base = PLANTILLAS_ES[clave];
  return {
    titulo: aplicar(base.titulo, params),
    cuerpo: aplicar(base.cuerpo, params),
  };
}

function aplicar(texto: string, params: Array<string | number>): string {
  return texto.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const idx = Number(n) - 1;
    return idx >= 0 && idx < params.length ? String(params[idx]) : '';
  });
}
