// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'movimiento_caja.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

MovimientoCaja _$MovimientoCajaFromJson(Map<String, dynamic> json) {
  return _MovimientoCaja.fromJson(json);
}

/// @nodoc
mixin _$MovimientoCaja {
  String get id => throw _privateConstructorUsedError;
  String get tipo => throw _privateConstructorUsedError;
  String get monto => throw _privateConstructorUsedError;
  String? get descripcion => throw _privateConstructorUsedError;
  String? get pedidoId => throw _privateConstructorUsedError;
  String? get cierreId => throw _privateConstructorUsedError;
  String? get codigoSeguimiento => throw _privateConstructorUsedError;
  String? get nombreCliente => throw _privateConstructorUsedError;
  DateTime get creadoEn => throw _privateConstructorUsedError;

  /// Serializes this MovimientoCaja to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MovimientoCaja
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MovimientoCajaCopyWith<MovimientoCaja> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MovimientoCajaCopyWith<$Res> {
  factory $MovimientoCajaCopyWith(
    MovimientoCaja value,
    $Res Function(MovimientoCaja) then,
  ) = _$MovimientoCajaCopyWithImpl<$Res, MovimientoCaja>;
  @useResult
  $Res call({
    String id,
    String tipo,
    String monto,
    String? descripcion,
    String? pedidoId,
    String? cierreId,
    String? codigoSeguimiento,
    String? nombreCliente,
    DateTime creadoEn,
  });
}

/// @nodoc
class _$MovimientoCajaCopyWithImpl<$Res, $Val extends MovimientoCaja>
    implements $MovimientoCajaCopyWith<$Res> {
  _$MovimientoCajaCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MovimientoCaja
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? tipo = null,
    Object? monto = null,
    Object? descripcion = freezed,
    Object? pedidoId = freezed,
    Object? cierreId = freezed,
    Object? codigoSeguimiento = freezed,
    Object? nombreCliente = freezed,
    Object? creadoEn = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            tipo: null == tipo
                ? _value.tipo
                : tipo // ignore: cast_nullable_to_non_nullable
                      as String,
            monto: null == monto
                ? _value.monto
                : monto // ignore: cast_nullable_to_non_nullable
                      as String,
            descripcion: freezed == descripcion
                ? _value.descripcion
                : descripcion // ignore: cast_nullable_to_non_nullable
                      as String?,
            pedidoId: freezed == pedidoId
                ? _value.pedidoId
                : pedidoId // ignore: cast_nullable_to_non_nullable
                      as String?,
            cierreId: freezed == cierreId
                ? _value.cierreId
                : cierreId // ignore: cast_nullable_to_non_nullable
                      as String?,
            codigoSeguimiento: freezed == codigoSeguimiento
                ? _value.codigoSeguimiento
                : codigoSeguimiento // ignore: cast_nullable_to_non_nullable
                      as String?,
            nombreCliente: freezed == nombreCliente
                ? _value.nombreCliente
                : nombreCliente // ignore: cast_nullable_to_non_nullable
                      as String?,
            creadoEn: null == creadoEn
                ? _value.creadoEn
                : creadoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$MovimientoCajaImplCopyWith<$Res>
    implements $MovimientoCajaCopyWith<$Res> {
  factory _$$MovimientoCajaImplCopyWith(
    _$MovimientoCajaImpl value,
    $Res Function(_$MovimientoCajaImpl) then,
  ) = __$$MovimientoCajaImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String tipo,
    String monto,
    String? descripcion,
    String? pedidoId,
    String? cierreId,
    String? codigoSeguimiento,
    String? nombreCliente,
    DateTime creadoEn,
  });
}

