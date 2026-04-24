# Modelos de Datos y DTOs

## 🎯 Propósito

Este documento define los **DTOs** (Data Transfer Objects), interfaces y contratos de datos que se usan en la API. Están pensados para NestJS (backend) pero también sirven de referencia para TypeScript (Angular) y Dart (Flutter).

## 📐 Convenciones

- Todos los DTOs usan `class-validator` y `class-transformer`.
- Identificadores en español, sin tildes (ver glosario maestro en `README.md`).
- Los campos opcionales se marcan con `?`.
- Las fechas llegan como strings ISO 8601 y se transforman a `Date`.
- Coordenadas se validan siempre: `latitud ∈ [-90, 90]`, `longitud ∈ [-180, 180]`.

---

## 1. Autenticación

### `RegistrarDto`

```typescript
import { IsEmail, IsEnum, IsLatitude, IsLongitude,
  IsOptional, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';
import { RolUsuario } from '../generated/prisma/client'; // Prisma 7: cliente generado en src/generated/prisma

export class RegistrarDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  telefono: string;

  @IsString()
  @Length(8, 64)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message: 'Debe contener mayúscula, número y símbolo',
  })
  contrasena: string;

  @IsString() @Length(3, 120)
  nombreCompleto: string;

  @IsEnum(['VENDEDOR', 'CLIENTE'])
  rol: 'VENDEDOR' | 'CLIENTE';

  // Solo si rol === VENDEDOR
  @IsOptional() @IsString()    nombreNegocio?: string;
  @IsOptional() @IsString()    direccion?: string;
  @IsOptional() @IsLatitude()  latitud?: number;
  @IsOptional() @IsLongitude() longitud?: number;
}
```

### `IniciarSesionDto`
```typescript
export class IniciarSesionDto {
  @IsEmail()  email: string;
  @IsString() contrasena: string;
}
```

### `RespuestaAutenticacionDto`
```typescript
export class RespuestaAutenticacionDto {
  tokenAcceso: string;
  tokenRefresco: string;
  usuario: UsuarioPublicoDto;
}
```

### `UsuarioPublicoDto`
```typescript
export class UsuarioPublicoDto {
  id: string;
  email: string;
  telefono: string;
  nombreCompleto: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  urlAvatar?: string;
}
```

---

## 2. Usuarios

### `CrearRepartidorDto`
```typescript
export class CrearRepartidorDto {
  @IsEmail()       email: string;
  @IsPhoneNumber() telefono: string;
  @IsString()      contrasena: string;
  @IsString()      nombreCompleto: string;
  @IsString()      tipoVehiculo: string;
  @IsOptional() @IsString() placa?: string;
  @IsString()      documentoIdentidad: string;
  @IsOptional() @IsPhoneNumber() telefonoEmergencia?: string;
  @IsArray() @IsUUID('4', { each: true }) zonaIds: string[];
  @IsOptional() @IsUUID('4') zonaPrimariaId?: string;
}
```

### `ActualizarEstadoUsuarioDto`
```typescript
export class ActualizarEstadoUsuarioDto {
  @IsEnum(EstadoUsuario) estado: EstadoUsuario;
  @IsOptional() @IsString() motivo?: string;
}
```

---

## 3. Zonas

### `PuntoGeoDto`
```typescript
export class PuntoGeoDto {
  @IsLatitude()  lat: number;
  @IsLongitude() lng: number;
}
```

### `CrearZonaDto`
```typescript
export class CrearZonaDto {
  @IsString() @Length(1, 10) codigo: string;
  @IsString() nombre: string;
  @IsOptional() @IsString() descripcion?: string;

  @ValidateNested({ each: true })
  @Type(() => PuntoGeoDto)
  @ArrayMinSize(3)
  // El backend convierte este array a `geometry(Polygon, 4326)` mediante
  // `ST_GeomFromGeoJSON` antes de persistir. Ver `GUIA_BACKEND.md`
  // sección "Resolución de Zona (PostGIS)".
  poligono: PuntoGeoDto[];

  @IsOptional() @IsUUID('4') puntoIntercambioId?: string;
}
```

### `AsignarRepartidoresAZonaDto`
```typescript
export class AsignarRepartidoresAZonaDto {
  @IsArray() @IsUUID('4', { each: true }) repartidorIds: string[];
  @IsOptional() @IsUUID('4') repartidorPrimarioId?: string;
}
```

---

## 4. Pedidos

