// Prueba manual de los 17 endpoints publicados en Fase 1.
// Usa emails sufijados por timestamp para evitar colisiones con datos existentes.

const BASE = 'http://localhost:3000';
const API = BASE + '/api/v1';

const sufijo = Date.now();
const clienteEmail = `smoke.cliente.${sufijo}@test.com`;
const vendedorEmail = `smoke.vendedor.${sufijo}@test.com`;
const creadoPorAdminEmail = `smoke.creado.${sufijo}@test.com`;

let passed = 0;
let failed = 0;
const errores = [];

async function call(method, url, body, headers = {}) {
  const r = await fetch((url.startsWith('/docs') ? BASE : API) + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const texto = await r.text();
  let datos;
  try { datos = JSON.parse(texto); } catch { datos = texto; }
  return { status: r.status, body: datos, headers: Object.fromEntries(r.headers) };
}

function check(titulo, condicion, detalle = '') {
  const icono = condicion ? '[OK]' : '[X] ';
  const linea = `${icono} ${titulo}${detalle ? ' — ' + detalle : ''}`;
  console.log(linea);
  if (condicion) passed++;
  else {
    failed++;
    errores.push(titulo);
  }
}

function seccion(titulo) {
  console.log(`\n━━━ ${titulo} ━━━`);
}

// ─────────────────────────────────────────────────────────
seccion('SALUD — endpoints públicos y admin');

{
  const r = await call('GET', '/salud');
  check('GET /salud → 200', r.status === 200);
  check('  estado=ok', r.body.estado === 'ok');
  check('  bd=arriba', r.body.bd === 'arriba');
  check('  redis=arriba', r.body.redis === 'arriba');
  check('  tiempoActividad numérico', typeof r.body.tiempoActividad === 'number');
}

{
  const r = await call('GET', '/salud/operativa');
  check('GET /salud/operativa sin token → 401', r.status === 401);
}

// ─────────────────────────────────────────────────────────
seccion('AUTENTICACION — registrar / iniciar / refrescar / cerrar');

{
  const r = await call('POST', '/autenticacion/registrar', {
    email: clienteEmail,
    telefono: `+5037700${String(sufijo).slice(-4)}`,
    contrasena: 'Secret123!',
    nombreCompleto: 'Smoke Cliente',
    rol: 'CLIENTE',
  });
  check('POST /autenticacion/registrar (CLIENTE) → 201', r.status === 201);
  check('  devuelve usuario + 2 tokens', !!r.body.usuario && !!r.body.tokenAcceso && !!r.body.tokenRefresco);
  check('  estado PENDIENTE_VERIFICACION (registro público)', r.body.usuario?.estado === 'PENDIENTE_VERIFICACION');
  globalThis.sesionCliente = r.body;
}

{
  const r = await call('POST', '/autenticacion/registrar', {
    email: vendedorEmail,
    telefono: `+5037799${String(sufijo).slice(-4)}`,
    contrasena: 'Secret123!',
    nombreCompleto: 'Smoke Vendedor',
    rol: 'VENDEDOR',
    nombreNegocio: 'Tienda Smoke',
  });
  check('POST /autenticacion/registrar (VENDEDOR) → 201', r.status === 201);
  globalThis.sesionVendedor = r.body;
}

{
  const r = await call('POST', '/autenticacion/registrar', {
    email: clienteEmail,  // duplicado
    telefono: `+5037701${String(sufijo).slice(-4)}`,
    contrasena: 'Secret123!',
    nombreCompleto: 'Dup',
    rol: 'CLIENTE',
  });
  check('POST /autenticacion/registrar email duplicado → 409', r.status === 409);
}

{
  const r = await call('POST', '/autenticacion/registrar', {
    email: `weak.${sufijo}@test.com`,
    telefono: `+5037702${String(sufijo).slice(-4)}`,
    contrasena: 'abc123',  // débil
    nombreCompleto: 'Weak',
    rol: 'CLIENTE',
  });
  check('POST /autenticacion/registrar contraseña débil → 400', r.status === 400);
}

{
  const r = await call('POST', '/autenticacion/iniciar-sesion',
    { email: clienteEmail, contrasena: 'Secret123!' });
  check('POST /autenticacion/iniciar-sesion válido → 200', r.status === 200);
  check('  ultimoIngresoEn poblado', !!r.body.usuario?.ultimoIngresoEn);
}

{
  const r = await call('POST', '/autenticacion/iniciar-sesion',
    { email: clienteEmail, contrasena: 'WrongPass!1' });
  check('POST /autenticacion/iniciar-sesion contraseña inválida → 401', r.status === 401);
}

{
  const r = await call('POST', '/autenticacion/refrescar',
    { tokenRefresco: sesionCliente.tokenRefresco });
  check('POST /autenticacion/refrescar → 200', r.status === 200);
  check('  tokenRefresco rotado (distinto)', r.body.tokenRefresco !== sesionCliente.tokenRefresco);
  globalThis.sesionClienteRotada = r.body;
}

{
  const r = await call('POST', '/autenticacion/refrescar',
    { tokenRefresco: sesionCliente.tokenRefresco });
  check('POST /autenticacion/refrescar con token previo (revocado) → 401', r.status === 401);
}

// ─────────────────────────────────────────────────────────
seccion('ADMIN bootstrap — login con admin raíz del seed');

{
  const r = await call('POST', '/autenticacion/iniciar-sesion',
    { email: 'admin@delivery.com', contrasena: 'Admin123!' });
  check('Login admin raíz (seed) → 200', r.status === 200);
  check('  rol=ADMIN', r.body.usuario?.rol === 'ADMIN');
  globalThis.sesionAdmin = r.body;
}
const auth = (t) => ({ Authorization: 'Bearer ' + t });

// ─────────────────────────────────────────────────────────
seccion('USUARIOS — /yo (cualquier autenticado)');

{
  const r = await call('GET', '/usuarios/yo', undefined, auth(sesionClienteRotada.tokenAcceso));
  check('GET /usuarios/yo → 200', r.status === 200);
  check('  id coincide con sesión', r.body.id === sesionClienteRotada.usuario.id);
}

{
  const r = await call('GET', '/usuarios/yo');
  check('GET /usuarios/yo sin token → 401', r.status === 401);
}

{
  const r = await call('PATCH', '/usuarios/yo',
    { nombreCompleto: 'Smoke Cliente (editado)' },
    auth(sesionClienteRotada.tokenAcceso));
  check('PATCH /usuarios/yo → 200', r.status === 200);
  check('  nombreCompleto actualizado', r.body.nombreCompleto === 'Smoke Cliente (editado)');
}

// ─────────────────────────────────────────────────────────
seccion('USUARIOS — endpoints ADMIN (autorización)');

{
  const r = await call('GET', '/usuarios', undefined, auth(sesionVendedor.tokenAcceso));
  check('GET /usuarios como VENDEDOR → 403', r.status === 403);
}

{
  const r = await call('GET', '/salud/operativa', undefined, auth(sesionVendedor.tokenAcceso));
  check('GET /salud/operativa como VENDEDOR → 403', r.status === 403);
}

// ─────────────────────────────────────────────────────────
seccion('USUARIOS — CRUD como ADMIN');

{
  const r = await call('GET', '/salud/operativa', undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /salud/operativa como ADMIN → 200', r.status === 200);
  check('  entorno reportado', typeof r.body.entorno === 'string');
}

{
  const r = await call('POST', '/usuarios', {
    email: creadoPorAdminEmail,
    telefono: `+5037703${String(sufijo).slice(-4)}`,
    contrasena: 'Secret123!',
    nombreCompleto: 'Creado por Admin',
    rol: 'REPARTIDOR',
  }, auth(sesionAdmin.tokenAcceso));
  check('POST /usuarios (REPARTIDOR) → 201', r.status === 201);
  check('  estado=ACTIVO (creación por admin)', r.body.estado === 'ACTIVO');
  globalThis.creadoId = r.body.id;
}

{
  const r = await call('GET', `/usuarios?pagina=1&limite=5`, undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /usuarios?pagina=1&limite=5 → 200', r.status === 200);
  check('  meta.pagina=1', r.body.meta?.pagina === 1);
  check('  meta.limite=5', r.body.meta?.limite === 5);
  check('  datos.length<=5', r.body.datos?.length <= 5);
  check('  meta.total >= 1', r.body.meta?.total >= 1);
}

{
  const r = await call('GET', `/usuarios?rol=REPARTIDOR`, undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /usuarios?rol=REPARTIDOR → 200', r.status === 200);
  const soloRepartidores = r.body.datos?.every(u => u.rol === 'REPARTIDOR');
  check('  todos los resultados son REPARTIDOR', !!soloRepartidores);
}

{
  const r = await call('GET', `/usuarios?busqueda=Smoke`, undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /usuarios?busqueda=Smoke → 200', r.status === 200);
  check('  encuentra al menos un Smoke', r.body.meta?.total >= 1);
}

{
  const r = await call('GET', `/usuarios/${creadoId}`, undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /usuarios/:id → 200', r.status === 200);
  check('  email coincide', r.body.email === creadoPorAdminEmail);
}

{
  const r = await call('PATCH', `/usuarios/${creadoId}`,
    { nombreCompleto: 'Renombrado por Admin' },
    auth(sesionAdmin.tokenAcceso));
  check('PATCH /usuarios/:id → 200', r.status === 200);
  check('  nombreCompleto actualizado', r.body.nombreCompleto === 'Renombrado por Admin');
}

{
  const r = await call('PATCH', `/usuarios/${creadoId}/estado`,
    { estado: 'SUSPENDIDO', motivo: 'Prueba de smoke' },
    auth(sesionAdmin.tokenAcceso));
  check('PATCH /usuarios/:id/estado ACTIVO→SUSPENDIDO → 200', r.status === 200);
  check('  estado=SUSPENDIDO', r.body.estado === 'SUSPENDIDO');
}

{
  // Transición inválida: SUSPENDIDO → PENDIENTE_VERIFICACION no permitida
  const r = await call('PATCH', `/usuarios/${creadoId}/estado`,
    { estado: 'PENDIENTE_VERIFICACION' },
    auth(sesionAdmin.tokenAcceso));
  check('PATCH /usuarios/:id/estado transición inválida → 400', r.status === 400);
}

{
  const r = await call('DELETE', `/usuarios/${creadoId}`, undefined, auth(sesionAdmin.tokenAcceso));
  check('DELETE /usuarios/:id → 200', r.status === 200);
  check('  estado=INACTIVO (soft delete)', r.body.estado === 'INACTIVO');
}

{
  // La fila sigue existiendo tras el DELETE
  const r = await call('GET', `/usuarios/${creadoId}`, undefined, auth(sesionAdmin.tokenAcceso));
  check('GET /usuarios/:id después de DELETE → 200 (fila existe)', r.status === 200);
  check('  estado persiste INACTIVO', r.body.estado === 'INACTIVO');
}

// ─────────────────────────────────────────────────────────
seccion('AUTENTICACION — cerrar sesión');

{
  const r = await call('POST', '/autenticacion/cerrar-sesion',
    { tokenRefresco: sesionClienteRotada.tokenRefresco },
    auth(sesionClienteRotada.tokenAcceso));
  check('POST /autenticacion/cerrar-sesion → 204', r.status === 204);
}

{
  const r = await call('POST', '/autenticacion/refrescar',
    { tokenRefresco: sesionClienteRotada.tokenRefresco });
  check('POST /autenticacion/refrescar tras cerrar-sesion → 401', r.status === 401);
}

{
  const r = await call('POST', '/autenticacion/cerrar-sesion',
    { tokenRefresco: sesionClienteRotada.tokenRefresco });
  check('POST /autenticacion/cerrar-sesion sin token → 401', r.status === 401);
}

// ─────────────────────────────────────────────────────────
seccion('SWAGGER — /docs, /docs-json, /docs-yaml');

{
  const r = await call('GET', '/docs');
  check('GET /docs → 200', r.status === 200);
  check('  responde HTML', typeof r.body === 'string' && r.body.includes('swagger'));
}

{
  const r = await call('GET', '/docs-json');
  check('GET /docs-json → 200', r.status === 200);
  check('  openapi 3.x', typeof r.body?.openapi === 'string' && r.body.openapi.startsWith('3.'));
  check('  tags presentes: Salud/Autenticacion/Usuarios',
    r.body?.tags?.map(t => t.name).sort().join(',') === 'Autenticacion,Salud,Usuarios');
  const pathCount = Object.keys(r.body?.paths ?? {}).length;
  check(`  paths documentados (${pathCount})`, pathCount >= 10);
}

{
  const r = await call('GET', '/docs-yaml');
  check('GET /docs-yaml → 200', r.status === 200);
  check('  body es YAML', typeof r.body === 'string' && r.body.startsWith('openapi'));
}

// ─────────────────────────────────────────────────────────
console.log(`\n━━━ RESULTADO: ${passed} OK / ${failed} fallidos ━━━`);
if (failed > 0) {
  console.log('Fallos:');
  errores.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
