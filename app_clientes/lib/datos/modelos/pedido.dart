import '../../nucleo/util/parseo_json.dart';

class Pedido {
  Pedido({
    required this.id,
    required this.codigoSeguimiento,
    required this.estado,
    required this.nombreCliente,
    required this.telefonoCliente,
    required this.direccionOrigen,
    required this.latitudOrigen,
    required this.longitudOrigen,
    required this.direccionDestino,
    required this.latitudDestino,
    required this.longitudDestino,
    required this.metodoPago,
    required this.creadoEn,
    this.emailCliente,
    this.descripcionPaquete,
    this.urlFotoPaquete,
    this.montoContraEntrega,
    this.tarifaTotal,
    this.costoEnvio,
    this.modoFacturacion,
    this.notasOrigen,
    this.notasDestino,
    this.zonaOrigen,
    this.zonaDestino,
    this.pesoPaqueteKg,
    this.valorDeclarado,
    this.motivoCancelado,
    this.motivoFallo,
    this.programadoPara,
    this.recogidoEn,
    this.enIntercambioEn,
    this.entregadoEn,
    this.canceladoEn,
    this.repartidorRecogida,
    this.repartidorEntrega,
    this.eventos = const [],
    this.comprobantes = const [],
  });

  final String id;
  final String codigoSeguimiento;
  final String estado;
  final String nombreCliente;
  final String telefonoCliente;
  final String? emailCliente;
  final String direccionOrigen;
  final double latitudOrigen;
  final double longitudOrigen;
  final String direccionDestino;
  final double latitudDestino;
  final double longitudDestino;
  final String metodoPago;
  final DateTime creadoEn;
  final String? descripcionPaquete;
  final String? urlFotoPaquete;
  final double? montoContraEntrega;
  final double? tarifaTotal;
  final double? costoEnvio;
  final String? modoFacturacion;
  final String? notasOrigen;
  final String? notasDestino;
  final ZonaResumen? zonaOrigen;
  final ZonaResumen? zonaDestino;
  final double? pesoPaqueteKg;
  final double? valorDeclarado;
  final String? motivoCancelado;
  final String? motivoFallo;
  final DateTime? programadoPara;
  final DateTime? recogidoEn;
  final DateTime? enIntercambioEn;
  final DateTime? entregadoEn;
  final DateTime? canceladoEn;
  final RepartidorAsignado? repartidorRecogida;
  final RepartidorAsignado? repartidorEntrega;
  final List<EventoPedido> eventos;
  final List<ComprobantePedido> comprobantes;

