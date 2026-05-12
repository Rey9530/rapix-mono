import 'dart:async';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/usuario.dart';
import '../../datos/repositorios/geocoding_repositorio.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../autenticacion/autenticacion_controlador.dart';
import 'pedidos_listado_controlador.dart';

final _regexUrlMapsCorta =
    RegExp(r'^https://maps\.app\.goo\.gl/[A-Za-z0-9_-]+/?$');

class CrearPedidoPantalla extends ConsumerStatefulWidget {
  const CrearPedidoPantalla({super.key});

  @override
  ConsumerState<CrearPedidoPantalla> createState() =>
      _CrearPedidoPantallaEstado();
}

class _CrearPedidoPantallaEstado extends ConsumerState<CrearPedidoPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _nombreCliente = TextEditingController();
  final _telefonoCliente = TextEditingController();
  final _direccionDestino = TextEditingController();
  final _urlMapsDestino = TextEditingController();
  final _descripcion = TextEditingController();
  final _montoContraEntrega = TextEditingController();
  final _notasDestino = TextEditingController();

  String _metodoPago = 'CONTRA_ENTREGA';
  XFile? _foto;
  bool _enviando = false;
  final _selectorImagen = ImagePicker();

  DateTime _fechaEntrega = DateTime.now();
  double? _latDestino;
  double? _lngDestino;

  @override
  void initState() {
    super.initState();
    _direccionDestino.addListener(_invalidarCoordsSiDireccionEditada);
  }

  void _invalidarCoordsSiDireccionEditada() {
    if (_direccionElegidaDelBuscador != null &&
        _direccionDestino.text.trim() != _direccionElegidaDelBuscador) {
      setState(() {
        _latDestino = null;
        _lngDestino = null;
        _direccionElegidaDelBuscador = null;
      });
    }
  }

  String? _direccionElegidaDelBuscador;

  void _aplicarResultadoGeocoding(ResultadoGeocoding resultado) {
    setState(() {
      _direccionDestino.text = resultado.direccion;
      _direccionElegidaDelBuscador = resultado.direccion;
      _latDestino = resultado.latitud;
      _lngDestino = resultado.longitud;
    });
  }

  @override
  void dispose() {
    _direccionDestino.removeListener(_invalidarCoordsSiDireccionEditada);
    _nombreCliente.dispose();
    _telefonoCliente.dispose();
    _direccionDestino.dispose();
    _urlMapsDestino.dispose();
    _descripcion.dispose();
    _montoContraEntrega.dispose();
    _notasDestino.dispose();
    super.dispose();
  }

  Future<void> _elegirFoto() async {
    final origen = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: tokens(context).superficie,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: tokens(context).contorno,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.photo_camera_outlined),
              title: const Text('Tomar foto'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Elegir de galería'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (origen == null) return;
    try {
      final imagen = await _selectorImagen.pickImage(
        source: origen,
        maxWidth: 1600,
        imageQuality: 80,
      );
      if (imagen != null) {
        setState(() => _foto = imagen);
      }
    } catch (e) {
      if (!mounted) return;
      _mostrarSnack('No se pudo abrir el selector: $e');
    }
  }

  Future<void> _pegarLink() async {
    final datos = await Clipboard.getData(Clipboard.kTextPlain);
    final texto = datos?.text?.trim() ?? '';
    if (texto.isEmpty) {
      _mostrarSnack('No hay texto en el portapapeles');
      return;
    }
    setState(() => _urlMapsDestino.text = texto);
    _mostrarSnack('Link pegado');
  }

  void _mostrarProximamente(String funcionalidad) {
    _mostrarSnack('$funcionalidad — próximamente');
  }

  void _mostrarSnack(String texto) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(texto)),
    );
  }

  void _mostrarSnackConAccion(
    String texto,
    String etiquetaAccion,
    VoidCallback alPresionar,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(texto),
        action: SnackBarAction(
          label: etiquetaAccion,
          onPressed: alPresionar,
        ),
      ),
    );
  }

  /// Resuelve el contexto del vendedor reintentando si aun esta cargando.
  /// Devuelve null si hubo error de red — el caller debe mostrar snack
  /// de reintentar.
  Future<ContextoVendedor?> _resolverContextoVendedor() async {
    var asincrono = ref.read(contextoVendedorProvider);
    if (asincrono.isLoading) {
      try {
        await ref.read(contextoVendedorProvider.future);
        asincrono = ref.read(contextoVendedorProvider);
      } catch (_) {
        return null;
      }
    }
    return asincrono.value;
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;

    final ctx = await _resolverContextoVendedor();
    if (!mounted) return;
    if (ctx == null) {
      _mostrarSnackConAccion(
        'No pudimos verificar los datos de tu tienda.',
        'Reintentar',
        () => ref.invalidate(contextoVendedorProvider),
      );
      return;
    }
    if (!ctx.tieneUbicacion ||
        ctx.latitud == null ||
        ctx.longitud == null) {
      _mostrarSnack(
        'Tu cuenta no tiene ubicación de tienda. Actualiza tu perfil.',
      );
      return;
    }

    final preview = ref.read(previewCostoEnvioProvider).value;
    final montoEntrega = _metodoPago == 'CONTRA_ENTREGA'
        ? double.tryParse(_montoContraEntrega.text)
        : null;

    final confirmado = await _mostrarConfirmacion(
      direccion: _direccionDestino.text.trim(),
      montoEntrega: montoEntrega,
      preview: preview,
    );
    if (!confirmado) return;
    if (!mounted) return;

    setState(() => _enviando = true);
    try {
      final repo = ref.read(pedidosRepositorioProvider);
      final urlMaps = _urlMapsDestino.text.trim();
      final pedido = await repo.crear(
        CrearPedidoEntrada(
          nombreCliente: _nombreCliente.text.trim(),
          telefonoCliente: _telefonoCliente.text.trim(),
          direccionOrigen: ctx.direccion ?? 'Tienda',
          latitudOrigen: ctx.latitud!,
          longitudOrigen: ctx.longitud!,
          direccionDestino: _direccionDestino.text.trim(),
          urlMapasDestino: urlMaps.isEmpty ? null : urlMaps,
          latitudDestino: _latDestino,
          longitudDestino: _lngDestino,
          programadoPara: _fechaEntrega,
          metodoPago: _metodoPago,
          descripcionPaquete: _descripcion.text.trim().isEmpty
              ? null
              : _descripcion.text.trim(),
          montoContraEntrega: montoEntrega,
          notasDestino: _notasDestino.text.trim().isEmpty
              ? null
              : _notasDestino.text.trim(),
          foto: _foto,
        ),
      );
      if (!mounted) return;
      ref.invalidate(pedidosListadoProvider);
      context.go('/pedidos/${pedido.id}');
    } on DioException catch (e) {
      if (!mounted) return;
      _mostrarSnack(_mensajeError(e));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  /// Sincroniza la cache local del Usuario (flutter_secure_storage) con
  /// el contexto fresco del backend. La fuente de verdad de este flujo
  /// es el endpoint; esto solo mantiene la cache util para otras
  /// pantallas que lean del estado de auth.
  void _sincronizarCacheUsuario(ContextoVendedor ctx) {
    if (!ctx.tieneUbicacion) return;
    final auth = ref.read(autenticacionControladorProvider);
    final usuario = auth.usuario;
    if (usuario == null) return;
    final perfilActual = usuario.perfilVendedor;
    final mismo = perfilActual != null &&
        perfilActual.direccion == ctx.direccion &&
        perfilActual.latitud == ctx.latitud &&
        perfilActual.longitud == ctx.longitud &&
        perfilActual.nombreNegocio == ctx.nombreNegocio &&
        perfilActual.urlLogo == ctx.urlLogo;
    if (mismo) return;
    final actualizado = Usuario(
      id: usuario.id,
      email: usuario.email,
      telefono: usuario.telefono,
      nombreCompleto: usuario.nombreCompleto,
      rol: usuario.rol,
      estado: usuario.estado,
      perfilVendedor: PerfilVendedor(
        nombreNegocio: ctx.nombreNegocio,
        rfc: perfilActual?.rfc,
        direccion: ctx.direccion,
        latitud: ctx.latitud,
        longitud: ctx.longitud,
        urlLogo: ctx.urlLogo,
      ),
    );
    ref
        .read(autenticacionControladorProvider.notifier)
        .actualizarUsuario(actualizado);
  }

  Future<bool> _mostrarConfirmacion({
    required String direccion,
    required double? montoEntrega,
    required PreviewCostoEnvio? preview,
  }) async {
    final fechaFmt = DateFormat('EEEE d MMM y', 'es').format(_fechaEntrega);
    final monedaFmt = NumberFormat.currency(
      locale: 'es',
      symbol: r'$',
      decimalDigits: 2,
    );
    final filas = <_FilaResumen>[
      _FilaResumen('Cliente', _nombreCliente.text.trim()),
      _FilaResumen(
        'Dirección',
        direccion.isEmpty ? '—' : direccion,
      ),
      _FilaResumen('Fecha de entrega', fechaFmt),
      if (montoEntrega != null)
        _FilaResumen(
          'Monto a cobrar al cliente',
          monedaFmt.format(montoEntrega),
        ),
      if (preview != null && preview.debeMostrarse)
        _FilaResumen(
          'Costo de envío a pagar al entregar',
          monedaFmt.format(preview.costoEnvio),
        ),
    ];

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Confirmar pedido?'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '¿Estás seguro de que los datos del pedido son correctos?',
            ),
            const SizedBox(height: 14),
            for (final fila in filas) ...[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: 110,
                    child: Text(
                      fila.etiqueta,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: tokens(ctx).tintaSilenciada,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      fila.valor,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: tokens(ctx).tinta,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Sí, crear pedido'),
          ),
        ],
      ),
    );
    return ok ?? false;
  }

  String _mensajeError(DioException e) {
    final datos = e.response?.data;
    if (datos is Map<String, dynamic>) {
      final codigo = datos['codigo'] as String?;
      final mensaje = datos['mensaje'] ?? datos['message'];
      if (codigo == 'PEDIDO_ZONA_INVALIDA' ||
          codigo == 'PEDIDO_ZONA_INVALIDA_DESTINO') {
        return 'La dirección de destino está fuera de la zona de cobertura';
      }
      if (codigo == 'PEDIDO_URL_MAPAS_INVALIDA') {
        return 'No se pudo leer la ubicación desde la URL de Google Maps. '
            'Verifica el enlace.';
      }
      if (mensaje is String && mensaje.isNotEmpty) return mensaje;
      if (mensaje is List && mensaje.isNotEmpty) return mensaje.first.toString();
    }
    return 'No se pudo crear el pedido. Intenta de nuevo.';
  }

  @override
  Widget build(BuildContext context) {
    // Disparar la consulta del contexto del vendedor en paralelo con el
    // preview de costo de envio (que se observa en _BarraInferiorCrear).
    // Ambos providers son autoDispose; watch desde aqui los mantiene
    // vivos durante la vida de la pantalla.
    ref.watch(contextoVendedorProvider);
    // Sincronizar la cache local cuando llega un contexto valido.
    ref.listen<AsyncValue<ContextoVendedor>>(
      contextoVendedorProvider,
      (_, next) {
        final ctx = next.value;
        if (ctx != null) _sincronizarCacheUsuario(ctx);
      },
    );
    return Scaffold(
      backgroundColor: tokens(context).fondo,
      appBar: AppBar(
        title: const Text('Nuevo pedido'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, size: 22),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        bottom: false,
        child: Form(
          key: _formulario,
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _SeccionNumerada(
                  numero: '1',
                  titulo: 'CLIENTE',
                  hijos: [
                    _CampoFormulario(
                      etiqueta: 'NOMBRE COMPLETO',
                      icono: Icons.person_outline,
                      controlador: _nombreCliente,
                      capitalizacion: TextCapitalization.words,
                      validador: (v) => (v == null || v.trim().isEmpty)
                          ? 'Requerido'
                          : null,
                    ),
                    _CampoFormulario(
                      etiqueta: 'TELÉFONO',
                      icono: Icons.phone_outlined,
                      controlador: _telefonoCliente,
                      teclado: TextInputType.phone,
                      hint: '+50370001234',
                      ultimo: true,
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (!RegExp(r'^\+?[0-9]{8,15}$').hasMatch(t)) {
                          return '8-15 dígitos, opcional con +';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
                _SeccionNumerada(
                  numero: '2',
                  titulo: 'DESTINO',
                  hijos: [
                    _BuscadorDireccion(
                      alSeleccionar: _aplicarResultadoGeocoding,
                    ),
                    _CampoFormulario(
                      etiqueta: 'DIRECCIÓN',
                      icono: Icons.place_outlined,
                      controlador: _direccionDestino,
                      hint: 'Calle, colonia, referencias',
                      validador: (v) => (v == null || v.trim().isEmpty)
                          ? 'Requerido'
                          : null,
                    ),
                    _BarraChipsAccion(
                      chips: [
                        _ChipAccion(
                          icono: Icons.content_paste_outlined,
                          etiqueta: 'Pegar link',
                          alPresionar: _pegarLink,
                        ),
                        _ChipAccion(
                          icono: Icons.my_location,
                          etiqueta: 'Mi ubicación',
                          alPresionar: () =>
                              _mostrarProximamente('Selección por GPS'),
                        ),
                      ],
                    ),
                    _CampoFormulario(
                      etiqueta: 'URL DE GOOGLE MAPS (OPCIONAL)',
                      icono: Icons.link,
                      controlador: _urlMapsDestino,
                      teclado: TextInputType.url,
                      hint: 'https://maps.app.goo.gl/...',
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (t.isEmpty) return null;
                        if (!_regexUrlMapsCorta.hasMatch(t)) {
                          return 'URL inválida. Comparte el sitio desde Google '
                              'Maps y pega el enlace corto';
                        }
                        return null;
                      },
                    ),
                    _CampoFormulario(
                      etiqueta: 'NOTAS PARA EL REPARTIDOR',
                      icono: Icons.sticky_note_2_outlined,
                      controlador: _notasDestino,
                      multilinea: true,
                      hint: 'Opcional · Portón verde, tocar timbre 2 veces…',
                      ultimo: true,
                    ),
                    _FilaFechaEntrega(
                      fecha: _fechaEntrega,
                      alElegir: (nueva) =>
                          setState(() => _fechaEntrega = nueva),
                    ),
                  ],
                ),
                _SeccionNumerada(
                  numero: '3',
                  titulo: 'PAQUETE',
                  hijos: [
                    _FilaFoto(
                      foto: _foto,
                      alPresionar: _elegirFoto,
                      alQuitar: () => setState(() => _foto = null),
                    ),
                    _CampoFormulario(
                      etiqueta: 'DESCRIPCIÓN',
                      icono: Icons.inventory_2_outlined,
                      controlador: _descripcion,
                      hint: 'Opcional · ¿Qué contiene el paquete?',
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _EtiquetaSeccion('MÉTODO DE PAGO'),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: _OpcionPago(
                                  etiqueta: 'Contra entrega',
                                  icono: Icons.payments_outlined,
                                  seleccionado:
                                      _metodoPago == 'CONTRA_ENTREGA',
                                  alPresionar: () => setState(
                                    () => _metodoPago = 'CONTRA_ENTREGA',
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _OpcionPago(
                                  etiqueta: 'Prepagado',
                                  icono: Icons.credit_card,
                                  seleccionado: _metodoPago == 'PREPAGADO',
                                  alPresionar: () => setState(
                                    () => _metodoPago = 'PREPAGADO',
                                  ),
                                ),
                              ),
                            ],
                          ),
                          if (_metodoPago == 'CONTRA_ENTREGA') ...[
                            const SizedBox(height: 14),
                            _EtiquetaSeccion('MONTO A COBRAR'),
                            const SizedBox(height: 6),
                            _CampoMonto(
                              controlador: _montoContraEntrega,
                              validador: (v) {
                                if (_metodoPago != 'CONTRA_ENTREGA') {
                                  return null;
                                }
                                final monto = double.tryParse(v ?? '');
                                if (monto == null || monto <= 0) {
                                  return 'Monto inválido';
                                }
                                return null;
                              },
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _BarraInferiorCrear(
        cargando: _enviando,
        alPresionar: _enviando ? null : _enviar,
        metodoPago: _metodoPago,
      ),
    );
  }
}

class _SeccionNumerada extends StatelessWidget {
  const _SeccionNumerada({
    required this.numero,
    required this.titulo,
    required this.hijos,
  });

  final String numero;
  final String titulo;
  final List<Widget> hijos;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 10),
            child: Row(
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: tokens(context).verdeSuave,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    numero,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: TokensRapix.verdeOscuro,
                      height: 1,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  titulo,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: tokens(context).tinta,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: tokens(context).superficie,
              borderRadius: BorderRadius.circular(TokensRapix.radioLg),
              border: Border.all(color: tokens(context).contorno),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: hijos,
            ),
          ),
        ],
      ),
    );
  }
}

class _CampoFormulario extends StatelessWidget {
  const _CampoFormulario({
    required this.etiqueta,
    required this.icono,
    required this.controlador,
    this.teclado,
    this.hint,
    this.multilinea = false,
    this.capitalizacion,
    this.validador,
    this.ultimo = false,
  });

  final String etiqueta;
  final IconData icono;
  final TextEditingController controlador;
  final TextInputType? teclado;
  final String? hint;
  final bool multilinea;
  final TextCapitalization? capitalizacion;
  final String? Function(String?)? validador;
  final bool ultimo;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: ultimo
            ? null
            : Border(
                bottom: BorderSide(color: tokens(context).contornoSuave),
              ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 18),
            child: Icon(
              icono,
              size: 18,
              color: tokens(context).tintaSilenciada,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  etiqueta,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: tokens(context).tintaSilenciada,
                    letterSpacing: 0.4,
                  ),
                ),
                const SizedBox(height: 3),
                TextFormField(
                  controller: controlador,
                  keyboardType: teclado,
                  textCapitalization:
                      capitalizacion ?? TextCapitalization.none,
                  maxLines: multilinea ? 3 : 1,
                  minLines: multilinea ? 1 : 1,
                  validator: validador,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: tokens(context).tinta,
                    height: 1.3,
                  ),
                  decoration: InputDecoration(
                    hintText: hint,
                    hintStyle: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                      color: tokens(context).tintaSuave,
                    ),
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    focusedErrorBorder: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    filled: false,
                    errorStyle: GoogleFonts.inter(
                      fontSize: 11,
                      color: TokensRapix.peligro,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BuscadorDireccion extends ConsumerStatefulWidget {
  const _BuscadorDireccion({required this.alSeleccionar});

  final void Function(ResultadoGeocoding) alSeleccionar;

  @override
  ConsumerState<_BuscadorDireccion> createState() =>
      _BuscadorDireccionEstado();
}

class _BuscadorDireccionEstado extends ConsumerState<_BuscadorDireccion> {
  final _consulta = TextEditingController();
  Timer? _debounce;
  bool _cargando = false;
  List<ResultadoGeocoding> _resultados = const [];
  String? _error;

  @override
  void dispose() {
    _debounce?.cancel();
    _consulta.dispose();
    super.dispose();
  }

  void _alCambiarTexto(String texto) {
    _debounce?.cancel();
    final consulta = texto.trim();
    if (consulta.length < 3) {
      setState(() {
        _resultados = const [];
        _error = null;
        _cargando = false;
      });
      return;
    }
    _debounce = Timer(const Duration(milliseconds: 400), () => _buscar(consulta));
  }

  Future<void> _buscar(String consulta) async {
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      final repo = ref.read(geocodingRepositorioProvider);
      final lista = await repo.buscar(consulta);
      if (!mounted) return;
      setState(() {
        _resultados = lista;
        _cargando = false;
        _error = lista.isEmpty ? 'Sin resultados' : null;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _resultados = const [];
        _cargando = false;
        _error = 'No se pudo buscar. Intenta de nuevo.';
      });
    }
  }

  void _seleccionar(ResultadoGeocoding resultado) {
    widget.alSeleccionar(resultado);
    setState(() {
      _consulta.text = resultado.direccion;
      _resultados = const [];
    });
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: tokens(context).contornoSuave),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _consulta,
            onChanged: _alCambiarTexto,
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              prefixIcon: Icon(
                Icons.search,
                size: 18,
                color: tokens(context).tintaSilenciada,
              ),
              suffixIcon: _cargando
                  ? const Padding(
                      padding: EdgeInsets.all(12),
                      child: SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                    )
                  : (_consulta.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close, size: 18),
                          onPressed: () {
                            _consulta.clear();
                            _alCambiarTexto('');
                          },
                        )
                      : null),
              hintText: 'Buscar dirección…',
              hintStyle: GoogleFonts.inter(
                fontSize: 13,
                color: tokens(context).tintaSilenciada,
              ),
              isDense: true,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                borderSide: BorderSide(color: tokens(context).contorno),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                borderSide: BorderSide(color: tokens(context).contorno),
              ),
            ),
          ),
          if (_error != null && _resultados.isEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                _error!,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: tokens(context).tintaSilenciada,
                ),
              ),
            ),
          if (_resultados.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Container(
                decoration: BoxDecoration(
                  color: tokens(context).superficie,
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                  border: Border.all(color: tokens(context).contorno),
                ),
                child: Column(
                  children: [
                    for (var i = 0; i < _resultados.length; i++)
                      InkWell(
                        onTap: () => _seleccionar(_resultados[i]),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            border: i < _resultados.length - 1
                                ? Border(
                                    bottom: BorderSide(
                                      color: tokens(context).contornoSuave,
                                    ),
                                  )
                                : null,
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.place_outlined,
                                size: 16,
                                color: tokens(context).tintaSilenciada,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  _resultados[i].direccion,
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    color: tokens(context).tinta,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _FilaFechaEntrega extends StatelessWidget {
  const _FilaFechaEntrega({
    required this.fecha,
    required this.alElegir,
  });

  final DateTime fecha;
  final void Function(DateTime) alElegir;

  @override
  Widget build(BuildContext context) {
    final etiqueta = DateFormat('EEEE d MMM y', 'es').format(fecha);
    return InkWell(
      onTap: () async {
        final ahora = DateTime.now();
        final hoy = DateTime(ahora.year, ahora.month, ahora.day);
        final seleccionada = await showDatePicker(
          context: context,
          initialDate: fecha,
          firstDate: hoy,
          lastDate: hoy.add(const Duration(days: 365)),
          locale: const Locale('es'),
        );
        if (seleccionada != null) alElegir(seleccionada);
      },
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(color: tokens(context).contornoSuave),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Icon(
                Icons.event,
                size: 18,
                color: tokens(context).tintaSilenciada,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'FECHA DE ENTREGA',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: tokens(context).tintaSilenciada,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    etiqueta,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: tokens(context).tinta,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BarraChipsAccion extends StatelessWidget {
  const _BarraChipsAccion({required this.chips});

  final List<Widget> chips;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: tokens(context).contornoSuave),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 8, 14, 12),
      child: Wrap(
        spacing: 6,
        runSpacing: 6,
        children: chips,
      ),
    );
  }
}

class _ChipAccion extends StatelessWidget {
  const _ChipAccion({
    required this.icono,
    required this.etiqueta,
    required this.alPresionar,
  });

  final IconData icono;
  final String etiqueta;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioPill),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: tokens(context).superficieAlt,
          borderRadius: BorderRadius.circular(TokensRapix.radioPill),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icono, size: 13, color: tokens(context).tinta),
            const SizedBox(width: 6),
            Text(
              etiqueta,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: tokens(context).tinta,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilaFoto extends StatelessWidget {
  const _FilaFoto({
    required this.foto,
    required this.alPresionar,
    required this.alQuitar,
  });

  final XFile? foto;
  final VoidCallback alPresionar;
  final VoidCallback alQuitar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(color: tokens(context).contornoSuave),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: tokens(context).superficieHundida,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                image: foto != null
                    ? DecorationImage(
                        image: FileImage(File(foto!.path)),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
              child: foto == null
                  ? Icon(
                      Icons.photo_camera_outlined,
                      size: 20,
                      color: tokens(context).tintaSilenciada,
                    )
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Foto del paquete',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: tokens(context).tinta,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    foto == null
                        ? 'Opcional · Cámara o galería'
                        : 'Toca para reemplazar',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: tokens(context).tintaSilenciada,
                    ),
                  ),
                ],
              ),
            ),
            if (foto != null)
              IconButton(
                tooltip: 'Quitar foto',
                onPressed: alQuitar,
                icon: const Icon(Icons.close, size: 18),
                color: tokens(context).tintaSilenciada,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(
                  minWidth: 32,
                  minHeight: 32,
                ),
              )
            else
              Icon(
                Icons.chevron_right,
                size: 18,
                color: tokens(context).tintaSuave,
              ),
          ],
        ),
      ),
    );
  }
}

