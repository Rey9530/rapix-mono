import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../data/repositorios/tokens_dispositivo_repositorio.dart';

/// Servicio de push notifications.
///
/// Para que esto funcione realmente necesita:
///   - `google-services.json` en `android/app/`
///   - `GoogleService-Info.plist` en `ios/Runner/`
///   - `firebase_options.dart` regenerado con `flutterfire configure`.
///
/// Ver `app_rider/README.md` (sección Firebase) para los pasos.
class ServicioPush {
  final TokensDispositivoRepositorio repositorio;
  final FlutterLocalNotificationsPlugin _notifLocal =
      FlutterLocalNotificationsPlugin();

  ServicioPush({required this.repositorio});

  Future<void> iniciar() async {
    final messaging = FirebaseMessaging.instance;

    final settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    if (settings.authorizationStatus == AuthorizationStatus.denied) {
      return;
    }

    final token = await messaging.getToken();
    if (token != null) {
      await _registrar(token);
    }

    messaging.onTokenRefresh.listen(_registrar);

    await _configurarNotifLocal();

    FirebaseMessaging.onMessage.listen(_alRecibirForeground);
    FirebaseMessaging.onMessageOpenedApp.listen(_alAbrirDesdePush);
  }

  Future<void> _registrar(String token) async {
    final plataforma = Platform.isAndroid ? 'ANDROID' : 'IOS';
    try {
      await repositorio.registrar(token: token, plataforma: plataforma);
    } catch (_) {
      // Errores de red no bloquean el ciclo de vida de push.
    }
  }

  Future<void> _configurarNotifLocal() async {
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosInit = DarwinInitializationSettings();
    await _notifLocal.initialize(
      const InitializationSettings(android: androidInit, iOS: iosInit),
    );
  }

  Future<void> _alRecibirForeground(RemoteMessage mensaje) async {
    final notif = mensaje.notification;
    if (notif == null) return;
    await _notifLocal.show(
      mensaje.hashCode,
      notif.title,
      notif.body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'rapix-rider-canal',
          'Rapix Repartidor',
          channelDescription: 'Notificaciones para repartidores',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(),
      ),
    );
  }

  void _alAbrirDesdePush(RemoteMessage mensaje) {
    // Deep link al pedido si viene en data.pedidoId.
    // Implementación completa de navegación queda pendiente de tener un GlobalKey<NavigatorState>.
    final pedidoId = mensaje.data['pedidoId'];
    if (pedidoId is String && pedidoId.isNotEmpty) {
      // TODO: navegar a /inicio/entregas/$pedidoId con un router accesible globalmente.
    }
  }
}
