import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../nucleo/tema/tokens_rapix.dart';

/// Wordmark de la marca Rapix: "rapix" + punto verde acento.
///
/// Replica el diseño de `design_handoff_rapix/screens/ui.jsx` (Wordmark).
/// Inter weight 800, letter-spacing -1, color [TokensRapix.tinta]; el punto
/// usa [TokensRapix.verde].
class WordmarkRapix extends StatelessWidget {
  const WordmarkRapix({
    super.key,
    this.tamano = 32,
    this.colorTexto,
    this.colorPunto,
  });

  final double tamano;
  final Color? colorTexto;
  final Color? colorPunto;

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(
            text: 'rapix',
            style: GoogleFonts.inter(
              fontSize: tamano,
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
              color: colorTexto ?? TokensRapix.tinta,
              height: 1,
            ),
          ),
          TextSpan(
            text: '.',
            style: GoogleFonts.inter(
              fontSize: tamano,
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
              color: colorPunto ?? TokensRapix.verde,
              height: 1,
            ),
          ),
        ],
      ),
    );
  }
}
