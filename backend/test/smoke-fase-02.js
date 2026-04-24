// Prueba manual de los endpoints nuevos de Fase 2.
//   Zonas:        GET, POST, GET /resolver, GET /:id, PATCH /:id, DELETE /:id, POST /:id/repartidores
//   Repartidores: GET, GET /:id/desempeno, GET /:id/ubicacion,
//                 GET /yo, PATCH /yo/disponibilidad, POST /yo/ubicacion,
//                 stubs /yo/pedidos|recogidas-pendientes|entregas-pendientes

const BASE = 'http://localhost:3000/api/v1';

const sufijo = Date.now();
const codigoZonaA = `SA${String(sufijo).slice(-6)}`;
const codigoZonaB = `SB${String(sufijo).slice(-6)}`;
const emailRepartidor = `smoke.repartidor.${sufijo}@test.com`;

let passed = 0;
let failed = 0;
const errores = [];

async function call(method, url, body, headers = {}) {
  const r = await fetch(BASE + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const texto = await r.text();
  let datos;
  try { datos = JSON.parse(texto); } catch { datos = texto; }
  return { status: r.status, body: datos };
}

function check(titulo, condicion, detalle = '') {
  const icono = condicion ? '[OK]' : '[X] ';
  console.log(`${icono} ${titulo}${detalle ? ' — ' + detalle : ''}`);
  if (condicion) passed++;
  else { failed++; errores.push(titulo); }
}

function seccion(titulo) { console.log(`\n━━━ ${titulo} ━━━`); }

// ─────────────────────────────────────────────────────────
seccion('Bootstrap — login admin + crear repartidor via /usuarios');

const loginAdmin = await call('POST', '/autenticacion/iniciar-sesion',
  { email: 'admin@delivery.com', contrasena: 'Admin123!' });
check('Login admin raíz → 200', loginAdmin.status === 200);
const tokenAdmin = loginAdmin.body.tokenAcceso;
const auth = (t) => ({ Authorization: 'Bearer ' + t });

const crearRepartidor = await call('POST', '/usuarios', {
  email: emailRepartidor,
  telefono: `+5037778${String(sufijo).slice(-4)}`,
  contrasena: 'Secret123!',
  nombreCompleto: 'Smoke Repartidor',
  rol: 'REPARTIDOR',
  tipoVehiculo: 'moto',
  placa: `SM${sufijo}`.slice(0, 10),
  documentoIdentidad: `DOC${sufijo}`,
}, auth(tokenAdmin));
check('POST /usuarios REPARTIDOR (con PerfilRepartidor) → 201', crearRepartidor.status === 201);
const usuarioRepartidorId = crearRepartidor.body.id;

// Para operaciones /yo del repartidor necesitamos su token.
const loginRepartidor = await call('POST', '/autenticacion/iniciar-sesion',
  { email: emailRepartidor, contrasena: 'Secret123!' });
check('Login repartidor → 200', loginRepartidor.status === 200);
const tokenRepartidor = loginRepartidor.body.tokenAcceso;

// ─────────────────────────────────────────────────────────
seccion('Zonas — CRUD');

// Polígono cuadrado alrededor de (13.7, -89.2) aprox Lat/Lng San Salvador
const poligonoA = [
  { lat: 13.7, lng: -89.3 },
  { lat: 13.7, lng: -89.2 },
  { lat: 13.8, lng: -89.2 },
  { lat: 13.8, lng: -89.3 },
];

const crearZonaA = await call('POST', '/zonas', {
  codigo: codigoZonaA,
  nombre: 'Smoke Zona A',
  descripcion: 'Zona de prueba',
  poligono: poligonoA,
  latitudCentro: 13.75,
  longitudCentro: -89.25,
}, auth(tokenAdmin));
check('POST /zonas (ADMIN) → 201', crearZonaA.status === 201);
check('  devuelve polígono con 4 puntos abiertos', crearZonaA.body.poligono?.length === 4);
const zonaAId = crearZonaA.body.id;

const crearDup = await call('POST', '/zonas', {
  codigo: codigoZonaA,  // duplicado
  nombre: 'Duplicada',
  poligono: poligonoA,
  latitudCentro: 0,
  longitudCentro: 0,
}, auth(tokenAdmin));
check('POST /zonas código duplicado → 409', crearDup.status === 409);

const poligonoB = [
  { lat: 14.0, lng: -89.3 },
  { lat: 14.0, lng: -89.2 },
  { lat: 14.1, lng: -89.2 },
  { lat: 14.1, lng: -89.3 },
];
const crearZonaB = await call('POST', '/zonas', {
  codigo: codigoZonaB,
  nombre: 'Smoke Zona B',
  poligono: poligonoB,
  latitudCentro: 14.05,
  longitudCentro: -89.25,
}, auth(tokenAdmin));
check('POST /zonas (B) → 201', crearZonaB.status === 201);
const zonaBId = crearZonaB.body.id;

const listar = await call('GET', '/zonas');
check('GET /zonas (público) → 200', listar.status === 200);
const listaCodigos = listar.body.map(z => z.codigo);
check('  incluye código A', listaCodigos.includes(codigoZonaA));
check('  polígono devuelto como {lat,lng}[]',
  !!listar.body[0]?.poligono?.[0]?.lat && !!listar.body[0]?.poligono?.[0]?.lng);

const obtenerPorId = await call('GET', `/zonas/${zonaAId}`);
check('GET /zonas/:id → 200', obtenerPorId.status === 200);
check('  codigo coincide', obtenerPorId.body.codigo === codigoZonaA);

const actualizar = await call('PATCH', `/zonas/${zonaAId}`,
  { nombre: 'Smoke Zona A (editada)' }, auth(tokenAdmin));
check('PATCH /zonas/:id (ADMIN) → 200', actualizar.status === 200);
check('  nombre actualizado', actualizar.body.nombre === 'Smoke Zona A (editada)');

// Actualizar polígono (nuevo rectángulo más grande)
const poligonoAgrande = [
  { lat: 13.6, lng: -89.4 },
  { lat: 13.6, lng: -89.1 },
  { lat: 13.9, lng: -89.1 },
  { lat: 13.9, lng: -89.4 },
];
const actualizarGeo = await call('PATCH', `/zonas/${zonaAId}`,
  { poligono: poligonoAgrande }, auth(tokenAdmin));
check('PATCH /zonas/:id con polígono nuevo → 200', actualizarGeo.status === 200);
check('  polígono actualizado', actualizarGeo.body.poligono?.length === 4);

// Como VENDEDOR debería fallar
const loginVendedor = await call('POST', '/autenticacion/iniciar-sesion',
  { email: 'vendedor1@delivery.com', contrasena: 'Vendedor123!' });
const tokenVendedor = loginVendedor.body.tokenAcceso;

const crearComoVendedor = await call('POST', '/zonas', {
  codigo: 'X', nombre: 'X', poligono: poligonoA,
  latitudCentro: 0, longitudCentro: 0,
}, auth(tokenVendedor));
check('POST /zonas como VENDEDOR → 403', crearComoVendedor.status === 403);

// ─────────────────────────────────────────────────────────
seccion('Zonas — asignar repartidores');

// Obtener el id de PerfilRepartidor del recién creado
const listaRepartidoresAdm = await call('GET', '/repartidores', undefined, auth(tokenAdmin));
check('GET /repartidores (ADMIN) → 200', listaRepartidoresAdm.status === 200);
const repartidorRow = listaRepartidoresAdm.body.find(r => r.usuarioId === usuarioRepartidorId);
check('  repartidor creado aparece en el listado', !!repartidorRow);
const perfilRepartidorId = repartidorRow.id;

const asignar = await call('POST', `/zonas/${zonaAId}/repartidores`, {
  repartidorIds: [perfilRepartidorId],
  repartidorPrimarioId: perfilRepartidorId,
}, auth(tokenAdmin));
check('POST /zonas/:id/repartidores → 200', asignar.status === 200);
check('  asignados=1', asignar.body.asignados === 1);

// Verificar vía listar repartidores
const listaRepartidoresDespues = await call('GET', '/repartidores', undefined, auth(tokenAdmin));
const conZona = listaRepartidoresDespues.body.find(r => r.id === perfilRepartidorId);
check('  repartidor muestra zona primaria asignada',
  conZona?.zonas?.some(z => z.codigo === codigoZonaA && z.esPrimaria === true));

// ─────────────────────────────────────────────────────────
seccion('Zonas — GET /resolver (GeoServicio)');

// Punto dentro de la zona A actualizada (más grande)
const resolverDentro = await call('GET', `/zonas/resolver?lat=13.75&lng=-89.25`);
check('GET /zonas/resolver punto dentro de A → 200', resolverDentro.status === 200);
check('  devuelve codigo=A',
  resolverDentro.body.codigo === codigoZonaA);

const resolverFuera = await call('GET', `/zonas/resolver?lat=0&lng=0`);
check('GET /zonas/resolver punto fuera → 404', resolverFuera.status === 404);
check('  codigo=PUNTO_FUERA_DE_ZONA', resolverFuera.body.codigo === 'PUNTO_FUERA_DE_ZONA');

const resolverInvalido = await call('GET', `/zonas/resolver?lat=200&lng=0`);
check('GET /zonas/resolver lat inválida → 400', resolverInvalido.status === 400);

// ─────────────────────────────────────────────────────────
seccion('Repartidores — /yo y /yo/disponibilidad');

const yo = await call('GET', '/repartidores/yo', undefined, auth(tokenRepartidor));
check('GET /repartidores/yo → 200', yo.status === 200);
check('  retorna tipoVehiculo=moto', yo.body.tipoVehiculo === 'moto');
check('  disponible=true (default)', yo.body.disponible === true);

const disp = await call('PATCH', '/repartidores/yo/disponibilidad',
  { disponible: false }, auth(tokenRepartidor));
check('PATCH /repartidores/yo/disponibilidad → 200', disp.status === 200);
check('  disponible=false', disp.body.disponible === false);

// ─────────────────────────────────────────────────────────
seccion('Repartidores — /yo/ubicacion + throttle custom');

const ubic1 = await call('POST', '/repartidores/yo/ubicacion',
  { latitud: 13.75, longitud: -89.25 }, auth(tokenRepartidor));
check('POST /repartidores/yo/ubicacion → 200', ubic1.status === 200);
check('  ultimaUbicacionEn reciente', !!ubic1.body.ultimaUbicacionEn);

// lat inválida
const ubicInvalida = await call('POST', '/repartidores/yo/ubicacion',
  { latitud: 200, longitud: 0 }, auth(tokenRepartidor));
check('POST /repartidores/yo/ubicacion latitud=200 → 400', ubicInvalida.status === 400);

// Como admin consultar la ubicación del repartidor
const ubicAdm = await call('GET', `/repartidores/${perfilRepartidorId}/ubicacion`,
  undefined, auth(tokenAdmin));
check('GET /repartidores/:id/ubicacion (ADMIN) → 200', ubicAdm.status === 200);
check('  latitudActual=13.75', ubicAdm.body.latitudActual === 13.75);
check('  longitudActual=-89.25', ubicAdm.body.longitudActual === -89.25);

// ─────────────────────────────────────────────────────────
seccion('Repartidores — desempeño + stubs Fase 3');

const desempeno = await call('GET', `/repartidores/${perfilRepartidorId}/desempeno`,
  undefined, auth(tokenAdmin));
check('GET /repartidores/:id/desempeno (ADMIN) → 200', desempeno.status === 200);
check('  totalEntregas presente', typeof desempeno.body.totalEntregas === 'number');
check('  calificacion presente', typeof desempeno.body.calificacion === 'number');

const stubPedidos = await call('GET', '/repartidores/yo/pedidos', undefined, auth(tokenRepartidor));
check('GET /repartidores/yo/pedidos (stub) → 200', stubPedidos.status === 200);
check('  array vacío', Array.isArray(stubPedidos.body) && stubPedidos.body.length === 0);

const stubRecogidas = await call('GET', '/repartidores/yo/recogidas-pendientes', undefined, auth(tokenRepartidor));
check('GET /repartidores/yo/recogidas-pendientes (stub) → 200', stubRecogidas.status === 200);

const stubEntregas = await call('GET', '/repartidores/yo/entregas-pendientes', undefined, auth(tokenRepartidor));
check('GET /repartidores/yo/entregas-pendientes (stub) → 200', stubEntregas.status === 200);

// ─────────────────────────────────────────────────────────
seccion('Autorización negativa');

const listaComoVendedor = await call('GET', '/repartidores', undefined, auth(tokenVendedor));
check('GET /repartidores como VENDEDOR → 403', listaComoVendedor.status === 403);

const ubicComoVendedor = await call('POST', '/repartidores/yo/ubicacion',
  { latitud: 0, longitud: 0 }, auth(tokenVendedor));
check('POST /repartidores/yo/ubicacion como VENDEDOR → 403', ubicComoVendedor.status === 403);

// ─────────────────────────────────────────────────────────
seccion('Zonas — soft delete');

const elim = await call('DELETE', `/zonas/${zonaBId}`, undefined, auth(tokenAdmin));
check('DELETE /zonas/:id (ADMIN) → 200', elim.status === 200);
check('  activa=false', elim.body.activa === false);

const listaSinInactivas = await call('GET', '/zonas');
const incluyeB = listaSinInactivas.body.some(z => z.id === zonaBId);
check('GET /zonas omite zonas inactivas por defecto', !incluyeB);

const listaConInactivas = await call('GET', '/zonas?incluirInactivas=true');
const incluyeB2 = listaConInactivas.body.some(z => z.id === zonaBId);
check('GET /zonas?incluirInactivas=true incluye la zona inactiva', incluyeB2);

// ─────────────────────────────────────────────────────────
console.log(`\n━━━ RESULTADO: ${passed} OK / ${failed} fallidos ━━━`);
if (failed > 0) {
  console.log('Fallos:');
  errores.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
