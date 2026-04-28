# admin-template — Plantilla Angular del Panel de Administración

> **Propósito de este documento**: servir como mapa del proyecto para agentes de IA (Claude Code) y desarrolladores. Cuando se necesite un componente reutilizable (modales, tablas, tarjetas, formularios, gráficos, etc.), este archivo indica la ruta exacta donde está implementado en la plantilla, para copiarlo/reutilizarlo en el proyecto `admin/` hermano.
>
> **Relación con `admin/`**: Este directorio contiene la plantilla Cuba Angular original con todos los componentes de ejemplo. El proyecto `F:\delivery-system-docs\admin/` es la aplicación real de Rapix y hereda la misma estructura. Cuando se deba implementar una funcionalidad nueva en `admin/` (por ejemplo, un listado con modales), se debe:
> 1. Localizar el componente en `admin-template/` usando este mapa.
> 2. Copiar o adaptar la implementación al proyecto `admin/`.
> 3. Traducir identificadores, textos y rutas al español siguiendo el glosario maestro del `CLAUDE.md` raíz.

---

## 1. Información general

- **Nombre interno (package.json)**: `cuba-angular` (plantilla administrativa Cuba)
- **Framework**: Angular 21.x (standalone components, sin NgModules)
- **Lenguaje**: TypeScript 5.9
- **Estilos**: SCSS (con Bootstrap 5.3, variables SCSS de la plantilla en `public/assets/scss/`)
- **UI Kit principal**: `@ng-bootstrap/ng-bootstrap` v20 (modales, datepicker, ratings, paginación, tooltips, tabs, accordions, etc.)
- **Router**: standalone `provideRouter` con lazy loading por feature (`loadComponent` / `loadChildren`)
- **Guards**: `AdminGuard` basado en `localStorage['user']`
- **i18n**: `@ngx-translate/core` (archivos JSON en `public/assets/i18n/`)
- **Notificaciones**: `ngx-toastr`
- **Alertas modales**: `sweetalert2`
- **Gráficos**: ApexCharts (`ng-apexcharts`), Chart.js (`ng2-charts`), Chartist, Google Charts
- **Mapas**: Google Maps (`@angular/google-maps`), Leaflet (`@bluehalo/ngx-leaflet`)
- **Editores ricos**: CKEditor 5, `@kolkov/angular-editor`, `ngx-editor`
- **Calendario**: `angular-calendar` + `date-fns`
- **Kanban**: `@syncfusion/ej2-angular-kanban`
- **Otros**: Swiper, ngx-dropzone-wrapper, ngx-image-cropper, ngx-masonry, ngx-owl-carousel-o, ngx-print, ngx-scrollbar, ngx-spinner, ngx-slider, ngx-chips, ngx-bar-rating, ng-gallery, ng-select2-component, `@danielmoncada/angular-datetime-picker`

### Comandos

```bash
yarn install          # o: npm install
yarn start            # ng serve en http://localhost:4200
yarn build            # build de producción
yarn watch            # build en modo desarrollo con watch
yarn lint             # ESLint en .ts y .html
yarn lint:fix         # ESLint con --fix
yarn format           # Prettier sobre ts/html/scss/json/md
yarn test             # Karma + Jasmine
```

### Convención Angular del proyecto

- **Standalone components**: no se usan NgModules. Cada componente declara sus propios `imports` en el decorador `@Component`.
- **Archivos por componente** (`angular.json` → schematics): `*.ts` + `*.html` + `*.scss` separados (no inline), `skipTests: true`, prefijo `app`.
- **Inyección con `inject()`**: el código moderno de la plantilla usa `inject(Servicio)` en lugar del constructor.
- **Lazy loading**: cada feature expone sus propias `*.routes.ts` importadas con `loadChildren`.

---

## 2. Árbol de alto nivel

