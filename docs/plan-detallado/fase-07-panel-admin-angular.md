# Fase 7 — Panel Admin (Angular)

> 📖 [← Volver al índice](../PLAN_DE_TAREAS_DETALLADO.md) · **Fase 7 de 10**

**Duración:** Semanas 10-11 · **Esfuerzo:** 14 p-d · **Entregable global:** Panel web completo para operar el negocio (usuarios, zonas, pedidos, cierres, paquetes, reportes).

---

### Tarea 7.1 — Scaffold Angular + Tailwind + Material

**Prioridad:** 🔴 P0 · **Estimación:** 0.5d · **Depende de:** 0.1, 0.4, 0.5

**Objetivo**
Crear el proyecto Angular 17+ con standalone components, configurar Tailwind CSS y Angular Material, dejando la estructura de carpetas lista para las features.

**Alcance**
- **Incluye:**
  - `ng new admin --standalone --routing --style=scss --strict --package-manager=yarn`.
  - Instalación y configuración de Tailwind + PostCSS.
  - `ng add @angular/material` con tema indigo/pink o tema corporativo.
  - Estructura de carpetas `app/{nucleo, compartido, layouts, caracteristicas, environments}`.
  - `environment.ts` con placeholders.
  - Scripts npm: `yarn start`, `yarn build`, `yarn lint`, `yarn test`.
- **Excluye:**
  - Autenticación → tarea 7.2.
  - Features → tareas 7.3–7.10.

**Subtareas**
1. Ejecutar `yarn dlx @angular/cli new admin --standalone --routing --style=scss --strict`.
2. Instalar Tailwind: `yarn add -D tailwindcss postcss autoprefixer`.
3. `tailwind.config.js` con content en `./src/**/*.{html,ts}`.
4. Añadir directivas Tailwind a `styles.scss`.
5. `yarn ng add @angular/material` con Angular Material + animations.
6. Crear estructura de carpetas y archivos `index.ts`.
7. Verificar build `yarn build` y dev server `yarn start`.

**Entregables**
- Proyecto Angular en `admin/`.
- Tailwind + Material integrados.
- Estructura de carpetas.

**Criterios de aceptación**
- [ ] `yarn start` sirve en http://localhost:4200 con página placeholder.
- [ ] Un componente con clases Tailwind aplica estilos.
- [ ] Un componente Material `<mat-button>` renderiza correctamente.

**Referencias**
- `docs/GUIA_ADMIN.md` § Stack y scaffold

---

### Tarea 7.2 — Login + guardia + interceptor HTTP

**Prioridad:** 🔴 P0 · **Estimación:** 1d · **Depende de:** 7.1, 1.3

**Objetivo**
Pantalla de login funcional que consume `/autenticacion/iniciar-sesion`, almacena tokens en localStorage, añade Bearer a todas las peticiones y protege rutas con guard.

**Alcance**
- **Incluye:**
  - `AutenticacionServicio` con `iniciarSesion`, `cerrarSesion`, `refrescar`, signal `usuarioActual`.
  - `autenticacion.interceptor.ts` que añade `Authorization: Bearer ...`.
  - `error.interceptor.ts` que hace refresh automático en 401.
  - `autenticacion.guardia.ts` (`CanActivateFn`).
  - `rol.guardia.ts` que solo permite `rol === 'ADMIN'`.
  - Pantalla `iniciar-sesion.component.ts` con form reactivo.
  - Registro de interceptores en `app.config.ts`.
- **Excluye:**
  - Olvidé contraseña → fase posterior.

**Subtareas**
1. Crear `nucleo/autenticacion/{autenticacion.servicio.ts, autenticacion.guardia.ts, rol.guardia.ts, autenticacion.interceptor.ts}`.
2. Crear `nucleo/http/error.interceptor.ts`.
3. Crear `caracteristicas/autenticacion/iniciar-sesion.component.ts`.
4. En `app.config.ts`, `provideHttpClient(withInterceptors([autenticacionInterceptor, errorInterceptor]))`.
5. En `app.rutas.ts`, rutas `/iniciar-sesion` (pública) y `/` (protegida con `canActivate: [autenticacionGuardia, rolGuardia]`).
6. Test unitario del servicio.

**Entregables**
- Servicios y guards listados.
- Pantalla login funcional.

**Criterios de aceptación**
- [ ] Login con admin válido redirige a `/tablero`.
- [ ] Login inválido muestra error amigable.
- [ ] Cualquier ruta protegida sin token redirige a `/iniciar-sesion`.
- [ ] Un usuario no-ADMIN con token válido recibe 403 lógico.

**Referencias**
- `docs/GUIA_ADMIN.md` § Autenticación e interceptores

---

### Tarea 7.3 — Módulo Usuarios (lista, crear, editar, suspender)

**Prioridad:** 🔴 P0 · **Estimación:** 2d · **Depende de:** 7.2, 1.6

**Objetivo**
CRUD visual de usuarios con filtros, paginación y modal de creación/edición; creación especial para repartidores con selector de zonas.

