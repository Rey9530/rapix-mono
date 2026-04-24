# Fase 5 — Cierre Financiero Diario

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 5 de 10**

**Duración:** Semana 8 · **Esfuerzo:** 5 p-d · **Entregable global:** Ciclo de cierre financiero diario funcionando end-to-end: repartidor ve resumen, sube monto + foto, admin aprueba/rechaza.

---

### Tarea 5.1 — Schema Prisma: CierreFinanciero, CierreFinancieroPedido

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 3.1

**Objetivo**
Modelar el cierre diario del repartidor y la relación N:M con los pedidos contra-entrega incluidos en ese cierre.

**Alcance**
- **Incluye:**
  - Enum `EstadoCierreFinanciero { PENDIENTE_REVISION, APROBADO, RECHAZADO, CON_DISCREPANCIA }`.
  - Modelo `CierreFinanciero { id, repartidorId (FK), fechaCierre (Date), montoEsperado (Decimal), montoReportado (Decimal), diferencia (Decimal), urlComprobanteFoto, notas?, estado, revisadoPor?, revisadoEn?, creadoEn, actualizadoEn }`.
  - Índice único `@@unique([repartidorId, fechaCierre])` para garantizar un cierre por día.
  - Índice `(fechaCierre, estado)`.
  - Modelo `CierreFinancieroPedido (cierreId, pedidoId, monto)` con PK compuesta.
- **Excluye:**
  - Informes consolidados → roadmap post-MVP.

**Subtareas**
1. Añadir enum y modelos.
2. `@@unique([repartidorId, fechaCierre])`.
3. Migración y generate.

**Entregables**
- Schema + migración `fase-5-cierres`.

**Criterios de aceptación**
- [ ] Intentar insertar 2 cierres con mismo `repartidorId + fechaCierre` viola el unique constraint.

**Referencias**
- `docs/BASE_DE_DATOS.md` § Cierres financieros

---

### Tarea 5.2 — Endpoint resumen del día (monto esperado)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 5.1, 3.6

**Objetivo**
`GET /cierres-financieros/yo/hoy` retorna al repartidor: suma esperada de `montoContraEntrega` de pedidos `ENTREGADO` hoy por él, lista de esos pedidos, cantidad total.

**Alcance**
- **Incluye:**
  - Endpoint (REPARTIDOR).
  - DTO `ResumenCierreDto`.
  - Lógica: `SUM(montoContraEntrega) WHERE repartidorEntregaId = yo AND estado = ENTREGADO AND entregadoEn::date = now()::date AND metodoPago = 'CONTRA_ENTREGA'`.
- **Excluye:**
  - Crear cierre → tarea 5.3.

**Subtareas**
1. Crear módulo `cierres-financieros/`.
2. Implementar `obtenerResumenHoy(repartidorId)`.
3. Endpoint con guard REPARTIDOR.

**Entregables**
- Endpoint y DTO.

**Criterios de aceptación**
- [ ] Retorna `montoEsperado = suma de montoContraEntrega de pedidos ENTREGADO hoy`.
- [ ] Incluye arreglo de pedidos con `id, codigoSeguimiento, montoContraEntrega, entregadoEn`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Cierre financiero

---

### Tarea 5.3 — Endpoint crear cierre (con foto)

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 5.2, 3.7

**Objetivo**
Permitir al repartidor enviar su cierre del día con monto reportado y foto del comprobante, creando `CierreFinanciero` y `CierreFinancieroPedido[]` en transacción.

**Alcance**
- **Incluye:**
  - `POST /cierres-financieros` (REPARTIDOR), multipart con `comprobanteFoto`.
  - DTO `CrearCierreDto { montoReportado, notas? }`.
  - Transacción: calcular `montoEsperado` (igual que 5.2), subir foto a MinIO, crear `CierreFinanciero`, crear filas en `CierreFinancieroPedido`.
  - Aplicar unique constraint → 409 si ya existe.
- **Excluye:**
  - Aprobación/rechazo → tareas 5.4/5.5.

**Subtareas**
1. Implementar `crear(repartidorId, dto, foto)` en servicio.
2. Validar que no existe cierre del día (409 `CIERRE_YA_EXISTE`).
3. Subir foto con `ArchivosServicio.subir`.
4. Transacción Prisma.
5. Test e2e.

**Entregables**
- Endpoint.

**Criterios de aceptación**
- [ ] Crear sin foto → 400.
- [ ] Crear dos cierres mismo día → segundo 409.
- [ ] Fila en `cierres_financieros_pedidos` por cada pedido contra-entrega del día.

**Referencias**
- `docs/API_ENDPOINTS.md` § `/cierres-financieros`

