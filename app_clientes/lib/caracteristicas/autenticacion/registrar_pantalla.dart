import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../nucleo/tema/tokens_rapix.dart';
import 'autenticacion_controlador.dart';

class RegistrarPantalla extends ConsumerStatefulWidget {
  const RegistrarPantalla({super.key});

  @override
  ConsumerState<RegistrarPantalla> createState() => _RegistrarPantallaEstado();
}

class _RegistrarPantallaEstado extends ConsumerState<RegistrarPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _contrasenaCtrl = TextEditingController();
  final _nombreCtrl = TextEditingController();
  final _negocioCtrl = TextEditingController();
  final _direccionCtrl = TextEditingController();

  bool _verContrasena = false;
  bool _aceptaTerminos = false;
  mb.Point? _ubicacionTienda;

  @override
  void initState() {
    super.initState();
    _contrasenaCtrl.addListener(_alCambiarContrasena);
  }

  @override
  void dispose() {
    _contrasenaCtrl.removeListener(_alCambiarContrasena);
    _emailCtrl.dispose();
    _telefonoCtrl.dispose();
    _contrasenaCtrl.dispose();
    _nombreCtrl.dispose();
    _negocioCtrl.dispose();
    _direccionCtrl.dispose();
    super.dispose();
  }

  void _alCambiarContrasena() {
    if (mounted) setState(() {});
  }

  Future<void> _elegirUbicacion() async {
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Ubicación de la tienda',
        'inicial': _ubicacionTienda,
      },
    );
    if (resultado != null) {
      setState(() => _ubicacionTienda = resultado);
    }
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    if (_ubicacionTienda == null) {
      _avisar('Selecciona la ubicación de la tienda en el mapa');
      return;
    }
    if (!_aceptaTerminos) {
      _avisar('Debes aceptar los términos para continuar');
      return;
    }
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .registrar(
          email: _emailCtrl.text.trim(),
          telefono: _telefonoCtrl.text.trim(),
          contrasena: _contrasenaCtrl.text,
          nombreCompleto: _nombreCtrl.text.trim(),
          nombreNegocio: _negocioCtrl.text.trim(),
          direccion: _direccionCtrl.text.trim(),
          latitud: _ubicacionTienda!.coordinates.lat.toDouble(),
          longitud: _ubicacionTienda!.coordinates.lng.toDouble(),
        );
    if (!mounted) return;
    if (ok) {
      context.go('/inicio');
    } else {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) _avisar(error);
    }
  }

  void _avisar(String mensaje) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(mensaje)));
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    final nivel = _nivelSeguridad(_contrasenaCtrl.text);
    return Scaffold(
      backgroundColor: TokensRapix.fondo,
      appBar: AppBar(
        backgroundColor: TokensRapix.fondo,
        toolbarHeight: 64,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Crear cuenta',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: TokensRapix.tinta,
                letterSpacing: -0.2,
              ),
            ),
            Text(
              'Datos personales y del negocio',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: TokensRapix.tintaSilenciada,
              ),
            ),
          ],
        ),
      ),
      body: Form(
        key: _formulario,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          children: [
            const _Bienvenida(),
            const SizedBox(height: 22),
            const _TituloSeccion(
              titulo: 'Tus datos',
              descripcion: 'Usaremos estos datos para tu cuenta de vendedor.',
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Nombre completo',
              hint: 'María Fernanda López',
              controlador: _nombreCtrl,
              tipoTeclado: TextInputType.name,
              capitalizacion: TextCapitalization.words,
              autofill: const [AutofillHints.name],
              validador: (v) => (v == null || v.trim().length < 2)
                  ? 'Ingresa tu nombre completo'
                  : null,
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Correo electrónico',
              hint: 'tu@correo.com',
              controlador: _emailCtrl,
              tipoTeclado: TextInputType.emailAddress,
              autofill: const [AutofillHints.email],
              validador: (v) {
                final t = v?.trim() ?? '';
                if (t.isEmpty) return 'Ingresa tu correo';
                if (!t.contains('@') || !t.contains('.')) {
                  return 'Correo inválido';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Teléfono (WhatsApp)',
              hint: '+50370001234',
              controlador: _telefonoCtrl,
              tipoTeclado: TextInputType.phone,
              autofill: const [AutofillHints.telephoneNumber],
              validador: (v) {
                final t = v?.trim() ?? '';
                if (!RegExp(r'^\+?[0-9]{8,15}$').hasMatch(t)) {
                  return 'Entre 8 y 15 dígitos, opcional con +';
                }
                return null;
              },
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Contraseña',
              hint: '••••••••',
              controlador: _contrasenaCtrl,
              ofuscar: !_verContrasena,
              autofill: const [AutofillHints.newPassword],
              sufijo: _BotonSufijoTexto(
                texto: _verContrasena ? 'OCULTAR' : 'MOSTRAR',
                alPresionar: () =>
                    setState(() => _verContrasena = !_verContrasena),
              ),
              validador: (v) {
                if (v == null || v.length < 8) return 'Mínimo 8 caracteres';
                if (!RegExp(r'[A-Z]').hasMatch(v)) {
                  return 'Debe incluir una mayúscula';
                }
                if (!RegExp(r'[0-9]').hasMatch(v)) {
                  return 'Debe incluir un número';
                }
                if (!RegExp(r'[^A-Za-z0-9]').hasMatch(v)) {
                  return 'Debe incluir un símbolo';
                }
                return null;
              },
            ),
            if (_contrasenaCtrl.text.isNotEmpty) ...[
              const SizedBox(height: 10),
              _MedidorSeguridad(nivel: nivel),
            ],
            const SizedBox(height: 28),
            const _TituloSeccion(
              titulo: 'Tu negocio',
              descripcion:
                  'Aparecerá en el seguimiento que ven tus clientes.',
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Nombre del negocio',
              hint: 'Florería Luna',
              controlador: _negocioCtrl,
              capitalizacion: TextCapitalization.words,
              validador: (v) => (v == null || v.trim().isEmpty)
                  ? 'Ingresa el nombre del negocio'
                  : null,
            ),
            const SizedBox(height: 14),
            _CampoEtiquetado(
              etiqueta: 'Dirección',
              hint: 'Av. Insurgentes 247',
              controlador: _direccionCtrl,
              capitalizacion: TextCapitalization.sentences,
              validador: (v) => (v == null || v.trim().isEmpty)
                  ? 'Ingresa la dirección'
                  : null,
            ),
            const SizedBox(height: 14),
            _TarjetaUbicacion(
              ubicacion: _ubicacionTienda,
              alPresionar: _elegirUbicacion,
            ),
            const SizedBox(height: 22),
            _CheckboxTerminos(
              valor: _aceptaTerminos,
              alCambiar: (v) => setState(() => _aceptaTerminos = v),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _PieRegistro(
        cargando: estado.cargando,
        habilitado: !estado.cargando,
        alPresionar: _enviar,
      ),
    );
  }

  // Calcula seguridad de contraseña en escala 0..4 (longitud, mayúscula,
  // número, símbolo). Se usa para el medidor visual.
  int _nivelSeguridad(String c) {
    if (c.isEmpty) return 0;
    var n = 0;
    if (c.length >= 8) n++;
    if (RegExp(r'[A-Z]').hasMatch(c)) n++;
    if (RegExp(r'[0-9]').hasMatch(c)) n++;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(c)) n++;
    return n;
  }
}

class _Bienvenida extends StatelessWidget {
  const _Bienvenida();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cuéntanos sobre ti',
          style: GoogleFonts.inter(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.6,
            color: TokensRapix.tinta,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Crea tu cuenta de vendedor en menos de un minuto.',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: TokensRapix.tintaSilenciada,
            height: 1.5,
          ),
        ),
      ],
    );
  }
}

