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
  static const Color verde = Color(0xFF3AAA35);
  static const Color verdeOscuro = Color(0xFF006633);
  static const Color verdeSuave = Color(0xFFEAF6E9);
  static const Color verdeTinta = Color(0xFF006633);

  // Superficies (paleta oficial: blanco + grises neutros)
  static const Color fondo = Color(0xFFFFFFFF);
  static const Color superficie = Color(0xFFFFFFFF);
  static const Color superficieAlt = Color(0xFFE8E8E8);
  static const Color superficieHundida = Color(0xFFE0E0E0);
  static const Color contorno = Color(0xFFE8E8E8);
  static const Color contornoSuave = Color(0xFFF0F0F0);

  // Texto (derivado de #333333 para 3 niveles de jerarquia)
  static const Color tinta = Color(0xFF333333);
  static const Color tintaSilenciada = Color(0xFF666666);
  static const Color tintaSuave = Color(0xFF999999);

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

/// Paleta de superficies y texto en modo oscuro.
///
/// Los tokens de marca (verde, peligro, ambar) se mantienen en [TokensRapix]
/// porque no cambian entre temas. Aqui solo se redefinen las superficies y
/// los colores de texto/contorno cuyo contraste depende del modo.
class TokensRapixOscuro {
  TokensRapixOscuro._();

  // Superficies (paleta inversa: derivadas desde #333333)
  static const Color fondo = Color(0xFF1A1A1A);
  static const Color superficie = Color(0xFF2A2A2A);
  static const Color superficieAlt = Color(0xFF333333);
  static const Color superficieHundida = Color(0xFF222222);
  static const Color contorno = Color(0xFF444444);
  static const Color contornoSuave = Color(0xFF3A3A3A);

  // Texto (paleta oficial invertida)
  static const Color tinta = Color(0xFFFFFFFF);
  static const Color tintaSilenciada = Color(0xFFE8E8E8);
  static const Color tintaSuave = Color(0xFF999999);

  // Variantes para chips informativos en dark
  static const Color verdeSuave = Color(0xFF0F2E1A);
  static const Color verdeTinta = Color(0xFF3AAA35);
  static const Color peligroSuave = Color(0xFF3A1414);
}

/// Extension del [ThemeData] que expone los tokens de superficie y texto
/// del rediseno Rapix de forma theme-aware.
///
/// Acceso ergonomico: usar [tokens] (`tokens(context).fondo`) en widgets.
class TokensRapixExt extends ThemeExtension<TokensRapixExt> {
  const TokensRapixExt({
    required this.fondo,
    required this.superficie,
    required this.superficieAlt,
    required this.superficieHundida,
    required this.contorno,
    required this.contornoSuave,
    required this.tinta,
    required this.tintaSilenciada,
    required this.tintaSuave,
    required this.verdeSuave,
    required this.verdeTinta,
    required this.peligroSuave,
  });

  final Color fondo;
  final Color superficie;
  final Color superficieAlt;
  final Color superficieHundida;
  final Color contorno;
  final Color contornoSuave;
  final Color tinta;
  final Color tintaSilenciada;
  final Color tintaSuave;
  final Color verdeSuave;
  final Color verdeTinta;
  final Color peligroSuave;

  static const TokensRapixExt claro = TokensRapixExt(
    fondo: TokensRapix.fondo,
    superficie: TokensRapix.superficie,
    superficieAlt: TokensRapix.superficieAlt,
    superficieHundida: TokensRapix.superficieHundida,
    contorno: TokensRapix.contorno,
    contornoSuave: TokensRapix.contornoSuave,
    tinta: TokensRapix.tinta,
    tintaSilenciada: TokensRapix.tintaSilenciada,
    tintaSuave: TokensRapix.tintaSuave,
    verdeSuave: TokensRapix.verdeSuave,
    verdeTinta: TokensRapix.verdeTinta,
    peligroSuave: TokensRapix.peligroSuave,
  );

  static const TokensRapixExt oscuro = TokensRapixExt(
    fondo: TokensRapixOscuro.fondo,
    superficie: TokensRapixOscuro.superficie,
    superficieAlt: TokensRapixOscuro.superficieAlt,
    superficieHundida: TokensRapixOscuro.superficieHundida,
    contorno: TokensRapixOscuro.contorno,
    contornoSuave: TokensRapixOscuro.contornoSuave,
    tinta: TokensRapixOscuro.tinta,
    tintaSilenciada: TokensRapixOscuro.tintaSilenciada,
    tintaSuave: TokensRapixOscuro.tintaSuave,
    verdeSuave: TokensRapixOscuro.verdeSuave,
    verdeTinta: TokensRapixOscuro.verdeTinta,
    peligroSuave: TokensRapixOscuro.peligroSuave,
  );

  @override
  TokensRapixExt copyWith({
    Color? fondo,
    Color? superficie,
    Color? superficieAlt,
    Color? superficieHundida,
    Color? contorno,
    Color? contornoSuave,
    Color? tinta,
    Color? tintaSilenciada,
    Color? tintaSuave,
    Color? verdeSuave,
    Color? verdeTinta,
    Color? peligroSuave,
  }) {
    return TokensRapixExt(
      fondo: fondo ?? this.fondo,
      superficie: superficie ?? this.superficie,
      superficieAlt: superficieAlt ?? this.superficieAlt,
      superficieHundida: superficieHundida ?? this.superficieHundida,
      contorno: contorno ?? this.contorno,
      contornoSuave: contornoSuave ?? this.contornoSuave,
      tinta: tinta ?? this.tinta,
      tintaSilenciada: tintaSilenciada ?? this.tintaSilenciada,
      tintaSuave: tintaSuave ?? this.tintaSuave,
      verdeSuave: verdeSuave ?? this.verdeSuave,
      verdeTinta: verdeTinta ?? this.verdeTinta,
      peligroSuave: peligroSuave ?? this.peligroSuave,
    );
  }

  @override
  TokensRapixExt lerp(ThemeExtension<TokensRapixExt>? other, double t) {
    if (other is! TokensRapixExt) return this;
    return TokensRapixExt(
      fondo: Color.lerp(fondo, other.fondo, t)!,
      superficie: Color.lerp(superficie, other.superficie, t)!,
      superficieAlt: Color.lerp(superficieAlt, other.superficieAlt, t)!,
      superficieHundida:
          Color.lerp(superficieHundida, other.superficieHundida, t)!,
      contorno: Color.lerp(contorno, other.contorno, t)!,
      contornoSuave: Color.lerp(contornoSuave, other.contornoSuave, t)!,
      tinta: Color.lerp(tinta, other.tinta, t)!,
      tintaSilenciada: Color.lerp(tintaSilenciada, other.tintaSilenciada, t)!,
      tintaSuave: Color.lerp(tintaSuave, other.tintaSuave, t)!,
      verdeSuave: Color.lerp(verdeSuave, other.verdeSuave, t)!,
      verdeTinta: Color.lerp(verdeTinta, other.verdeTinta, t)!,
      peligroSuave: Color.lerp(peligroSuave, other.peligroSuave, t)!,
    );
  }
}

/// Acceso ergonomico a los tokens theme-aware de Rapix.
TokensRapixExt tokens(BuildContext context) =>
    Theme.of(context).extension<TokensRapixExt>() ?? TokensRapixExt.claro;
