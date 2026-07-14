import 'package:flutter/material.dart';

/// Variantes de botón que admite [BotonConCarga]. Cada una renderiza el widget
/// Material 3 correspondiente pero con el mismo manejo de carga.
enum VarianteBoton {
  filled,
  outlined,
  tonal,
  text,
  icon,
  flotante,
}

/// Botón Material 3 que muestra automáticamente un spinner mientras se ejecuta
/// la [onPressed] async, y se deshabilita durante la operación para evitar
/// doble-toque.
///
/// Uso:
/// ```dart
/// BotonConCarga(
///   onPressed: () => repo.recoger(id),
///   icono: const Icon(Icons.archive),
///   etiqueta: const Text('Recoger paquete'),
/// )
/// ```
///
/// Si [onPressed] es `null` el botón permanece deshabilitado sin spinner.
class BotonConCarga extends StatefulWidget {
  const BotonConCarga({
    super.key,
    required this.onPressed,
    this.icono,
    this.etiqueta,
    this.variante = VarianteBoton.filled,
    this.estilo,
    this.colorIndicador,
    this.tooltip,
    this.heroTag,
  });

  /// Acción async a ejecutar. Mientras se ejecuta, el botón muestra spinner
  /// y queda deshabilitado. Tras completarse (éxito o error), el botón vuelve
  /// a su estado normal.
  final Future<void> Function()? onPressed;

  /// Icono a mostrar (requerido para [VarianteBoton.filled], [outlined],
  /// [tonal], [icon] y [flotante]).
  final Widget? icono;

  /// Etiqueta a mostrar (requerida para [VarianteBoton.filled], [outlined],
  /// [tonal] y [text]).
  final Widget? etiqueta;

  final VarianteBoton variante;
  final ButtonStyle? estilo;

  /// Color del spinner. Si no se indica, se usa `onPrimary` para variantes
  /// con fondo sólido y `primary` para variantes con fondo transparente.
  final Color? colorIndicador;

  /// Tooltip para [VarianteBoton.icon].
  final String? tooltip;

  /// `heroTag` para [VarianteBoton.flotante]. Necesario cuando hay varios
  /// `FloatingActionButton` en la misma ruta (caso común en pantallas con
  /// `Stack`).
  final Object? heroTag;

  @override
  State<BotonConCarga> createState() => _BotonConCargaEstado();
}

class _BotonConCargaEstado extends State<BotonConCarga> {
  bool _cargando = false;

  Future<void> _manejarToque() async {
    final cb = widget.onPressed;
    if (_cargando || cb == null) return;
    setState(() => _cargando = true);
    try {
      await cb();
    } finally {
      if (mounted) setState(() => _cargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cargando = _cargando;
    final callback =
        (cargando || widget.onPressed == null) ? null : _manejarToque;
    final tema = Theme.of(context);
    final colorSpin = widget.colorIndicador ??
        (widget.variante == VarianteBoton.outlined ||
                widget.variante == VarianteBoton.text
            ? tema.colorScheme.primary
            : tema.colorScheme.onPrimary);

    final icono = cargando
        ? SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: colorSpin,
            ),
          )
        : widget.icono;

    switch (widget.variante) {
      case VarianteBoton.filled:
        return FilledButton.icon(
          onPressed: callback,
          icon: icono ?? const SizedBox.shrink(),
          label: widget.etiqueta ?? const SizedBox.shrink(),
          style: widget.estilo,
        );
      case VarianteBoton.outlined:
        return OutlinedButton.icon(
          onPressed: callback,
          icon: icono ?? const SizedBox.shrink(),
          label: widget.etiqueta ?? const SizedBox.shrink(),
          style: widget.estilo,
        );
      case VarianteBoton.tonal:
        return FilledButton.tonalIcon(
          onPressed: callback,
          icon: icono ?? const SizedBox.shrink(),
          label: widget.etiqueta ?? const SizedBox.shrink(),
          style: widget.estilo,
        );
      case VarianteBoton.text:
        return TextButton(
          onPressed: callback,
          style: widget.estilo,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icono != null) ...[
                icono,
                const SizedBox(width: 8),
              ],
              if (widget.etiqueta != null) widget.etiqueta!,
            ],
          ),
        );
      case VarianteBoton.icon:
        return IconButton(
          icon: icono ?? const SizedBox.shrink(),
          onPressed: callback,
          tooltip: widget.tooltip,
        );
      case VarianteBoton.flotante:
        return FloatingActionButton(
          heroTag: widget.heroTag,
          onPressed: callback,
          child: icono ?? const SizedBox.shrink(),
        );
    }
  }
}