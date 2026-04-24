# API Endpoints - Referencia REST

## 🌐 Información General

- **Base URL (dev)**: `http://localhost:3000/api/v1`
- **Base URL (prod)**: `https://api.delivery.com/v1`
- **Formato**: JSON
- **Autenticación**: `Authorization: Bearer <tokenAcceso>`
- **Versionado**: prefijo `/v1`
- **Rate Limiting**: 100 req/min por IP, 300 req/min por usuario autenticado.

## 📋 Convenciones

- Todos los identificadores (rutas, claves JSON) en **español, sin tildes** — coherente con el glosario maestro de `README.md`.
- Todos los timestamps en **ISO 8601 UTC**.
- IDs en formato **UUID v4**.
- Paginación: query params `?pagina=1&limite=20`.
- Filtros: query params explícitos (`?estado=ENTREGADO&desde=2025-01-01`).
- Respuestas de error con formato estándar:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "mensaje": "Descripción humana",
  "codigo": "PEDIDO_ZONA_INVALIDA",
  "timestamp": "2025-04-22T10:00:00Z",
  "ruta": "/api/v1/pedidos"
}
```

## 🔐 Autenticación

### `POST /autenticacion/registrar`
Registra un nuevo usuario (vendedor/cliente). Los repartidores y admins los crea un administrador.

**Request**:
```json
{
  "email": "vendedor@shop.com",
  "telefono": "+50255551234",
  "contrasena": "SecurePass123!",
  "nombreCompleto": "Juan Pérez",
  "rol": "VENDEDOR",
  "nombreNegocio": "Tienda Juan",
  "direccion": "Av. Siempre Viva 123",
  "latitud": 14.634915,
  "longitud": -90.506882
}
```

**Response** `201`:
```json
{
  "usuario": {
    "id": "uuid",
    "email": "vendedor@shop.com",
    "rol": "VENDEDOR",
    "estado": "PENDIENTE_VERIFICACION"
  },
  "tokenAcceso": "eyJhbG...",
  "tokenRefresco": "eyJhbG..."
}
```

### `POST /autenticacion/iniciar-sesion`
**Request**:
```json
{ "email": "vendedor@shop.com", "contrasena": "SecurePass123!" }
```

**Response** `200`:
```json
{
  "tokenAcceso": "eyJhbG...",
  "tokenRefresco": "eyJhbG...",
  "usuario": { "id": "uuid", "rol": "VENDEDOR", "nombreCompleto": "Juan Pérez" }
}
```

### `POST /autenticacion/refrescar`
```json
{ "tokenRefresco": "eyJhbG..." }
```

### `POST /autenticacion/cerrar-sesion`
Revoca el `tokenRefresco` actual.

### `POST /autenticacion/olvide-contrasena`
### `POST /autenticacion/restablecer-contrasena`

---

## 👥 Usuarios

### `GET /usuarios/yo` 🔒
Retorna el perfil del usuario autenticado.

### `PATCH /usuarios/yo` 🔒
Actualiza datos propios.

### `GET /usuarios` 🔒 `ADMIN`
Lista paginada con filtros: `?rol=REPARTIDOR&estado=ACTIVO&busqueda=juan`.

### `POST /usuarios` 🔒 `ADMIN`
Crea un usuario (típicamente repartidores o admins).

**Request (Repartidor)**:
```json
{
  "email": "repartidor1@delivery.com",
  "telefono": "+50255559999",
  "contrasena": "Rider123!",
  "nombreCompleto": "Carlos López",
  "rol": "REPARTIDOR",
  "tipoVehiculo": "MOTO",
  "placa": "P-123ABC",
  "documentoIdentidad": "1234567890101",
  "zonaIds": ["uuid-zona-a", "uuid-zona-b"]
}
```

### `GET /usuarios/:id` 🔒 `ADMIN`
### `PATCH /usuarios/:id` 🔒 `ADMIN`
### `DELETE /usuarios/:id` 🔒 `ADMIN` (borrado lógico → estado `INACTIVO`)
### `PATCH /usuarios/:id/estado` 🔒 `ADMIN`
```json
{ "estado": "SUSPENDIDO", "motivo": "Incumplimiento" }
```

---

## 🗺️ Zonas

### `GET /zonas` 🔒
Lista todas las zonas activas.

**Response**:
```json
[
  {
    "id": "uuid",
    "codigo": "A",
    "nombre": "Zona Norte",
    "poligono": [
      {"lat": 14.65, "lng": -90.51},
      {"lat": 14.67, "lng": -90.51},
      {"lat": 14.67, "lng": -90.49},
      {"lat": 14.65, "lng": -90.49}
    ],
    "latitudCentro": 14.66,
    "longitudCentro": -90.50,
    "puntoIntercambio": { "id": "uuid", "nombre": "Central Norte" },
    "cantidadRepartidores": 5
  }
]
```

### `POST /zonas` 🔒 `ADMIN`
```json
{
  "codigo": "D",
  "nombre": "Zona Sur",
  "poligono": [{"lat": 14.6, "lng": -90.5}, "..."],
  "puntoIntercambioId": "uuid"
}
```

### `GET /zonas/:id` 🔒
### `PATCH /zonas/:id` 🔒 `ADMIN`
### `DELETE /zonas/:id` 🔒 `ADMIN`

### `POST /zonas/:id/repartidores` 🔒 `ADMIN`
Asigna repartidores a una zona.
```json
{ "repartidorIds": ["uuid1", "uuid2"], "repartidorPrimarioId": "uuid1" }
```

### `GET /zonas/resolver?lat=14.63&lng=-90.51` 🔒
Dado un punto, retorna la zona que lo contiene (vía `ST_Contains` PostGIS).

---

## 📦 Pedidos

### `POST /pedidos` 🔒 `VENDEDOR`
Crear un pedido.

**Request**:
```json
{
  "nombreCliente": "María Gómez",
  "telefonoCliente": "+50277778888",
  "emailCliente": "maria@mail.com",
  "direccionOrigen": "Mi Tienda, Zona 10",
  "latitudOrigen": 14.6089,
  "longitudOrigen": -90.5132,
  "direccionDestino": "Calle 5, Zona 14",
  "latitudDestino": 14.5923,
  "longitudDestino": -90.5044,
  "notasDestino": "Casa color azul, timbre",
  "descripcionPaquete": "Ropa de mujer talla M",
  "pesoPaqueteKg": 1.5,
  "valorDeclarado": 50.00,
  "metodoPago": "CONTRA_ENTREGA",
  "montoContraEntrega": 150.00,
  "programadoPara": "2025-04-23T09:00:00Z"
}
```

**Response** `201`:
```json
{
  "id": "uuid",
  "codigoSeguimiento": "DEL-2025-00342",
  "estado": "PENDIENTE_ASIGNACION",
  "modoFacturacion": "PAQUETE",
  "costoEnvio": 0,
  "zonaOrigen": { "codigo": "A" },
  "zonaDestino": { "codigo": "C" },
  "creadoEn": "2025-04-22T10:12:00Z"
}
```

### `GET /pedidos` 🔒
Lista con filtros: `?estado=ENTREGADO&zonaId=...&desde=...&hasta=...&vendedorId=...&repartidorId=...`

**Respuesta paginada**:
```json
{
  "datos": [ { "...": "Pedido" } ],
  "meta": { "pagina": 1, "limite": 20, "total": 342, "totalPaginas": 18 }
}
```

### `GET /pedidos/:id` 🔒
Retorna detalle con `eventos` (timeline) y `comprobantes`.

### `GET /pedidos/seguimiento/:codigoSeguimiento`
**Público** (sin auth) — para que el cliente final consulte su pedido.

### `PATCH /pedidos/:id` 🔒 `VENDEDOR` o `ADMIN` (antes de asignación)

### `POST /pedidos/:id/cancelar` 🔒
```json
{ "motivo": "Cliente canceló por teléfono" }
```

### `POST /pedidos/:id/asignar` 🔒 `ADMIN`
Asignación manual de repartidor.
```json
{ "repartidorRecogidaId": "uuid", "repartidorEntregaId": "uuid" }
```

### `POST /pedidos/asignar-automatico` 🔒 `ADMIN`
Asignación automática masiva según zonas.

### Transiciones de estado (por Repartidor) 🔒 `REPARTIDOR`

#### `POST /pedidos/:id/recoger`
```json
{
  "latitud": 14.6089,
  "longitud": -90.5132,
  "notas": "Paquete recibido en tienda"
}
```
Cambia estado a `RECOGIDO`.

#### `POST /pedidos/:id/en-transito`
```json
{
  "latitud": 14.6100,
  "longitud": -90.5150
}
```
Cambia a `EN_TRANSITO`. Solo válido desde `RECOGIDO`. Dispara la notificación `PEDIDO_EN_TRANSITO` al cliente.

#### `POST /pedidos/:id/llegar-intercambio`
```json
{
  "latitud": 14.6200,
  "longitud": -90.5200
}
```
Cambia a `EN_PUNTO_INTERCAMBIO`. Solo válido desde `EN_TRANSITO`.

#### `POST /pedidos/:id/tomar-entrega`
Un repartidor destino toma el paquete. Cambia a `EN_REPARTO`.

#### `POST /pedidos/:id/entregar`
**Multipart**: acepta foto + firma.
```
form-data:
  foto: (file)
  firma: (file, opcional)
  recibidoPor: "María Gómez"
  latitud: 14.5923
  longitud: -90.5044
  notas: "Entregado en mano"