/// @nodoc
class __$$MovimientoCajaImplCopyWithImpl<$Res>
    extends _$MovimientoCajaCopyWithImpl<$Res, _$MovimientoCajaImpl>
    implements _$$MovimientoCajaImplCopyWith<$Res> {
  __$$MovimientoCajaImplCopyWithImpl(
    _$MovimientoCajaImpl _value,
    $Res Function(_$MovimientoCajaImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of MovimientoCaja
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? tipo = null,
    Object? monto = null,
    Object? descripcion = freezed,
    Object? pedidoId = freezed,
    Object? cierreId = freezed,
    Object? codigoSeguimiento = freezed,
    Object? nombreCliente = freezed,
    Object? creadoEn = null,
  }) {
    return _then(
      _$MovimientoCajaImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        tipo: null == tipo
            ? _value.tipo
            : tipo // ignore: cast_nullable_to_non_nullable
                  as String,
        monto: null == monto
            ? _value.monto
            : monto // ignore: cast_nullable_to_non_nullable
                  as String,
        descripcion: freezed == descripcion
            ? _value.descripcion
            : descripcion // ignore: cast_nullable_to_non_nullable
                  as String?,
        pedidoId: freezed == pedidoId
            ? _value.pedidoId
            : pedidoId // ignore: cast_nullable_to_non_nullable
                  as String?,
        cierreId: freezed == cierreId
            ? _value.cierreId
            : cierreId // ignore: cast_nullable_to_non_nullable
                  as String?,
        codigoSeguimiento: freezed == codigoSeguimiento
            ? _value.codigoSeguimiento
            : codigoSeguimiento // ignore: cast_nullable_to_non_nullable
                  as String?,
        nombreCliente: freezed == nombreCliente
            ? _value.nombreCliente
            : nombreCliente // ignore: cast_nullable_to_non_nullable
                  as String?,
        creadoEn: null == creadoEn
            ? _value.creadoEn
            : creadoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$MovimientoCajaImpl implements _MovimientoCaja {
  const _$MovimientoCajaImpl({
    required this.id,
    required this.tipo,
    required this.monto,
    this.descripcion,
    this.pedidoId,
    this.cierreId,
    this.codigoSeguimiento,
    this.nombreCliente,
    required this.creadoEn,
  });

  factory _$MovimientoCajaImpl.fromJson(Map<String, dynamic> json) =>
      _$$MovimientoCajaImplFromJson(json);

  @override
  final String id;
  @override
  final String tipo;
  @override
  final String monto;
  @override
  final String? descripcion;
  @override
  final String? pedidoId;
  @override
  final String? cierreId;
  @override
  final String? codigoSeguimiento;
  @override
  final String? nombreCliente;
  @override
  final DateTime creadoEn;

  @override
  String toString() {
    return 'MovimientoCaja(id: $id, tipo: $tipo, monto: $monto, descripcion: $descripcion, pedidoId: $pedidoId, cierreId: $cierreId, codigoSeguimiento: $codigoSeguimiento, nombreCliente: $nombreCliente, creadoEn: $creadoEn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MovimientoCajaImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.tipo, tipo) || other.tipo == tipo) &&
            (identical(other.monto, monto) || other.monto == monto) &&
            (identical(other.descripcion, descripcion) ||
                other.descripcion == descripcion) &&
            (identical(other.pedidoId, pedidoId) ||
                other.pedidoId == pedidoId) &&
            (identical(other.cierreId, cierreId) ||
                other.cierreId == cierreId) &&
            (identical(other.codigoSeguimiento, codigoSeguimiento) ||
                other.codigoSeguimiento == codigoSeguimiento) &&
            (identical(other.nombreCliente, nombreCliente) ||
                other.nombreCliente == nombreCliente) &&
            (identical(other.creadoEn, creadoEn) ||
                other.creadoEn == creadoEn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    tipo,
    monto,
    descripcion,
    pedidoId,
    cierreId,
    codigoSeguimiento,
    nombreCliente,
    creadoEn,
  );

  /// Create a copy of MovimientoCaja
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MovimientoCajaImplCopyWith<_$MovimientoCajaImpl> get copyWith =>
      __$$MovimientoCajaImplCopyWithImpl<_$MovimientoCajaImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$MovimientoCajaImplToJson(this);
  }
}

abstract class _MovimientoCaja implements MovimientoCaja {
  const factory _MovimientoCaja({
    required final String id,
    required final String tipo,
    required final String monto,
    final String? descripcion,
    final String? pedidoId,
    final String? cierreId,
    final String? codigoSeguimiento,
    final String? nombreCliente,
    required final DateTime creadoEn,
  }) = _$MovimientoCajaImpl;

  factory _MovimientoCaja.fromJson(Map<String, dynamic> json) =
      _$MovimientoCajaImpl.fromJson;

  @override
  String get id;
  @override
  String get tipo;
  @override
  String get monto;
  @override
  String? get descripcion;
  @override
  String? get pedidoId;
  @override
  String? get cierreId;
  @override
  String? get codigoSeguimiento;
  @override
  String? get nombreCliente;
  @override
  DateTime get creadoEn;

  /// Create a copy of MovimientoCaja
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MovimientoCajaImplCopyWith<_$MovimientoCajaImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

SaldoPendiente _$SaldoPendienteFromJson(Map<String, dynamic> json) {
  return _SaldoPendiente.fromJson(json);
}

/// @nodoc
mixin _$SaldoPendiente {
  String get total => throw _privateConstructorUsedError;
  int get cantidad => throw _privateConstructorUsedError;

  /// Serializes this SaldoPendiente to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SaldoPendiente
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SaldoPendienteCopyWith<SaldoPendiente> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SaldoPendienteCopyWith<$Res> {
  factory $SaldoPendienteCopyWith(
    SaldoPendiente value,
    $Res Function(SaldoPendiente) then,
  ) = _$SaldoPendienteCopyWithImpl<$Res, SaldoPendiente>;
  @useResult
  $Res call({String total, int cantidad});
}

/// @nodoc
class _$SaldoPendienteCopyWithImpl<$Res, $Val extends SaldoPendiente>
    implements $SaldoPendienteCopyWith<$Res> {
  _$SaldoPendienteCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SaldoPendiente
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? total = null, Object? cantidad = null}) {
    return _then(
      _value.copyWith(
            total: null == total
                ? _value.total
                : total // ignore: cast_nullable_to_non_nullable
                      as String,
            cantidad: null == cantidad
                ? _value.cantidad
                : cantidad // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$SaldoPendienteImplCopyWith<$Res>
    implements $SaldoPendienteCopyWith<$Res> {
  factory _$$SaldoPendienteImplCopyWith(
    _$SaldoPendienteImpl value,
    $Res Function(_$SaldoPendienteImpl) then,
  ) = __$$SaldoPendienteImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String total, int cantidad});
}

/// @nodoc
class __$$SaldoPendienteImplCopyWithImpl<$Res>
    extends _$SaldoPendienteCopyWithImpl<$Res, _$SaldoPendienteImpl>
    implements _$$SaldoPendienteImplCopyWith<$Res> {
  __$$SaldoPendienteImplCopyWithImpl(
    _$SaldoPendienteImpl _value,
    $Res Function(_$SaldoPendienteImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of SaldoPendiente
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? total = null, Object? cantidad = null}) {
    return _then(
      _$SaldoPendienteImpl(
        total: null == total
            ? _value.total
            : total // ignore: cast_nullable_to_non_nullable
                  as String,
        cantidad: null == cantidad
            ? _value.cantidad
            : cantidad // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$SaldoPendienteImpl implements _SaldoPendiente {
  const _$SaldoPendienteImpl({required this.total, required this.cantidad});

  factory _$SaldoPendienteImpl.fromJson(Map<String, dynamic> json) =>
      _$$SaldoPendienteImplFromJson(json);

  @override
  final String total;
  @override
  final int cantidad;

  @override
  String toString() {
    return 'SaldoPendiente(total: $total, cantidad: $cantidad)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SaldoPendienteImpl &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.cantidad, cantidad) ||
                other.cantidad == cantidad));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, total, cantidad);

  /// Create a copy of SaldoPendiente
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SaldoPendienteImplCopyWith<_$SaldoPendienteImpl> get copyWith =>
      __$$SaldoPendienteImplCopyWithImpl<_$SaldoPendienteImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$SaldoPendienteImplToJson(this);
  }
}

abstract class _SaldoPendiente implements SaldoPendiente {
  const factory _SaldoPendiente({
    required final String total,
    required final int cantidad,
  }) = _$SaldoPendienteImpl;

  factory _SaldoPendiente.fromJson(Map<String, dynamic> json) =
      _$SaldoPendienteImpl.fromJson;

  @override
  String get total;
  @override
  int get cantidad;

  /// Create a copy of SaldoPendiente
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SaldoPendienteImplCopyWith<_$SaldoPendienteImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