---

### Tarea 5.4 — Cálculo automático de diferencia y estado inicial

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 5.3

**Objetivo**
Al crear el cierre, calcular `diferencia = montoReportado - montoEsperado` y decidir estado inicial: si `diferencia == 0` → `PENDIENTE_REVISION`; si diferente → `CON_DISCREPANCIA`.

**Alcance**
- **Incluye:**
  - Lógica integrada en `crear` (5.3).
  - Evento `cierre.enviado` (para notificar admin en fase 6).
- **Excluye:**
  - UI admin → fase 7.

**Subtareas**
1. Añadir `diferencia` y `estado` al objeto antes del insert.
2. Emitir `cierre.enviado` con flag `conDiscrepancia`.

**Entregables**
- Lógica de cálculo.

**Criterios de aceptación**
- [ ] montoReportado 100 / esperado 100 → `PENDIENTE_REVISION`.
- [ ] montoReportado 80 / esperado 100 → `CON_DISCREPANCIA, diferencia = -20`.

**Referencias**
- `docs/FLUJOS_DE_TRABAJO.md` § Cierre

---

### Tarea 5.5 — Endpoints admin: aprobar / rechazar

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 5.3

**Objetivo**
Admin puede listar cierres pendientes, ver detalle con foto ampliable (desde el admin UI) y aprobar o rechazar con motivo.

**Alcance**
- **Incluye:**
  - `GET /cierres-financieros` (ADMIN) paginado con filtros `estado, desde, hasta, repartidorId`.
  - `GET /cierres-financieros/:id` (ADMIN | REPARTIDOR si es suyo).
  - `POST /cierres-financieros/:id/aprobar` (ADMIN).
  - `POST /cierres-financieros/:id/rechazar` (ADMIN) con motivo.
  - Emite eventos `cierre.aprobado`, `cierre.rechazado`.
- **Excluye:**
  - UI → fase 7.

**Subtareas**
1. Endpoints y lógica en servicio.
2. Solo transiciones válidas: `PENDIENTE_REVISION|CON_DISCREPANCIA → APROBADO|RECHAZADO`.
3. Guardar `revisadoPor` y `revisadoEn`.

**Entregables**
- 4 endpoints.

**Criterios de aceptación**
- [ ] Aprobar un cierre `APROBADO` no permitido → 409.
- [ ] Rechazar sin motivo → 400.

**Referencias**
- `docs/API_ENDPOINTS.md` § Cierres

---

### Tarea 5.6 — Validación: un cierre por rider por día

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 5.3

**Objetivo**
Además del unique constraint en BD (5.1), añadir validación en el servicio con mensaje claro y tests exhaustivos.

**Alcance**
- **Incluye:**
  - Revisión previa al insert en `crear`.
  - Excepción `CIERRE_YA_EXISTE` (409) con mensaje usuario.
- **Excluye:**
  - Corrección de cierre rechazado → tarea futura (el rider puede re-enviar).

**Subtareas**
1. Query `findUnique` antes del insert.
2. Tests.

**Entregables**
- Validación en servicio.

**Criterios de aceptación**
- [ ] Mensaje al usuario claro en español: "Ya existe un cierre para hoy".

**Referencias**
- `docs/BASE_DE_DATOS.md` § Cierres (unique)

---

### Tarea 5.7 — Audit log de aprobaciones

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 5.5

**Objetivo**
Registrar cada aprobación/rechazo en `RegistroAuditoria` para trazabilidad.

**Alcance**
- **Incluye:**
  - Modelo `RegistroAuditoria` en schema (si no estaba; añadir ahora — independiente o en un schema pass).
  - Servicio `AuditoriaServicio.registrar(usuarioId, accion, tipoEntidad, entidadId, metadatos)`.
  - Llamadas desde `aprobar` y `rechazar`.
- **Excluye:**
  - Dashboard de auditoría → fase posterior.

**Subtareas**
1. Añadir modelo `RegistroAuditoria` si falta (check schema).
2. Crear `AuditoriaServicio` global.
3. Integrar llamadas en aprobar/rechazar.

**Entregables**
- `AuditoriaServicio` + filas.

**Criterios de aceptación**
- [ ] Aprobar un cierre crea fila en `registros_auditoria` con `accion = 'CIERRE_APROBADO'`.

**Referencias**
- `docs/BASE_DE_DATOS.md` § Registros de auditoría

---

**Navegación:** [← Fase 4 — Paquetes Prepago y Pricing](./fase-04-paquetes-prepago-pricing.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 6 — Notificaciones →](./fase-06-notificaciones.md)
