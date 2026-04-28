// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pedido.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PedidoImpl _$$PedidoImplFromJson(Map<String, dynamic> json) => _$PedidoImpl(
  id: json['id'] as String,
  codigoSeguimiento: json['codigoSeguimiento'] as String,
  estado: $enumDecode(_$EstadoPedidoEnumMap, json['estado']),
  metodoPago: json['metodoPago'] as String?,
  direccionRecogida: json['direccionRecogida'] as String?,
  direccionEntrega: json['direccionEntrega'] as String?,
  nombreDestinatario: json['nombreDestinatario'] as String?,
  telefonoDestinatario: json['telefonoDestinatario'] as String?,
  latitudRecogida: (json['latitudRecogida'] as num?)?.toDouble(),
  longitudRecogida: (json['longitudRecogida'] as num?)?.toDouble(),
  latitudEntrega: (json['latitudEntrega'] as num?)?.toDouble(),
  longitudEntrega: (json['longitudEntrega'] as num?)?.toDouble(),
  montoContraEntrega: json['montoContraEntrega'] as String?,
  notas: json['notas'] as String?,
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
      'metodoPago': instance.metodoPago,
      'direccionRecogida': instance.direccionRecogida,
      'direccionEntrega': instance.direccionEntrega,
      'nombreDestinatario': instance.nombreDestinatario,
      'telefonoDestinatario': instance.telefonoDestinatario,
      'latitudRecogida': instance.latitudRecogida,
      'longitudRecogida': instance.longitudRecogida,
      'latitudEntrega': instance.latitudEntrega,
      'longitudEntrega': instance.longitudEntrega,
      'montoContraEntrega': instance.montoContraEntrega,
      'notas': instance.notas,
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
