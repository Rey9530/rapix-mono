import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

import 'app.dart';
import 'nucleo/config/entorno.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  if (Entorno.tokenMapbox.isNotEmpty) {
    MapboxOptions.setAccessToken(Entorno.tokenMapbox);
  }

  runApp(const ProviderScope(child: AppClientes()));
}
