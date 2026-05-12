import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

import 'app.dart';
import 'nucleo/config/entorno.dart';
import 'nucleo/notificaciones/manejador_background.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  if (Entorno.tokenMapbox.isNotEmpty) {
    MapboxOptions.setAccessToken(Entorno.tokenMapbox);
  }

  runApp(const ProviderScope(child: AppClientes()));
}