class _TituloSeccion extends StatelessWidget {
  const _TituloSeccion({required this.titulo, required this.descripcion});

  final String titulo;
  final String descripcion;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          titulo,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
            color: TokensRapix.tinta,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          descripcion,
          style: GoogleFonts.inter(
            fontSize: 12,
            color: TokensRapix.tintaSilenciada,
            height: 1.4,
          ),
        ),
      ],
    );
  }
}

class _CampoEtiquetado extends StatelessWidget {
  const _CampoEtiquetado({
    required this.etiqueta,
    required this.controlador,
    this.hint,
    this.tipoTeclado,
    this.ofuscar = false,
    this.sufijo,
    this.validador,
    this.autofill,
    this.capitalizacion,
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
              color: TokensRapix.tintaSilenciada,
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
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: TokensRapix.tinta,
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

class _BotonSufijoTexto extends StatelessWidget {
  const _BotonSufijoTexto({required this.texto, required this.alPresionar});

  final String texto;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: alPresionar,
        child: Text(
          texto,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: TokensRapix.verde,
            letterSpacing: 0.4,
          ),
        ),
      ),
    );
  }
}

class _MedidorSeguridad extends StatelessWidget {
  const _MedidorSeguridad({required this.nivel});

  final int nivel;

  static const _etiquetas = <String>[
    'Muy débil',
    'Débil',
    'Regular',
    'Buena',
    'Excelente',
  ];

