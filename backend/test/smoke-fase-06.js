// Smoke manual de los endpoints/flujos de Fase 6 (Notificaciones).
//
// Cubre:
//  • POST /tokens-dispositivo (registrar y upsert)
//  • DELETE /tokens-dispositivo/:token
//  • GET /tokens-dispositivo
//  • GET /notificaciones/yo (paginado + filtros)
//  • PATCH /notificaciones/:id/leida
//  • Eventos de dominio → notificaciones persistidas:
//      - PEDIDO_CREADO     → vendedor EMAIL + cliente WHATSAPP (FALLIDO sin creds)
//      - PEDIDO_ASIGNADO   → vendedor PUSH (FALLIDO sin creds) + repartidor PUSH
//      - PEDIDO_CANCELADO  → vendedor + repartidor + cliente
//      - PAQUETE_COMPRADO  → vendedor PUSH+EMAIL
//  • Cuenta de notificaciones por usuario tras los flujos.
//  • Rate limit anti-spam (NOTIFICACIONES_LIMITE_HORA, default 20/h).
//  • Verificación de email entregado en Mailhog (http://localhost:8025).

const BASE = 'http://localhost:3000/api/v1';
const MAILHOG = 'http://localhost:8025/api/v2';
const sufijo = Date.now();
const codigoZonaA = `F6A${String(sufijo).slice(-5)}`;
const codigoZonaB = `F6B${String(sufijo).slice(-5)}`;

let passed = 0, failed = 0;
const errores = [];

