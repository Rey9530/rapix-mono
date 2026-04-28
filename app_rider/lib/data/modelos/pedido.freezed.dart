// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'pedido.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Pedido _$PedidoFromJson(Map<String, dynamic> json) {
  return _Pedido.fromJson(json);
}

/// @nodoc
mixin _$Pedido {
  String get id => throw _privateConstructorUsedError;
  String get codigoSeguimiento => throw _privateConstructorUsedError;
  EstadoPedido get estado => throw _privateConstructorUsedError;
  String? get metodoPago => throw _privateConstructorUsedError;
  String? get direccionRecogida => throw _privateConstructorUsedError;
  String? get direccionEntrega => throw _privateConstructorUsedError;
  String? get nombreDestinatario => throw _privateConstructorUsedError;
  String? get telefonoDestinatario => throw _privateConstructorUsedError;
  double? get latitudRecogida => throw _privateConstructorUsedError;
  double? get longitudRecogida => throw _privateConstructorUsedError;
  double? get latitudEntrega => throw _privateConstructorUsedError;
  double? get longitudEntrega => throw _privateConstructorUsedError;
  String? get montoContraEntrega => throw _privateConstructorUsedError;
  String? get notas => throw _privateConstructorUsedError;
  DateTime? get creadoEn => throw _privateConstructorUsedError;
  DateTime? get actualizadoEn => throw _privateConstructorUsedError;

  /// Serializes this Pedido to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Pedido
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PedidoCopyWith<Pedido> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PedidoCopyWith<$Res> {
  factory $PedidoCopyWith(Pedido value, $Res Function(Pedido) then) =
      _$PedidoCopyWithImpl<$Res, Pedido>;
  @useResult
  $Res call({
    String id,
    String codigoSeguimiento,
    EstadoPedido estado,
    String? metodoPago,
    String? direccionRecogida,
    String? direccionEntrega,
    String? nombreDestinatario,
    String? telefonoDestinatario,
    double? latitudRecogida,
    double? longitudRecogida,
    double? latitudEntrega,
    double? longitudEntrega,
    String? montoContraEntrega,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class _$PedidoCopyWithImpl<$Res, $Val extends Pedido>
    implements $PedidoCopyWith<$Res> {
  _$PedidoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Pedido
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? codigoSeguimiento = null,
    Object? estado = null,
    Object? metodoPago = freezed,
    Object? direccionRecogida = freezed,
    Object? direccionEntrega = freezed,
    Object? nombreDestinatario = freezed,
    Object? telefonoDestinatario = freezed,
    Object? latitudRecogida = freezed,
    Object? longitudRecogida = freezed,
    Object? latitudEntrega = freezed,
    Object? longitudEntrega = freezed,
    Object? montoContraEntrega = freezed,
    Object? notas = freezed,
    Object? creadoEn = freezed,
    Object? actualizadoEn = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            codigoSeguimiento: null == codigoSeguimiento
                ? _value.codigoSeguimiento
                : codigoSeguimiento // ignore: cast_nullable_to_non_nullable
                      as String,
            estado: null == estado
                ? _value.estado
                : estado // ignore: cast_nullable_to_non_nullable
                      as EstadoPedido,
            metodoPago: freezed == metodoPago
                ? _value.metodoPago
                : metodoPago // ignore: cast_nullable_to_non_nullable
                      as String?,
            direccionRecogida: freezed == direccionRecogida
                ? _value.direccionRecogida
                : direccionRecogida // ignore: cast_nullable_to_non_nullable
                      as String?,
            direccionEntrega: freezed == direccionEntrega
                ? _value.direccionEntrega
                : direccionEntrega // ignore: cast_nullable_to_non_nullable
                      as String?,
            nombreDestinatario: freezed == nombreDestinatario
                ? _value.nombreDestinatario
                : nombreDestinatario // ignore: cast_nullable_to_non_nullable
                      as String?,
            telefonoDestinatario: freezed == telefonoDestinatario
                ? _value.telefonoDestinatario
                : telefonoDestinatario // ignore: cast_nullable_to_non_nullable
                      as String?,
            latitudRecogida: freezed == latitudRecogida
                ? _value.latitudRecogida
                : latitudRecogida // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitudRecogida: freezed == longitudRecogida
                ? _value.longitudRecogida
                : longitudRecogida // ignore: cast_nullable_to_non_nullable
                      as double?,
            latitudEntrega: freezed == latitudEntrega
                ? _value.latitudEntrega
                : latitudEntrega // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitudEntrega: freezed == longitudEntrega
                ? _value.longitudEntrega
                : longitudEntrega // ignore: cast_nullable_to_non_nullable
                      as double?,
            montoContraEntrega: freezed == montoContraEntrega
                ? _value.montoContraEntrega
                : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                      as String?,
            notas: freezed == notas
                ? _value.notas
                : notas // ignore: cast_nullable_to_non_nullable
                      as String?,
            creadoEn: freezed == creadoEn
                ? _value.creadoEn
                : creadoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            actualizadoEn: freezed == actualizadoEn
                ? _value.actualizadoEn
                : actualizadoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PedidoImplCopyWith<$Res> implements $PedidoCopyWith<$Res> {
  factory _$$PedidoImplCopyWith(
    _$PedidoImpl value,
    $Res Function(_$PedidoImpl) then,
  ) = __$$PedidoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String codigoSeguimiento,
    EstadoPedido estado,
    String? metodoPago,
    String? direccionRecogida,
    String? direccionEntrega,
    String? nombreDestinatario,
    String? telefonoDestinatario,
    double? latitudRecogida,
    double? longitudRecogida,
    double? latitudEntrega,
    double? longitudEntrega,
    String? montoContraEntrega,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class __$$PedidoImplCopyWithImpl<$Res>
    extends _$PedidoCopyWithImpl<$Res, _$PedidoImpl>
    implements _$$PedidoImplCopyWith<$Res> {
  __$$PedidoImplCopyWithImpl(
    _$PedidoImpl _value,
    $Res Function(_$PedidoImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Pedido
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? codigoSeguimiento = null,
    Object? estado = null,
    Object? metodoPago = freezed,
    Object? direccionRecogida = freezed,
    Object? direccionEntrega = freezed,
    Object? nombreDestinatario = freezed,
    Object? telefonoDestinatario = freezed,
    Object? latitudRecogida = freezed,
    Object? longitudRecogida = freezed,
    Object? latitudEntrega = freezed,
    Object? longitudEntrega = freezed,
    Object? montoContraEntrega = freezed,
    Object? notas = freezed,
    Object? creadoEn = freezed,
    Object? actualizadoEn = freezed,
  }) {
    return _then(
      _$PedidoImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        codigoSeguimiento: null == codigoSeguimiento
            ? _value.codigoSeguimiento
            : codigoSeguimiento // ignore: cast_nullable_to_non_nullable
                  as String,
        estado: null == estado
            ? _value.estado
            : estado // ignore: cast_nullable_to_non_nullable
                  as EstadoPedido,
        metodoPago: freezed == metodoPago
            ? _value.metodoPago
            : metodoPago // ignore: cast_nullable_to_non_nullable
                  as String?,
        direccionRecogida: freezed == direccionRecogida
            ? _value.direccionRecogida
            : direccionRecogida // ignore: cast_nullable_to_non_nullable
                  as String?,
        direccionEntrega: freezed == direccionEntrega
            ? _value.direccionEntrega
            : direccionEntrega // ignore: cast_nullable_to_non_nullable
                  as String?,
        nombreDestinatario: freezed == nombreDestinatario
            ? _value.nombreDestinatario
            : nombreDestinatario // ignore: cast_nullable_to_non_nullable
                  as String?,
        telefonoDestinatario: freezed == telefonoDestinatario
            ? _value.telefonoDestinatario
            : telefonoDestinatario // ignore: cast_nullable_to_non_nullable
                  as String?,
        latitudRecogida: freezed == latitudRecogida
            ? _value.latitudRecogida
            : latitudRecogida // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitudRecogida: freezed == longitudRecogida
            ? _value.longitudRecogida
            : longitudRecogida // ignore: cast_nullable_to_non_nullable
                  as double?,
        latitudEntrega: freezed == latitudEntrega
            ? _value.latitudEntrega
            : latitudEntrega // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitudEntrega: freezed == longitudEntrega
            ? _value.longitudEntrega
            : longitudEntrega // ignore: cast_nullable_to_non_nullable
                  as double?,
        montoContraEntrega: freezed == montoContraEntrega
            ? _value.montoContraEntrega
            : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                  as String?,
        notas: freezed == notas
            ? _value.notas
            : notas // ignore: cast_nullable_to_non_nullable
                  as String?,
        creadoEn: freezed == creadoEn
            ? _value.creadoEn
            : creadoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        actualizadoEn: freezed == actualizadoEn
            ? _value.actualizadoEn
            : actualizadoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PedidoImpl implements _Pedido {
  const _$PedidoImpl({
    required this.id,
    required this.codigoSeguimiento,
    required this.estado,
    this.metodoPago,
    this.direccionRecogida,
    this.direccionEntrega,
    this.nombreDestinatario,
    this.telefonoDestinatario,
    this.latitudRecogida,
    this.longitudRecogida,
    this.latitudEntrega,
    this.longitudEntrega,
    this.montoContraEntrega,
    this.notas,
    this.creadoEn,
    this.actualizadoEn,
  });

  factory _$PedidoImpl.fromJson(Map<String, dynamic> json) =>
      _$$PedidoImplFromJson(json);

  @override
  final String id;
  @override
  final String codigoSeguimiento;
  @override
  final EstadoPedido estado;
  @override
  final String? metodoPago;
  @override
  final String? direccionRecogida;
  @override
  final String? direccionEntrega;
  @override
  final String? nombreDestinatario;
  @override
  final String? telefonoDestinatario;
  @override
  final double? latitudRecogida;
  @override
  final double? longitudRecogida;
  @override
  final double? latitudEntrega;
  @override
  final double? longitudEntrega;
  @override
  final String? montoContraEntrega;
  @override
  final String? notas;
  @override
  final DateTime? creadoEn;
  @override
  final DateTime? actualizadoEn;

  @override
  String toString() {
    return 'Pedido(id: $id, codigoSeguimiento: $codigoSeguimiento, estado: $estado, metodoPago: $metodoPago, direccionRecogida: $direccionRecogida, direccionEntrega: $direccionEntrega, nombreDestinatario: $nombreDestinatario, telefonoDestinatario: $telefonoDestinatario, latitudRecogida: $latitudRecogida, longitudRecogida: $longitudRecogida, latitudEntrega: $latitudEntrega, longitudEntrega: $longitudEntrega, montoContraEntrega: $montoContraEntrega, notas: $notas, creadoEn: $creadoEn, actualizadoEn: $actualizadoEn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PedidoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.codigoSeguimiento, codigoSeguimiento) ||
                other.codigoSeguimiento == codigoSeguimiento) &&
            (identical(other.estado, estado) || other.estado == estado) &&
            (identical(other.metodoPago, metodoPago) ||
                other.metodoPago == metodoPago) &&
            (identical(other.direccionRecogida, direccionRecogida) ||
                other.direccionRecogida == direccionRecogida) &&
            (identical(other.direccionEntrega, direccionEntrega) ||
                other.direccionEntrega == direccionEntrega) &&
            (identical(other.nombreDestinatario, nombreDestinatario) ||
                other.nombreDestinatario == nombreDestinatario) &&
            (identical(other.telefonoDestinatario, telefonoDestinatario) ||
                other.telefonoDestinatario == telefonoDestinatario) &&
            (identical(other.latitudRecogida, latitudRecogida) ||
                other.latitudRecogida == latitudRecogida) &&
            (identical(other.longitudRecogida, longitudRecogida) ||
                other.longitudRecogida == longitudRecogida) &&
            (identical(other.latitudEntrega, latitudEntrega) ||
                other.latitudEntrega == latitudEntrega) &&
            (identical(other.longitudEntrega, longitudEntrega) ||
                other.longitudEntrega == longitudEntrega) &&
            (identical(other.montoContraEntrega, montoContraEntrega) ||
                other.montoContraEntrega == montoContraEntrega) &&
            (identical(other.notas, notas) || other.notas == notas) &&
            (identical(other.creadoEn, creadoEn) ||
                other.creadoEn == creadoEn) &&
            (identical(other.actualizadoEn, actualizadoEn) ||
                other.actualizadoEn == actualizadoEn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    codigoSeguimiento,
    estado,
    metodoPago,
    direccionRecogida,
    direccionEntrega,
    nombreDestinatario,
    telefonoDestinatario,
    latitudRecogida,
    longitudRecogida,
    latitudEntrega,
    longitudEntrega,
    montoContraEntrega,
    notas,
    creadoEn,
    actualizadoEn,
  );

  /// Create a copy of Pedido
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PedidoImplCopyWith<_$PedidoImpl> get copyWith =>
      __$$PedidoImplCopyWithImpl<_$PedidoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PedidoImplToJson(this);
  }
}

abstract class _Pedido implements Pedido {
  const factory _Pedido({
    required final String id,
    required final String codigoSeguimiento,
    required final EstadoPedido estado,
    final String? metodoPago,
    final String? direccionRecogida,
    final String? direccionEntrega,
    final String? nombreDestinatario,
    final String? telefonoDestinatario,
    final double? latitudRecogida,
    final double? longitudRecogida,
    final double? latitudEntrega,
    final double? longitudEntrega,
    final String? montoContraEntrega,
    final String? notas,
    final DateTime? creadoEn,
    final DateTime? actualizadoEn,
  }) = _$PedidoImpl;

  factory _Pedido.fromJson(Map<String, dynamic> json) = _$PedidoImpl.fromJson;

  @override
  String get id;
  @override
  String get codigoSeguimiento;
  @override
  EstadoPedido get estado;
  @override
  String? get metodoPago;
  @override
  String? get direccionRecogida;
  @override
  String? get direccionEntrega;
  @override
  String? get nombreDestinatario;
  @override
  String? get telefonoDestinatario;
  @override
  double? get latitudRecogida;
  @override
  double? get longitudRecogida;
  @override
  double? get latitudEntrega;
  @override
  double? get longitudEntrega;
  @override
  String? get montoContraEntrega;
  @override
  String? get notas;
  @override
  DateTime? get creadoEn;
  @override
  DateTime? get actualizadoEn;

  /// Create a copy of Pedido
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PedidoImplCopyWith<_$PedidoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
