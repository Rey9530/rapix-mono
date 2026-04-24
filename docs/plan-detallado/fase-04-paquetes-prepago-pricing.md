# Fase 4 — Paquetes Prepago y Pricing

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 4 de 10**

**Duración:** Semana 7 · **Esfuerzo:** 4 p-d · **Entregable global:** Vendedores pueden comprar paquetes prepago y el sistema descuenta automáticamente al crear pedidos.

---

### Tarea 4.1 — Schema Prisma: PaqueteRecargado, ReglaTarifa

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 3.1

**Objetivo**
Modelar los paquetes prepago comprados por vendedores y las reglas de tarifa que definen precio por envío y catálogo de paquetes.

**Alcance**
- **Incluye:**
  - Enum `EstadoPaquete { ACTIVO, AGOTADO, EXPIRADO, CANCELADO }`.
  - Enum `ModoFacturacion { POR_ENVIO, PAQUETE }`.
  - Modelo `ReglaTarifa` con `nombre, modoFacturacion, precioPorEnvio?, tamanoPaquete?, precioPaquete?, activa, validaDesde, validaHasta?`.
  - Modelo `PaqueteRecargado` con `vendedorId (FK), reglaTarifaId (FK), nombre, enviosTotales, enviosRestantes, precio, estado, compradoEn, expiraEn?`.
  - Índices `(vendedorId, estado)`.
  - Cierre de la FK opcional `Pedido.paqueteRecargadoId` hacia `PaqueteRecargado` (declarada en 3.1 como stub).
- **Excluye:**
  - Facturas/recibos PDF → fuera de MVP.

**Subtareas**
1. Añadir enums y modelos al schema.
2. Completar la relación `Pedido.paqueteRecargado`.
3. Migración: `yarn prisma migrate dev --name fase-4-paquetes`.
4. Regenerar cliente.

**Entregables**
- Schema actualizado.
- Migración `fase-4-paquetes`.

**Criterios de aceptación**
- [ ] Tablas `reglas_tarifa`, `paquetes_recargados` existen.
- [ ] `PaqueteRecargado.enviosRestantes` default = `enviosTotales` (via lógica del servicio).

**Referencias**
- `docs/BASE_DE_DATOS.md` § Paquetes y tarifas

---

### Tarea 4.2 — Módulo `paquetes-recargados`: compra, balance, historial

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 4.1

**Objetivo**
Permitir al vendedor ver el catálogo, comprar un paquete, consultar su saldo y admin gestionar paquetes.

**Alcance**
- **Incluye:**
  - `GET /api/v1/paquetes-recargados/disponibles` (Autenticado): lista `ReglaTarifa` activas con `modoFacturacion = PAQUETE`.
  - `POST /api/v1/paquetes-recargados/comprar` (VENDEDOR): crea `PaqueteRecargado` con `enviosRestantes = enviosTotales`, estado `ACTIVO` (o `PENDIENTE_PAGO` si `metodoPago = TRANSFERENCIA`, admin aprueba luego).
  - `GET /api/v1/paquetes-recargados/yo` (VENDEDOR).
  - `GET /api/v1/paquetes-recargados/yo/saldo` (VENDEDOR): suma `enviosRestantes` de paquetes ACTIVO.
  - `GET /api/v1/paquetes-recargados` (ADMIN): con filtros.
  - `PATCH /api/v1/paquetes-recargados/:id` (ADMIN): cambiar estado (confirmar pago, cancelar).
  - DTOs: `ComprarPaqueteDto`, `ActualizarPaqueteDto`.
  - Evento `paquete.comprado`.
- **Excluye:**
  - Pasarela de pagos → roadmap post-MVP.

**Subtareas**
1. Crear módulo, controlador, servicio, DTOs.
2. `comprar(vendedorId, dto)`: busca `ReglaTarifa`, crea `PaqueteRecargado` con defaults.
3. `saldo(vendedorId)`: `SELECT sum(enviosRestantes) FROM paquetes_recargados WHERE vendedorId = $1 AND estado = 'ACTIVO'`.
4. `listarYo(vendedorId)` paginado.
5. `cambiarEstado(id, dto)` admin.
6. Tests unitarios.

