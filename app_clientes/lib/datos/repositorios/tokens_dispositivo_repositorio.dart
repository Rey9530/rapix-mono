import 'dart:io' show Platform;

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';

class TokensDispositivoRepositorio {
  TokensDispositivoRepositorio(this._dio);

  final Dio _dio;

  String get plataformaActual => Platform.isAndroid ? 'ANDROID' : 'IOS';

  Future<void> registrar(String token) async {
    await _dio.post<void>(
      '/tokens-dispositivo',
      data: {'token': token, 'plataforma': plataformaActual},
    );
  }

  Future<void> revocar(String token) async {
    await _dio.delete<void>('/tokens-dispositivo/$token');
  }
}

final tokensDispositivoRepositorioProvider =
    Provider<TokensDispositivoRepositorio>((ref) {
  return TokensDispositivoRepositorio(ref.watch(dioClienteProvider));
});
