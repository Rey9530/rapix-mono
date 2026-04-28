import 'dart:convert';

import '../../nucleo/util/parseo_json.dart';

class Usuario {
  Usuario({
    required this.id,
    required this.email,
    required this.telefono,
    required this.nombreCompleto,
    required this.rol,
    this.estado,
    this.perfilVendedor,
  });

  final String id;
  final String email;
  final String telefono;
  final String nombreCompleto;
  final String rol;
  final String? estado;
  final PerfilVendedor? perfilVendedor;

  factory Usuario.desdeJson(Map<String, dynamic> json) {
    final perfilJson = json['perfilVendedor'] as Map<String, dynamic>?;
    return Usuario(
      id: json['id'] as String,
      email: json['email'] as String,
      telefono: json['telefono'] as String,
      nombreCompleto: json['nombreCompleto'] as String,
      rol: json['rol'] as String,
      estado: json['estado'] as String?,
      perfilVendedor:
          perfilJson != null ? PerfilVendedor.desdeJson(perfilJson) : null,
    );
  }

  Map<String, dynamic> aJson() => {
        'id': id,
        'email': email,
        'telefono': telefono,
        'nombreCompleto': nombreCompleto,
        'rol': rol,
        'estado': estado,
        'perfilVendedor': perfilVendedor?.aJson(),
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
