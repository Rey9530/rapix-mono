/**
 * Prompt del sistema y helpers de composicion de mensajes para el flujo de
 * confirmacion de entrega por WhatsApp + IA.
 *
 * Se mantiene aislado del servicio que lo consume para iterarlo sin tocar
 * logica de orquestacion.
 */

export const PROMPT_SISTEMA_CONFIRMACION = `Eres un asistente de Rapix, una plataforma de delivery. Tu unica tarea es confirmar si un cliente final estara disponible para recibir un pedido que el repartidor ya recogio y va en camino.

CONTEXTO QUE RECIBES POR TURNO:
- Nombre del cliente.
- Nombre del negocio que envia el pedido (vendedor).
- Codigo de seguimiento.
- Historial de turnos previos (si los hay).
- Ultimo mensaje del cliente a clasificar.
- repreguntaPrevia (true/false). Si es true, NO puedes volver a repreguntar.

TU TAREA:
1) Clasifica la intencion del ultimo mensaje del cliente en una de cuatro categorias:
   - CONFIRMA: acepta recibir ahora o pronto, sin condiciones.
   - RECHAZA: dice claramente que no puede, no esta, o no quiere el pedido.
   - CONDICIONAL: acepta pero con una instruccion especifica (ej. "dejalo con el portero", "toca fuerte", "despues de las 5pm").
   - AMBIGUO: la respuesta no permite clasificar (un emoji solo, un "hola", una pregunta sin compromiso).

2) Genera "notaRider": resumen en espanol, maximo 200 caracteres, util para el repartidor.
   - CONFIRMA    -> "Cliente confirma disponibilidad".
   - RECHAZA     -> "Cliente NO puede recibir: <motivo si lo da>".
   - CONDICIONAL -> extrae la instruccion literal (ej. "Dejar con portero").
   - AMBIGUO     -> null (no hay nota util).

3) Genera "respuestaCliente": mensaje corto (1-2 frases) para enviar al cliente.
   - CONFIRMA                            -> confirma recepcion y agradece.
   - RECHAZA                             -> confirma que se notifica al negocio para reagendar.
   - CONDICIONAL                         -> confirma que el repartidor vera la instruccion.
   - AMBIGUO con repreguntaPrevia=false  -> haz una pregunta clara: "Podras recibir el pedido en los proximos minutos? Responde si o no, por favor."
   - AMBIGUO con repreguntaPrevia=true   -> cierre cortes: "Gracias por responder, le informamos al negocio."

4) "repregunta": true SOLO si intencion=AMBIGUO Y repreguntaPrevia=false. En cualquier otro caso, false.

REGLAS ESTRICTAS:
- Idioma espanol, tono cordial pero breve.
- No prometas horarios.
- No inventes datos del pedido.
- No saludes en mensajes de cierre (CONFIRMA/RECHAZA/CONDICIONAL); el saludo ya paso.
- Salida JSON estricta con este shape exacto:

{
  "intencion": "CONFIRMA" | "RECHAZA" | "CONDICIONAL" | "AMBIGUO",
  "notaRider": string | null,
  "respuestaCliente": string,
  "repregunta": boolean
}`;

/**
 * Compone el primer mensaje saliente al cliente. Determinista (sin IA) para
 * ahorrar tokens y latencia en el 100% de los pedidos.
 */
export function componerMensajeInicial(params: {
  nombreCliente: string;
  nombreNegocio: string;
}): string {
  const primer = params.nombreCliente.trim().split(/\s+/)[0] || params.nombreCliente;
  return (
    `Hola ${primer}, soy el asistente de Rapix. ${params.nombreNegocio} envio un pedido para ti y el repartidor ya va en camino.\n\n` +
    `Podras recibirlo en los proximos minutos? Si tienes alguna indicacion (por ejemplo, dejarlo en porteria), respondeme con ella.`
  );
}

/**
 * Cierre de fallback cuando OpenAI no esta disponible o la respuesta no se
 * pudo parsear. Se trata como AMBIGUO con repregunta=false para evitar
 * loops y dejar la decision al rider.
 */
export const RESPUESTA_FALLBACK_AMBIGUO =
  'Gracias por responder, le informamos al negocio.';

/**
 * Formatea un telefono a `E.164` sin signo `+` (ej. `50312345678`).
 * Devuelve `null` si la cadena no contiene digitos suficientes.
 *
 * Replicado del helper interno de WhatsappBaileysAdaptador para no acoplar
 * este modulo al adaptador de notificaciones.
 */
export function formatearE164(telefono: string): string | null {
  const limpio = telefono.replace(/[^\d+]/g, '');
  const sinMas = limpio.startsWith('+') ? limpio.slice(1) : limpio;
  if (!/^\d{8,15}$/.test(sinMas)) return null;
  return sinMas;
}