  static const _pistas = <String>[
    'Usa al menos 8 caracteres',
    'Agrega una mayúscula',
    'Agrega un número',
    'Agrega un símbolo',
    'Cumple todos los requisitos',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: TokensRapix.verdeSuave,
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'SEGURIDAD DE LA CONTRASEÑA',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: TokensRapix.verdeTinta,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: List.generate(4, (i) {
              final activo = i < nivel;
              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
                  decoration: BoxDecoration(
                    color: activo
                        ? TokensRapix.verde
                        : Colors.black.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 8),
          Text(
            '${_etiquetas[nivel]} · ${_pistas[nivel]}',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: TokensRapix.verdeTinta,
            ),
          ),
        ],
      ),
    );
  }
}

class _TarjetaUbicacion extends StatelessWidget {
  const _TarjetaUbicacion({required this.ubicacion, required this.alPresionar});

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
            color: TokensRapix.superficie,
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(
              color:
                  seleccionada ? TokensRapix.verde : TokensRapix.contorno,
              width: 1.5,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: TokensRapix.verdeSuave,
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
                        color: TokensRapix.tinta,
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
                        color: TokensRapix.tintaSilenciada,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: TokensRapix.tintaSuave,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CheckboxTerminos extends StatelessWidget {
  const _CheckboxTerminos({required this.valor, required this.alCambiar});

  final bool valor;
  final ValueChanged<bool> alCambiar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => alCambiar(!valor),
      borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 120),
              width: 22,
              height: 22,
              margin: const EdgeInsets.only(top: 1, right: 10),
              decoration: BoxDecoration(
                color: valor ? TokensRapix.verde : TokensRapix.superficie,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: valor ? TokensRapix.verde : TokensRapix.contorno,
                  width: 1.5,
                ),
              ),
              child: valor
                  ? const Icon(Icons.check, color: Colors.white, size: 14)
                  : null,
            ),
            Expanded(
              child: Text.rich(
                TextSpan(
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: TokensRapix.tintaSilenciada,
                    height: 1.5,
                  ),
                  children: [
                    const TextSpan(text: 'Acepto los '),
                    TextSpan(
                      text: 'términos',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: TokensRapix.verde,
                        height: 1.5,
                      ),
                    ),
                    const TextSpan(text: ' y la '),
                    TextSpan(
                      text: 'política de privacidad',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: TokensRapix.verde,
                        height: 1.5,
                      ),
                    ),
                    const TextSpan(text: ' de Rapix.'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PieRegistro extends StatelessWidget {
  const _PieRegistro({
    required this.cargando,
    required this.habilitado,
    required this.alPresionar,
  });

  final bool cargando;
  final bool habilitado;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: TokensRapix.superficie,
        border: Border(
          top: BorderSide(color: TokensRapix.contornoSuave),
        ),
      ),
      child: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(22, 14, 22, 18),
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            boxShadow: habilitado
                ? [
                    BoxShadow(
                      color: TokensRapix.verde.withValues(alpha: 0.28),
                      offset: const Offset(0, 6),
                      blurRadius: 16,
                    ),
                  ]
                : null,
          ),
          child: FilledButton(
            onPressed: habilitado ? alPresionar : null,
            child: cargando
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Text('Crear cuenta'),
                      SizedBox(width: 8),
                      Icon(Icons.chevron_right, size: 20),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
