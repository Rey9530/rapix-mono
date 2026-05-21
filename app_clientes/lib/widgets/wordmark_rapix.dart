import 'package:flutter/material.dart';

/// Logo de la marca Rapix renderizado desde `assets/logo_rapix.png`.
///
/// [tamano] se aplica como altura de la imagen, manteniendo su relación de
/// aspecto via [BoxFit.contain].
class WordmarkRapix extends StatelessWidget {
  const WordmarkRapix({
    super.key,
    this.tamano = 32,
  });

  final double tamano;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/logo_rapix.png',
      height: tamano,
      fit: BoxFit.contain,
      alignment: Alignment.centerLeft,
    );
  }
}