```
admin-template/
├── angular.json
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.spec.json
├── eslint.config.mjs
├── .prettierrc
├── public/                      ← assets estáticos (imágenes, SCSS base, i18n, fuentes)
│   └── assets/
│       ├── scss/                ← app.scss (importado desde src/styles.scss)
│       ├── images/
│       ├── i18n/                ← archivos de traducción
│       └── ...
└── src/
    ├── index.html
    ├── main.ts                  ← bootstrapApplication(App, appConfig)
    ├── styles.scss              ← sólo @use de public/assets/scss/app.scss
    └── app/
        ├── app.ts               ← componente raíz App (selector: app-root)
        ├── app.html             ← <router-outlet/> + <app-loader/> + <app-back-to-top/>
        ├── app.scss
        ├── app.config.ts        ← providers globales (Router, HttpClient, Animations, Toastr, Translate, Calendar)
        ├── app.routes.ts        ← redirect '' → /dashboard/default; rutas /auth/login + layouts content/full
        ├── auth/                ← login standalone (fuera del layout)
        │   └── login/
        │       ├── login.ts
        │       ├── login.html
        │       └── login.scss
        ├── shared/              ← TODO lo reutilizable (ver §4)
        └── components/          ← TODAS las features / páginas (ver §5)
```

---

## 3. Arranque y routing

### Bootstrap

- `src/main.ts` llama `bootstrapApplication(App, appConfig)`.
- `app/app.config.ts` registra providers globales:
  - `provideAnimations()`, `provideHttpClient()`, `provideToastr()`, `provideZoneChangeDetection({ eventCoalescing: true })`.
  - `provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }))`.
  - `TranslateModule.forRoot(...)` con loader HTTP apuntando a `./assets/i18n/`.
  - `CalendarModule.forRoot(...)` con date-fns adapter.

### Rutas raíz — `src/app/app.routes.ts`

Tres rutas hijas principales:

| Ruta | Layout / Componente | Guard | Hijos |
|------|--------------------|-------|-------|
| `''` → `/dashboard/default` | redirect | — | — |
| `auth/login` | `auth/login/Login` (pantalla suelta) | — | — |
| `''` | `shared/components/layout/content/Content` (header + sidebar + breadcrumbs + footer + customizer) | `AdminGuard` | `shared/routes/content.routes.ts` |
| `''` | `shared/components/layout/full/Full` (solo `<router-outlet/>`) | `AdminGuard` | `shared/routes/full.routes.ts` |
| `**` | redirect `''` | — | — |

- **`content.routes.ts`** agrupa todas las rutas que se ven dentro del shell administrativo (dashboards, órdenes, productos, usuarios, forms, tablas, charts, reports, etc.).
- **`full.routes.ts`** agrupa rutas a pantalla completa sin shell: `invoices/*`, `auth/*` (demos de login/register), `error/*`, `coming-soon/*`.

### Guard

- `src/app/shared/guard/admin.guard.ts` → `AdminGuard.canActivate()` lee `localStorage.getItem('user')`. Si no existe, redirige a `/auth/login`.

### Login real del shell

- `src/app/auth/login/login.ts` con usuario demo `Test@gmail.com` / `test123` que guarda `user` en `localStorage` y redirige a `/dashboard/default`. En `admin/` se reemplaza por el flujo real contra el backend NestJS.

### Menú lateral

- `src/app/shared/data/menu.ts` → `menuItems: IMenu[]` (interfaz en `shared/interface/menu.ts`). Aquí se agregan/quitan entradas del sidebar.

---

## 4. `src/app/shared/` — componentes y servicios reutilizables

Esta carpeta es la fuente principal para reutilizar en `admin/`.

```
src/app/shared/
├── components/
│   ├── header/                  ← header.ts/html/scss + widgets/
│   ├── sidebar/                 ← sidebar.ts/html/scss
│   ├── footer/                  ← footer.ts/html/scss
│   ├── layout/
│   │   ├── content/             ← shell con header+sidebar+breadcrumbs+footer+customizer
│   │   └── full/                ← shell vacío (solo router-outlet)
│   └── ui/                      ← componentes UI reutilizables (ver detalle abajo)
├── services/
├── data/                        ← datasets de ejemplo (mock)
├── interface/                   ← interfaces TypeScript
├── directives/
├── guard/
├── routes/                      ← content.routes.ts + full.routes.ts
└── files/                       ← archivos estáticos de ejemplo (pdf)
```

