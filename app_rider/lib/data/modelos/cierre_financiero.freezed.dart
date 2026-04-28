// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'cierre_financiero.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PedidoCierre _$PedidoCierreFromJson(Map<String, dynamic> json) {
  return _PedidoCierre.fromJson(json);
}

/// @nodoc
mixin _$PedidoCierre {
  String get id => throw _privateConstructorUsedError;
  String get codigoSeguimiento => throw _privateConstructorUsedError;
  String get montoContraEntrega => throw _privateConstructorUsedError;
  DateTime? get entregadoEn => throw _privateConstructorUsedError;

  /// Serializes this PedidoCierre to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PedidoCierre
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PedidoCierreCopyWith<PedidoCierre> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PedidoCierreCopyWith<$Res> {
  factory $PedidoCierreCopyWith(
    PedidoCierre value,
    $Res Function(PedidoCierre) then,
  ) = _$PedidoCierreCopyWithImpl<$Res, PedidoCierre>;
  @useResult
  $Res call({
    String id,
    String codigoSeguimiento,
    String montoContraEntrega,
    DateTime? entregadoEn,
  });
}

/// @nodoc
class _$PedidoCierreCopyWithImpl<$Res, $Val extends PedidoCierre>
    implements $PedidoCierreCopyWith<$Res> {
  _$PedidoCierreCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PedidoCierre
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? codigoSeguimiento = null,
    Object? montoContraEntrega = null,
    Object? entregadoEn = freezed,
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
            montoContraEntrega: null == montoContraEntrega
                ? _value.montoContraEntrega
                : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                      as String,
            entregadoEn: freezed == entregadoEn
                ? _value.entregadoEn
                : entregadoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PedidoCierreImplCopyWith<$Res>
    implements $PedidoCierreCopyWith<$Res> {
  factory _$$PedidoCierreImplCopyWith(
    _$PedidoCierreImpl value,
    $Res Function(_$PedidoCierreImpl) then,
  ) = __$$PedidoCierreImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String codigoSeguimiento,
    String montoContraEntrega,
    DateTime? entregadoEn,
  });
}

