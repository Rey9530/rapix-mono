import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage mensaje) async {
  await Firebase.initializeApp();
  if (kDebugMode) {
    debugPrint(
      '[FCM rider background] ${mensaje.messageId} '
      'titulo="${mensaje.notification?.title}" datos=${mensaje.data}',
    );
  }
}
