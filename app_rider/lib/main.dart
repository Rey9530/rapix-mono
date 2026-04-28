import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

import 'app.dart';
import 'core/config/entorno.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Mapbox: el token se inyecta vía --dart-define=MAPBOX_TOKEN=pk.xxx.
  if (Entorno.tokenMapbox.isNotEmpty) {
    MapboxOptions.setAccessToken(Entorno.tokenMapbox);
  }

  // Firebase: si los archivos de credenciales no están presentes, la
  // inicialización falla. La app debe seguir funcionando sin push.
  try {
    await Firebase.initializeApp();
  } catch (e) {
    if (kDebugMode) {
      debugPrint(
        'Firebase no inicializado (esperado si google-services.json no está): $e',
      );
    }
  }

  runApp(const ProviderScope(child: AppRepartidor()));
}