### `CrearPedidoDto`
```typescript
export class CrearPedidoDto {
  @IsString() @Length(2, 120) nombreCliente: string;
  @IsPhoneNumber()            telefonoCliente: string;
  @IsOptional() @IsEmail()    emailCliente?: string;

  @IsString()    direccionOrigen: string;
  @IsLatitude()  latitudOrigen: number;
  @IsLongitude() longitudOrigen: number;
  @IsOptional() @IsString() notasOrigen?: string;

  @IsString()    direccionDestino: string;
  @IsLatitude()  latitudDestino: number;
  @IsLongitude() longitudDestino: number;
  @IsOptional() @IsString() notasDestino?: string;

  @IsOptional() @IsString() descripcionPaquete?: string;
  @IsOptional() @IsNumber() @Min(0) pesoPaqueteKg?: number;
  @IsOptional() @IsNumber() @Min(0) valorDeclarado?: number;

  @IsEnum(MetodoPago) metodoPago: MetodoPago;
  @IsOptional() @IsNumber() @Min(0) montoContraEntrega?: number;
  @IsOptional() @IsDateString() programadoPara?: string;
}
```

### `RespuestaPedidoDto`
```typescript
export class RespuestaPedidoDto {
  id: string;
  codigoSeguimiento: string;
  estado: EstadoPedido;
  modoFacturacion: ModoFacturacion;
  costoEnvio: number;
  montoContraEntrega?: number;

  cliente:  { nombre: string; telefono: string; email?: string };
  origen:   { direccion: string; lat: number; lng: number; zona?: { id: string; codigo: string } };
  destino:  { direccion: string; lat: number; lng: number; zona?: { id: string; codigo: string } };

  repartidorRecogida?: ResumenRepartidorDto;
  repartidorEntrega?:  ResumenRepartidorDto;

  creadoEn: string;
  recogidoEn?: string;
  enIntercambioEn?: string;
  entregadoEn?: string;
}
```

### `ResumenRepartidorDto`
```typescript
export class ResumenRepartidorDto {
  id: string;
  nombreCompleto: string;
  telefono: string;
  tipoVehiculo: string;
  ubicacionActual?: { lat: number; lng: number; actualizadoEn: string };
}
```

### Transiciones de estado

```typescript
export class RecogerPedidoDto {
  @IsLatitude()  latitud: number;
  @IsLongitude() longitud: number;
  @IsOptional() @IsString() notas?: string;
}

export class EnTransitoPedidoDto {
  @IsLatitude()  latitud: number;
  @IsLongitude() longitud: number;
}

export class LlegarIntercambioPedidoDto {
  @IsLatitude()  latitud: number;
  @IsLongitude() longitud: number;
}

export class EntregarPedidoDto {
  @IsLatitude()  latitud: number;
  @IsLongitude() longitud: number;
  @IsOptional() @IsString() recibidoPor?: string;
  @IsOptional() @IsString() notas?: string;
  // foto y firma vienen como archivos (Multer)
}

export class FallarPedidoDto {
  @IsString() motivo: string;
  @IsEnum(['REPROGRAMAR', 'DEVOLVER_AL_VENDEDOR']) siguienteAccion: string;
}
```

### `AsignarPedidoDto`
```typescript
export class AsignarPedidoDto {
  @IsOptional() @IsUUID('4') repartidorRecogidaId?: string;
  @IsOptional() @IsUUID('4') repartidorEntregaId?: string;
}
```

---

## 5. Paquetes Recargados

### `ComprarPaqueteDto`
```typescript
export class ComprarPaqueteDto {
  @IsUUID('4') reglaTarifaId: string;
  @IsEnum(MetodoPago) metodoPago: MetodoPago;
}
```

### `PaqueteRecargadoDto`
```typescript
export class PaqueteRecargadoDto {
  id: string;
  nombre: string;
  enviosTotales: number;
  enviosRestantes: number;
  precio: number;
  estado: EstadoPaquete;
  compradoEn: string;
  expiraEn?: string;
}
```

### `SaldoDto`
```typescript
export class SaldoDto {
  saldoRecargado: number;
  paquetesActivos: number;
}
```

---

## 6. Cierre Financiero

### `CrearCierreDto`
```typescript
export class CrearCierreDto {
  @IsNumber() @Min(0) montoReportado: number;
  @IsOptional() @IsString() notas?: string;
  // comprobanteFoto viene como archivo
}
```

### `ResumenCierreDto`
```typescript
export class ResumenCierreDto {
  fechaCierre: string;
  montoEsperado: number;
  cantidadPedidosEntregados: number;
  pedidosContraEntrega: Array<{
    id: string;
    codigoSeguimiento: string;
    montoContraEntrega: number;
    entregadoEn: string;
  }>;
}
```