### 4.1. `shared/components/ui/` — componentes UI genéricos

| Componente | Ruta | Selector | Descripción |
|------------|------|----------|-------------|
| **Modales reutilizables** | `shared/components/ui/modal/` | — | Ver §4.1.1 |
| **Tabla genérica** | `shared/components/ui/table/table.ts` | `app-table` | Tabla con paginación, búsqueda, sort, filtros de fecha, selección, acciones por fila (edit/delete/view) y confirmación SweetAlert2 integrada. Se configura con `ITableConfigs` de `shared/interface/common.ts`. |
| **Tarjeta** | `shared/components/ui/card/card.ts` | `app-card` | Wrapper de tarjeta con `headerTitle`, slots, dropdown opcional. Usa `card-dropdown-button/` como subcomponente. |
| **Breadcrumbs** | `shared/components/ui/breadcrumbs/breadcrumbs.ts` | `app-breadcrumbs` | Se suscribe a `NavigationEnd` y lee `data.breadcrumb` + `data.title` de las rutas. |
| **Paginación** | `shared/components/ui/pagination/pagination.ts` | `app-pagination` | Recibe `paginate: IPagination` (del `TableService`) y emite `setPage`. |
| **Customizer** | `shared/components/ui/customizer/customizer.ts` | `app-customizer` | Panel lateral para cambiar layout/colores en caliente (solo visual; en `admin/` puede eliminarse). |
| **Loader** | `shared/components/ui/loader/loader.ts` | `app-loader` | Spinner fullscreen que se oculta tras 2s. Montado en `app.html`. |
| **Back-to-top** | `shared/components/ui/back-to-top/back-to-top.ts` | `app-back-to-top` | Botón flotante para volver al inicio. |
| **Feather Icon** | `shared/components/ui/feather-icon/feather-icon.ts` | `app-feather-icon` | Render de iconos de `feather-icons`. Input `icon`, `class`. |
| **SVG Icon** | `shared/components/ui/svg-icon/svg-icon.ts` | `app-svg-icon` | Render de iconos SVG internos del tema (`public/assets/svg/`). |

### 4.1.1. Modales predefinidos (`shared/components/ui/modal/`)

Todos usan `NgbActiveModal` (inyectado) y se abren desde un feature con `NgbModal.open(Componente, { size, centered })`.

| Modal | Ruta completa | Clase / selector | Uso |
|-------|---------------|------------------|-----|
| **Añadir etiqueta** | `shared/components/ui/modal/add-label-modal/add-label-modal.ts` | `AddLabelModal` / `app-add-label-modal` | Modal simple con input de nombre de etiqueta. |
| **Dirección** | `shared/components/ui/modal/address-modal/address-modal.ts` | `AddressModal` / `app-address-modal` | Formulario de dirección con país/estado (usa `ng-select2-component` + `shared/data/country.ts`). |
| **Crear categoría** | `shared/components/ui/modal/create-category-modal/create-category-modal.ts` | `CreateCategoryModal` / `app-create-category-modal` | Formulario con `@kolkov/angular-editor`, Select2 de categoría padre/tipo, datos de `shared/data/category.ts`. |
| **Permisos** | `shared/components/ui/modal/permission-modal/permission-modal.ts` | `PermissionModal` / `app-permission-modal` | Matriz de permisos por módulo con check-all; datos en `shared/data/user.ts`. |
| **Detalles de producto** | `shared/components/ui/modal/product-details-modal/product-details-modal.ts` | `ProductDetailsModal` / `app-product-details-modal` | Muestra imagen, precio, selector de cantidad. `@Input() productDetail: IProduct`. |
| **Reseña** | `shared/components/ui/modal/review-modal/review-modal.ts` | `ReviewModal` / `app-review-modal` | Formulario reactivo con `NgbRating` (rating 0-5), nombre y descripción. |

