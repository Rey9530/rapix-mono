import 'dart:io';
import 'package:dio/dio.dart';
import '../../core/network/excepciones_api.dart';
import '../modelos/pedido.dart';

class PedidosRepositorio {
  final Dio _dio;

  PedidosRepositorio({required Dio dio}) : _dio = dio;

  Future<List<Pedido>> recogidasPendientes() async {
    final r = await _dio.get<List<dynamic>>('/repartidores/yo/recogidas-pendientes');
    return r.data!.map((e) => Pedido.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Pedido>> entregasPendientes() async {
    final r = await _dio.get<List<dynamic>>('/repartidores/yo/entregas-pendientes');
    return r.data!.map((e) => Pedido.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Pedido> pedidoPorId(String id) async {
    final r = await _dio.get<Map<String, dynamic>>('/pedidos/$id');
    return Pedido.fromJson(r.data!);
  }

  Future<Pedido> recoger(String id, {double? lat, double? lng, String? notas}) =>
      _transicion(id, 'recoger', lat: lat, lng: lng, notas: notas);

  Future<Pedido> enTransito(String id, {double? lat, double? lng, String? notas}) =>
      _transicion(id, 'en-transito', lat: lat, lng: lng, notas: notas);

  Future<Pedido> llegarIntercambio(String id, {double? lat, double? lng, String? notas}) =>
      _transicion(id, 'llegar-intercambio', lat: lat, lng: lng, notas: notas);

  Future<Pedido> tomarEntrega(String id, {double? lat, double? lng, String? notas}) =>
      _transicion(id, 'tomar-entrega', lat: lat, lng: lng, notas: notas);

  Future<Pedido> fallar(
    String id, {
    required String motivo,
    double? lat,
    double? lng,
    String? notas,
  }) =>
      _transicion(id, 'fallar', lat: lat, lng: lng, notas: notas, motivo: motivo);

  Future<Pedido> _transicion(
    String id,
    String accion, {
    double? lat,
    double? lng,
    String? notas,
    String? motivo,
  }) async {
    final body = <String, dynamic>{};
    if (lat != null) body['latitud'] = lat;
    if (lng != null) body['longitud'] = lng;
    if (notas != null && notas.isNotEmpty) body['notas'] = notas;
    if (motivo != null) body['motivo'] = motivo;
    try {
      final r = await _dio.post<Map<String, dynamic>>(
        '/pedidos/$id/$accion',
        data: body,
      );
      return Pedido.fromJson(r.data!);
    } on DioException catch (e) {
      throw _mapearError(e, 'No se pudo $accion el pedido');
    }
  }

  Future<Pedido> entregar({
    required String id,
    required File foto,
    File? firma,
    String? recibidoPor,
    double? lat,
    double? lng,
    String? notas,
  }) async {
    final form = FormData();
    form.files.add(
      MapEntry('foto', await MultipartFile.fromFile(foto.path, filename: 'foto.jpg')),
    );
    if (firma != null) {
      form.files.add(
        MapEntry('firma', await MultipartFile.fromFile(firma.path, filename: 'firma.png')),
      );
    }
    if (recibidoPor != null && recibidoPor.isNotEmpty) {
      form.fields.add(MapEntry('recibidoPor', recibidoPor));
    }
    if (lat != null) form.fields.add(MapEntry('latitud', lat.toString()));
    if (lng != null) form.fields.add(MapEntry('longitud', lng.toString()));
    if (notas != null && notas.isNotEmpty) {
      form.fields.add(MapEntry('notas', notas));
    }

    try {
      final r = await _dio.post<Map<String, dynamic>>(
        '/pedidos/$id/entregar',
        data: form,
        options: Options(contentType: 'multipart/form-data'),
      );
      return Pedido.fromJson(r.data!);
    } on DioException catch (e) {
      throw _mapearError(e, 'No se pudo entregar el pedido');
    }
  }

  ExcepcionApi _mapearError(DioException e, String mensajePorDefecto) {
    final statusCode = e.response?.statusCode;
    final data = e.response?.data;
    String mensaje = mensajePorDefecto;
    String? codigoNegocio;
    if (data is Map<String, dynamic>) {
      final m = data['message'];
      if (m is String) mensaje = m;
      if (m is List && m.isNotEmpty) mensaje = m.first.toString();
      if (data['codigo'] is String) codigoNegocio = data['codigo'] as String;
    }
    return ExcepcionApi(mensaje, codigoHttp: statusCode, codigoNegocio: codigoNegocio);
  }
}
