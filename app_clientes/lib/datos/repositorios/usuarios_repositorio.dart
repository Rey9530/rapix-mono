import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/usuario.dart';

class ActualizarPerfilVendedorEntrada {
  ActualizarPerfilVendedorEntrada({
    this.nombreNegocio,
    this.rfc,
    this.direccion,
    this.latitud,
    this.longitud,
    this.logo,
  });

  final String? nombreNegocio;
  final String? rfc;
  final String? direccion;
  final double? latitud;
  final double? longitud;
  final XFile? logo;

  Map<String, dynamic> aCamposMultipart() => {
        if (nombreNegocio != null) 'nombreNegocio': nombreNegocio,
        if (rfc != null) 'rfc': rfc,
        if (direccion != null) 'direccion': direccion,
        if (latitud != null) 'latitud': latitud.toString(),
        if (longitud != null) 'longitud': longitud.toString(),
      };
}

class UsuariosRepositorio {
  UsuariosRepositorio(this._dio);

  final Dio _dio;

  Future<Usuario> actualizarPerfilVendedor(
    ActualizarPerfilVendedorEntrada entrada,
  ) async {
    final campos = entrada.aCamposMultipart();
    if (entrada.logo != null) {
      final logo = entrada.logo!;
      campos['logo'] = await MultipartFile.fromFile(
        logo.path,
        filename: logo.name,
      );
    }
    final respuesta = await _dio.patch<Map<String, dynamic>>(
      '/usuarios/yo/perfil-vendedor',
      data: FormData.fromMap(campos),
    );
    return Usuario.desdeJson(respuesta.data!);
  }
}

final usuariosRepositorioProvider = Provider<UsuariosRepositorio>((ref) {
  return UsuariosRepositorio(ref.watch(dioClienteProvider));
});
