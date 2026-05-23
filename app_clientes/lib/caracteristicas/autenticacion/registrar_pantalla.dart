import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;
import 'package:url_launcher/url_launcher.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import 'autenticacion_controlador.dart';
import 'widgets/botones_oauth.dart';

const _urlTerminos = 'https://rapixapp.com/terminos/';
const _urlPrivacidad = 'https://rapixapp.com/privacidad/';

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
    // Si ya hay una ubicación seleccionada, asumimos que el usuario quiere
    // refinarla manualmente en el mapa.
    if (_ubicacionTienda != null) {
      await _abrirMapa();
      return;
    }
    // Primer toque: intentar GPS. El resultado puede ser un punto (se
    // usa para centrar el mapa, no para aplicarlo directo), una señal de
    // "ir al mapa", o cancelar (usuario descartó el diálogo).
    final resultado = await _obtenerUbicacionActual();
    if (!mounted) return;
    if (resultado.punto != null) {
      await _abrirMapa(puntoInicial: resultado.punto);
      return;
    }
    if (resultado.usarMapa) {
      await _abrirMapa();
    }
    // cancelar → no hacer nada
  }

  Future<void> _abrirMapa({mb.Point? puntoInicial}) async {
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Ubicación de la tienda',
        'inicial': puntoInicial ?? _ubicacionTienda,
      },
    );
    if (!mounted) return;
    if (resultado != null) {
      setState(() => _ubicacionTienda = resultado);
    }
  }

  // Resuelve la ubicación actual o decide cómo seguir. Si el servicio
  // está apagado o el permiso es denegado, muestra un diálogo con opción
  // de reintentar — el bucle re-chequea hasta que el usuario obtiene
  // ubicación, elige el mapa, o descarta el diálogo.
  Future<_ResultadoUbicacion> _obtenerUbicacionActual() async {
    while (true) {
      if (!await Geolocator.isLocationServiceEnabled()) {
        if (!mounted) return _ResultadoUbicacion.cancelar;
        final accion = await _mostrarDialogoUbicacion(
          titulo: 'Ubicación apagada',
          mensaje:
              'El servicio de ubicación del dispositivo está apagado. '
              'Actívalo en los ajustes y toca "Reintentar" para detectarla '
              'automáticamente.',
        );
        if (!mounted) return _ResultadoUbicacion.cancelar;
        if (accion == _AccionUbicacion.reintentar) continue;
        if (accion == _AccionUbicacion.buscarEnMapa) {
          return _ResultadoUbicacion.irAlMapa;
        }
        return _ResultadoUbicacion.cancelar;
      }
      var permiso = await Geolocator.checkPermission();
      if (permiso == LocationPermission.denied) {
        permiso = await Geolocator.requestPermission();
      }
      if (permiso == LocationPermission.denied ||
          permiso == LocationPermission.deniedForever) {
        if (!mounted) return _ResultadoUbicacion.cancelar;
        final accion = await _mostrarDialogoUbicacion(
          titulo: 'Permiso de ubicación',
          mensaje:
              'Necesitamos permiso de ubicación para detectarla '
              'automáticamente. Concede el permiso o busca el punto en el '
              'mapa.',
        );
        if (!mounted) return _ResultadoUbicacion.cancelar;
        if (accion == _AccionUbicacion.reintentar) continue;
        if (accion == _AccionUbicacion.buscarEnMapa) {
          return _ResultadoUbicacion.irAlMapa;
        }
        return _ResultadoUbicacion.cancelar;
      }
      try {
        final pos = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.high,
            timeLimit: Duration(seconds: 10),
          ),
        );
        return _ResultadoUbicacion.con(
          mb.Point(coordinates: mb.Position(pos.longitude, pos.latitude)),
        );
      } catch (_) {
        if (!mounted) return _ResultadoUbicacion.cancelar;
        _avisar('No pudimos obtener tu ubicación, marca el punto en el mapa');
        return _ResultadoUbicacion.irAlMapa;
      }
    }
  }

  Future<_AccionUbicacion?> _mostrarDialogoUbicacion({
    required String titulo,
    required String mensaje,
  }) {
    return showDialog<_AccionUbicacion>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(titulo),
        content: Text(mensaje),
        actions: [
          TextButton(
            onPressed: () =>
                Navigator.of(ctx).pop(_AccionUbicacion.buscarEnMapa),
            child: const Text('Buscar en mapa'),
          ),
          FilledButton(
            onPressed: () =>
                Navigator.of(ctx).pop(_AccionUbicacion.reintentar),
            child: const Text('Reintentar'),
          ),
        ],
      ),
    );
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

  Future<void> _abrirEnlace(String url) async {
    final uri = Uri.parse(url);
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && mounted) {
      _avisar('No se pudo abrir el enlace');
    }
  }

  Future<void> _iniciarConGoogle() async {
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .iniciarSesionConGoogle();
    if (!mounted) return;
    if (ok) {
      // El router decide entre /inicio (registroCompleto=true) o
      // /completar-registro (registroCompleto=false) automaticamente.
      context.go('/inicio');
    } else {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) _avisar(error);
    }
  }

  void _mostrarProximamente(String funcionalidad) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$funcionalidad — próximamente')),
    );
  }

  List<Widget> _seccionOauthRegistro({required bool cargando}) {
    final plataforma = Theme.of(context).platform;
    final String proveedor;
    final Widget boton;
    switch (plataforma) {
      case TargetPlatform.android:
        proveedor = 'Google';
        boton = BotonOAuth(
          etiqueta: 'Registrar con Google',
          iconoAsset: 'assets/google_logo.svg',
          cargando: cargando,
          alPresionar: cargando ? null : _iniciarConGoogle,
        );
        break;
      case TargetPlatform.iOS:
        proveedor = 'Apple';
        boton = BotonOAuth(
          etiqueta: 'Registrar con Apple',
          cargando: false,
          alPresionar: () => _mostrarProximamente('Registro con Apple'),
        );
        break;
      default:
        return const [];
    }
    return [
      boton,
      const SizedBox(height: 10),
      Text(
        'Al registrarte con $proveedor aceptas automáticamente los términos y la política de privacidad de Rapix.',
        textAlign: TextAlign.center,
        style: GoogleFonts.inter(
          fontSize: 11,
          color: tokens(context).tintaSilenciada,
          height: 1.4,
        ),
      ),
      const SizedBox(height: 22),
      const DivisorOContinua(),
      const SizedBox(height: 22),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    final nivel = _nivelSeguridad(_contrasenaCtrl.text);
    return Scaffold(
      backgroundColor: tokens(context).fondo,
      appBar: AppBar(
        backgroundColor: tokens(context).fondo,
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
                color: tokens(context).tinta,
                letterSpacing: -0.2,
              ),
            ),
            Text(
              'Datos personales y del negocio',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: tokens(context).tintaSilenciada,
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
            ..._seccionOauthRegistro(cargando: estado.cargando),
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
              hint: '70001234',
              controlador: _telefonoCtrl,
              tipoTeclado: TextInputType.phone,
              autofill: const [AutofillHints.telephoneNumber],
              validador: (v) {
                final t = v?.trim() ?? '';
                if (!RegExp(r'^[267][0-9]{7}$').hasMatch(t)) {
                  return 'Debe tener 8 dígitos y empezar con 2, 6 o 7';
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
            const SizedBox(height: 10),
            _MedidorSeguridad(
              contrasena: _contrasenaCtrl.text,
              nivel: nivel,
            ),
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
            const SizedBox(height: 4),
            Padding(
              padding: const EdgeInsets.only(left: 32),
              child: Row(
                children: [
                  _BotonEnlaceLegal(
                    etiqueta: 'Ver términos',
                    alPresionar: () => _abrirEnlace(_urlTerminos),
                  ),
                  const SizedBox(width: 8),
                  _BotonEnlaceLegal(
                    etiqueta: 'Ver privacidad',
                    alPresionar: () => _abrirEnlace(_urlPrivacidad),
                  ),
                ],
              ),
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
            color: tokens(context).tinta,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Crea tu cuenta de vendedor en menos de un minuto.',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: tokens(context).tintaSilenciada,
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
            color: tokens(context).tinta,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          descripcion,
          style: GoogleFonts.inter(
            fontSize: 12,
            color: tokens(context).tintaSilenciada,
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

enum _CategoriaSeguridad { vacia, debil, intermedia, aceptable }

_CategoriaSeguridad _categoriaPorNivel(int nivel) {
  if (nivel == 0) return _CategoriaSeguridad.vacia;
  if (nivel <= 2) return _CategoriaSeguridad.debil;
  if (nivel == 3) return _CategoriaSeguridad.intermedia;
  return _CategoriaSeguridad.aceptable;
}

class _MedidorSeguridad extends StatelessWidget {
  const _MedidorSeguridad({required this.contrasena, required this.nivel});

  final String contrasena;
  final int nivel;

  static const _etiquetas = <String>[
    'Sin contraseña',
    'Muy débil',
    'Débil',
    'Intermedia',
    'Aceptable',
  ];

  Color _colorPrincipal(BuildContext context, _CategoriaSeguridad cat) {
    switch (cat) {
      case _CategoriaSeguridad.vacia:
        return tokens(context).tintaSuave;
      case _CategoriaSeguridad.debil:
        return TokensRapix.peligro;
      case _CategoriaSeguridad.intermedia:
        return TokensRapix.ambar;
      case _CategoriaSeguridad.aceptable:
        return TokensRapix.verde;
    }
  }

  Color _colorFondo(BuildContext context, _CategoriaSeguridad cat) {
    switch (cat) {
      case _CategoriaSeguridad.vacia:
        return tokens(context).superficie;
      case _CategoriaSeguridad.debil:
        return TokensRapix.peligroSuave;
      case _CategoriaSeguridad.intermedia:
        return TokensRapix.ambar.withValues(alpha: 0.15);
      case _CategoriaSeguridad.aceptable:
        return tokens(context).verdeSuave;
    }
  }

  @override
  Widget build(BuildContext context) {
    final categoria = _categoriaPorNivel(nivel);
    final color = _colorPrincipal(context, categoria);
    final fondo = _colorFondo(context, categoria);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: fondo,
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        border: categoria == _CategoriaSeguridad.vacia
            ? Border.all(color: tokens(context).contorno, width: 1)
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'SEGURIDAD: ${_etiquetas[nivel].toUpperCase()}',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: color,
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
                    color: activo ? color : tokens(context).contorno,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 10),
          _FilaRequisito(
            texto: 'Al menos 8 caracteres',
            cumplido: contrasena.length >= 8,
            colorCumplido: color,
          ),
          _FilaRequisito(
            texto: 'Una letra mayúscula',
            cumplido: RegExp(r'[A-Z]').hasMatch(contrasena),
            colorCumplido: color,
          ),
          _FilaRequisito(
            texto: 'Un número',
            cumplido: RegExp(r'[0-9]').hasMatch(contrasena),
            colorCumplido: color,
          ),
          _FilaRequisito(
            texto: 'Un símbolo (!@#\$...)',
            cumplido: RegExp(r'[^A-Za-z0-9]').hasMatch(contrasena),
            colorCumplido: color,
          ),
        ],
      ),
    );
  }
}

class _FilaRequisito extends StatelessWidget {
  const _FilaRequisito({
    required this.texto,
    required this.cumplido,
    required this.colorCumplido,
  });

  final String texto;
  final bool cumplido;
  final Color colorCumplido;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Icon(
            cumplido ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 16,
            color: cumplido ? colorCumplido : tokens(context).tintaSuave,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              texto,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: cumplido ? FontWeight.w600 : FontWeight.w500,
                color: cumplido
                    ? tokens(context).tinta
                    : tokens(context).tintaSilenciada,
              ),
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
                color: valor ? TokensRapix.verde : tokens(context).superficie,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: valor ? TokensRapix.verde : tokens(context).contorno,
                  width: 1.5,
                ),
              ),
              child: valor
                  ? const Icon(Icons.check, color: Colors.white, size: 14)
                  : null,
            ),
            Expanded(
              child: Text(
                'Acepto los términos y la política de privacidad de Rapix.',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: tokens(context).tintaSilenciada,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BotonEnlaceLegal extends StatelessWidget {
  const _BotonEnlaceLegal({required this.etiqueta, required this.alPresionar});

  final String etiqueta;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: alPresionar,
      style: TextButton.styleFrom(
        foregroundColor: TokensRapix.verde,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        minimumSize: const Size(0, 36),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      icon: const Icon(Icons.open_in_new, size: 16),
      label: Text(
        etiqueta,
        style: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w600,
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
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        border: Border(
          top: BorderSide(color: tokens(context).contornoSuave),
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

enum _AccionUbicacion { reintentar, buscarEnMapa }

class _ResultadoUbicacion {
  const _ResultadoUbicacion._({this.punto, this.usarMapa = false});

  final mb.Point? punto;
  final bool usarMapa;

  static const cancelar = _ResultadoUbicacion._();
  static const irAlMapa = _ResultadoUbicacion._(usarMapa: true);
  static _ResultadoUbicacion con(mb.Point p) =>
      _ResultadoUbicacion._(punto: p);
}
