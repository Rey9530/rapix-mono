import '../../nucleo/util/parseo_json.dart';

class PaquetePendienteDeposito {
  PaquetePendienteDeposito({
    required this.id,
    required this.codigoSeguimiento,
    required this.nombreCliente,
    required this.direccionDestino,
    required this.montoContraEntrega,
    this.entregadoEn,
  });

  final String id;
  final String codigoSeguimiento;
  final String nombreCliente;
  final String direccionDestino;
  final double montoContraEntrega;
  final DateTime? entregadoEn;

  factory PaquetePendienteDeposito.desdeJson(Map<String, dynamic> json) {
    return PaquetePendienteDeposito(
      id: json['id'] as String,
      codigoSeguimiento: json['codigoSeguimiento'] as String? ?? '',
      nombreCliente: json['nombreCliente'] as String? ?? '',
      direccionDestino: json['direccionDestino'] as String? ?? '',
      montoContraEntrega:
          parseDoubleSeguroODefault(json['montoContraEntrega']),
      entregadoEn: _fecha(json['entregadoEn']),
    );
  }

  static DateTime? _fecha(dynamic raw) {
    if (raw == null) return null;
    if (raw is String && raw.isEmpty) return null;
    return DateTime.tryParse(raw.toString());
  }
}

class SaldoPendiente {
  SaldoPendiente({
    required this.totalPendiente,
    required this.cantidad,
    required this.paquetes,
  });

  final double totalPendiente;
  final int cantidad;
  final List<PaquetePendienteDeposito> paquetes;

