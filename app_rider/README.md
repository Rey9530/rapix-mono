# app_rider — App móvil del repartidor (Rapix)

App Flutter que cubre el flujo completo del repartidor: login, listas de
recogidas/entregas, mapa con ruta optimizada, captura de comprobante (foto + firma),
y cierre financiero diario.

## Stack

- Flutter 3.41+ / Dart 3.11+
- Riverpod (estado), go_router (navegación)
- Dio + flutter_secure_storage
- mapbox_maps_flutter (mapa) — endpoint backend `/api/v1/mapas/optimizar-ruta`
- image_picker + signature (comprobante)
- firebase_messaging + flutter_local_notifications (push)

## Variables de entorno (Dart-define)

| Variable        | Default                            | Descripción                                                      |
|-----------------|------------------------------------|------------------------------------------------------------------|
| `API_URL`       | `http://10.0.2.2:3000/api/v1`      | Base URL del backend NestJS (10.0.2.2 = host desde emulador Android). |
| `MAPBOX_TOKEN`  | *(vacío)*                          | Token público (`pk.xxx`) de Mapbox. Sin esto, el mapa muestra mensaje. |

## Comandos

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs
dart analyze

flutter run \
  --dart-define=API_URL=http://10.0.2.2:3000/api/v1 \
  --dart-define=MAPBOX_TOKEN=pk.xxxxx
```

Para device físico, reemplazar `10.0.2.2` por la IP local de tu máquina.

## TODO — Firebase / FCM

Las dependencias de FCM ya están instaladas, pero el proyecto de Firebase **no está
configurado todavía**. Mientras eso no esté:

- `Firebase.initializeApp()` falla silenciosamente en `main.dart` y la app sigue
  funcionando sin push.
- `lib/firebase_options.dart` es un placeholder.
- Faltan `android/app/google-services.json` y `ios/Runner/GoogleService-Info.plist`.

Para habilitar push:

1. Crear proyecto en console.firebase.google.com.
2. `dart pub global activate flutterfire_cli`
3. Desde `app_rider/`: `flutterfire configure --project=<id-proyecto>`
4. La CLI deja los archivos correctos en su lugar y regenera `firebase_options.dart`.
5. En `lib/main.dart` cambiar `Firebase.initializeApp()` por
   `Firebase.initializeApp(options: OpcionesFirebaseDefecto.currentPlatform)`.

## Backend requerido

- NestJS arrancado en `localhost:3000` (`yarn start:dev` desde `backend/`).
- Endpoint `/api/v1/mapas/optimizar-ruta` (Fase 8 — agregado en backend).
- `MAPBOX_TOKEN` configurado en `backend/.env`.

## Estructura

Ver detalle en `lib/`:
- `core/` — config, network, storage, router, theme
- `data/` — modelos freezed + repositorios Dio
- `features/` — pantallas + controladores Riverpod
- `servicios/` — push, ubicación
- `widgets/` — UI compartida

## Verificación manual (golden path)

1. Login con `repartidor1@delivery.com / Repartidor123!`.
2. Pestaña Recoger: ver pedidos `ASIGNADO`, abrir uno, "Recoger paquete".
3. Continuar transiciones: en tránsito → llegar al punto → tomar entrega.
4. Pestaña Entregar: ver pedido `EN_REPARTO`, "Confirmar entrega" → tomar foto +
   firma + nombre + notas → confirmar.
5. Pestaña Mapa: ver waypoints + ruta dibujada.
6. Pestaña Cierre: ver monto esperado, ingresar reportado + foto comprobante,
   enviar. Reintento del mismo día → bloqueado por `CIERRE_YA_EXISTE`.
