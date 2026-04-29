// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pedido.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PedidoImpl _$$PedidoImplFromJson(Map<String, dynamic> json) => _$PedidoImpl(
  id: json['id'] as String,
  codigoSeguimiento: json['codigoSeguimiento'] as String,
  estado: $enumDecode(_$EstadoPedidoEnumMap, json['estado']),
  nombreCliente: json['nombreCliente'] as String?,
  telefonoCliente: json['telefonoCliente'] as String?,
  emailCliente: json['emailCliente'] as String?,
  direccionOrigen: json['direccionOrigen'] as String?,
  latitudOrigen: (json['latitudOrigen'] as num?)?.toDouble(),
  longitudOrigen: (json['longitudOrigen'] as num?)?.toDouble(),
  notasOrigen: json['notasOrigen'] as String?,
  direccionDestino: json['direccionDestino'] as String?,
  latitudDestino: (json['latitudDestino'] as num?)?.toDouble(),
  longitudDestino: (json['longitudDestino'] as num?)?.toDouble(),
  notasDestino: json['notasDestino'] as String?,
  descripcionPaquete: json['descripcionPaquete'] as String?,
  pesoPaqueteKg: json['pesoPaqueteKg'] as String?,
  valorDeclarado: json['valorDeclarado'] as String?,
  urlFotoPaquete: json['urlFotoPaquete'] as String?,
  metodoPago: json['metodoPago'] as String?,
  modoFacturacion: json['modoFacturacion'] as String?,
  costoEnvio: json['costoEnvio'] as String?,
  montoContraEntrega: json['montoContraEntrega'] as String?,
  recogidoEn: json['recogidoEn'] == null
      ? null
      : DateTime.parse(json['recogidoEn'] as String),
  enIntercambioEn: json['enIntercambioEn'] == null
      ? null
      : DateTime.parse(json['enIntercambioEn'] as String),
  entregadoEn: json['entregadoEn'] == null
      ? null
      : DateTime.parse(json['entregadoEn'] as String),
  creadoEn: json['creadoEn'] == null
      ? null
      : DateTime.parse(json['creadoEn'] as String),
  actualizadoEn: json['actualizadoEn'] == null
      ? null
      : DateTime.parse(json['actualizadoEn'] as String),
);

Map<String, dynamic> _$$PedidoImplToJson(_$PedidoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'codigoSeguimiento': instance.codigoSeguimiento,
      'estado': _$EstadoPedidoEnumMap[instance.estado]!,
      'nombreCliente': instance.nombreCliente,
      'telefonoCliente': instance.telefonoCliente,
      'emailCliente': instance.emailCliente,
      'direccionOrigen': instance.direccionOrigen,
      'latitudOrigen': instance.latitudOrigen,
      'longitudOrigen': instance.longitudOrigen,
      'notasOrigen': instance.notasOrigen,
      'direccionDestino': instance.direccionDestino,
      'latitudDestino': instance.latitudDestino,
      'longitudDestino': instance.longitudDestino,
      'notasDestino': instance.notasDestino,
      'descripcionPaquete': instance.descripcionPaquete,
      'pesoPaqueteKg': instance.pesoPaqueteKg,
      'valorDeclarado': instance.valorDeclarado,
      'urlFotoPaquete': instance.urlFotoPaquete,
      'metodoPago': instance.metodoPago,
      'modoFacturacion': instance.modoFacturacion,
      'costoEnvio': instance.costoEnvio,
      'montoContraEntrega': instance.montoContraEntrega,
      'recogidoEn': instance.recogidoEn?.toIso8601String(),
      'enIntercambioEn': instance.enIntercambioEn?.toIso8601String(),
      'entregadoEn': instance.entregadoEn?.toIso8601String(),
      'creadoEn': instance.creadoEn?.toIso8601String(),
      'actualizadoEn': instance.actualizadoEn?.toIso8601String(),
    };

const _$EstadoPedidoEnumMap = {
  EstadoPedido.PENDIENTE_ASIGNACION: 'PENDIENTE_ASIGNACION',
  EstadoPedido.ASIGNADO: 'ASIGNADO',
  EstadoPedido.RECOGIDO: 'RECOGIDO',
  EstadoPedido.EN_TRANSITO: 'EN_TRANSITO',
  EstadoPedido.EN_PUNTO_INTERCAMBIO: 'EN_PUNTO_INTERCAMBIO',
  EstadoPedido.EN_REPARTO: 'EN_REPARTO',
  EstadoPedido.ENTREGADO: 'ENTREGADO',
  EstadoPedido.CANCELADO: 'CANCELADO',
  EstadoPedido.FALLIDO: 'FALLIDO',
  EstadoPedido.DEVUELTO: 'DEVUELTO',
};
