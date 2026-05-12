/// Resuelve la ruta GoRouter a la que debe navegar la app cuando se recibe
/// un mensaje FCM, segun los datos adjuntos por el backend.
///
/// El backend incluye en `data` la `plantillaClave` (ej. `PEDIDO_ASIGNADO_VENDEDOR`)
/// y, para notificaciones de pedido, `pedidoId` y `codigoSeguimiento`.
String? rutaDesdePayload(Map<String, dynamic> datos) {
  final clave = datos['plantillaClave']?.toString();
  if (clave == null) return null;

  if (clave.startsWith('PEDIDO_')) {
    final pedidoId = datos['pedidoId']?.toString();
    if (pedidoId != null && pedidoId.isNotEmpty) {
      return '/pedidos/$pedidoId';
    }
    return '/pedidos';
  }

  if (clave.startsWith('PAQUETE_')) {
    return '/paquetes';
  }

  return null;
}