**Patrón para abrir un modal** (ejemplo real, `components/category/category.ts:77-79`):

```ts
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCategoryModal } from '../../shared/components/ui/modal/create-category-modal/create-category-modal';

export class Category {
  private modal = inject(NgbModal);

  openCategoryModal() {
    this.modal.open(CreateCategoryModal, { size: 'lg', centered: true });
  }
}
```

**Modales específicos de una feature** (viven junto a la feature, no en `shared/`):

| Modal | Ruta |
|-------|------|
| Bookmark (marcadores) | `components/bookmark/widgets/bookmark-modal/` |
| Tag de bookmark | `components/bookmark/widgets/tag-modal/` |
| Compose email | `components/mail-box/widgets/compose-email-modal/` |
| Contacto nuevo / categoría / imprimir contacto | `components/contacts/widgets/add-contact-modal/`, `.../category-modal/`, `.../print-contact-modal/` |
| Manage API token | `components/manage-api/manage-api-modal/` |
| Modales de demo UI Kit | `components/ui-kits/modal/widgets/` (balance, profile, result, scrolling-content, simple, size, tooltip-popover, cuba-signup) |
| Modal animado (demo) | `components/bonus-ui/animated-modal/` |

> **Regla general**: si el modal es genuinamente reutilizable entre features, va en `shared/components/ui/modal/`. Si es exclusivo de una feature, vive en `components/<feature>/widgets/<nombre>-modal/`.

### 4.2. `shared/services/`

| Servicio | Ruta | Responsabilidad |
|----------|------|-----------------|
| `LayoutService` | `shared/services/layout.service.ts` | Config global de layout (tipo de sidebar, colores, versión ltr/rtl, sidebar_type). Método `applyLayout(nombre)` que mapea nombres de layout (`dubai`, `tokyo`, `paris`, etc.) a clases CSS. |
| `NavService` | `shared/services/nav.service.ts` | Flags de estado del header (idioma abierto, fullscreen, búsqueda abierta). |
| `TableService` | `shared/services/table.service.ts` | Paginador reutilizable: `getPager(total, currentPage, pageSize)` → `IPagination`. |
| `CartService` | `shared/services/cart.service.ts` | Lógica de carrito (demo ecommerce). |
| `WishlistService` | `shared/services/wishlist.service.ts` | Lista de deseos (demo ecommerce). |
| `ProductService` | `shared/services/product.service.ts` | CRUD mock de productos. |
| `ChatService` | `shared/services/chat.service.ts` | Lógica mock de chat. |
| `ContactService` | `shared/services/contact.service.ts` | Lógica mock de contactos. |
| `TaskService` | `shared/services/task.service.ts` | Lógica mock de tareas. |

> **Nota para `admin/`**: los servicios mock (`ProductService`, `CartService`, etc.) deben reemplazarse por servicios HTTP reales que consuman el backend NestJS. Mantener `LayoutService`, `NavService` y `TableService` tal cual — son de infraestructura UI.

### 4.3. `shared/data/` — mocks y datasets

Cada archivo exporta arrays con datos de demostración que alimentan las features. Útil como plantilla de estructura cuando se sustituye por datos reales del backend.

Archivos: `animation.ts`, `api.ts`, `blog.ts`, `bonus-ui/*`, `bookmark.ts`, `bootstrap-table.ts`, `buttons.ts`, `cart.ts`, `category.ts`, `charts/*`, `chat.ts`, `common.ts`, `contacts.ts`, `country.ts`, `courses.ts`, `currency.ts`, `dashboard/*`, `data-table.ts`, `email.ts`, `faq.ts`, `fileManager.ts`, `form-control.ts`, `form-layout.ts`, `form-widgets.ts`, `gallery.ts`, `header.ts`, `icons/*`, `internationalization.ts`, `jobs/*`, `knowledge-base.ts`, `layout.ts`, **`menu.ts`** (sidebar), `order.ts`, `pricing.ts`, `product.ts`, `project.ts`, `register-wizard.ts`, `reports.ts`, `review.ts`, `search-result.ts`, `seller.ts`, `social-app.ts`, `store.ts`, `subscribed-user.ts`, `support-ticket.ts`, `tasks.ts`, `timezone.ts`, `todo.ts`, `ui-kits/*`, `user.ts`, `widgets/*`, `wishlist.ts`.

