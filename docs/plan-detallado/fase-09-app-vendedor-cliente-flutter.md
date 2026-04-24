# Fase 9 — App Vendedor/Cliente (Flutter)

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 9 de 10**

**Duración:** Semana 13 · **Esfuerzo:** 8 p-d · **Entregable global:** Vendedor opera desde móvil (crear pedido, ver estado, comprar paquetes); cliente final accede a seguimiento público por código.

---

### Tarea 9.1 — Registro e inicio de sesión

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 0.1, 1.3

**Objetivo**
Pantallas de registro (vendedor con selector de ubicación tienda) y login; guardar tokens.

**Alcance**
- **Incluye:**
  - Scaffold similar a 8.1 pero en `app-cliente/`.
  - `caracteristicas/autenticacion/{iniciar_sesion,registrar}_pantalla.dart`.
  - `SelectorUbicacionPantalla` reutilizable (también la usa 9.2).
  - POST `/autenticacion/registrar` con `rol: 'VENDEDOR'`.
- **Excluye:**
  - Flujo para `CLIENTE` como usuario activo → MVP usa seguimiento público (9.7).

**Subtareas**
1. Crear proyecto Flutter `app-cliente/` con mismas deps que 8.1 (sin `flutter_background_geolocation`, `signature`).
2. Implementar los interceptores HTTP iguales que en rider.
3. Pantalla registrar con form y ubicación tienda.
4. Pantalla login.
5. Controladores Riverpod.

**Entregables**
- Scaffold `app-cliente/` + auth.

**Criterios de aceptación**
- [ ] Registrar vendedor crea Usuario + PerfilVendedor con coordenadas.
- [ ] Login retiene sesión tras reiniciar app.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Autenticación

---

### Tarea 9.2 — Crear pedido con selector de ubicación en mapa

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 9.1, 3.2

**Objetivo**
Pantalla `crear_pedido_pantalla.dart` con form completo y selector de ubicación para el destino del paquete.

**Alcance**
- **Incluye:**
  - Form con datos del cliente, descripción paquete, método pago (CONTRA_ENTREGA / PREPAGADO), monto contra entrega.
  - `SelectorUbicacionPantalla` con `MapWidget` y pin central.
  - POST `/pedidos`.
  - Navegación al detalle tras crear.
- **Excluye:**
  - Plantillas de pedidos recurrentes → post-MVP.

**Subtareas**
1. Pantalla form con validaciones.
2. Selector ubicación (mapa con pin central fijo, callback con coords al confirmar).
3. `PedidosRepositorio.crear`.
4. Manejo de error `PEDIDO_ZONA_INVALIDA`.

**Entregables**
- Pantallas.

**Criterios de aceptación**
- [ ] Crear pedido con destino fuera de zona muestra error amigable.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Crear pedido

---

### Tarea 9.3 — Listado de pedidos con estado

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 9.2

**Objetivo**
Listar los pedidos del vendedor autenticado con filtros y pull-to-refresh.

**Alcance**
- **Incluye:**
  - `pedidos_listado_pantalla.dart`.
  - Chip de estado colorizado.
  - Filtros simples (estado, rango fechas).
- **Excluye:**
  - Búsqueda avanzada → post-MVP.

**Subtareas**
1. Provider `misPedidosProvider`.
2. Componente `PedidoTarjeta`.
3. FAB para crear nuevo pedido.

**Entregables**
- Pantalla.

**Criterios de aceptación**
- [ ] Lista ordenada por `creadoEn desc`.
- [ ] Pull-to-refresh refetch.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Listado

---

### Tarea 9.4 — Detalle con tracking en vivo

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 9.3, 3.8

**Objetivo**
Pantalla detalle con timeline de eventos y mapa con posición del repartidor actualizándose.

**Alcance**
- **Incluye:**
  - `pedido_detalle_pantalla.dart`.
  - Componente `LineaTiempoEstado`.
  - Mapa pequeño con posición rider (polling cada 10s al endpoint público de tracking o al detalle).
- **Excluye:**
  - WebSockets → usa polling por simplicidad.

**Subtareas**
1. Provider `pedidoDetalleProvider(id)`.
2. Timeline componente.
3. Mapa con actualización polling.

**Entregables**
- Pantalla.

**Criterios de aceptación**
- [ ] Estado ENTREGADO muestra la foto del comprobante.
- [ ] Estado EN_REPARTO muestra mapa con marker del rider.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Detalle

---

### Tarea 9.5 — Comprar paquete prepago

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 9.1, 4.2

**Objetivo**
Catálogo de paquetes disponibles y flujo de compra.

**Alcance**
- **Incluye:**
  - `paquetes_tienda_pantalla.dart` con cards.
  - Flujo compra con confirmación.
  - Post `/paquetes-recargados/comprar`.
- **Excluye:**
  - Pasarela de pago real → post-MVP; por ahora `metodoPago: TRANSFERENCIA` y admin aprueba.

**Subtareas**
1. `PaquetesRepositorio.disponibles` y `.comprar`.
2. Pantalla.

**Entregables**
- Pantalla.

**Criterios de aceptación**
- [ ] Comprar paquete aparece en "Mis paquetes".

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Paquetes

---

### Tarea 9.6 — Ver saldo y consumo

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 9.5

**Objetivo**
Widget `saldo_widget.dart` en home y pantalla `mis_paquetes` con detalle.

**Alcance**
- **Incluye:**
  - Widget de saldo con color según nivel.
  - Pantalla mis paquetes con lista y estado.
- **Excluye:**
  - Gráfico de consumo → post-MVP.

**Subtareas**
1. `saldoProvider` que consume `/paquetes-recargados/yo/saldo`.
2. Widget reutilizable.

**Entregables**
- Widget y pantalla.

**Criterios de aceptación**
- [ ] Saldo se actualiza tras crear un pedido (invalidar provider).

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Saldo

---

### Tarea 9.7 — Notificaciones push

**Prioridad:** 🟠 P1 · **Estimación:** 0.5d · **Depende de:** 9.1, 6.3, 6.7

**Objetivo**
Registrar token FCM y mostrar notificaciones (cambios de estado, saldo bajo, paquete agotado).

**Alcance**
- **Incluye:**
  - Config similar a 8.9.
  - Handler que invalida `pedidoDetalleProvider` al recibir notificación con `pedidoId`.
- **Excluye:**
  - Topics → post-MVP.

**Subtareas**
Idéntico a 8.9 adaptado a app cliente.

**Entregables**
- Servicio push.

**Criterios de aceptación**
- [ ] Push con `pedidoId` refresca detalle abierto automáticamente.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Push

---

### Tarea 9.8 — Historial / reportes propios

**Prioridad:** 🟡 P2 · **Estimación:** 1d · **Depende de:** 9.3

**Objetivo**
Pantalla con resumen de pedidos por periodo (día/semana/mes), conteos por estado y gastos.

**Alcance**
- **Incluye:**
  - Consumir `/reportes/resumen-pedidos?vendedorId=yo`.
  - Gráficos simples (fl_chart).
- **Excluye:**
  - Exportación → post-MVP.

**Subtareas**
1. Pantalla.
2. Charts.

**Entregables**
- Pantalla.

**Criterios de aceptación**
- [ ] Filtrar por mes muestra conteos correctos.

**Referencias**
- `docs/GUIA_APP_CLIENTES.md` § Historial

---

**Navegación:** [← Fase 8 — App Repartidor (Flutter)](./fase-08-app-repartidor-flutter.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 10 — Hardening y Producción →](./fase-10-hardening-produccion.md)
