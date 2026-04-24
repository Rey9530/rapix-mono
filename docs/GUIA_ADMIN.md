# Guía de Desarrollo - Panel Administrativo (Angular)

## 🎯 Objetivo

Panel web responsive para administradores con gestión de usuarios, zonas, pedidos, repartidores, cierres financieros y reportes. Incluye visualización en Mapbox GL JS.

## 📦 Stack

- **Angular** 17+ (standalone components)
- **TypeScript** 5.x
- **Angular Material** + **TailwindCSS**
- **NgRx Signals** (o NgRx clásico)
- **Mapbox GL JS**
- **RxJS**
- **Chart.js** (tablero)

## 🗂️ Estructura de Carpetas

```
admin/
├── src/
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.rutas.ts
│   │   ├── app.component.ts
│   │   ├── nucleo/
│   │   │   ├── autenticacion/
│   │   │   │   ├── autenticacion.servicio.ts
│   │   │   │   ├── autenticacion.guardia.ts
│   │   │   │   ├── rol.guardia.ts
│   │   │   │   └── autenticacion.interceptor.ts
│   │   │   ├── http/
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── api.config.ts
│   │   │   ├── modelos/
│   │   │   │   ├── usuario.modelo.ts
│   │   │   │   ├── pedido.modelo.ts
│   │   │   │   ├── zona.modelo.ts
│   │   │   │   └── ...
│   │   │   └── servicios/
│   │   ├── compartido/
│   │   │   ├── componentes/
│   │   │   │   ├── tabla-datos/
│   │   │   │   ├── encabezado-pagina/
│   │   │   │   ├── chip-estado/
│   │   │   │   ├── dialogo-confirmacion/
│   │   │   │   └── vista-mapa/
│   │   │   ├── pipes/
│   │   │   └── directivas/
│   │   ├── layouts/
│   │   │   └── tablero-layout/
│   │   └── caracteristicas/
│   │       ├── autenticacion/
│   │       │   └── iniciar-sesion/
│   │       ├── tablero/
│   │       ├── usuarios/
│   │       │   ├── usuarios-listado.component.ts
│   │       │   ├── usuario-formulario.component.ts
│   │       │   └── usuarios.servicio.ts
│   │       ├── zonas/
│   │       │   ├── zonas-listado.component.ts
│   │       │   ├── zona-editor.component.ts  # poligono en Mapbox
│   │       │   └── zonas.servicio.ts
│   │       ├── pedidos/
│   │       │   ├── pedidos-listado.component.ts
│   │       │   ├── pedido-detalle.component.ts
│   │       │   └── pedidos.servicio.ts
│   │       ├── repartidores/
│   │       │   ├── repartidores-listado.component.ts
│   │       │   ├── repartidores-mapa.component.ts   # tiempo real
│   │       │   └── repartidores.servicio.ts
│   │       ├── cierres-financieros/
│   │       ├── paquetes-recargados/
│   │       └── reportes/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.scss
├── tailwind.config.js
├── angular.json
└── package.json
```

## 🧰 Instalación

```bash
# Activar Yarn 4 (viene con Node 24 vía corepack)
corepack enable
corepack prepare yarn@stable --activate

# Angular CLI (instalación global opcional; también se puede usar `yarn dlx`)
yarn global add @angular/cli@17
ng new admin --standalone --routing --style=scss --strict --package-manager=yarn
cd admin

# Fijar Yarn 4 en el repo
yarn set version stable
# En package.json añadir: "packageManager": "yarn@4.x.x" y "engines.node": ">=24.10.0"

# Material + Tailwind
ng add @angular/material
yarn add -D tailwindcss postcss autoprefixer
yarn dlx tailwindcss init

# Mapbox
yarn add mapbox-gl
yarn add -D @types/mapbox-gl

# NgRx signals
yarn add @ngrx/signals

# Charts
yarn add chart.js
```

> Correr el proyecto: `yarn start` (alias de `ng serve`) · Tests: `yarn test` · Build: `yarn build`.

### `tailwind.config.js`

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: [],
};
```

## ⚙️ Variables de Entorno

`src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  mapboxToken: 'pk.xxxxx',
  wsUrl: 'ws://localhost:3000',
};
```

## 🔐 Autenticación

### `autenticacion.servicio.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutenticacionServicio {
  private http = inject(HttpClient);
  usuarioActual = signal<Usuario | null>(null);

  iniciarSesion(correo: string, contrasena: string) {
    return this.http.post<RespuestaAutenticacion>(`${environment.apiUrl}/autenticacion/iniciar-sesion`, { correo, contrasena })
      .pipe(tap(res => {
        localStorage.setItem('tokenAcceso', res.tokenAcceso);
        localStorage.setItem('tokenRefresco', res.tokenRefresco);
        this.usuarioActual.set(res.usuario);
      }));
  }

  cerrarSesion() {
    localStorage.removeItem('tokenAcceso');
    localStorage.removeItem('tokenRefresco');
    this.usuarioActual.set(null);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('tokenAcceso');
  }
}
```

### `autenticacion.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tokenAcceso');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### `autenticacion.guardia.ts`

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionServicio } from './autenticacion.servicio';