**Alcance**
- **Incluye:**
  - Pantalla `caracteristicas/usuarios/usuarios-listado.component.ts` con `mat-table` + filtros (rol, estado, búsqueda).
  - `usuario-formulario.component.ts` (modal) para crear/editar, con validaciones cliente.
  - Creación de repartidor con multi-select de zonas y marca de zona primaria.
  - Acciones: crear, editar, suspender (cambiar estado), eliminar (lógico).
  - `usuarios.servicio.ts` que encapsula llamadas a `/usuarios/*`.
- **Excluye:**
  - Importación masiva → post-MVP.

**Subtareas**
1. Crear servicios y modelos.
2. Pantalla lista con `TablaDatosComponent` (compartido; crear si no existe aquí).
3. Filtros con `mat-form-field` + debounce 300ms.
4. Modal con reactive forms.
5. Tests unitarios del servicio.

**Entregables**
- Pantallas y servicios listados.

**Criterios de aceptación**
- [ ] Lista pagina 20 por página y pagina correctamente.
- [ ] Crear repartidor con 3 zonas crea el usuario y las zonas asociadas.
- [ ] Suspender usuario cambia visualmente su chip de estado.

**Referencias**
- `docs/GUIA_ADMIN.md` § Usuarios
- `docs/API_ENDPOINTS.md` § `/usuarios`

---

### Tarea 7.4 — Módulo Zonas con editor de polígonos en Mapbox

**Prioridad:** 🔴 P0 · **Estimación:** 2.5d · **Depende de:** 7.3, 2.2

**Objetivo**
Pantalla con mapa Mapbox GL JS + Mapbox GL Draw donde el admin dibuja polígonos, los guarda como zonas y asigna repartidores.

**Alcance**
- **Incluye:**
  - Pantalla `zonas-listado.component.ts` con tabla + mapa de previsualización.
  - Pantalla `zona-editor.component.ts` con Mapbox GL Draw.
  - Conversión `[lng,lat][]` ↔ `{lat,lng}[]` al guardar/cargar.
  - Selector de `PuntoIntercambio` y asignación de repartidores.
  - `zonas.servicio.ts` envolviendo `/zonas/*`.
- **Excluye:**
  - Edición masiva → post-MVP.

**Subtareas**
1. Instalar `mapbox-gl` y `@mapbox/mapbox-gl-draw`.
2. Crear componente wrapper `vista-mapa` reutilizable.
3. En el editor, inicializar `MapboxDraw({ displayControlsDefault: false, controls: { polygon: true, trash: true }})`.
4. Escuchar eventos `draw.create, draw.update` para capturar polígono.
5. Guardar vía `zonasServicio.crear` o `actualizar`.
6. Pantalla listado con preview de polígonos en mapa (read-only).

**Entregables**
- Componentes listados.

**Criterios de aceptación**
- [ ] Dibujar un polígono de 4 puntos y guardar crea la zona.
- [ ] Editar la zona re-carga el polígono existente y permite modificarlo.
- [ ] Asignar repartidores con toggle de primario funciona.

**Referencias**
- `docs/GUIA_ADMIN.md` § Zonas
- `docs/INTEGRACION_MAPBOX.md` § Editor

---

### Tarea 7.5 — Módulo Pedidos (lista, detalle, filtros, asignar)

**Prioridad:** 🔴 P0 · **Estimación:** 2.5d · **Depende de:** 7.3, 3.2, 3.9

**Objetivo**
Visualizar pedidos con filtros avanzados, ver detalle con timeline y permitir asignar/reasignar repartidor desde UI.

**Alcance**
- **Incluye:**
  - Pantalla lista con filtros: estado (multiselect), zona, vendedor, repartidor, rango fechas, búsqueda por código.
  - Pantalla detalle con timeline (componente vertical con eventos), mapa con origen/destino/punto intercambio, comprobantes (imágenes).
  - Acción "Asignar automáticamente" (botón global) y "Asignar a rider específico" (dropdown por pedido).
  - Acción cancelar.
- **Excluye:**
  - Crear pedido desde admin → opcional.

**Subtareas**
1. Servicio `pedidos.servicio.ts`.
2. Componente listado con tabla.
3. Componente detalle con timeline.
4. Modal asignar con búsqueda de repartidores disponibles.
5. Visualización de fotos con `mat-dialog` ampliable.

**Entregables**
- Pantallas listadas.

**Criterios de aceptación**
- [ ] Filtro por estado ENTREGADO + rango fecha hoy retorna correctos.
- [ ] Asignación manual persiste y refresca la lista.

**Referencias**
- `docs/GUIA_ADMIN.md` § Pedidos

---

### Tarea 7.6 — Módulo Repartidores (lista + mapa en vivo)

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 7.3, 2.4

**Objetivo**
Listar repartidores con desempeño y mostrar en un mapa en tiempo real las ubicaciones actuales de los activos.