```
Cambia a `ENTREGADO`.

#### `POST /pedidos/:id/fallar`
```json
{ "motivo": "Cliente ausente", "siguienteAccion": "REPROGRAMAR" }
```

### `GET /pedidos/:id/eventos` 🔒
Timeline completo del pedido.

---

## 🚴 Repartidores

### `GET /repartidores/yo/pedidos` 🔒 `REPARTIDOR`
Pedidos asignados (filtros: `?estado=RECOGIDO`).

### `GET /repartidores/yo/recogidas-pendientes` 🔒 `REPARTIDOR`
Pendientes de recoger en la zona del repartidor.

### `GET /repartidores/yo/entregas-pendientes` 🔒 `REPARTIDOR`
Paquetes en punto de intercambio que el repartidor debe llevar a destino.

### `POST /repartidores/yo/ubicacion` 🔒 `REPARTIDOR`
Actualiza ubicación (se llama cada N segundos).
```json
{ "latitud": 14.62, "longitud": -90.51 }
```

### `PATCH /repartidores/yo/disponibilidad` 🔒 `REPARTIDOR`
```json
{ "disponible": false }
```

### `GET /repartidores` 🔒 `ADMIN`
### `GET /repartidores/:id/ubicacion` 🔒 `ADMIN`
### `GET /repartidores/:id/desempeno` 🔒 `ADMIN`

---

## 💳 Paquetes Recargados

### `GET /paquetes-recargados/disponibles` 🔒
Lista de paquetes disponibles para comprar (tarifas).

### `POST /paquetes-recargados/comprar` 🔒 `VENDEDOR`
```json
{ "reglaTarifaId": "uuid", "metodoPago": "TRANSFERENCIA" }
```

### `GET /paquetes-recargados/yo` 🔒 `VENDEDOR`
Paquetes del vendedor.

### `GET /paquetes-recargados/yo/saldo` 🔒 `VENDEDOR`
```json
{ "saldoRecargado": 87, "paquetesActivos": 1 }
```

### `GET /paquetes-recargados` 🔒 `ADMIN`
### `PATCH /paquetes-recargados/:id` 🔒 `ADMIN`

---

## 💰 Cierre Financiero

### `GET /cierres-financieros/yo/hoy` 🔒 `REPARTIDOR`
Resumen del día en curso (monto esperado y pedidos contra entrega).

**Response**:
```json
{
  "fechaCierre": "2025-04-22",
  "montoEsperado": 1250.00,
  "cantidadPedidosEntregados": 12,
  "pedidosContraEntrega": [ { "id": "uuid", "codigoSeguimiento": "...", "montoContraEntrega": 150.00 } ]
}
```

### `POST /cierres-financieros` 🔒 `REPARTIDOR`
**Multipart** (subir foto del comprobante).
```
form-data:
  montoReportado: 1250.00
  comprobanteFoto: (file)
  notas: "Depósito en banco X, ref 998877"
