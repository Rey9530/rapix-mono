import 'package:flutter/material.dart';

/// Tokens de marca del rediseño Rapix.
///
/// Estos tokens replican exactamente los definidos en
/// `design_handoff_rapix/screens/tokens.js` y `design_handoff_rapix/README.md`.
/// Se usan localmente en pantallas migradas al rediseño hasta que el
/// `ColorScheme` global de [TemaApp] sea reemplazado.
class TokensRapix {
  TokensRapix._();

  // Color marca
  static const Color verde = Color(0xFF25B276);
  static const Color verdeOscuro = Color(0xFF1A8F5D);
  static const Color verdeSuave = Color(0xFFE6F6EE);
  static const Color verdeTinta = Color(0xFF0D3A26);

  // Superficies (warm-neutral)
  static const Color fondo = Color(0xFFFBFAF7);
  static const Color superficie = Color(0xFFFFFFFF);
  static const Color superficieAlt = Color(0xFFF4F2EE);
  static const Color superficieHundida = Color(0xFFEFECE6);
  static const Color contorno = Color(0xFFE2DFD8);
  static const Color contornoSuave = Color(0xFFEEEBE4);

  // Texto
  static const Color tinta = Color(0xFF13140F);
  static const Color tintaSilenciada = Color(0xFF5A5B54);
  static const Color tintaSuave = Color(0xFF8B8C84);

  // Estados destructivos
  static const Color peligro = Color(0xFFDC2626);
  static const Color peligroSuave = Color(0xFFFEE2E2);

  // Acento (estrella rating)
  static const Color ambar = Color(0xFFFBBF24);

  // Radii
  static const double radioSm = 8;
  static const double radioMd = 12;
  static const double radioLg = 16;
  static const double radioXl = 20;
  static const double radioPill = 999;

  // Sombras
  static const List<BoxShadow> sombraSm = [
    BoxShadow(
      color: Color(0x0D13140F),
      offset: Offset(0, 1),
      blurRadius: 2,
    ),
  ];

  static const List<BoxShadow> sombraMd = [
    BoxShadow(
      color: Color(0x0F13140F),
      offset: Offset(0, 4),
      blurRadius: 12,
    ),
    BoxShadow(
      color: Color(0x0A13140F),
      offset: Offset(0, 2),
      blurRadius: 4,
    ),
  ];

  static const List<BoxShadow> sombraLg = [
    BoxShadow(
      color: Color(0x1413140F),
      offset: Offset(0, 12),
      blurRadius: 32,
    ),
    BoxShadow(
      color: Color(0x0D13140F),
      offset: Offset(0, 4),
      blurRadius: 12,
    ),
  ];

  /// Mapa de colores por estado de pedido.
  ///
  /// Se mantiene la convención del enum del backend en
  /// `SCREAMING_SNAKE_CASE`. Cada [EstadoColores] expone fondo (chip),
  /// foreground (texto del chip) y dot (punto indicador).
  static const Map<String, EstadoColores> estados = {
    'PENDIENTE_ASIGNACION': EstadoColores(
      fondo: Color(0xFFFFF4E6),
      texto: Color(0xFFB45309),
      punto: Color(0xFFF59E0B),
    ),
    'ASIGNADO': EstadoColores(
      fondo: Color(0xFFDBEAFE),
      texto: Color(0xFF1D4ED8),
      punto: Color(0xFF3B82F6),
    ),
    'RECOGIDO': EstadoColores(
      fondo: Color(0xFFEDE9FE),
      texto: Color(0xFF6D28D9),
      punto: Color(0xFF8B5CF6),
    ),
    'EN_TRANSITO': EstadoColores(
      fondo: Color(0xFFE9E3FD),
      texto: Color(0xFF5B21B6),
      punto: Color(0xFF7C3AED),
    ),
    'EN_REPARTO': EstadoColores(
      fondo: Color(0xFFDBEAFE),
      texto: Color(0xFF1E40AF),
      punto: Color(0xFF2563EB),
    ),
    'ENTREGADO': EstadoColores(
      fondo: Color(0xFFDCFCE7),
      texto: Color(0xFF15803D),
      punto: Color(0xFF22C55E),
    ),
    'FALLIDO': EstadoColores(
      fondo: Color(0xFFFEE2E2),
      texto: Color(0xFFB91C1C),
      punto: Color(0xFFEF4444),
    ),
    'DEVUELTO': EstadoColores(
      fondo: Color(0xFFFEF3C7),
      texto: Color(0xFF92400E),
      punto: Color(0xFFD97706),
    ),
    'CANCELADO': EstadoColores(
      fondo: Color(0xFFF1F5F9),
      texto: Color(0xFF475569),
      punto: Color(0xFF94A3B8),
    ),
  };
}

class EstadoColores {
  const EstadoColores({
    required this.fondo,
    required this.texto,
    required this.punto,
  });

  final Color fondo;
  final Color texto;
  final Color punto;
}
