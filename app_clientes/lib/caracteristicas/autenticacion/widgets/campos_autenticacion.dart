import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../../nucleo/tema/tokens_rapix.dart';

/// Campo de formulario con etiqueta superior, usado en las pantallas de
/// autenticacion. Extraido para reutilizarse entre registrar y
/// completar-registro.
class CampoEtiquetado extends StatelessWidget {
  const CampoEtiquetado({
    super.key,
    required this.etiqueta,
    required this.controlador,
    this.hint,
    this.tipoTeclado,
    this.ofuscar = false,
    this.sufijo,
    this.validador,
    this.autofill,
    this.capitalizacion,
    this.habilitado = true,
  });

  final String etiqueta;
  final String? hint;
  final TextEditingController controlador;
  final TextInputType? tipoTeclado;
  final bool ofuscar;
  final Widget? sufijo;
  final String? Function(String?)? validador;
  final Iterable<String>? autofill;
  final TextCapitalization? capitalizacion;
  final bool habilitado;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 2, bottom: 6),
          child: Text(
            etiqueta,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: tokens(context).tintaSilenciada,
            ),
          ),
        ),
        TextFormField(
          controller: controlador,
          keyboardType: tipoTeclado,
          obscureText: ofuscar,
          autofillHints: autofill,
          textCapitalization: capitalizacion ?? TextCapitalization.none,
          validator: validador,
          enabled: habilitado,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: tokens(context).tinta,
            letterSpacing: ofuscar ? 3 : null,
          ),
          decoration: InputDecoration(
            hintText: hint,
            suffixIcon: sufijo,
            suffixIconConstraints: const BoxConstraints(
              minWidth: 0,
              minHeight: 0,
            ),
          ),
        ),
      ],
    );
  }
}

/// Tarjeta tappeable que muestra la ubicacion seleccionada en el mapa, o
/// invita a elegir si aun no hay seleccion.
class TarjetaUbicacion extends StatelessWidget {
  const TarjetaUbicacion({
    super.key,
    required this.ubicacion,
    required this.alPresionar,
  });

  final mb.Point? ubicacion;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    final seleccionada = ubicacion != null;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: alPresionar,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: tokens(context).superficie,
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(
              color:
                  seleccionada ? TokensRapix.verde : tokens(context).contorno,
              width: 1.5,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: tokens(context).verdeSuave,
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                ),
                child: const Icon(
                  Icons.map_outlined,
                  color: TokensRapix.verdeOscuro,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      seleccionada
                          ? 'Ubicación seleccionada'
                          : 'Selecciona la ubicación',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: tokens(context).tinta,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      seleccionada
                          ? '(${ubicacion!.coordinates.lat.toStringAsFixed(5)}, '
                              '${ubicacion!.coordinates.lng.toStringAsFixed(5)})'
                          : 'Marca el punto exacto en el mapa',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: tokens(context).tintaSilenciada,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right,
                color: tokens(context).tintaSuave,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