### 4.4. `shared/interface/` — contratos TypeScript

Principales interfaces:

- **`common.ts`**: `ICardToggleOptions`, `ITableConfigs<T>`, `ITableColumn`, `ITableClickedAction<TData,TValue>`, `IPagination`, `IPageSizeOptions`, `IHasId`, `IGoogleMapMarkers`. **Imprescindibles al usar `Table`/`Pagination`**.
- **`menu.ts`**: `IMenu` — estructura del sidebar.
- **`layout.ts`**, **`header.ts`**: interfaces de configuración visual.
- Una interfaz por dominio: `user.ts`, `product.ts`, `order.ts`, `project.ts`, `category.ts`, `blog.ts`, `chat.ts`, `email.ts`, etc.

### 4.5. `shared/directives/`

- `outside.directive.ts` → `OutsideDirective` (selector `[appOutside]`): emite evento al hacer clic fuera del elemento. Se usa en dropdowns personalizados.

### 4.6. `shared/guard/`

- `admin.guard.ts` → `AdminGuard` (verifica `localStorage.user`).

### 4.7. `shared/routes/`

- `content.routes.ts` → rutas dentro del shell (con header/sidebar).
- `full.routes.ts` → rutas a pantalla completa (auth demos, errores, invoices, coming-soon).

---

## 5. `src/app/components/` — features y páginas

Cada carpeta es una **feature** con su propio `*.routes.ts`. Todas están registradas en `shared/routes/content.routes.ts` (excepto invoices/authentication/error-pages/coming-soon que van en `full.routes.ts`).

Convención interna de cada feature:
- `<feature>.routes.ts` — define rutas hijas con `loadComponent`.
- `<feature>.ts/html/scss` — componente principal (opcional si la feature sólo agrupa subpáginas).
- `widgets/` — subcomponentes exclusivos de la feature (incluye modales específicos).
- Subcarpetas por página hija (p.ej. `add-user/`, `user-list/`, `user-profile/`).

### 5.1. Dashboards — `components/dashboards/`

Ruta base: `/dashboard/*` (ver `dashboard.routes.ts`).

| Ruta | Carpeta | Componente |
|------|---------|------------|
| `/dashboard/default` | `default/` | `Default` |
| `/dashboard/e-commerce` | `ecommerce/` | `Ecommerce` |
| `/dashboard/online-course` | `online-course/` | `OnlineCourse` |
| `/dashboard/crypto` | `crypto/` | `Crypto` |
| `/dashboard/social` | `social/` | `Social` |
| `/dashboard/nft` | `nft/` | `Nft` |
| `/dashboard/school-management` | `school-management/` | `SchoolManagement` |
| `/dashboard/pos` | `pos/` | `Pos` |
| `/dashboard/crm` | `crm/` | `Crm` |
| `/dashboard/analytics` | `analytics/` | `Analytics` |
| `/dashboard/hr` | `hr/` | `Hr` |
| `/dashboard/projects` | `projects/` | `Projects` |
| `/dashboard/logistics` | `logistics/` | `Logistics` **← referencia para el dashboard de Rapix**. |

### 5.2. Autenticación (demos) — `components/authentication/`

Ruta base: `/auth/*` (en `full.routes.ts`). **Importante**: el login real del shell está en `src/app/auth/login/` (fuera de `components/`).

Variantes: `login-simple`, `login-bg-image`, `login-bg-image-two`, `login-bg-image-three`, `login-sweet-alert`, `register`, `register-bg-image`, `register-bg-image-two`, `register-wizard`, `forgot-password`, `reset-password`, `account-restricted`, `unlock-user`, `maintenance`.

