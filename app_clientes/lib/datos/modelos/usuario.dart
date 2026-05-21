import 'dart:convert';

import '../../nucleo/util/parseo_json.dart';

class Usuario {
  Usuario({
    required this.id,
    required this.email,
    required this.telefono,
    required this.nombreCompleto,
    required this.rol,
    required this.registroCompleto,
    this.estado,
    this.urlAvatar,
    this.creadoEn,
    this.correoVerificadoEn,
    this.perfilVendedor,
    this.estadisticas,
  });

  final String id;
  final String email;
  final String? telefono;
  final String nombreCompleto;
  final String rol;
  final bool registroCompleto;
  final String? estado;
  final String? urlAvatar;
  final DateTime? creadoEn;
  final DateTime? correoVerificadoEn;
  final PerfilVendedor? perfilVendedor;
  final EstadisticasUsuario? estadisticas;

  bool get correoVerificado => correoVerificadoEn != null;

  factory Usuario.desdeJson(Map<String, dynamic> json) {
    final perfilJson = json['perfilVendedor'] as Map<String, dynamic>?;
    final estadJson = json['estadisticas'] as Map<String, dynamic>?;
    return Usuario(
      id: json['id'] as String,
      email: json['email'] as String,
      telefono: json['telefono'] as String?,
      nombreCompleto: json['nombreCompleto'] as String,
      rol: json['rol'] as String,
      registroCompleto: json['registroCompleto'] as bool? ?? false,
      estado: json['estado'] as String?,
      urlAvatar: json['urlAvatar'] as String?,
      creadoEn: _parseFecha(json['creadoEn']),
      correoVerificadoEn: _parseFecha(json['correoVerificadoEn']),
      perfilVendedor:
          perfilJson != null ? PerfilVendedor.desdeJson(perfilJson) : null,
      estadisticas:
          estadJson != null ? EstadisticasUsuario.desdeJson(estadJson) : null,
    );
  }

  Map<String, dynamic> aJson() => {
        'id': id,
        'email': email,
        'telefono': telefono,
        'nombreCompleto': nombreCompleto,
        'rol': rol,
        'registroCompleto': registroCompleto,
        'estado': estado,
        'urlAvatar': urlAvatar,
        'creadoEn': creadoEn?.toIso8601String(),
        'correoVerificadoEn': correoVerificadoEn?.toIso8601String(),
        'perfilVendedor': perfilVendedor?.aJson(),
        'estadisticas': estadisticas?.aJson(),
      };

  String aJsonString() => jsonEncode(aJson());

  static Usuario? desdeJsonString(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    return Usuario.desdeJson(jsonDecode(raw) as Map<String, dynamic>);
  }
}

class PerfilVendedor {
  PerfilVendedor({
    this.nombreNegocio,
    this.rfc,
    this.direccion,
    this.latitud,
    this.longitud,
    this.urlLogo,
  });

  final String? nombreNegocio;
  final String? rfc;
  final String? direccion;
  final double? latitud;
  final double? longitud;
  final String? urlLogo;

  factory PerfilVendedor.desdeJson(Map<String, dynamic> json) => PerfilVendedor(
        nombreNegocio: json['nombreNegocio'] as String?,
        rfc: json['rfc'] as String?,
        direccion: json['direccion'] as String?,
        latitud: parseDoubleSeguro(json['latitud']),
        longitud: parseDoubleSeguro(json['longitud']),
        urlLogo: json['urlLogo'] as String?,
      );

  Map<String, dynamic> aJson() => {
        'nombreNegocio': nombreNegocio,
        'rfc': rfc,
        'direccion': direccion,
        'latitud': latitud,
        'longitud': longitud,
        'urlLogo': urlLogo,
      };
}

class EstadisticasUsuario {
  const EstadisticasUsuario({
    required this.enviosTotales,
    required this.enviosEntregados,
    required this.saldoRecargado,
  });

  final int enviosTotales;
  final int enviosEntregados;
  final int saldoRecargado;

  /// Porcentaje 0..100. Devuelve null si no hay envíos para evitar /0.
  double? get porcentajeEntregados {
    if (enviosTotales == 0) return null;
    return (enviosEntregados / enviosTotales) * 100.0;
  }

  factory EstadisticasUsuario.desdeJson(Map<String, dynamic> json) =>
      EstadisticasUsuario(
        enviosTotales: parseIntSeguroODefault(json['enviosTotales']),
        enviosEntregados: parseIntSeguroODefault(json['enviosEntregados']),
        saldoRecargado: parseIntSeguroODefault(json['saldoRecargado']),
      );

  Map<String, dynamic> aJson() => {
        'enviosTotales': enviosTotales,
        'enviosEntregados': enviosEntregados,
        'saldoRecargado': saldoRecargado,
      };
}

DateTime? _parseFecha(dynamic valor) {
  if (valor == null) return null;
  if (valor is DateTime) return valor;
  if (valor is String && valor.isNotEmpty) return DateTime.tryParse(valor);
  return null;
}