  factory Pedido.desdeJson(Map<String, dynamic> json) {
    final costoEnvioBruto = parseDoubleSeguro(json['costoEnvio']);
    return Pedido(
      id: json['id'] as String,
      codigoSeguimiento: json['codigoSeguimiento'] as String? ?? '',
      estado: json['estado'] as String,
      nombreCliente: json['nombreCliente'] as String? ?? '',
      telefonoCliente: json['telefonoCliente'] as String? ?? '',
      emailCliente: json['emailCliente'] as String?,
      direccionOrigen: json['direccionOrigen'] as String? ?? '',
      latitudOrigen: parseDoubleSeguroODefault(json['latitudOrigen']),
      longitudOrigen: parseDoubleSeguroODefault(json['longitudOrigen']),
      direccionDestino: json['direccionDestino'] as String? ?? '',
      latitudDestino: parseDoubleSeguroODefault(json['latitudDestino']),
      longitudDestino: parseDoubleSeguroODefault(json['longitudDestino']),
      metodoPago: json['metodoPago'] as String? ?? 'CONTRA_ENTREGA',
      creadoEn: DateTime.tryParse(json['creadoEn'] as String? ?? '') ??
          DateTime.now(),
      descripcionPaquete: json['descripcionPaquete'] as String?,
      urlFotoPaquete: json['urlFotoPaquete'] as String?,
      montoContraEntrega: parseDoubleSeguro(json['montoContraEntrega']),
      tarifaTotal: parseDoubleSeguro(json['tarifaTotal'] ?? json['costoEnvio']),
      costoEnvio: costoEnvioBruto,
      modoFacturacion: json['modoFacturacion'] as String?,
      notasOrigen: json['notasOrigen'] as String?,
      notasDestino: json['notasDestino'] as String?,
      zonaOrigen: _zona(json['zonaOrigen']),
      zonaDestino: _zona(json['zonaDestino']),
      pesoPaqueteKg: parseDoubleSeguro(json['pesoPaqueteKg']),
      valorDeclarado: parseDoubleSeguro(json['valorDeclarado']),
      motivoCancelado: json['motivoCancelado'] as String?,
      motivoFallo: json['motivoFallo'] as String?,
      programadoPara: _fecha(json['programadoPara']),
      recogidoEn: _fecha(json['recogidoEn']),
      enIntercambioEn: _fecha(json['enIntercambioEn']),
      entregadoEn: _fecha(json['entregadoEn']),
      canceladoEn: _fecha(json['canceladoEn']),
      repartidorRecogida: _repartidor(json['repartidorRecogida']),
      repartidorEntrega: _repartidor(json['repartidorEntrega']),
      eventos: (json['eventos'] as List?)
              ?.map((e) => EventoPedido.desdeJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      comprobantes: (json['comprobantes'] as List?)
              ?.map((e) =>
                  ComprobantePedido.desdeJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  static RepartidorAsignado? _repartidor(dynamic raw) {
    if (raw == null) return null;
    return RepartidorAsignado.desdeJson(raw as Map<String, dynamic>);
  }

  static ZonaResumen? _zona(dynamic raw) {
    if (raw == null) return null;
    return ZonaResumen.desdeJson(raw as Map<String, dynamic>);
  }

  static DateTime? _fecha(dynamic raw) {
    if (raw == null) return null;
    if (raw is String && raw.isEmpty) return null;
    return DateTime.tryParse(raw.toString());
  }

  static const _estadosTerminales = {'ENTREGADO', 'CANCELADO', 'DEVUELTO'};

  static bool esEstadoTerminal(String estado) =>
      _estadosTerminales.contains(estado);

  bool get esEditable => !esEstadoTerminal(estado);
}

class ZonaResumen {
  ZonaResumen({required this.id, required this.codigo, required this.nombre});

  final String id;
  final String codigo;
  final String nombre;

  factory ZonaResumen.desdeJson(Map<String, dynamic> json) {
    return ZonaResumen(
      id: json['id'] as String? ?? '',
      codigo: json['codigo'] as String? ?? '',
      nombre: json['nombre'] as String? ?? '',
    );
  }
}

class RepartidorAsignado {
  RepartidorAsignado({
    required this.id,
    required this.nombreCompleto,
    this.telefono,
    this.latitud,
    this.longitud,
  });

  final String id;
  final String nombreCompleto;
  final String? telefono;
  final double? latitud;
  final double? longitud;

  factory RepartidorAsignado.desdeJson(Map<String, dynamic> json) {
    final ubicacion = json['ubicacionActual'] as Map<String, dynamic>?;
    final usuario = json['usuario'] as Map<String, dynamic>? ?? json;
    return RepartidorAsignado(
      id: (json['id'] ?? usuario['id']) as String,
      nombreCompleto: usuario['nombreCompleto'] as String? ?? '',
      telefono: usuario['telefono'] as String?,
      latitud: parseDoubleSeguro(ubicacion?['latitud']),
      longitud: parseDoubleSeguro(ubicacion?['longitud']),
    );
  }
}

class EventoPedido {
  EventoPedido({
    required this.id,
    required this.tipo,
    required this.creadoEn,
    this.estadoNuevo,
    this.notas,
  });

  final String id;
  final String tipo;
  final DateTime creadoEn;
  final String? estadoNuevo;
  final String? notas;

  factory EventoPedido.desdeJson(Map<String, dynamic> json) {
    final estado = json['estado'] as String?;
    return EventoPedido(
      id: json['id'] as String,
      tipo: (json['tipo'] as String?) ?? estado ?? '',
      creadoEn: DateTime.tryParse(json['creadoEn'] as String? ?? '') ??
          DateTime.now(),
      estadoNuevo: (json['estadoNuevo'] as String?) ?? estado,
      notas: json['notas'] as String?,
    );
  }
}

class ComprobantePedido {
  ComprobantePedido({
    required this.id,
    required this.tipo,
    required this.url,
    this.descripcion,
  });

  final String id;
  final String tipo;
  final String url;
  final String? descripcion;

  factory ComprobantePedido.desdeJson(Map<String, dynamic> json) {
    return ComprobantePedido(
      id: json['id'] as String,
      tipo: json['tipo'] as String? ?? 'FOTO',
      url: (json['url'] ?? json['urlPublica']) as String? ?? '',
      descripcion: json['descripcion'] as String?,
    );
  }
}
