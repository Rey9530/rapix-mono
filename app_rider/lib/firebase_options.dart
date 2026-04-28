// TODO(firebase): regenerar este archivo con `flutterfire configure` cuando
// exista un proyecto de Firebase real para Rapix Repartidor.
//
// Mientras tanto, esta variable expone valores vacíos para que la app
// compile sin Firebase. `Firebase.initializeApp()` se invoca dentro de
// un try/catch en `main.dart` y degrada silenciosamente a "FCM no configurado".
//
// Pasos cuando se configure Firebase:
//   1. `dart pub global activate flutterfire_cli`
//   2. `flutterfire configure --project=<id-proyecto>`
//   3. Reemplazar este archivo con el generado por la CLI.
//   4. Pegar `google-services.json` en `android/app/` y `GoogleService-Info.plist`
//      en `ios/Runner/` (también lo hace flutterfire CLI por nosotros).
import 'package:firebase_core/firebase_core.dart';

class OpcionesFirebaseDefecto {
  static FirebaseOptions get currentPlatform {
    throw UnsupportedError(
      'Firebase no está configurado todavía. '
      'Ejecutá `flutterfire configure` y regenerá lib/firebase_options.dart.',
    );
  }
}
