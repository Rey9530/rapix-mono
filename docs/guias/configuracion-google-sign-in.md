# Configuración de Google Sign-In

Esta guía describe paso a paso cómo crear las credenciales de Google Cloud Console necesarias para que la app Flutter (`app_clientes/`) y el backend NestJS puedan validar `idToken`s emitidos por Google.

> **Cuándo seguir esta guía**: la primera vez que se despliega el feature de Google Sign-In, o cuando se agrega una nueva plataforma (otro buildflavor, una variante release con keystore distinto, una segunda app móvil).

---

## 1. Proyecto en Google Cloud Console

1. Abrir <https://console.cloud.google.com/>.
2. Crear o seleccionar el proyecto `rapix-app` (cualquier nombre interno; el cliente final no lo ve).
3. Habilitar el API "Google People API" (opcional, solo si queremos atributos extra como foto en alta calidad).

---

## 2. Pantalla de consentimiento OAuth

`APIs & Services` → `OAuth consent screen`.

- **User type**: **External** (a menos que el deploy sea solo Workspace interno).
- **App name**: `Rapix`.
- **User support email**: el correo del owner del proyecto.
- **App logo**: subir el `assets/logo_rapix.png` del repo.
- **Scopes**: agregar **solo** los siguientes (mínimos necesarios para autenticación):
  - `email`
  - `profile`
  - `openid`
- **Authorized domains**: agregar `rapixapp.com` (o el dominio productivo del backend).
- **Test users** (mientras la app esté en modo Testing): agregar los correos de los testers internos.
- Publicar a producción (`PUBLISH APP`) cuando esté listo. Hasta entonces, los `idToken`s solo funcionan para los test users listados.

---

## 3. Credenciales OAuth 2.0

`APIs & Services` → `Credentials` → `CREATE CREDENTIALS` → `OAuth client ID`.

Se necesitan **tres** credenciales (una por plataforma). Todas se referencian desde `backend/.env` y `app_clientes/`.

### 3.1 Web Application (usada por backend y por Android)

- **Application type**: **Web application**.
- **Name**: `Rapix Web (backend + Android server)`.
- **Authorized redirect URIs**: dejar vacío (el backend no hace flujo redirect, solo verifica `idToken`).
- Guardar y copiar el **Client ID** (formato `123456-abc...apps.googleusercontent.com`).

**Dónde se usa**:
- En `backend/.env` como `GOOGLE_CLIENT_ID_WEB`. El backend valida que el `idToken` tenga este `aud`.
- En la app Flutter Android como `serverClientId` del paquete `google_sign_in` (sin esto, Android no devuelve `idToken`). Pasar vía `--dart-define=GOOGLE_CLIENT_ID_WEB=...` al `flutter run` / `flutter build`.

### 3.2 Android

- **Application type**: **Android**.
- **Name**: `Rapix Android (debug)` (y repetir para release con su huella).
- **Package name**: `com.rapixapp` (el `applicationId` definido en `app_clientes/android/app/build.gradle.kts`).
- **SHA-1 certificate fingerprint**: ver subsección 3.2.1.
- (Opcional) Agregar también SHA-256 si Cloud Console lo solicita.

**Crear dos credenciales separadas**: una con la huella del keystore de debug, otra con la del keystore de release. Ambas pueden coexistir sin conflicto.

#### 3.2.1 Obtener huellas SHA-1 y SHA-256

**Debug** (auto-generado por Flutter en `~/.android/debug.keystore`):

```bash
# Opción A (recomendada): desde el proyecto Android del app_clientes
cd app_clientes/android
./gradlew :app:signingReport

# Opción B: usando keytool directamente
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android
```

En Windows PowerShell, sustituir `~/.android` por `$env:USERPROFILE\.android`.

Buscar en la salida las líneas:
```
SHA1: AA:BB:CC:...
SHA-256: 11:22:33:...
```

**Release** (el keystore productivo que firma los APK / AAB):

```bash
keytool -list -v \
  -keystore /ruta/al/rapix-release.jks \
  -alias rapix \
  -storepass <password>
```

> **Importante**: si se usa **Google Play App Signing** (recomendado), Google reemplaza la firma local con la suya al subir el bundle. En ese caso, la SHA-1 que necesita el OAuth Client es la del **App signing key** que muestra Play Console → `Setup` → `App integrity` → `App signing key certificate`.

### 3.3 iOS

- **Application type**: **iOS**.
- **Name**: `Rapix iOS`.
- **Bundle ID**: el del Runner (típicamente `com.rapixapp`; confirmar en `app_clientes/ios/Runner.xcodeproj/project.pbxproj` buscando `PRODUCT_BUNDLE_IDENTIFIER`).
- Guardar y copiar el **Client ID** y el **iOS URL scheme** (lo necesitaremos para el `Info.plist`).

---

## 4. Archivos del proyecto a actualizar

### 4.1 Android — `google-services.json`

`app_clientes/android/app/google-services.json` ya existe (Firebase). **No** se reemplaza por una credencial de Google Cloud directamente; se actualiza desde Firebase Console:

1. Ir a <https://console.firebase.google.com/> → proyecto Rapix.
2. `Project settings` → pestaña `General` → sección `Your apps` → app Android.
3. Agregar SHA-1 y SHA-256 (sección "SHA certificate fingerprints"). Firebase los sincroniza automáticamente con el OAuth Client de Google Cloud.
4. Descargar el `google-services.json` actualizado y reemplazar `app_clientes/android/app/google-services.json`.

> Si **no** se usa Firebase para Auth pero sí para FCM (caso actual), basta con tener las SHA en Firebase para que Google Sign-In funcione. No hace falta `firebase_auth`.

### 4.2 iOS — `Info.plist` + `GoogleService-Info.plist`

Editar `app_clientes/ios/Runner/Info.plist` y agregar dentro del `<dict>` raíz:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <!-- REVERSED_CLIENT_ID del GoogleService-Info.plist
           (ej: com.googleusercontent.apps.123456-abc) -->
      <string>com.googleusercontent.apps.XXXX-YYYY</string>
    </array>
  </dict>
</array>
```

El valor de `REVERSED_CLIENT_ID` viene en `app_clientes/ios/Runner/GoogleService-Info.plist`. Si el archivo aún no tiene esa entrada, descargarlo de nuevo desde Firebase Console (registrando el iOS app si no estaba) y reemplazarlo.

### 4.3 Backend — `.env`

```env
GOOGLE_CLIENT_ID_WEB=123456-abc...apps.googleusercontent.com
GOOGLE_CLIENT_ID_ANDROID=123456-def...apps.googleusercontent.com
GOOGLE_CLIENT_ID_IOS=123456-ghi...apps.googleusercontent.com
```

El servicio `GoogleVerificadorServicio` (`backend/src/modulos/autenticacion/google-verificador.servicio.ts`) pasa los tres como array al `verifyIdToken` de `google-auth-library`. Vacíos se ignoran, pero al menos `GOOGLE_CLIENT_ID_WEB` debe estar configurado.

### 4.4 Flutter — `--dart-define`

En lugar de hardcodear el Web Client ID, se pasa en build:

```bash
flutter run \
  --dart-define=GOOGLE_CLIENT_ID_WEB=123456-abc...apps.googleusercontent.com \
  --dart-define=MAPBOX_TOKEN=... \
  --dart-define=API_URL=https://b.rapixapp.com/api/v1
```

Para builds productivos, guardar estas variables en un script de CI o en `flutter_launcher_icons.yaml` / `lib/flavor.dart` según convenga al equipo.

---

## 5. Verificación rápida

1. Backend levantado con las tres `GOOGLE_CLIENT_ID_*` configuradas:
   ```bash
   curl -X POST http://localhost:3000/api/v1/autenticacion/google \
     -H "Content-Type: application/json" \
     -d '{"idToken":"esto-es-invalido"}'
   ```
   Debe responder `401 Unauthorized` con `{"message":"Token de Google invalido",...}`. ✅

2. App Android (con `google-services.json` actualizado, SHA en Firebase y `--dart-define=GOOGLE_CLIENT_ID_WEB=...`):
   - Tocar el botón **Google** en la pantalla de login.
   - Aceptar la cuenta en el diálogo nativo.
   - La app debe llegar a `/inicio` (si la cuenta ya tenía `registroCompleto=true`) o a `/completar-registro` (cuenta nueva o sin teléfono).

3. App iOS (con `GoogleService-Info.plist` y `REVERSED_CLIENT_ID` en `Info.plist`):
   - Mismo flujo. El botón aparece como "Apple" en iOS por design del proyecto; si se quiere Google también en iOS, modificar `iniciar_sesion_pantalla.dart > _oauthSeccion`.

---

## 6. Notas y caveats

- **Rotación de keystore release**: si en algún momento se rota la huella del keystore productivo (o si Google Play decide rotar la App signing key), hay que **agregar** la nueva SHA al OAuth Client Android (no reemplazar, para permitir el periodo de transición).
- **Revocación de acceso por el usuario**: si el usuario revoca la app desde su cuenta Google (<https://myaccount.google.com/permissions>), la sesión backend sigue válida hasta que expire el refresh token (30 días). Esto es aceptable; documentado en el plan.
- **Modo Testing vs Production**: mientras la app esté en modo "Testing" en `OAuth consent screen`, solo los **test users** listados pueden autenticarse — el resto recibe `403 access_denied`. Publicar antes del lanzamiento público.
- **No exponer el Web Client ID en clientes web públicos**: si en el futuro hay una app web pública usando este mismo Client ID, tener cuidado: el Web Client ID puede usarse como `aud` en cualquier flujo OAuth; protegerlo cuando aplique.
- **iOS no usa serverClientId**: en iOS, el `idToken` que devuelve `google_sign_in` ya tiene como `aud` el iOS Client ID. Por eso `GOOGLE_CLIENT_ID_IOS` debe estar en el array de audiences del backend.

---

## 7. Recursos oficiales

- Verificar idToken en backend: <https://developers.google.com/identity/sign-in/web/backend-auth>
- google-auth-library Node: <https://github.com/googleapis/google-auth-library-nodejs>
- google_sign_in Flutter: <https://pub.dev/packages/google_sign_in>
- Google Play App Signing: <https://developer.android.com/studio/publish/app-signing>