async function call(method, url, body, headers = {}) {
  const r = await fetch(BASE + url, {
    method,
    headers: body && !(body instanceof FormData)
      ? { 'Content-Type': 'application/json', ...headers }
      : headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  let data;
  try { data = JSON.parse(txt); } catch { data = txt; }
  return { status: r.status, body: data };
}

function check(titulo, cond, det = '') {
  const ic = cond ? '[OK]' : '[X] ';
  console.log(`${ic} ${titulo}${det ? ' — ' + det : ''}`);
  if (cond) passed++; else { failed++; errores.push(titulo); }
}

function seccion(t) { console.log(`\n━━━ ${t} ━━━`); }

// pequeño sleep para esperar que los handlers @OnEvent terminen
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

// ─────────────── Bootstrap ───────────────
seccion('Bootstrap: admin + vendedor + 2 zonas + 2 repartidores');

const loginAdmin = await call('POST', '/autenticacion/iniciar-sesion',
  { email: 'admin@delivery.com', contrasena: 'Admin123!' });
const tokenAdmin = loginAdmin.body.tokenAcceso;
check('login admin', loginAdmin.status === 200);
const auth = (t) => ({ Authorization: 'Bearer ' + t });

const vendEmail = `smoke.f6.v.${sufijo}@test.com`;
const crearVend = await call('POST', '/usuarios', {
  email: vendEmail,
  telefono: `+5037000${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Vendedor F6',
  rol: 'VENDEDOR',
  nombreNegocio: 'Neg F6',
  direccion: 'Origen F6',
  latitud: 27.5,
  longitud: 27.5,
}, auth(tokenAdmin));
check('crear vendedor → 201', crearVend.status === 201);
const vendUsuarioId = crearVend.body.id;

const tokenVend = (await call('POST', '/autenticacion/iniciar-sesion',
  { email: vendEmail, contrasena: 'Secret123!' })).body.tokenAcceso;

const poligonoA = [
  { lat: 27, lng: 27 }, { lat: 27, lng: 28 },
  { lat: 28, lng: 28 }, { lat: 28, lng: 27 },
];
const poligonoB = [
  { lat: 32, lng: 32 }, { lat: 32, lng: 33 },
  { lat: 33, lng: 33 }, { lat: 33, lng: 32 },
];
const zA = await call('POST', '/zonas', {
  codigo: codigoZonaA, nombre: 'F6 A', poligono: poligonoA,
  latitudCentro: 27.5, longitudCentro: 27.5,
}, auth(tokenAdmin));
const zB = await call('POST', '/zonas', {
  codigo: codigoZonaB, nombre: 'F6 B', poligono: poligonoB,
  latitudCentro: 32.5, longitudCentro: 32.5,
}, auth(tokenAdmin));
check('2 zonas creadas', zA.status === 201 && zB.status === 201);

const r1Email = `smoke.f6.r1.${sufijo}@test.com`;
const crearR1 = await call('POST', '/usuarios', {
  email: r1Email,
  telefono: `+5037001${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Rider F6',
  rol: 'REPARTIDOR',
  tipoVehiculo: 'moto',
  documentoIdentidad: `DOC-F6-${sufijo}`,
  zonaIds: [zA.body.id],
  zonaPrimariaId: zA.body.id,
}, auth(tokenAdmin));
check('crear rider → 201', crearR1.status === 201);
const tokenR1 = (await call('POST', '/autenticacion/iniciar-sesion',
  { email: r1Email, contrasena: 'Secret123!' })).body.tokenAcceso;
const riderUsuarioId = crearR1.body.id;

// ─────────────── 1) Tokens de dispositivo ───────────────
seccion('Tokens de dispositivo (POST/DELETE/GET)');

const tokenFCM = `dummy-fcm-token-${sufijo}`;

const reg1 = await call('POST', '/tokens-dispositivo',
  { token: tokenFCM, plataforma: 'ANDROID' }, auth(tokenVend));
check('POST /tokens-dispositivo → 201', reg1.status === 201);
check('  activo=true', reg1.body.activo === true);
check('  plataforma=ANDROID', reg1.body.plataforma === 'ANDROID');

// Upsert: el mismo token por el mismo usuario no duplica.
const reg2 = await call('POST', '/tokens-dispositivo',
  { token: tokenFCM, plataforma: 'IOS' }, auth(tokenVend));
check('POST repetido → upsert (mismo id, no duplica)',
  reg2.status === 201 && reg2.body.id === reg1.body.id);
check('  upsert actualizó plataforma', reg2.body.plataforma === 'IOS');

// Otro usuario reclama el mismo token → reasigna y reactiva.
const reg3 = await call('POST', '/tokens-dispositivo',
  { token: tokenFCM, plataforma: 'ANDROID' }, auth(tokenR1));
check('POST mismo token desde otro usuario → reasigna',
  reg3.status === 201 && reg3.body.id === reg1.body.id);
check('  ahora pertenece al rider', reg3.body.usuarioId === riderUsuarioId);

// Re-registramos el del vendedor con un token nuevo
const tokenFCM2 = `dummy-fcm-token-2-${sufijo}`;
await call('POST', '/tokens-dispositivo',
  { token: tokenFCM2, plataforma: 'ANDROID' }, auth(tokenVend));

const listVend = await call('GET', '/tokens-dispositivo', undefined, auth(tokenVend));
check('GET /tokens-dispositivo → 200', listVend.status === 200);
check('  vendedor tiene ≥1 token activo', listVend.body.length >= 1);

// DELETE soft
const del = await call('DELETE', `/tokens-dispositivo/${tokenFCM2}`, undefined, auth(tokenVend));
check('DELETE /tokens-dispositivo/:token → 200', del.status === 200);
check('  revocados=1', del.body.revocados === 1);

const listTrasDel = await call('GET', '/tokens-dispositivo', undefined, auth(tokenVend));
check('  GET ya no muestra el revocado',
  !listTrasDel.body.some((t) => t.token === tokenFCM2));

// ─────────────── 2) Crear pedido → eventos → notificaciones ───────────────
seccion('Pedido creado — vendedor EMAIL + cliente WHATSAPP');

const emailCliente = `cliente.f6.${sufijo}@test.com`;
const crearPed = await call('POST', '/pedidos', {
  nombreCliente: 'Cliente F6',
  telefonoCliente: '+50377776666',
  emailCliente,
  direccionOrigen: 'Origen F6',
  latitudOrigen: 27.5, longitudOrigen: 27.5,
  direccionDestino: 'Destino F6',
  latitudDestino: 32.5, longitudDestino: 32.5,
  metodoPago: 'PREPAGADO',
}, auth(tokenVend));
check('POST /pedidos → 201', crearPed.status === 201);
const pedidoId = crearPed.body.id;

await dormir(800);

// El vendedor debe ver al menos 1 notificación EMAIL del PEDIDO_CREADO.
const notifVend1 = await call('GET', '/notificaciones/yo', undefined, auth(tokenVend));
check('GET /notificaciones/yo (vendedor) → 200', notifVend1.status === 200);
const tieneCreado = notifVend1.body.datos.some(
  (n) => n.canal === 'EMAIL' && /creado/i.test(n.titulo),
);
check('  vendedor recibió EMAIL "Pedido … creado"', tieneCreado);

// ─────────────── 3) Asignar pedido → push al rider ───────────────
seccion('Pedido asignado — rider PUSH');

await call('POST', '/pedidos/asignar-automatico', null, auth(tokenAdmin));
await dormir(800);

const notifR1 = await call('GET', '/notificaciones/yo', undefined, auth(tokenR1));
const tieneAsignado = notifR1.body.datos.some(
  (n) => n.canal === 'PUSH' && /asignado|recoger/i.test(n.titulo),
);
check('rider recibió PUSH de asignación', tieneAsignado);

// PUSH sin Firebase → debe estar FALLIDO con CANAL_NO_CONFIGURADO
const pushFallido = notifR1.body.datos.find((n) => n.canal === 'PUSH');
if (pushFallido) {
  check('  PUSH marcado FALLIDO sin FCM',
    pushFallido.estado === 'FALLIDO',
    `mensajeError=${pushFallido.mensajeError ?? 'n/a'}`);
}

// ─────────────── 4) Cancelar pedido — múltiples destinatarios ───────────────
seccion('Pedido cancelado — vendedor + rider + cliente');

// El pedido ya está ASIGNADO; cancelar desde ASIGNADO está permitido por la máquina.
const cancel = await call('POST', `/pedidos/${pedidoId}/cancelar`,
  { motivo: 'cliente cambió de planes' }, auth(tokenVend));
check('POST /:id/cancelar → 200', cancel.status === 200 && cancel.body.estado === 'CANCELADO');

await dormir(800);

const notifVend2 = await call('GET', '/notificaciones/yo', undefined, auth(tokenVend));
check('  vendedor recibió notificación de cancelación',
  notifVend2.body.datos.some((n) => /cancelad/i.test(n.titulo)));

const notifR1c = await call('GET', '/notificaciones/yo', undefined, auth(tokenR1));
check('  rider recibió notificación de cancelación',
  notifR1c.body.datos.some((n) => /cancelad/i.test(n.titulo)));

// ─────────────── 5) Marcar como leída ───────────────
seccion('PATCH /notificaciones/:id/leida');

const primera = notifVend2.body.datos[0];
const leida = await call('PATCH', `/notificaciones/${primera.id}/leida`, null, auth(tokenVend));
check('PATCH leida → 200', leida.status === 200);
check('  estado=LEIDO', leida.body.estado === 'LEIDO');
check('  leidoEn poblado', !!leida.body.leidoEn);

// Otro usuario no puede marcar la leída
const ajena = await call('PATCH', `/notificaciones/${primera.id}/leida`, null, auth(tokenR1));
check('PATCH leida por ajeno → 403',
  ajena.status === 403 && ajena.body.codigo === 'NOTIFICACION_NO_AUTORIZADA');

// soloNoLeidas filtro
const soloPendientes = await call('GET', '/notificaciones/yo?soloNoLeidas=true',
  undefined, auth(tokenVend));
check('GET ?soloNoLeidas=true filtra correctamente',
  soloPendientes.body.datos.every((n) => n.leidoEn === null));

// ─────────────── 6) Compra de paquete → vendedor PUSH+EMAIL ───────────────
seccion('Paquete comprado — vendedor PUSH+EMAIL');

const reglas = await call('GET', '/paquetes-recargados/disponibles',
  undefined, auth(tokenVend));
const reglaPaquete = reglas.body.find((r) => r.modoFacturacion === 'PAQUETE');
check('regla PAQUETE disponible', !!reglaPaquete);

const compra = await call('POST', '/paquetes-recargados/comprar',
  { reglaTarifaId: reglaPaquete.id, metodoPago: 'TARJETA' }, auth(tokenVend));
check('POST /paquetes-recargados/comprar → 201', compra.status === 201);

await dormir(800);

const notifVend3 = await call('GET', '/notificaciones/yo?limite=50',
  undefined, auth(tokenVend));
const compradoEmail = notifVend3.body.datos.find(
  (n) => n.canal === 'EMAIL' && /paquete comprado/i.test(n.titulo),
);
const compradoPush = notifVend3.body.datos.find(
  (n) => n.canal === 'PUSH' && /paquete comprado/i.test(n.titulo),
);
check('vendedor recibió EMAIL "Paquete comprado"', !!compradoEmail);
check('vendedor recibió PUSH "Paquete comprado"', !!compradoPush);

// ─────────────── 7) Filtros: por canal ───────────────
seccion('Filtros — por canal y estado');

const soloEmail = await call('GET', '/notificaciones/yo?canal=EMAIL&limite=50',
  undefined, auth(tokenVend));
check('GET ?canal=EMAIL solo emails',
  soloEmail.body.datos.every((n) => n.canal === 'EMAIL') && soloEmail.body.datos.length >= 1);

const soloFallidos = await call('GET', '/notificaciones/yo?estado=FALLIDO&limite=50',
  undefined, auth(tokenVend));
check('GET ?estado=FALLIDO solo fallidos',
  soloFallidos.body.datos.every((n) => n.estado === 'FALLIDO'));

// ─────────────── 8) Mailhog: hubo correos reales ───────────────
seccion('Mailhog — correos entregados');

try {
  const mh = await fetch(`${MAILHOG}/messages`);
  if (mh.ok) {
    const data = await mh.json();
    const total = data.total ?? data.count ?? (data.items?.length ?? 0);
    check(`Mailhog tiene ≥1 mensaje recibido (total=${total})`, total >= 1);
  } else {
    check('Mailhog accesible', false, `HTTP ${mh.status}`);
  }
} catch (e) {
  check('Mailhog accesible', false, e.message);
}

// ─────────────── 9) Rate limit (20/h por defecto) ───────────────
seccion('Rate limit — al pasar el umbral, las nuevas se marcan FALLIDO');

// Usamos un usuario nuevo para no contaminar el conteo previo.
const limEmail = `smoke.f6.lim.${sufijo}@test.com`;
const lim = await call('POST', '/usuarios', {
  email: limEmail,
  telefono: `+5037003${String(sufijo).slice(-5)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Rate Limit',
  rol: 'VENDEDOR',
  nombreNegocio: 'Lim',
  direccion: 'X', latitud: 27.5, longitud: 27.5,
}, auth(tokenAdmin));
const tokenLim = (await call('POST', '/autenticacion/iniciar-sesion',
  { email: limEmail, contrasena: 'Secret123!' })).body.tokenAcceso;

// Disparar 25 pedidos rápidamente; cada uno emite 1 EMAIL al vendedor.
// El vendedor verá 20 con estado=ENVIADO/FALLIDO (intento real) y 5 RATE_LIMIT_EXCEDIDO.
const promesas = [];
for (let i = 0; i < 25; i++) {
  promesas.push(call('POST', '/pedidos', {
    nombreCliente: `C${i}`,
    telefonoCliente: '+50377778888',
    direccionOrigen: 'X', latitudOrigen: 27.5, longitudOrigen: 27.5,
    direccionDestino: 'X', latitudDestino: 32.5, longitudDestino: 32.5,
    metodoPago: 'PREPAGADO',
  }, auth(tokenLim)));
}
await Promise.all(promesas);
await dormir(2000);

const notifLim = await call('GET', '/notificaciones/yo?limite=100',
  undefined, auth(tokenLim));
const conRateLimit = notifLim.body.datos.filter(
  (n) => n.mensajeError === 'RATE_LIMIT_EXCEDIDO',
).length;
check(`rate limit aplicó (≥1 RATE_LIMIT_EXCEDIDO; obtenidas=${conRateLimit})`,
  conRateLimit >= 1);

// ─────────────── 10) Sin auth → 401 ───────────────
seccion('Endpoints autenticados rechazan sin token');
const sinAuth = await call('GET', '/notificaciones/yo');
check('GET /notificaciones/yo sin token → 401', sinAuth.status === 401);

const sinAuthTok = await call('POST', '/tokens-dispositivo',
  { token: 'x', plataforma: 'ANDROID' });
check('POST /tokens-dispositivo sin token → 401', sinAuthTok.status === 401);

// ─────────────── Resumen ───────────────
console.log(`\n━━━ RESULTADO: ${passed} OK / ${failed} fallidos ━━━`);
if (failed > 0) {
  console.log('Fallos:');
  errores.forEach((e) => console.log('  - ' + e));
  process.exit(1);
}
