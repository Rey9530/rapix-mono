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

class DepositoResumen {
  DepositoResumen({
    required this.id,
    required this.fechaDeposito,
    required this.monto,
    this.referencia,
  });

  final String id;
  final DateTime fechaDeposito;
  final double monto;
  final String? referencia;

  factory DepositoResumen.desdeJson(Map<String, dynamic> json) {
    return DepositoResumen(
      id: json['id'] as String,
      fechaDeposito:
          DateTime.tryParse(json['fechaDeposito'] as String? ?? '') ??
              DateTime.now(),
      monto: parseDoubleSeguroODefault(json['monto']),
      referencia: json['referencia'] as String?,
    );
  }
}

class PaqueteDepositado {
  PaqueteDepositado({
    required this.id,
    required this.codigoSeguimiento,
    required this.nombreCliente,
    required this.montoContraEntrega,
    required this.deposito,
    this.entregadoEn,
  });

  final String id;
  final String codigoSeguimiento;
  final String nombreCliente;
  final double montoContraEntrega;
  final DateTime? entregadoEn;
  final DepositoResumen deposito;

  factory PaqueteDepositado.desdeJson(Map<String, dynamic> json) {
    return PaqueteDepositado(
      id: json['id'] as String,
      codigoSeguimiento: json['codigoSeguimiento'] as String? ?? '',
      nombreCliente: json['nombreCliente'] as String? ?? '',
      montoContraEntrega:
          parseDoubleSeguroODefault(json['montoContraEntrega']),
      entregadoEn: _fecha(json['entregadoEn']),
      deposito:
          DepositoResumen.desdeJson(json['deposito'] as Map<String, dynamic>),
    );
  }

  static DateTime? _fecha(dynamic raw) {
    if (raw == null) return null;
    if (raw is String && raw.isEmpty) return null;
    return DateTime.tryParse(raw.toString());
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

  final List<PaqueteDepositado> datos;
  final int pagina;
  final int limite;
  final int total;
  final int totalPaginas;

  factory PaginaDepositos.desdeJson(Map<String, dynamic> json) {
    final datos = (json['datos'] as List?) ?? const [];
    final meta = json['meta'] as Map<String, dynamic>? ?? const {};
    return PaginaDepositos(
      datos: datos
          .map((e) => PaqueteDepositado.desdeJson(e as Map<String, dynamic>))
          .toList(),
      pagina: parseIntSeguroODefault(meta['pagina'], porDefecto: 1),
      limite: parseIntSeguroODefault(meta['limite'], porDefecto: 20),
      total: parseIntSeguroODefault(meta['total']),
      totalPaginas: parseIntSeguroODefault(meta['totalPaginas']),
    );
  }
}
