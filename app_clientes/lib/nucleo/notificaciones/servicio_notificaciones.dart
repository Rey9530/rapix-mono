import 'dart:io' show Platform;

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'manejador_deep_link.dart';

const String _canalAndroidId = 'rapix_notificaciones_default';
const String _canalAndroidNombre = 'Notificaciones Rapix';
const String _canalAndroidDescripcion =
    'Avisos sobre pedidos, paquetes y cuenta.';

class ServicioNotificaciones {
  ServicioNotificaciones();

  final FirebaseMessaging _mensajeria = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _local =
      FlutterLocalNotificationsPlugin();

  final ValueNotifier<String?> deepLinkPendiente = ValueNotifier<String?>(null);

  bool _inicializado = false;
  bool _refrescoSuscrito = false;

  Future<void> inicializar() async {
    if (_inicializado) return;
    _inicializado = true;

    await _mensajeria.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    const inicializacionAndroid = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );
    const inicializacionIos = DarwinInitializationSettings();
    await _local.initialize(
      const InitializationSettings(
        android: inicializacionAndroid,
        iOS: inicializacionIos,
      ),
      onDidReceiveNotificationResponse: (respuesta) {
        final payload = respuesta.payload;
        if (payload == null || payload.isEmpty) return;
        deepLinkPendiente.value = payload;
      },
    );

    if (Platform.isAndroid) {
      final canal = _local
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();
      await canal?.createNotificationChannel(
        const AndroidNotificationChannel(
          _canalAndroidId,
          _canalAndroidNombre,
          description: _canalAndroidDescripcion,
          importance: Importance.high,
        ),
      );
    }

    await _mensajeria.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    FirebaseMessaging.onMessage.listen(_alRecibirEnPrimerPlano);
    FirebaseMessaging.onMessageOpenedApp.listen(_alAbrirDesdeNotificacion);

    final inicial = await _mensajeria.getInitialMessage();
    if (inicial != null) {
      _alAbrirDesdeNotificacion(inicial);
    }
  }

  Future<String?> obtenerToken() async {
    try {
      return await _mensajeria.getToken();
    } catch (e) {
      if (kDebugMode) debugPrint('[FCM] error al obtener token: $e');
      return null;
    }
  }

  void escucharRefresco(void Function(String token) callback) {
    if (_refrescoSuscrito) return;
    _refrescoSuscrito = true;
    _mensajeria.onTokenRefresh.listen(callback);
  }

  Future<void> eliminarToken() async {
    try {
      await _mensajeria.deleteToken();
    } catch (e) {
      if (kDebugMode) debugPrint('[FCM] error al eliminar token: $e');
    }
  }

  Future<void> _alRecibirEnPrimerPlano(RemoteMessage mensaje) async {
    final notificacion = mensaje.notification;
    if (notificacion == null) return;

    final ruta = rutaDesdePayload(mensaje.data);
    await _local.show(
      mensaje.hashCode,
      notificacion.title,
      notificacion.body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          _canalAndroidId,
          _canalAndroidNombre,
          channelDescription: _canalAndroidDescripcion,
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(),
      ),
      payload: ruta,
    );
  }

  void _alAbrirDesdeNotificacion(RemoteMessage mensaje) {
    final ruta = rutaDesdePayload(mensaje.data);
    if (ruta != null) {
      deepLinkPendiente.value = ruta;
    }
  }
}

final servicioNotificacionesProvider = Provider<ServicioNotificaciones>((ref) {
  return ServicioNotificaciones();
});
