import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../core/storage/almacenamiento_seguro.dart';
import '../data/repositorios/tokens_dispositivo_repositorio.dart';

const String _canalAndroidId = 'rapix-rider-canal';
const String _canalAndroidNombre = 'Rapix Repartidor';
const String _canalAndroidDescripcion = 'Notificaciones para repartidores';

/// Servicio de push notifications.
///
/// Requiere que `google-services.json` y `GoogleService-Info.plist` esten
/// en su sitio y que `Firebase.initializeApp()` haya corrido en `main.dart`.
class ServicioPush {
  final TokensDispositivoRepositorio repositorio;
  final AlmacenamientoSeguro almacen;
  final FlutterLocalNotificationsPlugin _notifLocal =
      FlutterLocalNotificationsPlugin();

  final ValueNotifier<String?> deepLinkPendiente = ValueNotifier<String?>(null);

  bool _inicializado = false;

  ServicioPush({required this.repositorio, required this.almacen});

  Future<void> iniciar() async {
    if (_inicializado) return;
    _inicializado = true;

    final messaging = FirebaseMessaging.instance;

    final settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    if (settings.authorizationStatus == AuthorizationStatus.denied) {
      _inicializado = false;
      return;
    }

    await _configurarNotifLocal();

    final token = await messaging.getToken();
    if (token != null) {
      await _registrar(token);
    }

    messaging.onTokenRefresh.listen(_registrar);

    await messaging.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    FirebaseMessaging.onMessage.listen(_alRecibirForeground);
    FirebaseMessaging.onMessageOpenedApp.listen(_alAbrirDesdePush);

    final inicial = await messaging.getInitialMessage();
    if (inicial != null) {
      _alAbrirDesdePush(inicial);
    }
  }

  /// Llamar al cerrar sesion: revoca en el backend, borra del device y limpia
  /// la copia local.
  Future<void> revocar() async {
    final token = await almacen.tokenFcm();
    if (token != null && token.isNotEmpty) {
      try {
        await repositorio.eliminar(token);
      } catch (_) {
        // Si la red falla o el token ya no existe en backend, igual seguimos.
      }
    }
    try {
      await FirebaseMessaging.instance.deleteToken();
    } catch (_) {
      // Algunos dispositivos no pueden borrar el token; no es fatal.
    }
    await almacen.eliminarTokenFcm();
  }

  Future<void> _registrar(String token) async {
    final guardado = await almacen.tokenFcm();
    if (guardado == token) return;

    final plataforma = Platform.isAndroid ? 'ANDROID' : 'IOS';
    try {
      await repositorio.registrar(token: token, plataforma: plataforma);
      await almacen.guardarTokenFcm(token);
    } catch (_) {
      // Errores de red no bloquean el ciclo de vida de push.
    }
  }

  Future<void> _configurarNotifLocal() async {
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosInit = DarwinInitializationSettings();
    await _notifLocal.initialize(
      const InitializationSettings(android: androidInit, iOS: iosInit),
      onDidReceiveNotificationResponse: (respuesta) {
        final payload = respuesta.payload;
        if (payload == null || payload.isEmpty) return;
        deepLinkPendiente.value = payload;
      },
    );

    if (Platform.isAndroid) {
      final androidPlugin = _notifLocal
          .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin
          >();
      await androidPlugin?.createNotificationChannel(
        const AndroidNotificationChannel(
          _canalAndroidId,
          _canalAndroidNombre,
          description: _canalAndroidDescripcion,
          importance: Importance.high,
        ),
      );
    }
  }

  Future<void> _alRecibirForeground(RemoteMessage mensaje) async {
    final notif = mensaje.notification;
    if (notif == null) return;
    final ruta = _rutaDesdePayload(mensaje.data);
    await _notifLocal.show(
      mensaje.hashCode,
      notif.title,
      notif.body,
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

  void _alAbrirDesdePush(RemoteMessage mensaje) {
    final ruta = _rutaDesdePayload(mensaje.data);
    if (ruta != null) {
      deepLinkPendiente.value = ruta;
    }
  }
}

String? _rutaDesdePayload(Map<String, dynamic> datos) {
  final pedidoId = datos['pedidoId']?.toString();
  final clave = datos['plantillaClave']?.toString();

  if (pedidoId != null && pedidoId.isNotEmpty) {
    if (clave == null || clave.startsWith('PEDIDO_')) {
      return '/inicio/recogidas/$pedidoId';
    }
  }
  return null;
}