class _EtiquetaSeccion extends StatelessWidget {
  const _EtiquetaSeccion(this.texto);

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Text(
      texto,
      style: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: tokens(context).tintaSilenciada,
        letterSpacing: 0.4,
      ),
    );
  }
}

class _OpcionPago extends StatelessWidget {
  const _OpcionPago({
    required this.etiqueta,
    required this.icono,
    required this.seleccionado,
    required this.alPresionar,
  });

  final String etiqueta;
  final IconData icono;
  final bool seleccionado;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        decoration: BoxDecoration(
          color: seleccionado
              ? tokens(context).verdeSuave
              : tokens(context).superficie,
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          border: Border.all(
            color: seleccionado ? TokensRapix.verde : tokens(context).contorno,
            width: seleccionado ? 1.5 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icono,
              size: 20,
              color: seleccionado
                  ? TokensRapix.verdeOscuro
                  : tokens(context).tintaSilenciada,
            ),
            const SizedBox(height: 4),
            Text(
              etiqueta,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight:
                    seleccionado ? FontWeight.w700 : FontWeight.w600,
                color: seleccionado
                    ? TokensRapix.verdeOscuro
                    : tokens(context).tintaSilenciada,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CampoMonto extends StatelessWidget {
  const _CampoMonto({
    required this.controlador,
    required this.validador,
  });

  final TextEditingController controlador;
  final String? Function(String?)? validador;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: tokens(context).superficieAlt,
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          Text(
            r'$',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: tokens(context).tintaSilenciada,
            ),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: TextFormField(
              controller: controlador,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              validator: validador,
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: tokens(context).tinta,
                letterSpacing: -0.5,
                height: 1.1,
              ),
              decoration: InputDecoration(
                hintText: '0.00',
                hintStyle: GoogleFonts.inter(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: tokens(context).tintaSuave,
                  letterSpacing: -0.5,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                errorBorder: InputBorder.none,
                focusedErrorBorder: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
                filled: false,
                errorStyle: GoogleFonts.inter(
                  fontSize: 11,
                  color: TokensRapix.peligro,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BarraInferiorCrear extends ConsumerWidget {
  const _BarraInferiorCrear({
    required this.cargando,
    required this.alPresionar,
    required this.metodoPago,
  });

  final bool cargando;
  final VoidCallback? alPresionar;
  final String metodoPago;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final preview = ref.watch(previewCostoEnvioProvider);
    final mostrarNota = metodoPago == 'CONTRA_ENTREGA' &&
        (preview.value?.debeMostrarse ?? false);
    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        border: Border(
          top: BorderSide(color: tokens(context).contorno),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (mostrarNota) ...[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: TokensRapix.ambar.withValues(alpha: 0.18),
                    borderRadius:
                        BorderRadius.circular(TokensRapix.radioMd),
                    border: Border.all(
                      color: TokensRapix.ambar.withValues(alpha: 0.45),
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.info_outline,
                        size: 16,
                        color: tokens(context).tinta,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Si el cliente pagará el paquete más el envío, '
                          'el total a pagar debe ser la suma de ambos '
                          'para que el rider cobre lo correcto.',
                          style: GoogleFonts.inter(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: tokens(context).tinta,
                            height: 1.35,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
              ],
              Row(
                children: [
                  Expanded(
                    child: _ResumenCostoEnvio(preview: preview),
                  ),
                  const SizedBox(width: 12),
                  FilledButton(
                    onPressed: alPresionar,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 22,
                        vertical: 14,
                      ),
                      minimumSize: Size.zero,
                    ),
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
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Text('Crear pedido'),
                              SizedBox(width: 6),
                              Icon(Icons.chevron_right, size: 18),
                            ],
                          ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ResumenCostoEnvio extends StatelessWidget {
  const _ResumenCostoEnvio({required this.preview});

  final AsyncValue<PreviewCostoEnvio> preview;

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(
      locale: 'es',
      symbol: r'$',
      decimalDigits: 2,
    );
    return preview.when(
      loading: () => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Calculando…',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: tokens(context).tintaSilenciada,
            ),
          ),
          const SizedBox(height: 2),
          SizedBox(
            height: 18,
            width: 80,
            child: LinearProgressIndicator(
              minHeight: 4,
              backgroundColor: tokens(context).superficieAlt,
            ),
          ),
        ],
      ),
      error: (_, _) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Costo de envío',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: tokens(context).tintaSilenciada,
            ),
          ),
          Text(
            'No disponible',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: tokens(context).tintaSilenciada,
            ),
          ),
        ],
      ),
      data: (p) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: p.debeMostrarse
            ? [
                Text(
                  'Costo de envío a pagar al entregar',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: tokens(context).tintaSilenciada,
                  ),
                ),
                Text(
                  formato.format(p.costoEnvio),
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: tokens(context).tinta,
                    letterSpacing: -0.3,
                  ),
                ),
              ]
            : [
                Text(
                  'Cubierto por tu paquete activo',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: tokens(context).tintaSilenciada,
                  ),
                ),
                Text(
                  '1 envío del paquete',
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: tokens(context).tinta,
                    letterSpacing: -0.3,
                  ),
                ),
              ],
      ),
    );
  }
}

class _FilaResumen {
  const _FilaResumen(this.etiqueta, this.valor);
  final String etiqueta;
  final String valor;
}
