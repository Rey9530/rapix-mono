# Integración con Mapbox

## 🎯 Objetivo

Documentar cómo se integra Mapbox en los tres componentes visuales: **panel admin (Angular)**, **app rider (Flutter)** y **app cliente (Flutter)**, además de los proxies del backend.

## 📦 Servicios de Mapbox Utilizados

| Servicio | Uso | SDK |
|----------|-----|-----|
| **Maps** | Renderizado de mapas | Mapbox GL JS / Maps SDK Flutter |
| **Geocoding** | Buscar direcciones → coordenadas | API REST |
| **Directions** | Rutas punto a punto | API REST |
| **Optimization** | Ordenar waypoints óptimamente | API REST |
| **Static Images** | Mapas en emails/reportes | API REST |

## 🔑 Tokens

- **Public Token** (`pk.xxx`): usado en clientes (frontend).
- **Secret Token** (`sk.xxx`): usado en backend (si se necesitan scopes privados).
- **Nunca** commitear tokens. Usar variables de entorno.

## 🌐 Proxy en el Backend

Para proteger el token y controlar uso, el backend expone endpoints que proxy al de Mapbox:

```typescript
// maps.controller.ts
@Controller('maps')
@UseGuards(JwtAuthGuard)
export class MapsController {
  constructor(private maps: MapsService) {}

  @Get('geocode')
  geocode(@Query('q') q: string) {
    return this.maps.geocode(q);
  }

  @Post('optimize-route')
  optimize(@Body() dto: OptimizeRouteDto) {
    return this.maps.optimize(dto);
  }

  @Post('directions')
  directions(@Body() dto: DirectionsDto) {
    return this.maps.directions(dto);
  }
}
```

### `maps.service.ts`

```typescript
@Injectable()
export class MapsService {
  private token = process.env.MAPBOX_TOKEN!;
  private base = 'https://api.mapbox.com';

  async geocode(q: string) {
    const url = `${this.base}/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`;
    const { data } = await axios.get(url, {
      params: { access_token: this.token, limit: 5, language: 'es' },
    });
    return data.features.map((f: any) => ({
      place: f.place_name,
      lat: f.center[1],
      lng: f.center[0],
    }));
  }

  async optimize(dto: OptimizeRouteDto) {
    const coords = [dto.start, ...dto.waypoints, dto.end]
      .map(p => `${p.lng},${p.lat}`).join(';');
    const url = `${this.base}/optimized-trips/v1/mapbox/driving/${coords}`;
    const { data } = await axios.get(url, {
      params: {
        access_token: this.token,
        geometries: 'polyline',
        overview: 'full',
        source: 'first',
        destination: 'last',
        roundtrip: 'false',
      },
    });
    const trip = data.trips[0];
    return {
      distanceMeters: trip.distance,
      durationSeconds: trip.duration,
      geometry: trip.geometry,
      orderedWaypoints: data.waypoints.map((w: any) => w.waypoint_index),
    };
  }

  async directions(dto: DirectionsDto) {
    const coords = `${dto.start.lng},${dto.start.lat};${dto.end.lng},${dto.end.lat}`;
    const url = `${this.base}/directions/v5/mapbox/driving/${coords}`;
    const { data } = await axios.get(url, {
      params: {
        access_token: this.token,
        geometries: 'polyline',
        overview: 'full',
        language: 'es',
      },
    });
    return data.routes[0];
  }
}
```

## 🖥️ Panel Admin (Angular + Mapbox GL JS)

### Instalación

```bash
yarn add mapbox-gl @mapbox/mapbox-gl-draw
yarn add -D @types/mapbox-gl
```

Agregar estilos en `angular.json`:

```json
"styles": [
  "src/styles.scss",
  "node_modules/mapbox-gl/dist/mapbox-gl.css",
  "node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
]
```

### Componente de mapa base

