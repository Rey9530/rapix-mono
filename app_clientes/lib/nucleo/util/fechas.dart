import 'package:intl/intl.dart';

String fechaLegible(DateTime fecha) {
  final local = fecha.toLocal();
  return DateFormat('d MMM y, h:mm a', 'es').format(local);
}

String tiempoRelativo(DateTime fecha) {
  final ahora = DateTime.now();
  final diferencia = ahora.difference(fecha.toLocal());
  if (diferencia.inSeconds.abs() < 60) return 'hace un momento';
  if (diferencia.inMinutes.abs() < 60) {
    final m = diferencia.inMinutes.abs();
    return 'hace $m ${m == 1 ? 'minuto' : 'minutos'}';
  }
  if (diferencia.inHours.abs() < 24) {
    final h = diferencia.inHours.abs();
    return 'hace $h ${h == 1 ? 'hora' : 'horas'}';
  }
  if (diferencia.inDays.abs() < 7) {
    final d = diferencia.inDays.abs();
    return 'hace $d ${d == 1 ? 'día' : 'días'}';
  }
  return fechaLegible(fecha);
}

/// Devuelve "miembro desde {mes abreviado} {año}" en español.
String miembroDesde(DateTime fecha) {
  final local = fecha.toLocal();
  return 'miembro desde ${DateFormat('MMM y', 'es').format(local)}';
}