```

### `GET /cierres-financieros` 🔒 `ADMIN`
Filtros: `?estado=PENDIENTE_REVISION&desde=...&hasta=...&repartidorId=...`

### `GET /cierres-financieros/:id` 🔒 `ADMIN` / `REPARTIDOR` (si es suyo)

### `POST /cierres-financieros/:id/aprobar` 🔒 `ADMIN`
### `POST /cierres-financieros/:id/rechazar` 🔒 `ADMIN`
```json
{ "motivo": "Monto no coincide con comprobante" }
```

---

## 📊 Reportes

### `GET /reportes/resumen-pedidos` 🔒 `ADMIN`
`?desde=2025-04-01&hasta=2025-04-30&agruparPor=zona|vendedor|repartidor|dia`

### `GET /reportes/desempeno-repartidores` 🔒 `ADMIN`
### `GET /reportes/financiero` 🔒 `ADMIN`
### `GET /reportes/exportar` 🔒 `ADMIN`
`?tipo=pedidos&formato=csv|xlsx`

---

## 🔔 Notificaciones

### `GET /notificaciones/yo` 🔒
### `PATCH /notificaciones/:id/leida` 🔒
### `POST /tokens-dispositivo` 🔒
Registra token FCM del dispositivo.
```json
{ "token": "fcm_token", "plataforma": "android" }
```
### `DELETE /tokens-dispositivo/:token` 🔒

---

## 🗺️ Mapbox (proxy)

### `GET /mapas/geocodificar?q=direccion` 🔒
Proxy a Mapbox Geocoding (evita exponer la API key).

### `POST /mapas/optimizar-ruta` 🔒 `REPARTIDOR` / `ADMIN`
```json
{
  "inicio":  {"lat": 14.6, "lng": -90.5},
  "fin":     {"lat": 14.65, "lng": -90.52},
  "paradas": [ {"lat": 14.61, "lng": -90.51} ]
}
```
**Response**:
```json
{
  "metrosDistancia": 8420,
  "segundosDuracion": 1320,
  "geometria": "encoded-polyline",
  "paradasOrdenadas": [0, 2, 1, 3]
}
```

---

## 🩺 Health & Meta

### `GET /salud`
```json
{ "estado": "ok", "tiempoActividad": 12345, "bd": "ok", "redis": "ok" }
```

### `GET /version`
```json
{ "version": "1.4.0", "commit": "abc123" }
```

---

## 📑 Resumen de Endpoints por Rol

| Rol | Endpoints principales |
|-----|----------------------|
| **Público** | `/autenticacion/*`, `/pedidos/seguimiento/:codigo`, `/salud` |
| **VENDEDOR** | Crear/consultar pedidos, paquetes recargados, reportes propios |
| **REPARTIDOR** | Flujo de recolección/entrega, cierre financiero, ubicación |
| **ADMIN** | Gestión total |

## 🔧 Códigos de Error Comunes

| Código | Significado |
|--------|-------------|
| `AUTH_CREDENCIALES_INVALIDAS` | Email/clave incorrectos |
| `AUTH_TOKEN_EXPIRADO` | Token de acceso expiró |
| `USUARIO_NO_ENCONTRADO` | Usuario inexistente |
| `PEDIDO_NO_ENCONTRADO` | Pedido inexistente |
| `PEDIDO_TRANSICION_INVALIDA` | Cambio de estado no permitido |
| `PEDIDO_ZONA_INVALIDA` | Coordenadas fuera de zonas |
| `PAQUETE_SIN_SALDO` | Sin envíos recargados disponibles |
| `CIERRE_YA_EXISTE` | Ya existe cierre para esta fecha |
| `REPARTIDOR_NO_DISPONIBLE` | Repartidor no disponible |

---

> Ver [`MODELOS_DE_DATOS.md`](./MODELOS_DE_DATOS.md) para los DTOs completos.