```typescript
import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-view',
  standalone: true,
  template: `<div #container class="w-full h-full"></div>`,
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @Input() center: [number, number] = [-90.51, 14.63];
  @Input() zoom = 12;

  map!: mapboxgl.Map;

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapboxToken;
    this.map = new mapboxgl.Map({
      container: this.container.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.center,
      zoom: this.zoom,
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  addMarker(lng: number, lat: number, color = '#3b82f6') {
    new mapboxgl.Marker({ color }).setLngLat([lng, lat]).addTo(this.map);
  }

  drawRoute(polyline: string, color = '#ef4444') {
    const decoded = this.decodePolyline(polyline);
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: decoded },
        properties: {},
      },
    });
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      paint: { 'line-color': color, 'line-width': 4 },
    });
  }

  private decodePolyline(str: string): [number, number][] {
    // Usar @mapbox/polyline package
    return [];
  }
}
```

### Editor de polígonos (zonas)

Ver ejemplo en [`GUIA_ADMIN.md`](./GUIA_ADMIN.md) sección "Editor de Zonas con Mapbox".

### Mapa en vivo de riders

```typescript
// Suscribirse a WebSocket y mover markers
tiempoRealServicio.alUbicacionRepartidor(({ repartidorId, lat, lng }) => {
  if (this.marcadoresRepartidor[repartidorId]) {
    this.marcadoresRepartidor[repartidorId].setLngLat([lng, lat]);
  } else {
    this.marcadoresRepartidor[repartidorId] = new mapboxgl.Marker({ color: '#22c55e' })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<b>Repartidor ${repartidorId}</b>`))
      .addTo(this.map);
  }
});
```

## 📱 Apps Flutter (mapbox_maps_flutter)

### Instalación

```bash
flutter pub add mapbox_maps_flutter
```

### Setup Android

`android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.mapbox.token"
    android:value="${MAPBOX_TOKEN}" />
```

### Setup iOS

`ios/Runner/Info.plist`:

```xml
<key>MBXAccessToken</key>
<string>$(MAPBOX_TOKEN)</string>
```

### Widget base

```dart
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

class BaseMap extends StatefulWidget {
  final Point center;
  final double zoom;
  final Function(MapboxMap)? onReady;

  const BaseMap({
    super.key,
    required this.center,
    this.zoom = 12,
    this.onReady,
  });

  @override
  State<BaseMap> createState() => _BaseMapState();
}

class _BaseMapState extends State<BaseMap> {
  @override
  void initState() {
    super.initState();
    MapboxOptions.setAccessToken(Env.mapboxToken);
  }

  @override
  Widget build(BuildContext context) {
    return MapWidget(
      cameraOptions: CameraOptions(center: widget.center, zoom: widget.zoom),
      styleUri: MapboxStyles.MAPBOX_STREETS,
      onMapCreated: (map) => widget.onReady?.call(map),
    );
  }
}
```

### Dibujar línea (ruta decodificada)

```dart
Future<void> drawRouteFromPolyline(MapboxMap map, String encoded) async {
  final coords = decodePolyline(encoded); // usa paquete `polyline`
  final lineString = {
    'type': 'Feature',
    'geometry': {
      'type': 'LineString',
      'coordinates': coords.map((c) => [c.longitude, c.latitude]).toList(),
    },
  };

  await map.style.addSource(GeoJsonSource(id: 'route', data: json.encode(lineString)));
  await map.style.addLayer(LineLayer(
    id: 'route-line',
    sourceId: 'route',
    lineColor: Colors.red.value,
    lineWidth: 4,
  ));
}
```

### Solicitar ruta al backend

```dart
Future<RouteResult> getOptimizedRoute({
  required LatLng start,
  required LatLng end,
  required List<LatLng> waypoints,
}) async {
  final dio = DioClient.create();
  final res = await dio.post('/maps/optimize-route', data: {
    'start': {'lat': start.lat, 'lng': start.lng},
    'end':   {'lat': end.lat,   'lng': end.lng},
    'waypoints': waypoints.map((p) => {'lat': p.lat, 'lng': p.lng}).toList(),
  });
  return RouteResult.fromJson(res.data);
}
```

## 🎯 Buenas Prácticas

### Performance

- **Caché** de resultados de geocoding (mismos inputs) en Redis por 7 días.
- **Batching** de actualizaciones: no mover markers más rápido de 1 vez por segundo.
- Usar **clusters** cuando haya > 50 markers.
- **Lazy-load** del mapa (inicializar solo cuando sea visible).

### UX

- Mostrar indicador de carga mientras se calcula la ruta.
- **Fallback** con OpenStreetMap si Mapbox falla (raro, pero útil en demos).
- Respetar el color de marca en polilíneas.
- En móvil, orientar el mapa según el rumbo del rider cuando esté en ruta.

### Costos

Mapbox cobra por **Map Load**, **Geocoding Request**, **Directions Request**, etc. Gratis hasta ciertos límites mensuales.

**Recomendaciones**:
- Cachear geocoding.
- Recalcular rutas solo si el desvío es > 100m.
- Usar **static images** para emails (una sola petición).
- Monitorear métricas en [Mapbox Studio Statistics](https://studio.mapbox.com/).

### Seguridad

- Tokens frontend → restringir por dominio (URL Whitelisting en Mapbox).
- Tokens backend → restringir por scope.
- Rotar tokens cada 90 días.
- Rate limit en el proxy del backend (p.ej. 60 req/min por usuario).

## 🗺️ Styles Recomendados

| Contexto | Style URI |
|----------|-----------|
| Admin (claro) | `mapbox://styles/mapbox/streets-v12` |
| App rider (día) | `mapbox://styles/mapbox/navigation-day-v1` |
| App rider (noche) | `mapbox://styles/mapbox/navigation-night-v1` |
| App cliente | `mapbox://styles/mapbox/streets-v12` |
| Custom branded | Crear en Mapbox Studio |

## 🧪 Testing

- En tests, **mockear** `MapsService`.
- Capturas de pantalla comparativas (visual regression) con **Percy** o similar.
- Validar que los polígonos de zonas son cerrados y no se solapan.

## 📍 Resolución de Zona (PostGIS)

La resolución `(lat, lng) → zona` se hace en la BD con `ST_Contains` sobre la columna `zones.polygon` (tipo `geometry(Polygon, 4326)`, indexada con GIST):

```sql
SELECT id, code
FROM zones
WHERE is_active = true
  AND ST_Contains(polygon, ST_SetSRID(ST_MakePoint($lng, $lat), 4326))
LIMIT 1;
```

> El editor de polígonos en Mapbox produce GeoJSON; el backend lo convierte con `ST_GeomFromGeoJSON` al persistir. Ver implementación completa (`GeoService.resolveZone` y `createZone`) en [`GUIA_BACKEND.md`](./GUIA_BACKEND.md) sección "Resolución de Zona (PostGIS)".

## 🧰 Herramientas Útiles

- **Mapbox Studio** — editor visual de estilos.
- **geojson.io** — dibujar y validar polígonos.
- **turf.js** — utilidades geoespaciales en JS.
- **@mapbox/polyline** — codificar/decodificar polilíneas.

---

> Ver [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) sección "Mapbox Helpers" para la API completa del proxy.