### 5.3. Usuarios — `components/users/`

| Ruta | Carpeta | Componente |
|------|---------|------------|
| `/user/add-user` | `add-user/` | `AddUser` |
| `/user/user-list` | `user-list/` | `UserList` |
| `/user/user-cards` | `user-cards/` | `UserCards` |
| `/user/user-profile/:id` | `user-profile/` | `UserProfile` |
| `/user/roles-permission` | `roles-permission/` | `RolesPermission` (usa `PermissionModal`) |

### 5.4. Órdenes / Pedidos — `components/orders/`

| Ruta | Carpeta | Componente |
|------|---------|------------|
| `/order/list` | (raíz) | `Orders` |
| `/order/:id` | `order-details/` | `OrderDetails` |

Widgets: `widgets/billing-details/`, `widgets/customer-details/`, `widgets/order-filter/`. **Plantilla natural para la feature de Pedidos de Rapix** (`PedidoControlador` del backend).

### 5.5. Productos — `components/product/`

Subrutas: `create-product/`, `product-details/`, `product-list/`. Widgets: `widgets/` (varios).

### 5.6. Categorías — `components/category/`

Componente `Category` (`category.ts`) es el mejor ejemplo del **patrón completo Tabla + Modal + acciones fila**: usa `Table`, `CreateCategoryModal`, `ITableConfigs`, `ITableClickedAction`, filtro `widgets/category-filter/`.

### 5.7. Tablas — `components/table/`

- `bootstrap-tables/basic-table/` — tablas estáticas Bootstrap.
- `bootstrap-tables/table-components/` — variantes con estilos/estados.
- `data-table/` (`DataTable`) — tabla dinámica con `shared/data/data-table.ts`.

### 5.8. Formularios — `components/forms/`

- `form-controls/base-input/`, `checkbox-radio/`, `form-validation/`, `input-groups/`, `input-mask/`, `mega-options/`.
- `form-layout/form-wizard1/`, `form-wizard2/`, `two-factor/`.
- `form-widgets/clipboard/`, `datepicker/`, `select2/`, `switch/`, `touchspin/`, `typeahead/`.

### 5.9. Charts — `components/charts/`

- `apex-chart/`, `chartist-chart/`, `chatjs-chart/`, `google-chart/`.

### 5.10. Mapas — `components/maps/`

- `google-map/` (Google Maps Angular).
- `leaflet-map/` (Leaflet + bluehalo). **Plantilla para las vistas geográficas de zonas/rutas de Rapix** (integración con Mapbox).

### 5.11. Mensajería y comunicación

- `chat/` — chat estilo Slack.
- `mail-box/` — bandeja de correo completa (con `widgets/compose-email-modal/`, `mail-details/`, `mail-header/`, `sidebar/`).
- `contacts/` — lista de contactos (con varios modales en `widgets/`).

### 5.12. Gestión de archivos y galerías

- `file-manager/` — explorador de archivos tipo drive.
- `gallery/` — galería de imágenes.

### 5.13. Productividad

- `task/` — listado/creación de tareas.
- `to-do/` — lista de pendientes.
- `calendar/` — calendario completo con eventos (`angular-calendar`).
- `kanban/` — tablero Kanban con Syncfusion.
- `bookmark/` — marcadores (con modales en `widgets/`).

### 5.14. Reportes — `components/reports/`

Subrutas: `customer-order-report/`, `product-report/`, `sales-report/`, `sales-return-report/`.
**Plantilla para los reportes del delivery** (cierres financieros, entregas por rider, etc.).

### 5.15. Otros ecommerce

- `cart/`, `wishlist/`, `checkout/` (usa `AddressModal`), `review/` (usa `ReviewModal`), `ecommerce-setting/`, `pricing/`, `invoices/` (6 variantes a pantalla completa), `seller/`.

### 5.16. Páginas estáticas / utilitarias

