import '../../nucleo/util/parseo_json.dart';

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
        tamanoPaquete: parseIntSeguroODefault(json['tamanoPaquete']),
        precioPaquete: parseDoubleSeguroODefault(json['precioPaquete']),
        descripcion: json['descripcion'] as String?,
        diasValidez: parseIntSeguro(json['diasValidez']),
      );
}

class PaqueteRecargado {
  PaqueteRecargado({
    required this.id,
    required this.nombre,
    required this.estado,
    required this.enviosTotales,
    required this.enviosRestantes,
    required this.precio,
    required this.compradoEn,
    this.expiraEn,
  });

  final String id;
  final String nombre;
  final String estado;
  final int enviosTotales;
  final int enviosRestantes;
  final double precio;
  final DateTime compradoEn;
  final DateTime? expiraEn;

  int get enviosUsados => enviosTotales - enviosRestantes;

  factory PaqueteRecargado.desdeJson(Map<String, dynamic> json) {
    return PaqueteRecargado(
      id: json['id'] as String,
      nombre: json['nombre'] as String? ?? 'Paquete',
      estado: json['estado'] as String,
      enviosTotales: parseIntSeguroODefault(json['enviosTotales']),
      enviosRestantes: parseIntSeguroODefault(json['enviosRestantes']),
      precio: parseDoubleSeguroODefault(json['precio']),
      compradoEn: DateTime.tryParse(json['compradoEn'] as String? ?? '') ??
          DateTime.now(),
      expiraEn: json['expiraEn'] != null
          ? DateTime.tryParse(json['expiraEn'] as String)
          : null,
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
        saldoRecargado: parseIntSeguro(json['saldoRecargado']) ??
            parseIntSeguroODefault(json['enviosRestantes']),
        paquetesActivos: parseIntSeguroODefault(json['paquetesActivos']),
      );
}