  factory SaldoPendiente.desdeJson(Map<String, dynamic> json) {
    final lista = (json['paquetes'] as List?) ?? const [];
    return SaldoPendiente(
      totalPendiente: parseDoubleSeguroODefault(json['totalPendiente']),
      cantidad: parseIntSeguroODefault(json['cantidad']),
      paquetes: lista
          .map((e) =>
              PaquetePendienteDeposito.desdeJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class CuentaBancariaResumen {
  CuentaBancariaResumen({
    required this.id,
    required this.numeroCuenta,
    required this.tipoCuenta,
    required this.bancoNombre,
    this.alias,
  });

  final String id;
  final String numeroCuenta;
  final String tipoCuenta;
  final String bancoNombre;
  final String? alias;

  factory CuentaBancariaResumen.desdeJson(Map<String, dynamic> json) {
    final banco = json['banco'] as Map<String, dynamic>?;
    return CuentaBancariaResumen(
      id: json['id'] as String? ?? '',
      numeroCuenta: json['numeroCuenta'] as String? ?? '',
      tipoCuenta: json['tipoCuenta'] as String? ?? '',
      bancoNombre: banco?['nombre'] as String? ?? '',
      alias: json['alias'] as String?,
    );
  }
}

class DepositoHistorial {
  DepositoHistorial({
    required this.id,
    required this.fechaDeposito,
    required this.monto,
    required this.cantidadPaquetes,
    this.referencia,
    this.urlComprobante,
    this.cuentaBancaria,
  });

  final String id;
  final DateTime fechaDeposito;
  final double monto;
  final int cantidadPaquetes;
  final String? referencia;
  final String? urlComprobante;
  final CuentaBancariaResumen? cuentaBancaria;

  factory DepositoHistorial.desdeJson(Map<String, dynamic> json) {
    final conteo = json['_count'] as Map<String, dynamic>?;
    final cuenta = json['cuentaBancaria'] as Map<String, dynamic>?;
    return DepositoHistorial(
      id: json['id'] as String,
      fechaDeposito:
          DateTime.tryParse(json['fechaDeposito'] as String? ?? '') ??
              DateTime.now(),
      monto: parseDoubleSeguroODefault(json['monto']),
      cantidadPaquetes:
          parseIntSeguroODefault(conteo?['pedidos']),
      referencia: json['referencia'] as String?,
      urlComprobante: json['urlComprobante'] as String?,
      cuentaBancaria:
          cuenta == null ? null : CuentaBancariaResumen.desdeJson(cuenta),
    );
  }
}

class PaginaDepositos {
  PaginaDepositos({
    required this.datos,
    required this.pagina,
    required this.limite,
    required this.total,
    required this.totalPaginas,
  });

  final List<DepositoHistorial> datos;
  final int pagina;
  final int limite;
  final int total;
  final int totalPaginas;

  factory PaginaDepositos.desdeJson(Map<String, dynamic> json) {
    final datos = (json['datos'] as List?) ?? const [];
    final meta = json['meta'] as Map<String, dynamic>? ?? const {};
    return PaginaDepositos(
      datos: datos
          .map((e) => DepositoHistorial.desdeJson(e as Map<String, dynamic>))
          .toList(),
      pagina: parseIntSeguroODefault(meta['pagina'], porDefecto: 1),
      limite: parseIntSeguroODefault(meta['limite'], porDefecto: 20),
      total: parseIntSeguroODefault(meta['total']),
      totalPaginas: parseIntSeguroODefault(meta['totalPaginas']),
    );
  }
}

class RepartidorResumen {
  RepartidorResumen({required this.nombreCompleto, this.telefono});

  final String nombreCompleto;
  final String? telefono;

  factory RepartidorResumen.desdeJson(Map<String, dynamic> json) {
    final usuario = json['usuario'] as Map<String, dynamic>?;
    return RepartidorResumen(
      nombreCompleto: usuario?['nombreCompleto'] as String? ?? '',
      telefono: usuario?['telefono'] as String?,
    );
  }
}

class PaqueteEnDeposito {
  PaqueteEnDeposito({
    required this.id,
    required this.codigoSeguimiento,
    required this.nombreCliente,
    required this.direccionDestino,
    required this.montoContraEntrega,
    this.telefonoCliente,
    this.entregadoEn,
    this.repartidorEntrega,
  });

  final String id;
  final String codigoSeguimiento;
  final String nombreCliente;
  final String direccionDestino;
  final double montoContraEntrega;
  final String? telefonoCliente;
  final DateTime? entregadoEn;
  final RepartidorResumen? repartidorEntrega;

  factory PaqueteEnDeposito.desdeJson(Map<String, dynamic> json) {
    final rep = json['repartidorEntrega'] as Map<String, dynamic>?;
    return PaqueteEnDeposito(
      id: json['id'] as String,
      codigoSeguimiento: json['codigoSeguimiento'] as String? ?? '',
      nombreCliente: json['nombreCliente'] as String? ?? '',
      direccionDestino: json['direccionDestino'] as String? ?? '',
      montoContraEntrega:
          parseDoubleSeguroODefault(json['montoContraEntrega']),
      telefonoCliente: json['telefonoCliente'] as String?,
      entregadoEn: _fecha(json['entregadoEn']),
      repartidorEntrega:
          rep == null ? null : RepartidorResumen.desdeJson(rep),
    );
  }

  static DateTime? _fecha(dynamic raw) {
    if (raw == null) return null;
    if (raw is String && raw.isEmpty) return null;
    return DateTime.tryParse(raw.toString());
  }
}

class DepositoDetalle {
  DepositoDetalle({
    required this.id,
    required this.fechaDeposito,
    required this.monto,
    required this.pedidos,
    this.referencia,
    this.notas,
    this.urlComprobante,
    this.cuentaBancaria,
  });

  final String id;
  final DateTime fechaDeposito;
  final double monto;
  final List<PaqueteEnDeposito> pedidos;
  final String? referencia;
  final String? notas;
  final String? urlComprobante;
  final CuentaBancariaResumen? cuentaBancaria;

  factory DepositoDetalle.desdeJson(Map<String, dynamic> json) {
    final cuenta = json['cuentaBancaria'] as Map<String, dynamic>?;
    final pedidos = (json['pedidos'] as List?) ?? const [];
    return DepositoDetalle(
      id: json['id'] as String,
      fechaDeposito:
          DateTime.tryParse(json['fechaDeposito'] as String? ?? '') ??
              DateTime.now(),
      monto: parseDoubleSeguroODefault(json['monto']),
      referencia: json['referencia'] as String?,
      notas: json['notas'] as String?,
      urlComprobante: json['urlComprobante'] as String?,
      cuentaBancaria:
          cuenta == null ? null : CuentaBancariaResumen.desdeJson(cuenta),
      pedidos: pedidos
          .map((e) => PaqueteEnDeposito.desdeJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
