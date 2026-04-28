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
    this.descripcionPaquete,
    this.montoContraEntrega,
    this.tarifaTotal,
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
  final String direccionOrigen;
  final double latitudOrigen;
  final double longitudOrigen;
  final String direccionDestino;
  final double latitudDestino;
  final double longitudDestino;
  final String metodoPago;
  final DateTime creadoEn;
  final String? descripcionPaquete;
  final double? montoContraEntrega;
  final double? tarifaTotal;
  final RepartidorAsignado? repartidorRecogida;
  final RepartidorAsignado? repartidorEntrega;
  final List<EventoPedido> eventos;
  final List<ComprobantePedido> comprobantes;

  factory Pedido.desdeJson(Map<String, dynamic> json) {
    return Pedido(
      id: json['id'] as String,
      codigoSeguimiento: json['codigoSeguimiento'] as String? ?? '',
      estado: json['estado'] as String,
      nombreCliente: json['nombreCliente'] as String? ?? '',
      telefonoCliente: json['telefonoCliente'] as String? ?? '',
      direccionOrigen: json['direccionOrigen'] as String? ?? '',
      latitudOrigen: (json['latitudOrigen'] as num?)?.toDouble() ?? 0,
      longitudOrigen: (json['longitudOrigen'] as num?)?.toDouble() ?? 0,
      direccionDestino: json['direccionDestino'] as String? ?? '',
      latitudDestino: (json['latitudDestino'] as num?)?.toDouble() ?? 0,
      longitudDestino: (json['longitudDestino'] as num?)?.toDouble() ?? 0,
      metodoPago: json['metodoPago'] as String? ?? 'CONTRA_ENTREGA',
      creadoEn: DateTime.tryParse(json['creadoEn'] as String? ?? '') ??
          DateTime.now(),
      descripcionPaquete: json['descripcionPaquete'] as String?,
      montoContraEntrega: (json['montoContraEntrega'] as num?)?.toDouble(),
      tarifaTotal: (json['tarifaTotal'] as num?)?.toDouble(),
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
      latitud: (ubicacion?['latitud'] as num?)?.toDouble(),
      longitud: (ubicacion?['longitud'] as num?)?.toDouble(),
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
    return EventoPedido(
      id: json['id'] as String,
      tipo: json['tipo'] as String,
      creadoEn: DateTime.tryParse(json['creadoEn'] as String? ?? '') ??
          DateTime.now(),
      estadoNuevo: json['estadoNuevo'] as String?,
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