- `error-pages/` — 403, 404, 500.
- `coming-soon/` — countdown.
- `sample-page/`, `sitemap/`, `faq/`, `subscribed-user/`, `support-ticket/`, `knowledge-base/`, `manage-api/` (con `manage-api-modal/`), `internationalization/`, `search-result/`, `blog/`, `jobs/`, `courses/`, `projects/`, `social-app/`.

### 5.17. UI Kits (referencia visual) — `components/ui-kits/`

Demos completos para copiar estilos/markup: `accordion/`, `alert/`, `avatars/`, `divider/`, `dropdown/`, `grid/`, `helper-classes/`, `lists/`, **`modal/`** (con subcarpetas `basic-modals/`, `centered-modal/`, `cuba-custom-modals/`, `full-screen-modals/`, `grid-modal/`, `scrolling-long-content-modal/`, `sizes-modals/`, `static-backdrop-modal/`, `toggle-between-modal/` y `widgets/` con modales demo), `navigate-links/`, `offcanvas/`, `placeholders/`, `popover/`, `progress/`, `tabs/`, `tag-pills/`, `tooltip/`, `typography/`.

### 5.18. Bonus UI — `components/bonus-ui/`

Componentes visuales adicionales: `animated-modal/`, `basic-cards/`, `block-ui/`, `breadcrumb/`, `creative-card/`, `draggable-card/`, `dropzone/`, `image-crop/`, `owl-carousel/`, `pagination/`, `range-slider/`, `rating/`, `ratios/`, `ribbons/`, `scrollable/`, `scrollspy/`, `sweetalert2/`, `timeline/`, `toast/`, `tree-view/`.

### 5.19. Editores / Íconos / Widgets / Botones / Animación

- `editors/ngx-editor/`, `editors/mde-editor/`.
- `icons/feather-icon/`, `flag-icon/`, `font-awesome-icon/`, `ico-icon/`, `themify-icon/`, `weather-icon/`.
- `widgets/` (widgets de dashboard: generales + charts).
- `button/`.
- `animation/`.

---

## 6. Flujo típico para añadir una funcionalidad nueva (en `admin/`)

Cuando necesites implementar una feature nueva (ejemplo: "Gestión de Zonas" con listado, crear, editar y modal de confirmación):

1. **Escoger feature análoga en `admin-template/`**:
   - Listado con tabla + modal de creación → copiar `components/category/` (ver §5.6).
   - Formulario wizard → `components/forms/form-layout/form-wizard1/`.
   - Dashboard con tarjetas y gráficos → `components/dashboards/default/` o `logistics/`.
   - Tabla con filtros de fecha → `components/orders/`.
   - Mapa con polígonos → `components/maps/leaflet-map/`.
   - Reportes con exportación → `components/reports/sales-report/`.
2. **Reutilizar UI genérica** de `shared/components/ui/` (tabla, card, breadcrumbs, paginación, modales) en lugar de reescribir.
3. **Abrir modal**:
   - Si es reutilizable → `shared/components/ui/modal/<nombre>-modal/` (ver §4.1.1).
   - Si es exclusivo → `components/<feature>/widgets/<nombre>-modal/`.
   - Importar `NgbModal` con `inject(NgbModal)` y llamar `modal.open(MiModal, { size: 'lg', centered: true })`.
4. **Registrar ruta**: crear `<feature>.routes.ts` y añadir la entrada en `shared/routes/content.routes.ts` (o `full.routes.ts` si no necesita sidebar).
5. **Añadir al sidebar**: editar `shared/data/menu.ts`.
6. **Traducir al español**: seguir el glosario maestro del `CLAUDE.md` raíz del repo (identificadores, rutas, enums, mensajes) — esto es obligatorio en `admin/`, no en `admin-template/`.
7. **Reemplazar mocks**: sustituir importaciones desde `shared/data/*.ts` por llamadas HTTP reales a los endpoints NestJS definidos en `docs/API_ENDPOINTS.md`.

---

## 7. Ubicación rápida — tabla maestra