**Alcance**
- **Incluye:**
  - Pantalla lista con KPIs (totalEntregas, tasa éxito, calificación).
  - Pantalla mapa con markers actualizándose (polling 5s al endpoint `/repartidores` + lat/lng, o vía WebSocket si se decide implementarlo ahora).
- **Excluye:**
  - Histórico de rutas → post-MVP.

**Subtareas**
1. Servicio `repartidores.servicio.ts`.
2. Componente listado.
3. Componente mapa con Mapbox GL JS; agregar/actualizar markers por repartidor.
4. Polling cada 5s o suscripción WebSocket.

**Entregables**
- Pantallas.

**Criterios de aceptación**
- [ ] El mapa muestra los repartidores con posición reciente.
- [ ] Los markers se actualizan al cambiar la posición en backend.

**Referencias**
- `docs/GUIA_ADMIN.md` § Repartidores

---

### Tarea 7.7 — Módulo Cierres Financieros

**Prioridad:** 🔴 P0 · **Estimación:** 1.5d · **Depende de:** 7.3, 5.5

**Objetivo**
Pantallas para listar cierres con filtros, ver detalle con foto ampliable y aprobar/rechazar.

**Alcance**
- **Incluye:**
  - Lista con filtros (estado, repartidor, fecha).
  - Detalle con foto en modal (`mat-dialog` con zoom), botones Aprobar/Rechazar (modal con motivo).
  - Chip visual de discrepancia.
- **Excluye:**
  - Exportación → tarea 7.10.

**Subtareas**
1. Servicio.
2. Componentes lista + detalle.
3. Tests unitarios servicio.

**Entregables**
- Pantallas.

**Criterios de aceptación**
- [ ] Clic en foto abre modal con imagen a tamaño completo.
- [ ] Aprobar/rechazar refresca lista.

**Referencias**
- `docs/GUIA_ADMIN.md` § Cierres financieros

---

### Tarea 7.8 — Módulo Paquetes Prepago y Pricing

**Prioridad:** 🟠 P1 · **Estimación:** 1d · **Depende de:** 7.3, 4.2

**Objetivo**
Vista administrativa de paquetes comprados (por vendedor), y CRUD de `ReglaTarifa`.

**Alcance**
- **Incluye:**
  - Lista paquetes con filtros y estado.
  - CRUD de reglas de tarifa (POR_ENVIO, PAQUETE).
- **Excluye:**
  - Activar/desactivar reglas con workflow → opcional.

**Subtareas**
1. Servicio.
2. Componentes.

**Entregables**
- Pantallas.

**Criterios de aceptación**
- [ ] Crear nueva regla POR_ENVIO con precio 3.50.

**Referencias**
- `docs/GUIA_ADMIN.md` § Paquetes

---

### Tarea 7.9 — Dashboard con KPIs

**Prioridad:** 🟠 P1 · **Estimación:** 1.5d · **Depende de:** 7.3

**Objetivo**
Pantalla de inicio con indicadores clave y gráficos Chart.js.

**Alcance**
- **Incluye:**
  - KPIs: pedidos hoy/semana/mes, entregados vs fallidos, ingresos, repartidores activos, top zona.
  - Gráficos: barras por día, pie por estado, línea por semana.
- **Excluye:**
  - Filtros por periodo → fase posterior (default últimos 30 días).

**Subtareas**
1. `dashboard.componente.ts` con grid responsive.
2. Consumir `/reportes/resumen-pedidos` con `agruparPor=dia`.
3. Integrar Chart.js.

**Entregables**
- Pantalla dashboard.

**Criterios de aceptación**
- [ ] Números coinciden con consultas directas a BD.

**Referencias**
- `docs/GUIA_ADMIN.md` § Dashboard

---

### Tarea 7.10 — Reportes exportables (CSV/XLSX)

**Prioridad:** 🟡 P2 · **Estimación:** 1d · **Depende de:** 7.7, 7.8

**Objetivo**
Permitir exportar listados (pedidos, cierres, paquetes) en CSV/XLSX desde el admin.

**Alcance**
- **Incluye:**
  - Uso de `xlsx` (SheetJS) en el navegador.
  - Botón "Exportar" en cada listado principal.
  - Formato CSV plano o XLSX con sheets.
- **Excluye:**
  - Generación server-side → el backend expone `/reportes/exportar` si el dataset es grande; por ahora cliente-side basta.

**Subtareas**
1. `yarn add xlsx`.
2. Util `exportarCsv(data, columnas, nombreArchivo)`.
3. Util `exportarXlsx`.
4. Integrar en pedidos, cierres, paquetes.

**Entregables**
- Util de exportación.

**Criterios de aceptación**
- [ ] Descargar CSV de pedidos con todos los campos relevantes.

**Referencias**
- `docs/GUIA_ADMIN.md` § Reportes

---

**Navegación:** [← Fase 6 — Notificaciones](./fase-06-notificaciones.md) · [Índice](../PLAN_DE_TAREAS_DETALLADO.md) · [Fase 8 — App Repartidor (Flutter) →](./fase-08-app-repartidor-flutter.md)