export const autenticacionGuardia: CanActivateFn = () => {
  const autenticacion = inject(AutenticacionServicio);
  const router = inject(Router);
  if (autenticacion.estaAutenticado()) return true;
  router.navigate(['/iniciar-sesion']);
  return false;
};
```

### `app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { rutas } from './app.rutas';
import { autenticacionInterceptor } from './nucleo/autenticacion/autenticacion.interceptor';
import { errorInterceptor } from './nucleo/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(rutas),
    provideHttpClient(withInterceptors([autenticacionInterceptor, errorInterceptor])),
    provideAnimations(),
  ],
};
```

## 🛣️ Rutas Principales

```typescript
export const rutas: Routes = [
  { path: 'iniciar-sesion', loadComponent: () => import('./caracteristicas/autenticacion/iniciar-sesion/iniciar-sesion.component').then(m => m.IniciarSesionComponent) },
  {
    path: '',
    canActivate: [autenticacionGuardia],
    loadComponent: () => import('./layouts/tablero-layout/tablero-layout.component').then(m => m.TableroLayoutComponent),
    children: [
      { path: '', redirectTo: 'tablero', pathMatch: 'full' },
      { path: 'tablero', loadComponent: () => import('./caracteristicas/tablero/tablero.component').then(m => m.TableroComponent) },
      { path: 'usuarios', loadChildren: () => import('./caracteristicas/usuarios/usuarios.rutas').then(m => m.rutas) },
      { path: 'zonas', loadChildren: () => import('./caracteristicas/zonas/zonas.rutas').then(m => m.rutas) },
      { path: 'pedidos', loadChildren: () => import('./caracteristicas/pedidos/pedidos.rutas').then(m => m.rutas) },
      { path: 'repartidores', loadChildren: () => import('./caracteristicas/repartidores/repartidores.rutas').then(m => m.rutas) },
      { path: 'cierres-financieros', loadChildren: () => import('./caracteristicas/cierres-financieros/cierres.rutas').then(m => m.rutas) },
      { path: 'paquetes-recargados', loadChildren: () => import('./caracteristicas/paquetes-recargados/paquetes.rutas').then(m => m.rutas) },
      { path: 'reportes', loadChildren: () => import('./caracteristicas/reportes/reportes.rutas').then(m => m.rutas) },
    ],
  },
];
```

## 🗺️ Editor de Zonas con Mapbox

```typescript
import { Component, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-zona-editor',
  standalone: true,
  template: `<div #contenedorMapa class="w-full h-[600px] rounded-lg"></div>
             <button class="mt-4" mat-raised-button color="primary" (click)="guardar()">Guardar Zona</button>`,
})
export class ZonaEditorComponent implements AfterViewInit {
  @ViewChild('contenedorMapa') contenedor!: ElementRef<HTMLDivElement>;
  private mapa!: mapboxgl.Map;
  private dibujo!: any;
  poligono = signal<any>(null);

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.mapboxToken;
    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-90.51, 14.63],
      zoom: 12,
    });

    this.dibujo = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });
    this.mapa.addControl(this.dibujo);

    this.mapa.on('draw.create', e => this.poligono.set(e.features[0].geometry));
    this.mapa.on('draw.update', e => this.poligono.set(e.features[0].geometry));
  }

  guardar() {
    const geom = this.poligono();
    if (!geom) return;
    // transformar [lng,lat] a {lat,lng}
    const coordenadas = geom.coordinates[0].map(([lng, lat]: number[]) => ({ latitud: lat, longitud: lng }));
    // llamar zonasServicio.crear({ ..., poligono: coordenadas })
  }
}
```

## 📊 Componente Tabla de Datos Reutilizable

```typescript
@Component({
  selector: 'app-tabla-datos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="datos">
      <ng-container *ngFor="let columna of columnas" [matColumnDef]="columna.clave">
        <th mat-header-cell *matHeaderCellDef>{{ columna.etiqueta }}</th>
        <td mat-cell *matCellDef="let fila">{{ fila[columna.clave] }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="clavesColumnas"></tr>
      <tr mat-row *matRowDef="let fila; columns: clavesColumnas"></tr>
    </table>
    <mat-paginator [length]="total" [pageSize]="tamanoPagina" (page)="cambioPagina.emit($event)" />
  `,
})
export class TablaDatosComponent<T> {
  @Input() datos: T[] = [];
  @Input() columnas: { clave: string; etiqueta: string }[] = [];
  @Input() total = 0;
  @Input() tamanoPagina = 20;
  @Output() cambioPagina = new EventEmitter();

  get clavesColumnas() { return this.columnas.map(c => c.clave); }
}
```

## 📡 Tiempo Real (WebSocket)

Para ver la ubicación de los repartidores en vivo:

```typescript
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class TiempoRealServicio {
  private socket: Socket;

  conectar(token: string) {
    this.socket = io(environment.wsUrl, { auth: { token } });
  }

  alRecibirUbicacionRepartidor(cb: (datos: { repartidorId: string; latitud: number; longitud: number }) => void) {
    this.socket.on('repartidor:ubicacion', cb);
  }
}
```

## 🎨 Layout y UI

- **Barra lateral** fija con secciones: Tablero, Usuarios, Zonas, Pedidos, Repartidores, Cierres, Paquetes, Reportes.
- **Barra superior** con avatar, notificaciones y cerrar sesión.
- **Migas de pan** en cada página.
- **Tema claro/oscuro** (opcional).

## ✅ Checklist del Admin

- [ ] Inicio de sesión con validación.
- [ ] CRUD de usuarios con filtros y paginación.
- [ ] Editor visual de zonas con Mapbox Draw.
- [ ] Lista de pedidos con filtros y estado en vivo.
- [ ] Mapa con repartidores en tiempo real.
- [ ] Aprobación de cierres financieros con foto ampliable.
- [ ] Tablero con indicadores clave (KPIs).
- [ ] Exportación de reportes CSV/XLSX.
- [ ] Responsive móvil/tableta.

## 📜 Scripts

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "build:prod": "ng build --configuration=production"
  }
}
```

---

> Ver [`INTEGRACION_MAPBOX.md`](./INTEGRACION_MAPBOX.md) para más detalle sobre mapas.