### `CierreDto`
```typescript
export class CierreDto {
  id: string;
  repartidorId: string;
  fechaCierre: string;
  montoEsperado: number;
  montoReportado: number;
  diferencia: number;
  urlComprobanteFoto: string;
  estado: EstadoCierreFinanciero;
  notas?: string;
  revisadoPor?: string;
  revisadoEn?: string;
  creadoEn: string;
}
```

### `RevisarCierreDto`
```typescript
export class RevisarCierreDto {
  @IsOptional() @IsString() motivo?: string;
}
```

---

## 7. Notificaciones

### `NotificacionDto`
```typescript
export class NotificacionDto {
  id: string;
  canal: CanalNotificacion;
  titulo: string;
  cuerpo: string;
  datos?: Record<string, any>;
  estado: EstadoNotificacion;
  creadoEn: string;
  leidoEn?: string;
}
```

### `RegistrarTokenDispositivoDto`
```typescript
export class RegistrarTokenDispositivoDto {
  @IsString() token: string;
  @IsEnum(['ios', 'android', 'web']) plataforma: 'ios' | 'android' | 'web';
}
```

---

## 8. Mapbox / Rutas

### `OptimizarRutaDto`
```typescript
export class OptimizarRutaDto {
  @ValidateNested() @Type(() => PuntoGeoDto) inicio: PuntoGeoDto;
  @ValidateNested() @Type(() => PuntoGeoDto) fin:    PuntoGeoDto;

  @ValidateNested({ each: true })
  @Type(() => PuntoGeoDto)
  @ArrayMaxSize(25)
  paradas: PuntoGeoDto[];
}
```

### `RespuestaRutaDto`
```typescript
export class RespuestaRutaDto {
  metrosDistancia: number;
  segundosDuracion: number;
  geometria: string;          // polyline codificada
  paradasOrdenadas: number[]; // índices en orden óptimo
}
```

---

## 9. Paginación y Filtros Comunes

### `PaginacionDto`
```typescript
export class PaginacionDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)             pagina: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)   limite: number = 20;
}
```

### `RespuestaPaginada<T>`
```typescript
export class RespuestaPaginada<T> {
  datos: T[];
  meta: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}
```

### `FiltrosPedidoDto`
```typescript
export class FiltrosPedidoDto extends PaginacionDto {
  @IsOptional() @IsEnum(EstadoPedido) estado?: EstadoPedido;
  @IsOptional() @IsUUID('4')          zonaId?: string;
  @IsOptional() @IsUUID('4')          vendedorId?: string;
  @IsOptional() @IsUUID('4')          repartidorId?: string;
  @IsOptional() @IsDateString()       desde?: string;
  @IsOptional() @IsDateString()       hasta?: string;
  @IsOptional() @IsString()           busqueda?: string; // busca en codigoSeguimiento, nombreCliente
}
```

---

## 10. Eventos de Dominio (interno)

Usados con el `EventEmitter2` interno de NestJS:

```typescript
export class PedidoCreadoEvento {
  constructor(public readonly pedidoId: string, public readonly vendedorId: string) {}
}

export class PedidoEstadoCambiadoEvento {
  constructor(
    public readonly pedidoId: string,
    public readonly desde: EstadoPedido,
    public readonly hacia: EstadoPedido,
    public readonly actorId?: string,
  ) {}
}

export class CierreEnviadoEvento {
  constructor(public readonly cierreId: string, public readonly repartidorId: string) {}
}
```

---

## 11. Equivalencias Dart (Flutter)

Ejemplo de modelo equivalente en Dart para `RespuestaPedidoDto`:

```dart
class Pedido {
  final String id;
  final String codigoSeguimiento;
  final EstadoPedido estado;
  final String nombreCliente;
  final String telefonoCliente;
  final PuntoGeo origen;
  final PuntoGeo destino;
  final double? montoContraEntrega;
  final DateTime creadoEn;
  final DateTime? entregadoEn;

  Pedido.fromJson(Map<String, dynamic> j)
      : id = j['id'],
        codigoSeguimiento = j['codigoSeguimiento'],
        estado = EstadoPedido.values.byName(j['estado']),
        nombreCliente = j['cliente']['nombre'],
        telefonoCliente = j['cliente']['telefono'],
        origen = PuntoGeo.fromJson(j['origen']),
        destino = PuntoGeo.fromJson(j['destino']),
        montoContraEntrega = (j['montoContraEntrega'] as num?)?.toDouble(),
        creadoEn = DateTime.parse(j['creadoEn']),
        entregadoEn = j['entregadoEn'] != null ? DateTime.parse(j['entregadoEn']) : null;
}
```

---

> Ver [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) para ver en qué endpoint se usa cada DTO.
