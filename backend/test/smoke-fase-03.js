// Smoke manual de los endpoints nuevos de Fase 3.
//   Pedidos: POST, GET, GET /:id, GET /:id/eventos, PATCH /:id, /:id/cancelar,
//            /:id/asignar, /asignar-automatico, /seguimiento/:codigo,
//            rider: /recoger, /en-transito, /llegar-intercambio,
//                   /tomar-entrega, /entregar (multipart), /fallar,
//                   /reintentar, /devolver.
//   Repartidores (upgrade Fase 3): /yo/pedidos, /yo/recogidas-pendientes,
//                                  /yo/entregas-pendientes, /:id/desempeno con tasaExito real.

const BASE = 'http://localhost:3000/api/v1';
const sufijo = Date.now();
const codigoZonaA = `FA${String(sufijo).slice(-6)}`;
const codigoZonaB = `FB${String(sufijo).slice(-6)}`;

let passed = 0, failed = 0;
const errores = [];

async function call(method, url, body, headers = {}) {
  const r = await fetch(BASE + url, {
    method,
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const texto = await r.text();
  let datos;
  try { datos = JSON.parse(texto); } catch { datos = texto; }
  return { status: r.status, body: datos };
}

function check(titulo, cond, det = '') {
  const ic = cond ? '[OK]' : '[X] ';
  console.log(`${ic} ${titulo}${det ? ' — ' + det : ''}`);
  if (cond) passed++; else { failed++; errores.push(titulo); }
}

function seccion(t) { console.log(`\n━━━ ${t} ━━━`); }

// ─────────────── Bootstrap ───────────────
seccion('Bootstrap: login admin + rider + crear vendedor + 2 zonas nuevas');

const loginAdmin = await call('POST', '/autenticacion/iniciar-sesion',
  { email: 'admin@delivery.com', contrasena: 'Admin123!' });
const tokenAdmin = loginAdmin.body.tokenAcceso;
check('admin login', loginAdmin.status === 200);
const auth = (t) => ({ Authorization: 'Bearer ' + t });

// Crear vendedor nuevo por admin (para tener perfil limpio que use zonas nuevas)
const vendEmail = `smoke.fase3.vendedor.${sufijo}@test.com`;
const crearVend = await call('POST', '/usuarios', {
  email: vendEmail,
  telefono: `+5037000${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Vendedor F3',
  rol: 'VENDEDOR',
  nombreNegocio: 'Neg F3',
  direccion: 'Origen',
  latitud: 25.5,
  longitud: 25.5,
}, auth(tokenAdmin));
check('POST /usuarios VENDEDOR → 201', crearVend.status === 201);
const loginVend = await call('POST', '/autenticacion/iniciar-sesion',
  { email: vendEmail, contrasena: 'Secret123!' });
const tokenVend = loginVend.body.tokenAcceso;

// Crear 2 repartidores con zonas
const poligonoA = [
  { lat: 25, lng: 25 },
  { lat: 25, lng: 26 },
  { lat: 26, lng: 26 },
  { lat: 26, lng: 25 },
];
const poligonoB = [
  { lat: 30, lng: 30 },
  { lat: 30, lng: 31 },
  { lat: 31, lng: 31 },
  { lat: 31, lng: 30 },
];
const zA = await call('POST', '/zonas', {
  codigo: codigoZonaA, nombre: 'Smoke A3', poligono: poligonoA,
  latitudCentro: 25.5, longitudCentro: 25.5,
}, auth(tokenAdmin));
const zB = await call('POST', '/zonas', {
  codigo: codigoZonaB, nombre: 'Smoke B3', poligono: poligonoB,
  latitudCentro: 30.5, longitudCentro: 30.5,
}, auth(tokenAdmin));
const zAId = zA.body.id;
const zBId = zB.body.id;
check('2 zonas creadas', zA.status === 201 && zB.status === 201);

const rider1Email = `smoke.f3.r1.${sufijo}@test.com`;
const rider2Email = `smoke.f3.r2.${sufijo}@test.com`;
const crearR1 = await call('POST', '/usuarios', {
  email: rider1Email,
  telefono: `+5037001${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Rider F3 uno',
  rol: 'REPARTIDOR',
  tipoVehiculo: 'moto',
  documentoIdentidad: `DOC-F3-1-${sufijo}`,
  zonaIds: [zAId],
  zonaPrimariaId: zAId,
}, auth(tokenAdmin));
const crearR2 = await call('POST', '/usuarios', {
  email: rider2Email,
  telefono: `+5037002${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Rider F3 dos',
  rol: 'REPARTIDOR',
  tipoVehiculo: 'moto',
  documentoIdentidad: `DOC-F3-2-${sufijo}`,
  zonaIds: [zBId],
  zonaPrimariaId: zBId,
}, auth(tokenAdmin));
check('2 repartidores creados con zonas', crearR1.status === 201 && crearR2.status === 201);
const tokenR1 = (await call('POST', '/autenticacion/iniciar-sesion',
  { email: rider1Email, contrasena: 'Secret123!' })).body.tokenAcceso;
const tokenR2 = (await call('POST', '/autenticacion/iniciar-sesion',
  { email: rider2Email, contrasena: 'Secret123!' })).body.tokenAcceso;

// ─────────────── Crear pedido ───────────────
seccion('Pedidos — crear / listar / detalle / eventos / actualizar');

const crearPed = await call('POST', '/pedidos', {
  nombreCliente: 'Cliente F3',
  telefonoCliente: '+50370001111',
  direccionOrigen: 'Origen F3',
  latitudOrigen: 25.5,
  longitudOrigen: 25.5,
  direccionDestino: 'Destino F3',
  latitudDestino: 30.5,
  longitudDestino: 30.5,
  metodoPago: 'CONTRA_ENTREGA',
  montoContraEntrega: 50,
  descripcionPaquete: 'Caja',
}, auth(tokenVend));
check('POST /pedidos → 201', crearPed.status === 201);
check('  codigoSeguimiento DEL-YYYY-NNNNN', /^DEL-\d{4}-\d{5}$/.test(crearPed.body.codigoSeguimiento || ''));
check('  estado=PENDIENTE_ASIGNACION', crearPed.body.estado === 'PENDIENTE_ASIGNACION');
check('  zonaOrigenId resuelto', crearPed.body.zonaOrigenId === zAId);
check('  zonaDestinoId resuelto', crearPed.body.zonaDestinoId === zBId);
const pedidoId = crearPed.body.id;
const codigo = crearPed.body.codigoSeguimiento;

// Zona inválida
const fueraZona = await call('POST', '/pedidos', {
  nombreCliente: 'X', telefonoCliente: '+50399999999',
  direccionOrigen: 'X', latitudOrigen: 0, longitudOrigen: 0,
  direccionDestino: 'X', latitudDestino: 30.5, longitudDestino: 30.5,
  metodoPago: 'PREPAGADO',
}, auth(tokenVend));
check('POST /pedidos origen fuera → 400 PEDIDO_ZONA_INVALIDA_ORIGEN',
  fueraZona.status === 400 && fueraZona.body.codigo === 'PEDIDO_ZONA_INVALIDA_ORIGEN');

// CONTRA_ENTREGA sin monto
const sinMonto = await call('POST', '/pedidos', {
  nombreCliente: 'X', telefonoCliente: '+50399999998',
  direccionOrigen: 'X', latitudOrigen: 25.5, longitudOrigen: 25.5,
  direccionDestino: 'X', latitudDestino: 30.5, longitudDestino: 30.5,
  metodoPago: 'CONTRA_ENTREGA',
}, auth(tokenVend));
check('POST /pedidos CONTRA_ENTREGA sin monto → 400', sinMonto.status === 400);

// Listado scoped: vendedor solo ve los suyos
const listV = await call('GET', '/pedidos', undefined, auth(tokenVend));
check('GET /pedidos como VENDEDOR → 200', listV.status === 200);
check('  solo los del vendedor', listV.body.datos?.every(p => p.vendedorId === crearPed.body.vendedorId));

// Admin ve todos
const listA = await call('GET', '/pedidos', undefined, auth(tokenAdmin));
check('GET /pedidos como ADMIN → 200', listA.status === 200);
check('  ADMIN ve al menos 1', (listA.body.meta?.total ?? 0) >= 1);

// Detalle
const detalle = await call('GET', `/pedidos/${pedidoId}`, undefined, auth(tokenVend));
check('GET /pedidos/:id → 200', detalle.status === 200);
check('  incluye eventos y comprobantes', Array.isArray(detalle.body.eventos) && Array.isArray(detalle.body.comprobantes));

// Eventos
const eventos = await call('GET', `/pedidos/${pedidoId}/eventos`, undefined, auth(tokenVend));
check('GET /pedidos/:id/eventos → 200', eventos.status === 200);
check('  ≥1 evento (creado)', eventos.body.length >= 1);

// PATCH antes de asignar
const patch = await call('PATCH', `/pedidos/${pedidoId}`,
  { descripcionPaquete: 'Caja XL' }, auth(tokenVend));
check('PATCH /pedidos/:id (PENDIENTE_ASIGNACION) → 200', patch.status === 200);

// ─────────────── Asignación ───────────────
seccion('Pedidos — asignar (auto + manual)');

const asigAuto = await call('POST', '/pedidos/asignar-automatico', null, auth(tokenAdmin));
check('POST /pedidos/asignar-automatico → 200', asigAuto.status === 200);
check('  asignados ≥ 1', asigAuto.body.asignados >= 1);

const detalle2 = await call('GET', `/pedidos/${pedidoId}`, undefined, auth(tokenAdmin));
check('  pedido ahora ASIGNADO', detalle2.body.estado === 'ASIGNADO');
check('  repartidorRecogida asignado (zona origen A)', !!detalle2.body.repartidorRecogidaId);

// PATCH después de asignar → 409
const patchTarde = await call('PATCH', `/pedidos/${pedidoId}`,
  { descripcionPaquete: 'X' }, auth(tokenVend));
check('PATCH tras ASIGNADO → 409 PEDIDO_NO_EDITABLE',
  patchTarde.status === 409 && patchTarde.body.codigo === 'PEDIDO_NO_EDITABLE');

// Cancelar tras ASIGNADO sí es válido (máquina permite)
// pero primero dejemos este en RECOGIDO para probar transición inválida abajo.

// ─────────────── Ciclo rider ───────────────
seccion('Pedidos — ciclo de vida (rider)');

const recoger = await call('POST', `/pedidos/${pedidoId}/recoger`, {}, auth(tokenR1));
check('POST /:id/recoger (R1, asignado a recogida) → 200', recoger.status === 200);
check('  estado=RECOGIDO', recoger.body.estado === 'RECOGIDO');

// Transición inválida: cancelar desde RECOGIDO
const cancelTarde = await call('POST', `/pedidos/${pedidoId}/cancelar`,
  { motivo: 'tarde' }, auth(tokenVend));
check('POST /:id/cancelar desde RECOGIDO → 409',
  cancelTarde.status === 409 && cancelTarde.body.codigo === 'PEDIDO_TRANSICION_INVALIDA');

// Repartidor NO asignado intenta recoger otro pedido → 403
// Creamos un 2do pedido, asignamos auto y probamos con R2
const ped2 = await call('POST', '/pedidos', {
  nombreCliente: 'C2', telefonoCliente: '+50377002222',
  direccionOrigen: 'X', latitudOrigen: 25.5, longitudOrigen: 25.5,
  direccionDestino: 'X', latitudDestino: 30.5, longitudDestino: 30.5,
  metodoPago: 'PREPAGADO',
}, auth(tokenVend));
await call('POST', '/pedidos/asignar-automatico', null, auth(tokenAdmin));
const noAsig = await call('POST', `/pedidos/${ped2.body.id}/recoger`, {}, auth(tokenR2));
check('POST /:id/recoger por rider NO asignado → 403',
  noAsig.status === 403 && noAsig.body.codigo === 'PEDIDO_REPARTIDOR_NO_AUTORIZADO');

// Continuar el flujo del pedido 1
await call('POST', `/pedidos/${pedidoId}/en-transito`, {}, auth(tokenR1));
await call('POST', `/pedidos/${pedidoId}/llegar-intercambio`, {}, auth(tokenR1));

// Rider 2 toma la entrega (se auto-asigna)
const tomar = await call('POST', `/pedidos/${pedidoId}/tomar-entrega`, {}, auth(tokenR2));
check('POST /:id/tomar-entrega (R2) → 200', tomar.status === 200);
check('  estado=EN_REPARTO', tomar.body.estado === 'EN_REPARTO');

// Entregar sin foto → 400
const entregarSinFoto = await fetch(BASE + `/pedidos/${pedidoId}/entregar`, {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + tokenR2 },
  body: new FormData(),
});
check('POST /:id/entregar sin foto → 400', entregarSinFoto.status === 400);

// Entregar con foto → 200 y crea ComprobanteEntrega + sube a MinIO
const fd = new FormData();
const fotoBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
fd.append('foto', new Blob([fotoBuf], { type: 'image/jpeg' }), 'f.jpg');
fd.append('recibidoPor', 'Cliente firmante');
const entregar = await call('POST', `/pedidos/${pedidoId}/entregar`, fd, auth(tokenR2));
check('POST /:id/entregar con foto → 200', entregar.status === 200);
check('  estado=ENTREGADO', entregar.body.estado === 'ENTREGADO');
check('  entregadoEn poblado', !!entregar.body.entregadoEn);

// Verificar que hay comprobante con urlFoto apuntando a MinIO
const finalDet = await call('GET', `/pedidos/${pedidoId}`, undefined, auth(tokenAdmin));
check('  comprobante guardado', finalDet.body.comprobantes?.length === 1);
const urlFoto = finalDet.body.comprobantes?.[0]?.urlFoto ?? '';
check('  urlFoto apunta a MinIO', urlFoto.includes('9000') || urlFoto.includes('delivery-uploads'));

// ─────────────── Tracking público ───────────────
seccion('Pedidos — tracking público');

const track = await call('GET', `/pedidos/seguimiento/${codigo}`);
check('GET /pedidos/seguimiento/:codigo sin auth → 200', track.status === 200);
check('  estado=ENTREGADO', track.body.estado === 'ENTREGADO');
check('  cliente.nombre presente pero sin email/telefono',
  track.body.cliente?.nombre === 'Cliente F3' && track.body.cliente?.email === undefined
  && track.body.cliente?.telefono === undefined);
check('  siguientePaso presente', typeof track.body.siguientePaso === 'string');

const trackNotFound = await call('GET', '/pedidos/seguimiento/DEL-9999-99999');
check('GET /seguimiento inexistente → 404', trackNotFound.status === 404);

// ─────────────── Listados del rider (mejora) ───────────────
seccion('Repartidores — stubs ahora reales');

const r1Pedidos = await call('GET', '/repartidores/yo/pedidos', undefined, auth(tokenR1));
check('GET /repartidores/yo/pedidos → 200', r1Pedidos.status === 200);
check('  R1 tiene ≥1 pedido', r1Pedidos.body.length >= 1);

const r2Entregas = await call('GET', '/repartidores/yo/entregas-pendientes', undefined, auth(tokenR2));
check('GET /repartidores/yo/entregas-pendientes → 200', r2Entregas.status === 200);

// ─────────────── Asignación manual + Reintentar/Devolver ───────────────
seccion('Pedidos — asignar manual, fallar + reintentar, fallar + devolver');

const pedRe = await call('POST', '/pedidos', {
  nombreCliente: 'Cli Re', telefonoCliente: '+50377003333',
  direccionOrigen: 'X', latitudOrigen: 25.5, longitudOrigen: 25.5,
  direccionDestino: 'X', latitudDestino: 30.5, longitudDestino: 30.5,
  metodoPago: 'PREPAGADO',
}, auth(tokenVend));
const pedReId = pedRe.body.id;

// Asignación manual (ADMIN) con repartidor específico
const r1Id = crearR1.body.id; // id del Usuario — necesitamos PerfilRepartidor id
const listaR = await call('GET', '/repartidores', undefined, auth(tokenAdmin));
const perfilR1 = listaR.body.find(r => r.usuarioId === crearR1.body.id);
const perfilR2 = listaR.body.find(r => r.usuarioId === crearR2.body.id);

const asigManual = await call('POST', `/pedidos/${pedReId}/asignar`,
  { repartidorRecogidaId: perfilR1.id }, auth(tokenAdmin));
check('POST /pedidos/:id/asignar (manual) → 200', asigManual.status === 200);
check('  estado=ASIGNADO tras asignación manual', asigManual.body.estado === 'ASIGNADO');
check('  repartidorRecogida = R1', asigManual.body.repartidorRecogidaId === perfilR1.id);

// Flujo hasta EN_REPARTO
await call('POST', `/pedidos/${pedReId}/recoger`, {}, auth(tokenR1));
await call('POST', `/pedidos/${pedReId}/en-transito`, {}, auth(tokenR1));
await call('POST', `/pedidos/${pedReId}/llegar-intercambio`, {}, auth(tokenR1));
await call('POST', `/pedidos/${pedReId}/tomar-entrega`, {}, auth(tokenR2));

// Fallar → FALLIDO
const fallar = await call('POST', `/pedidos/${pedReId}/fallar`,
  { motivo: 'cliente ausente' }, auth(tokenR2));
check('POST /:id/fallar → 200 estado=FALLIDO', fallar.status === 200 && fallar.body.estado === 'FALLIDO');

// Reintentar → EN_REPARTO
const rei = await call('POST', `/pedidos/${pedReId}/reintentar`, {}, auth(tokenR2));
check('POST /:id/reintentar → 200 estado=EN_REPARTO', rei.status === 200 && rei.body.estado === 'EN_REPARTO');

// Fallar de nuevo
await call('POST', `/pedidos/${pedReId}/fallar`,
  { motivo: 'cliente rechazó' }, auth(tokenR2));
// Devolver
const dev = await call('POST', `/pedidos/${pedReId}/devolver`, {}, auth(tokenR2));
check('POST /:id/devolver → 200 estado=DEVUELTO', dev.status === 200 && dev.body.estado === 'DEVUELTO');

// ─────────────── Desempeño con tasaExito real ───────────────
seccion('Repartidores — desempeño con tasaExito');

const desR2 = await call('GET', `/repartidores/${perfilR2.id}/desempeno`, undefined, auth(tokenAdmin));
check('GET /repartidores/:id/desempeno → 200', desR2.status === 200);
check('  entregados ≥ 1', desR2.body.entregados >= 1);
check('  tasaExito numérico (0..1)',
  desR2.body.tasaExito === null || (desR2.body.tasaExito >= 0 && desR2.body.tasaExito <= 1));

// ─────────────── Cancelar desde PENDIENTE_ASIGNACION ───────────────
seccion('Pedidos — cancelar permitido desde PENDIENTE_ASIGNACION');

const pedC = await call('POST', '/pedidos', {
  nombreCliente: 'Cli C', telefonoCliente: '+50377004444',
  direccionOrigen: 'X', latitudOrigen: 25.5, longitudOrigen: 25.5,
  direccionDestino: 'X', latitudDestino: 30.5, longitudDestino: 30.5,
  metodoPago: 'PREPAGADO',
}, auth(tokenVend));
const cancel = await call('POST', `/pedidos/${pedC.body.id}/cancelar`,
  { motivo: 'cambio' }, auth(tokenVend));
check('POST /:id/cancelar (PENDIENTE_ASIGNACION) → 200', cancel.status === 200);
check('  estado=CANCELADO', cancel.body.estado === 'CANCELADO');

// ─────────────── Resumen ───────────────
console.log(`\n━━━ RESULTADO: ${passed} OK / ${failed} fallidos ━━━`);
if (failed > 0) {
  console.log('Fallos:');
  errores.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
