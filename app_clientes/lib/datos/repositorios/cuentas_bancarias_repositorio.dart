import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/cuenta_bancaria.dart';

class CrearCuentaBancariaEntrada {
  CrearCuentaBancariaEntrada({
    required this.bancoId,
    required this.tipoCuenta,
    required this.numeroCuenta,
    this.alias,
    this.esPrincipal,
  });

  final String bancoId;
  final TipoCuentaBancaria tipoCuenta;
  final String numeroCuenta;
  final String? alias;
  final bool? esPrincipal;

  Map<String, dynamic> aJson() => {
        'bancoId': bancoId,
        'tipoCuenta': tipoCuenta.apiValor,
        'numeroCuenta': numeroCuenta,
        if (alias != null && alias!.isNotEmpty) 'alias': alias,
        if (esPrincipal != null) 'esPrincipal': esPrincipal,
      };
}

class ActualizarCuentaBancariaEntrada {
  ActualizarCuentaBancariaEntrada({
    this.tipoCuenta,
    this.alias,
    this.esPrincipal,
  });

  final TipoCuentaBancaria? tipoCuenta;
  final String? alias;
  final bool? esPrincipal;

  Map<String, dynamic> aJson() => {
        if (tipoCuenta != null) 'tipoCuenta': tipoCuenta!.apiValor,
        if (alias != null) 'alias': alias,
        if (esPrincipal != null) 'esPrincipal': esPrincipal,
      };
}

class CuentasBancariasRepositorio {
  CuentasBancariasRepositorio(this._dio);

  final Dio _dio;

  Future<List<Banco>> listarBancos() async {
    final respuesta = await _dio.get<List<dynamic>>('/bancos');
    return (respuesta.data ?? [])
        .map((e) => Banco.desdeJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<CuentaBancaria>> listar() async {
    final respuesta = await _dio.get<List<dynamic>>(
      '/usuarios/yo/cuentas-bancarias',
    );
    return (respuesta.data ?? [])
        .map((e) => CuentaBancaria.desdeJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<CuentaBancaria> crear(CrearCuentaBancariaEntrada entrada) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/usuarios/yo/cuentas-bancarias',
      data: entrada.aJson(),
    );
    return CuentaBancaria.desdeJson(respuesta.data!);
  }

  Future<CuentaBancaria> actualizar(
    String id,
    ActualizarCuentaBancariaEntrada entrada,
  ) async {
    final respuesta = await _dio.patch<Map<String, dynamic>>(
      '/usuarios/yo/cuentas-bancarias/$id',
      data: entrada.aJson(),
    );
    return CuentaBancaria.desdeJson(respuesta.data!);
  }

  Future<void> eliminar(String id) async {
    await _dio.delete('/usuarios/yo/cuentas-bancarias/$id');
  }
}

final cuentasBancariasRepositorioProvider =
    Provider<CuentasBancariasRepositorio>((ref) {
  return CuentasBancariasRepositorio(ref.watch(dioClienteProvider));
});
