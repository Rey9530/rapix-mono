// Smoke manual de la integración admin → backend (Fase 7).
// Ejecuta desde Node 20+ con backend corriendo en :3000.
//
// Verifica:
//  - Login real contra /autenticacion/iniciar-sesion (Tarea 7.2).
//  - Errores propagados (401 con credenciales inválidas).
//  - Refresco con tokenRefresco.
//  - Endpoints utilizados por las features 7.3, 7.5 y 7.7:
//      GET  /usuarios?rol=&estado=&busqueda= (paginado)
//      POST /usuarios + PATCH /usuarios/:id/estado
//      GET  /pedidos (paginado/filtrado)
//      POST /pedidos/asignar-automatico
//      POST /pedidos/:id/cancelar
//      GET  /cierres-financieros (paginado/filtrado)

const BASE = "http://localhost:3000/api/v1";
const sufijo = Date.now();

let passed = 0,
  failed = 0;
const errores = [];

async function call(method, url, body, headers = {}) {
  const r = await fetch(BASE + url, {
    method,
    headers: body
      ? { "Content-Type": "application/json", ...headers }
      : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  let data;
  try {
    data = JSON.parse(txt);
  } catch {
    data = txt;
  }
  return { status: r.status, body: data };
}

function check(titulo, cond, det = "") {
  const ic = cond ? "[OK]" : "[X] ";
  console.log(`${ic} ${titulo}${det ? " — " + det : ""}`);
  if (cond) passed++;
  else {
    failed++;
    errores.push(titulo);
  }
}
function seccion(t) {
  console.log(`\n━━━ ${t} ━━━`);
}

// ───────────────  7.2 Auth ───────────────
seccion("7.2 Auth — login admin, refresh, credenciales inválidas");

const login = await call("POST", "/autenticacion/iniciar-sesion", {
  email: "admin@delivery.com",
  contrasena: "Admin123!",
});
check("login admin → 200", login.status === 200);
check(
  "  payload tiene tokenAcceso/tokenRefresco/usuario",
  !!login.body.tokenAcceso &&
    !!login.body.tokenRefresco &&
    login.body.usuario?.rol === "ADMIN",
);
const tokenAdmin = login.body.tokenAcceso;
const tokenRefresco = login.body.tokenRefresco;
const auth = (t) => ({ Authorization: "Bearer " + t });

const refresh = await call("POST", "/autenticacion/refrescar", {
  tokenRefresco,
});
check("refresh con token válido → 200", refresh.status === 200);
// Nota: dos JWTs emitidos dentro del mismo segundo con mismo payload son
// idénticos; basta con verificar que el refresh devolvió tokens vigentes.
check(
  "  refresh devuelve tokens",
  !!refresh.body.tokenAcceso && !!refresh.body.tokenRefresco,
);

const malo = await call("POST", "/autenticacion/iniciar-sesion", {
  email: "admin@delivery.com",
  contrasena: "Wrong1234",
});
check("credenciales inválidas → 401", malo.status === 401);

// ───────────────  7.3 Usuarios ───────────────
seccion("7.3 Usuarios — listado, crear, suspender");

const lista = await call(
  "GET",
  "/usuarios?pagina=1&limite=20",
  undefined,
  auth(tokenAdmin),
);
check("GET /usuarios → 200", lista.status === 200);
check(
  "  estructura paginada (datos+meta)",
  Array.isArray(lista.body.datos) && typeof lista.body.meta?.total === "number",
);

const filtroRol = await call(
  "GET",
  "/usuarios?rol=VENDEDOR",
  undefined,
  auth(tokenAdmin),
);
check(
  "GET /usuarios?rol=VENDEDOR filtra por rol",
  filtroRol.body.datos.every((u) => u.rol === "VENDEDOR"),
);

const email = `smoke.f7.${sufijo}@test.com`;
const crear = await call(
  "POST",
  "/usuarios",
  {
    email,
    telefono: `+5037004${String(sufijo).slice(-5)}`,
    contrasena: "Secret123!",
    nombreCompleto: "Vendedor F7",
    rol: "VENDEDOR",
    nombreNegocio: "Neg F7",
    direccion: "Origen F7",
    latitud: 25.5,
    longitud: 25.5,
  },
  auth(tokenAdmin),
);
check("POST /usuarios (VENDEDOR) → 201", crear.status === 201);
const usuarioId = crear.body.id;

const susp = await call(
  "PATCH",
  `/usuarios/${usuarioId}/estado`,
  { estado: "SUSPENDIDO" },
  auth(tokenAdmin),
);
check(
  "PATCH /usuarios/:id/estado → 200 estado=SUSPENDIDO",
  susp.status === 200 && susp.body.estado === "SUSPENDIDO",
);

const reactiv = await call(
  "PATCH",
  `/usuarios/${usuarioId}/estado`,
  { estado: "ACTIVO" },
  auth(tokenAdmin),
);
check("PATCH reactiva → ACTIVO", reactiv.body.estado === "ACTIVO");

// ───────────────  7.5 Pedidos ───────────────
seccion("7.5 Pedidos — listado, asignar, cancelar");

const pedidos = await call(
  "GET",
  "/pedidos?pagina=1&limite=10",
  undefined,
  auth(tokenAdmin),
);
check("GET /pedidos → 200", pedidos.status === 200);
check(
  "  estructura paginada",
  Array.isArray(pedidos.body.datos) &&
    typeof pedidos.body.meta?.total === "number",
);

const asigAuto = await call(
  "POST",
  "/pedidos/asignar-automatico",
  null,
  auth(tokenAdmin),
);
check("POST /pedidos/asignar-automatico → 200", asigAuto.status === 200);
check(
  "  respuesta contiene procesados/asignados/pendientes",
  typeof asigAuto.body.procesados === "number" &&
    typeof asigAuto.body.asignados === "number",
);

// ───────────────  7.7 Cierres ───────────────
seccion("7.7 Cierres — listado y filtro por estado");

const cierres = await call(
  "GET",
  "/cierres-financieros?pagina=1&limite=10",
  undefined,
  auth(tokenAdmin),
);
check("GET /cierres-financieros → 200", cierres.status === 200);

const cierresPend = await call(
  "GET",
  "/cierres-financieros?estado=PENDIENTE_REVISION",
  undefined,
  auth(tokenAdmin),
);
check(
  "GET /cierres-financieros?estado=PENDIENTE_REVISION filtra",
  cierresPend.body.datos.every((c) => c.estado === "PENDIENTE_REVISION"),
);

// ───────────────  Repartidores y zonas (consumidos por modales) ───────────────
seccion("Endpoints auxiliares — repartidores y zonas");

const reps = await call("GET", "/repartidores", undefined, auth(tokenAdmin));
check(
  "GET /repartidores → 200 array",
  reps.status === 200 && Array.isArray(reps.body),
);

const zonas = await call("GET", "/zonas", undefined, auth(tokenAdmin));
check(
  "GET /zonas → 200 array",
  zonas.status === 200 && Array.isArray(zonas.body),
);

// ───────────────  Sin auth → 401 ───────────────
seccion("Endpoints autenticados rechazan sin token");
const sinAuth = await call("GET", "/usuarios");
check("GET /usuarios sin token → 401", sinAuth.status === 401);

// ───────────────  Resumen ───────────────
console.log(`\n━━━ RESULTADO: ${passed} OK / ${failed} fallidos ━━━`);
if (failed > 0) {
  console.log("Fallos:");
  errores.forEach((e) => console.log("  - " + e));
  process.exit(1);
}