| Necesito… | Mirar en… |
|-----------|-----------|
| Un modal reutilizable | `src/app/shared/components/ui/modal/` |
| Una tabla configurable con paginación y acciones | `src/app/shared/components/ui/table/table.ts` |
| Ejemplo de abrir modal desde un listado | `src/app/components/category/category.ts` |
| Tarjeta con header + dropdown | `src/app/shared/components/ui/card/card.ts` |
| Breadcrumbs | `src/app/shared/components/ui/breadcrumbs/breadcrumbs.ts` |
| Iconos Feather / SVG del tema | `src/app/shared/components/ui/feather-icon/` / `svg-icon/` |
| Sidebar / Header / Footer del shell | `src/app/shared/components/{sidebar,header,footer}/` |
| Entradas del menú lateral | `src/app/shared/data/menu.ts` |
| Layout con/sin shell | `src/app/shared/components/layout/{content,full}/` |
| Rutas globales | `src/app/app.routes.ts` + `src/app/shared/routes/{content,full}.routes.ts` |
| Guard de autenticación | `src/app/shared/guard/admin.guard.ts` |
| Login real del shell | `src/app/auth/login/login.ts` |
| Configuración global (providers) | `src/app/app.config.ts` |
| Paginador utilitario (`IPagination`) | `src/app/shared/services/table.service.ts` + `shared/interface/common.ts` |
| Interfaces de tabla (`ITableConfigs`, `ITableClickedAction`) | `src/app/shared/interface/common.ts` |
| Dashboard de logística (punto de partida del sistema) | `src/app/components/dashboards/logistics/` |
| Listado de órdenes con filtros | `src/app/components/orders/` |
| Mapa con Leaflet | `src/app/components/maps/leaflet-map/` |
| Wizard de formulario | `src/app/components/forms/form-layout/form-wizard1/` |
| Reportes | `src/app/components/reports/` |
| Calendario de eventos | `src/app/components/calendar/` |
| Kanban | `src/app/components/kanban/` |
| Chat | `src/app/components/chat/` |
| Bandeja de correo (inbox) | `src/app/components/mail-box/` |
| Gestión de archivos | `src/app/components/file-manager/` |
| Cropping de imagen | `src/app/components/bonus-ui/image-crop/` |
| Dropzone (subir archivos) | `src/app/components/bonus-ui/dropzone/` |
| SweetAlert2 | `src/app/components/bonus-ui/sweetalert2/` |
| Toast (ngx-toastr) | `src/app/components/bonus-ui/toast/` |
| Gráficos ApexCharts | `src/app/components/charts/apex-chart/` |
| Editor WYSIWYG | `src/app/components/editors/ngx-editor/` |
| Datepicker | `src/app/components/forms/form-widgets/datepicker/` |
| Select2 | `src/app/components/forms/form-widgets/select2/` |
| Timeline | `src/app/components/bonus-ui/timeline/` |
| Error 403/404/500 | `src/app/components/error-pages/` |
| Coming Soon | `src/app/components/coming-soon/` |
| Invoices (facturas printables) | `src/app/components/invoices/` |

---

## 8. Notas importantes

- **No modificar `admin-template/` desde trabajos de Rapix**: este directorio debe quedar como plantilla de referencia intacta. Todo cambio real va a `admin/`.
- **Versiones críticas**: Angular 21 + `@ng-bootstrap/ng-bootstrap` 20 + `bootstrap` 5.3. Respetar estas versiones al copiar snippets.
- **Assets (`public/assets/`)**: incluye SCSS maestro, imágenes, i18n y SVG del tema. Si un componente copiado se ve roto, probablemente falte copiar el asset correspondiente.
- **Standalone components**: al copiar un componente al proyecto `admin/`, recordar revisar y completar los `imports:` del `@Component` — son explícitos (no hay NgModule que los provea).
- **Paths relativos**: la mayoría de componentes usan imports relativos largos (`../../shared/...`). Considerar configurar `paths` en `tsconfig.json` del proyecto `admin/` si conviene (`@shared/*`, `@components/*`).
