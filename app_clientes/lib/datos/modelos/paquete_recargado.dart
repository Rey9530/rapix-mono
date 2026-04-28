class ReglaTarifaPaquete {
  ReglaTarifaPaquete({
    required this.id,
    required this.nombre,
    required this.tamanoPaquete,
    required this.precioPaquete,
    this.descripcion,
    this.diasValidez,
  });

  final String id;
  final String nombre;
  final int tamanoPaquete;
  final double precioPaquete;
  final String? descripcion;
  final int? diasValidez;

  factory ReglaTarifaPaquete.desdeJson(Map<String, dynamic> json) =>
      ReglaTarifaPaquete(
        id: json['id'] as String,
        nombre: json['nombre'] as String,
        tamanoPaquete: (json['tamanoPaquete'] as num?)?.toInt() ?? 0,
        precioPaquete: (json['precioPaquete'] as num?)?.toDouble() ?? 0,
        descripcion: json['descripcion'] as String?,
        diasValidez: (json['diasValidez'] as num?)?.toInt(),
      );
}

class PaqueteRecargado {
  PaqueteRecargado({
    required this.id,
    required this.estado,
    required this.enviosTotales,
    required this.enviosUsados,
    required this.precioPagado,
    required this.compradoEn,
    this.expiraEn,
    this.metodoPago,
    this.reglaTarifa,
  });

  final String id;
  final String estado;
  final int enviosTotales;
  final int enviosUsados;
  final double precioPagado;
  final DateTime compradoEn;
  final DateTime? expiraEn;
  final String? metodoPago;
  final ReglaTarifaPaquete? reglaTarifa;

  int get enviosRestantes => enviosTotales - enviosUsados;

  factory PaqueteRecargado.desdeJson(Map<String, dynamic> json) {
    final regla = json['reglaTarifa'] as Map<String, dynamic>?;
    return PaqueteRecargado(
      id: json['id'] as String,
      estado: json['estado'] as String,
      enviosTotales: (json['enviosTotales'] as num?)?.toInt() ?? 0,
      enviosUsados: (json['enviosUsados'] as num?)?.toInt() ?? 0,
      precioPagado: (json['precioPagado'] as num?)?.toDouble() ?? 0,
      compradoEn: DateTime.tryParse(json['compradoEn'] as String? ?? '') ??
          DateTime.now(),
      expiraEn: json['expiraEn'] != null
          ? DateTime.tryParse(json['expiraEn'] as String)
          : null,
      metodoPago: json['metodoPago'] as String?,
      reglaTarifa: regla != null ? ReglaTarifaPaquete.desdeJson(regla) : null,
    );
  }
}

class SaldoPaquetes {
  SaldoPaquetes({
    required this.saldoRecargado,
    required this.paquetesActivos,
  });

  final int saldoRecargado;
  final int paquetesActivos;

  factory SaldoPaquetes.desdeJson(Map<String, dynamic> json) => SaldoPaquetes(
        saldoRecargado: (json['saldoRecargado'] as num?)?.toInt() ??
            (json['enviosRestantes'] as num?)?.toInt() ??
            0,
        paquetesActivos: (json['paquetesActivos'] as num?)?.toInt() ?? 0,
      );
}