**Entregables**
- Módulo completo.
- 6 endpoints.

**Criterios de aceptación**
- [ ] Comprar paquete crea fila con `enviosRestantes == enviosTotales`.
- [ ] `GET /yo/saldo` refleja correctamente tras comprar.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/paquetes-recargados`

---

### Tarea 4.3 — Lógica de `resolveBilling` al crear pedido

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 4.2, 3.2

**Objetivo**
Determinar, en el momento de crear un pedido, si se facturará vía paquete prepago (descontando un envío) o por envío individual (cobrando al vendedor según `ReglaTarifa` activa POR_ENVIO).

**Descripción detallada**
Función `resolveBilling(vendedorId): Promise<{ modoFacturacion, costoEnvio, paqueteRecargadoId? }>` que:
1. Busca paquete ACTIVO con `enviosRestantes > 0` del vendedor, ordenado `compradoEn asc` (FIFO).
2. Si existe → `modoFacturacion = PAQUETE, costoEnvio = 0, paqueteRecargadoId = paquete.id`.
3. Si no → `modoFacturacion = POR_ENVIO, costoEnvio = reglaPorEnvioActiva.precioPorEnvio` (típicamente $3).

**Alcance**
- **Incluye:**
  - Servicio `FacturacionServicio.resolveBilling(vendedorId)`.
  - Integración dentro de `PedidosServicio.crear`.
- **Excluye:**
  - Reserva de envío (no se descuenta aquí; se descuenta en 4.4 dentro de la transacción).

**Subtareas**
1. Crear `src/modulos/paquetes-recargados/facturacion.servicio.ts` y exportarlo.
2. Implementar lógica descrita.
3. Integrar en `PedidosServicio.crear` antes del `INSERT` al pedido.
4. Tests unitarios con 3 escenarios (con paquete, sin paquete, con paquete agotado).

**Entregables**
- `facturacion.servicio.ts`.
- Integración en `PedidosServicio`.

**Criterios de aceptación**
- [ ] Vendedor con paquete activo de 100 crea pedido → `modoFacturacion = PAQUETE, costoEnvio = 0`.
- [ ] Vendedor sin paquete crea pedido → `modoFacturacion = POR_ENVIO, costoEnvio = 3.00`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Facturación

---

### Tarea 4.4 — Descuento automático al crear pedido (transacción)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 4.3

**Objetivo**
Al crear un pedido que use un paquete, decrementar `enviosRestantes` en la misma transacción que persiste el pedido, y marcar el paquete `AGOTADO` si llega a 0.

**Descripción detallada**
Dentro de `PedidosServicio.crear`, si `resolveBilling` retornó un `paqueteRecargadoId`, en la misma `prisma.$transaction([...])` se incluye un `prisma.paqueteRecargado.update` con `enviosRestantes: { decrement: 1 }`. Si `enviosRestantes` queda en 0, en un paso posterior se cambia `estado` a `AGOTADO`. Para evitar que dos pedidos concurrentes descuenten del mismo paquete cuando queda 1, se usa `SELECT ... FOR UPDATE` (Prisma lo expresa via raw SQL o via `isolationLevel: 'Serializable'` + `interactiveTransactions`).

**Alcance**
- **Incluye:**
  - Decremento transaccional.
  - Lógica de `AGOTADO` cuando llega a 0.
  - Bloqueo pesimista para evitar race en el último envío.
  - Evento `paquete.agotado` si aplica.
- **Excluye:**
  - Aviso de saldo bajo (<10) → tarea 4.6 lo cubre.

**Subtareas**
1. Refactorizar `PedidosServicio.crear` para usar `prisma.$transaction(async (tx) => {...})`.
2. Dentro de la transacción, si hay paquete: `SELECT ... FROM paquetes_recargados WHERE id = $1 FOR UPDATE` (raw) o usar `tx.paqueteRecargado.update` con `where: { id, enviosRestantes: { gt: 0 } }` y verificar el count.
3. Si el update afecta 0 filas, lanzar `PaqueteAgotadoException` y abortar.
4. Después del decremento, si `enviosRestantes === 0`, update adicional a `estado = AGOTADO`.
5. Fuera de la transacción, si agotado → emitir evento `paquete.agotado`.
6. Test e2e: dos peticiones concurrentes al último envío, solo una tiene éxito.

**Entregables**
- Lógica transaccional en `PedidosServicio.crear`.
- Excepción `PaqueteAgotadoException`.

**Criterios de aceptación**
- [ ] Crear pedido con paquete de 1 envío restante decrementa a 0 y marca `AGOTADO`.
- [ ] Dos requests concurrentes sobre paquete con `enviosRestantes = 1`: uno tiene éxito, el otro retorna 409 con `PaqueteAgotadoException`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Facturación
- `docs/ARQUITECTURA.md` § Consistencia transaccional

---

### Tarea 4.5 — Expiración de paquetes (job diario)

**Prioridad:** 🟡 P2 · **Estimación:** 0.5d · **Depende de:** 4.2

**Objetivo**
Job programado que a las 03:00 AM cada día marca como `EXPIRADO` todos los paquetes `ACTIVO` con `expiraEn < now()`.

**Alcance**
- **Incluye:**
  - `@nestjs/schedule` con `@Cron('0 3 * * *')`.
  - Servicio `PaquetesCronServicio.expirarPaquetes`.
  - Log estructurado del conteo procesado.
- **Excluye:**
  - Job de saldo bajo → tarea 4.6.

**Subtareas**
1. `yarn add @nestjs/schedule`.
2. Registrar `ScheduleModule.forRoot()` en `AppModule`.
3. Crear `paquetes-cron.servicio.ts` con método `@Cron('0 3 * * *') expirarPaquetes()`.
4. Implementar `UPDATE paquetes_recargados SET estado = 'EXPIRADO' WHERE estado = 'ACTIVO' AND expiraEn < now()`.
5. Log con Pino: `{ expirados: N }`.

**Entregables**
- `paquetes-cron.servicio.ts`.
- ScheduleModule registrado.

**Criterios de aceptación**
- [ ] Paquete con `expiraEn = now() - 1 día` queda `EXPIRADO` tras ejecutar el job manualmente en tests.

**Referencias**
- `docs/GUIA_BACKEND.md` § Jobs programados

---

### Tarea 4.6 — Reporte de consumo de paquetes

**Prioridad:** 🟡 P2 · **Estimación:** 0.5d · **Depende de:** 4.2

**Objetivo**
Endpoint admin que agrega consumo de paquetes por vendedor y periodo, útil para el dashboard y exportación.

**Alcance**
- **Incluye:**
  - `GET /api/v1/reportes/consumo-paquetes?desde=&hasta=&vendedorId?=`.
  - Respuesta: `[{vendedorId, nombreNegocio, paquetesComprados, enviosTotales, enviosConsumidos, enviosRestantes, gastoTotal}]`.
- **Excluye:**
  - Exportación CSV/XLSX → tarea 7.10 del admin (reusará este endpoint).

**Subtareas**
1. Añadir endpoint al módulo `reportes` (si no existe, crearlo básico aquí).
2. Query con `GROUP BY vendedorId`.
3. Test e2e con 2 vendedores.

**Entregables**
- Endpoint `/reportes/consumo-paquetes`.

**Criterios de aceptación**
- [ ] Vendedor con 2 paquetes de 100 ($250) y 47 consumidos retorna `{enviosTotales:200, enviosConsumidos:47, enviosRestantes:153, gastoTotal:500}`.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/reportes`

---

**Navegación:** [← Fase 3 — Pedidos y Máquina de Estados](./fase-03-pedidos-maquina-estados.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 5 — Cierre Financiero Diario →](./fase-05-cierre-financiero-diario.md)
