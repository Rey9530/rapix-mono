import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../nucleo/tema/tokens_rapix.dart';

class DivisorOContinua extends StatelessWidget {
  const DivisorOContinua({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider()),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'O CONTINÚA CON',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: tokens(context).tintaSuave,
              letterSpacing: 0.5,
            ),
          ),
        ),
        const Expanded(child: Divider()),
      ],
    );
  }
}

class BotonOAuth extends StatelessWidget {
  const BotonOAuth({
    super.key,
    required this.etiqueta,
    required this.cargando,
    required this.alPresionar,
    this.iconoAsset,
  });

  final String etiqueta;
  final bool cargando;
  final VoidCallback? alPresionar;
  final String? iconoAsset;

  @override
  Widget build(BuildContext context) {
    final Widget contenido = cargando
        ? const SizedBox(
            height: 18,
            width: 18,
            child: CircularProgressIndicator(strokeWidth: 2),
          )
        : Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (iconoAsset != null) ...[
                SvgPicture.asset(
                  iconoAsset!,
                  height: 20,
                  width: 20,
                ),
                const SizedBox(width: 10),
              ],
              Text(etiqueta),
            ],
          );
    return OutlinedButton(
      onPressed: alPresionar,
      child: contenido,
    );
  }
}