/// @nodoc
class __$$PedidoCierreImplCopyWithImpl<$Res>
    extends _$PedidoCierreCopyWithImpl<$Res, _$PedidoCierreImpl>
    implements _$$PedidoCierreImplCopyWith<$Res> {
  __$$PedidoCierreImplCopyWithImpl(
    _$PedidoCierreImpl _value,
    $Res Function(_$PedidoCierreImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PedidoCierre
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? codigoSeguimiento = null,
    Object? montoContraEntrega = null,
    Object? entregadoEn = freezed,
  }) {
    return _then(
      _$PedidoCierreImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        codigoSeguimiento: null == codigoSeguimiento
            ? _value.codigoSeguimiento
            : codigoSeguimiento // ignore: cast_nullable_to_non_nullable
                  as String,
        montoContraEntrega: null == montoContraEntrega
            ? _value.montoContraEntrega
            : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                  as String,
        entregadoEn: freezed == entregadoEn
            ? _value.entregadoEn
            : entregadoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PedidoCierreImpl implements _PedidoCierre {
  const _$PedidoCierreImpl({
    required this.id,
    required this.codigoSeguimiento,
    required this.montoContraEntrega,
    this.entregadoEn,
  });

  factory _$PedidoCierreImpl.fromJson(Map<String, dynamic> json) =>
      _$$PedidoCierreImplFromJson(json);

  @override
  final String id;
  @override
  final String codigoSeguimiento;
  @override
  final String montoContraEntrega;
  @override
  final DateTime? entregadoEn;

  @override
  String toString() {
    return 'PedidoCierre(id: $id, codigoSeguimiento: $codigoSeguimiento, montoContraEntrega: $montoContraEntrega, entregadoEn: $entregadoEn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PedidoCierreImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.codigoSeguimiento, codigoSeguimiento) ||
                other.codigoSeguimiento == codigoSeguimiento) &&
            (identical(other.montoContraEntrega, montoContraEntrega) ||
                other.montoContraEntrega == montoContraEntrega) &&
            (identical(other.entregadoEn, entregadoEn) ||
                other.entregadoEn == entregadoEn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    codigoSeguimiento,
    montoContraEntrega,
    entregadoEn,
  );

  /// Create a copy of PedidoCierre
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PedidoCierreImplCopyWith<_$PedidoCierreImpl> get copyWith =>
      __$$PedidoCierreImplCopyWithImpl<_$PedidoCierreImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PedidoCierreImplToJson(this);
  }
}

abstract class _PedidoCierre implements PedidoCierre {
  const factory _PedidoCierre({
    required final String id,
    required final String codigoSeguimiento,
    required final String montoContraEntrega,
    final DateTime? entregadoEn,
  }) = _$PedidoCierreImpl;

  factory _PedidoCierre.fromJson(Map<String, dynamic> json) =
      _$PedidoCierreImpl.fromJson;

  @override
  String get id;
  @override
  String get codigoSeguimiento;
  @override
  String get montoContraEntrega;
  @override
  DateTime? get entregadoEn;

  /// Create a copy of PedidoCierre
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PedidoCierreImplCopyWith<_$PedidoCierreImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ResumenCierreHoy _$ResumenCierreHoyFromJson(Map<String, dynamic> json) {
  return _ResumenCierreHoy.fromJson(json);
}

/// @nodoc
mixin _$ResumenCierreHoy {
  String get fecha => throw _privateConstructorUsedError;
  String get montoEsperado => throw _privateConstructorUsedError;
  int get cantidadPedidos => throw _privateConstructorUsedError;
  List<PedidoCierre> get pedidos => throw _privateConstructorUsedError;

  /// Serializes this ResumenCierreHoy to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ResumenCierreHoy
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ResumenCierreHoyCopyWith<ResumenCierreHoy> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ResumenCierreHoyCopyWith<$Res> {
  factory $ResumenCierreHoyCopyWith(
    ResumenCierreHoy value,
    $Res Function(ResumenCierreHoy) then,
  ) = _$ResumenCierreHoyCopyWithImpl<$Res, ResumenCierreHoy>;
  @useResult
  $Res call({
    String fecha,
    String montoEsperado,
    int cantidadPedidos,
    List<PedidoCierre> pedidos,
  });
}

/// @nodoc
class _$ResumenCierreHoyCopyWithImpl<$Res, $Val extends ResumenCierreHoy>
    implements $ResumenCierreHoyCopyWith<$Res> {
  _$ResumenCierreHoyCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ResumenCierreHoy
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? fecha = null,
    Object? montoEsperado = null,
    Object? cantidadPedidos = null,
    Object? pedidos = null,
  }) {
    return _then(
      _value.copyWith(
            fecha: null == fecha
                ? _value.fecha
                : fecha // ignore: cast_nullable_to_non_nullable
                      as String,
            montoEsperado: null == montoEsperado
                ? _value.montoEsperado
                : montoEsperado // ignore: cast_nullable_to_non_nullable
                      as String,
            cantidadPedidos: null == cantidadPedidos
                ? _value.cantidadPedidos
                : cantidadPedidos // ignore: cast_nullable_to_non_nullable
                      as int,
            pedidos: null == pedidos
                ? _value.pedidos
                : pedidos // ignore: cast_nullable_to_non_nullable
                      as List<PedidoCierre>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ResumenCierreHoyImplCopyWith<$Res>
    implements $ResumenCierreHoyCopyWith<$Res> {
  factory _$$ResumenCierreHoyImplCopyWith(
    _$ResumenCierreHoyImpl value,
    $Res Function(_$ResumenCierreHoyImpl) then,
  ) = __$$ResumenCierreHoyImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String fecha,
    String montoEsperado,
    int cantidadPedidos,
    List<PedidoCierre> pedidos,
  });
}

/// @nodoc
class __$$ResumenCierreHoyImplCopyWithImpl<$Res>
    extends _$ResumenCierreHoyCopyWithImpl<$Res, _$ResumenCierreHoyImpl>
    implements _$$ResumenCierreHoyImplCopyWith<$Res> {
  __$$ResumenCierreHoyImplCopyWithImpl(
    _$ResumenCierreHoyImpl _value,
    $Res Function(_$ResumenCierreHoyImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ResumenCierreHoy
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? fecha = null,
    Object? montoEsperado = null,
    Object? cantidadPedidos = null,
    Object? pedidos = null,
  }) {
    return _then(
      _$ResumenCierreHoyImpl(
        fecha: null == fecha
            ? _value.fecha
            : fecha // ignore: cast_nullable_to_non_nullable
                  as String,
        montoEsperado: null == montoEsperado
            ? _value.montoEsperado
            : montoEsperado // ignore: cast_nullable_to_non_nullable
                  as String,
        cantidadPedidos: null == cantidadPedidos
            ? _value.cantidadPedidos
            : cantidadPedidos // ignore: cast_nullable_to_non_nullable
                  as int,
        pedidos: null == pedidos
            ? _value._pedidos
            : pedidos // ignore: cast_nullable_to_non_nullable
                  as List<PedidoCierre>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ResumenCierreHoyImpl implements _ResumenCierreHoy {
  const _$ResumenCierreHoyImpl({
    required this.fecha,
    required this.montoEsperado,
    required this.cantidadPedidos,
    required final List<PedidoCierre> pedidos,
  }) : _pedidos = pedidos;

  factory _$ResumenCierreHoyImpl.fromJson(Map<String, dynamic> json) =>
      _$$ResumenCierreHoyImplFromJson(json);

  @override
  final String fecha;
  @override
  final String montoEsperado;
  @override
  final int cantidadPedidos;
  final List<PedidoCierre> _pedidos;
  @override
  List<PedidoCierre> get pedidos {
    if (_pedidos is EqualUnmodifiableListView) return _pedidos;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_pedidos);
  }

  @override
  String toString() {
    return 'ResumenCierreHoy(fecha: $fecha, montoEsperado: $montoEsperado, cantidadPedidos: $cantidadPedidos, pedidos: $pedidos)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ResumenCierreHoyImpl &&
            (identical(other.fecha, fecha) || other.fecha == fecha) &&
            (identical(other.montoEsperado, montoEsperado) ||
                other.montoEsperado == montoEsperado) &&
            (identical(other.cantidadPedidos, cantidadPedidos) ||
                other.cantidadPedidos == cantidadPedidos) &&
            const DeepCollectionEquality().equals(other._pedidos, _pedidos));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    fecha,
    montoEsperado,
    cantidadPedidos,
    const DeepCollectionEquality().hash(_pedidos),
  );

  /// Create a copy of ResumenCierreHoy
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ResumenCierreHoyImplCopyWith<_$ResumenCierreHoyImpl> get copyWith =>
      __$$ResumenCierreHoyImplCopyWithImpl<_$ResumenCierreHoyImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ResumenCierreHoyImplToJson(this);
  }
}

abstract class _ResumenCierreHoy implements ResumenCierreHoy {
  const factory _ResumenCierreHoy({
    required final String fecha,
    required final String montoEsperado,
    required final int cantidadPedidos,
    required final List<PedidoCierre> pedidos,
  }) = _$ResumenCierreHoyImpl;

  factory _ResumenCierreHoy.fromJson(Map<String, dynamic> json) =
      _$ResumenCierreHoyImpl.fromJson;

  @override
  String get fecha;
  @override
  String get montoEsperado;
  @override
  int get cantidadPedidos;
  @override
  List<PedidoCierre> get pedidos;

  /// Create a copy of ResumenCierreHoy
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ResumenCierreHoyImplCopyWith<_$ResumenCierreHoyImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CierreFinanciero _$CierreFinancieroFromJson(Map<String, dynamic> json) {
  return _CierreFinanciero.fromJson(json);
}

/// @nodoc
mixin _$CierreFinanciero {
  String get id => throw _privateConstructorUsedError;
  String get repartidorId => throw _privateConstructorUsedError;
  String get fechaCierre => throw _privateConstructorUsedError;
  String get montoEsperado => throw _privateConstructorUsedError;
  String get montoReportado => throw _privateConstructorUsedError;
  String get diferencia => throw _privateConstructorUsedError;
  String get estado => throw _privateConstructorUsedError;
  String? get comprobanteFotoUrl => throw _privateConstructorUsedError;
  String? get notas => throw _privateConstructorUsedError;
  DateTime? get creadoEn => throw _privateConstructorUsedError;
  DateTime? get actualizadoEn => throw _privateConstructorUsedError;

  /// Serializes this CierreFinanciero to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CierreFinanciero
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CierreFinancieroCopyWith<CierreFinanciero> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CierreFinancieroCopyWith<$Res> {
  factory $CierreFinancieroCopyWith(
    CierreFinanciero value,
    $Res Function(CierreFinanciero) then,
  ) = _$CierreFinancieroCopyWithImpl<$Res, CierreFinanciero>;
  @useResult
  $Res call({
    String id,
    String repartidorId,
    String fechaCierre,
    String montoEsperado,
    String montoReportado,
    String diferencia,
    String estado,
    String? comprobanteFotoUrl,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class _$CierreFinancieroCopyWithImpl<$Res, $Val extends CierreFinanciero>
    implements $CierreFinancieroCopyWith<$Res> {
  _$CierreFinancieroCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CierreFinanciero
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? repartidorId = null,
    Object? fechaCierre = null,
    Object? montoEsperado = null,
    Object? montoReportado = null,
    Object? diferencia = null,
    Object? estado = null,
    Object? comprobanteFotoUrl = freezed,
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
            repartidorId: null == repartidorId
                ? _value.repartidorId
                : repartidorId // ignore: cast_nullable_to_non_nullable
                      as String,
            fechaCierre: null == fechaCierre
                ? _value.fechaCierre
                : fechaCierre // ignore: cast_nullable_to_non_nullable
                      as String,
            montoEsperado: null == montoEsperado
                ? _value.montoEsperado
                : montoEsperado // ignore: cast_nullable_to_non_nullable
                      as String,
            montoReportado: null == montoReportado
                ? _value.montoReportado
                : montoReportado // ignore: cast_nullable_to_non_nullable
                      as String,
            diferencia: null == diferencia
                ? _value.diferencia
                : diferencia // ignore: cast_nullable_to_non_nullable
                      as String,
            estado: null == estado
                ? _value.estado
                : estado // ignore: cast_nullable_to_non_nullable
                      as String,
            comprobanteFotoUrl: freezed == comprobanteFotoUrl
                ? _value.comprobanteFotoUrl
                : comprobanteFotoUrl // ignore: cast_nullable_to_non_nullable
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
abstract class _$$CierreFinancieroImplCopyWith<$Res>
    implements $CierreFinancieroCopyWith<$Res> {
  factory _$$CierreFinancieroImplCopyWith(
    _$CierreFinancieroImpl value,
    $Res Function(_$CierreFinancieroImpl) then,
  ) = __$$CierreFinancieroImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String repartidorId,
    String fechaCierre,
    String montoEsperado,
    String montoReportado,
    String diferencia,
    String estado,
    String? comprobanteFotoUrl,
    String? notas,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class __$$CierreFinancieroImplCopyWithImpl<$Res>
    extends _$CierreFinancieroCopyWithImpl<$Res, _$CierreFinancieroImpl>
    implements _$$CierreFinancieroImplCopyWith<$Res> {
  __$$CierreFinancieroImplCopyWithImpl(
    _$CierreFinancieroImpl _value,
    $Res Function(_$CierreFinancieroImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CierreFinanciero
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? repartidorId = null,
    Object? fechaCierre = null,
    Object? montoEsperado = null,
    Object? montoReportado = null,
    Object? diferencia = null,
    Object? estado = null,
    Object? comprobanteFotoUrl = freezed,
    Object? notas = freezed,
    Object? creadoEn = freezed,
    Object? actualizadoEn = freezed,
  }) {
    return _then(
      _$CierreFinancieroImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        repartidorId: null == repartidorId
            ? _value.repartidorId
            : repartidorId // ignore: cast_nullable_to_non_nullable
                  as String,
        fechaCierre: null == fechaCierre
            ? _value.fechaCierre
            : fechaCierre // ignore: cast_nullable_to_non_nullable
                  as String,
        montoEsperado: null == montoEsperado
            ? _value.montoEsperado
            : montoEsperado // ignore: cast_nullable_to_non_nullable
                  as String,
        montoReportado: null == montoReportado
            ? _value.montoReportado
            : montoReportado // ignore: cast_nullable_to_non_nullable
                  as String,
        diferencia: null == diferencia
            ? _value.diferencia
            : diferencia // ignore: cast_nullable_to_non_nullable
                  as String,
        estado: null == estado
            ? _value.estado
            : estado // ignore: cast_nullable_to_non_nullable
                  as String,
        comprobanteFotoUrl: freezed == comprobanteFotoUrl
            ? _value.comprobanteFotoUrl
            : comprobanteFotoUrl // ignore: cast_nullable_to_non_nullable
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
class _$CierreFinancieroImpl implements _CierreFinanciero {
  const _$CierreFinancieroImpl({
    required this.id,
    required this.repartidorId,
    required this.fechaCierre,
    required this.montoEsperado,
    required this.montoReportado,
    required this.diferencia,
    required this.estado,
    this.comprobanteFotoUrl,
    this.notas,
    this.creadoEn,
    this.actualizadoEn,
  });

  factory _$CierreFinancieroImpl.fromJson(Map<String, dynamic> json) =>
      _$$CierreFinancieroImplFromJson(json);

  @override
  final String id;
  @override
  final String repartidorId;
  @override
  final String fechaCierre;
  @override
  final String montoEsperado;
  @override
  final String montoReportado;
  @override
  final String diferencia;
  @override
  final String estado;
  @override
  final String? comprobanteFotoUrl;
  @override
  final String? notas;
  @override
  final DateTime? creadoEn;
  @override
  final DateTime? actualizadoEn;

  @override
  String toString() {
    return 'CierreFinanciero(id: $id, repartidorId: $repartidorId, fechaCierre: $fechaCierre, montoEsperado: $montoEsperado, montoReportado: $montoReportado, diferencia: $diferencia, estado: $estado, comprobanteFotoUrl: $comprobanteFotoUrl, notas: $notas, creadoEn: $creadoEn, actualizadoEn: $actualizadoEn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CierreFinancieroImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.repartidorId, repartidorId) ||
                other.repartidorId == repartidorId) &&
            (identical(other.fechaCierre, fechaCierre) ||
                other.fechaCierre == fechaCierre) &&
            (identical(other.montoEsperado, montoEsperado) ||
                other.montoEsperado == montoEsperado) &&
            (identical(other.montoReportado, montoReportado) ||
                other.montoReportado == montoReportado) &&
            (identical(other.diferencia, diferencia) ||
                other.diferencia == diferencia) &&
            (identical(other.estado, estado) || other.estado == estado) &&
            (identical(other.comprobanteFotoUrl, comprobanteFotoUrl) ||
                other.comprobanteFotoUrl == comprobanteFotoUrl) &&
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
    repartidorId,
    fechaCierre,
    montoEsperado,
    montoReportado,
    diferencia,
    estado,
    comprobanteFotoUrl,
    notas,
    creadoEn,
    actualizadoEn,
  );

  /// Create a copy of CierreFinanciero
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CierreFinancieroImplCopyWith<_$CierreFinancieroImpl> get copyWith =>
      __$$CierreFinancieroImplCopyWithImpl<_$CierreFinancieroImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CierreFinancieroImplToJson(this);
  }
}

abstract class _CierreFinanciero implements CierreFinanciero {
  const factory _CierreFinanciero({
    required final String id,
    required final String repartidorId,
    required final String fechaCierre,
    required final String montoEsperado,
    required final String montoReportado,
    required final String diferencia,
    required final String estado,
    final String? comprobanteFotoUrl,
    final String? notas,
    final DateTime? creadoEn,
    final DateTime? actualizadoEn,
  }) = _$CierreFinancieroImpl;

  factory _CierreFinanciero.fromJson(Map<String, dynamic> json) =
      _$CierreFinancieroImpl.fromJson;

  @override
  String get id;
  @override
  String get repartidorId;
  @override
  String get fechaCierre;
  @override
  String get montoEsperado;
  @override
  String get montoReportado;
  @override
  String get diferencia;
  @override
  String get estado;
  @override
  String? get comprobanteFotoUrl;
  @override
  String? get notas;
  @override
  DateTime? get creadoEn;
  @override
  DateTime? get actualizadoEn;

  /// Create a copy of CierreFinanciero
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CierreFinancieroImplCopyWith<_$CierreFinancieroImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
