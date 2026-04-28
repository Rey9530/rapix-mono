// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'ruta_optimizada.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

RutaOptimizada _$RutaOptimizadaFromJson(Map<String, dynamic> json) {
  return _RutaOptimizada.fromJson(json);
}

/// @nodoc
mixin _$RutaOptimizada {
  String get geometriaPolyline => throw _privateConstructorUsedError;
  double get distanciaMetros => throw _privateConstructorUsedError;
  double get duracionSegundos => throw _privateConstructorUsedError;
  List<int> get ordenWaypoints => throw _privateConstructorUsedError;

  /// Serializes this RutaOptimizada to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RutaOptimizada
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RutaOptimizadaCopyWith<RutaOptimizada> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RutaOptimizadaCopyWith<$Res> {
  factory $RutaOptimizadaCopyWith(
    RutaOptimizada value,
    $Res Function(RutaOptimizada) then,
  ) = _$RutaOptimizadaCopyWithImpl<$Res, RutaOptimizada>;
  @useResult
  $Res call({
    String geometriaPolyline,
    double distanciaMetros,
    double duracionSegundos,
    List<int> ordenWaypoints,
  });
}

/// @nodoc
class _$RutaOptimizadaCopyWithImpl<$Res, $Val extends RutaOptimizada>
    implements $RutaOptimizadaCopyWith<$Res> {
  _$RutaOptimizadaCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RutaOptimizada
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? geometriaPolyline = null,
    Object? distanciaMetros = null,
    Object? duracionSegundos = null,
    Object? ordenWaypoints = null,
  }) {
    return _then(
      _value.copyWith(
            geometriaPolyline: null == geometriaPolyline
                ? _value.geometriaPolyline
                : geometriaPolyline // ignore: cast_nullable_to_non_nullable
                      as String,
            distanciaMetros: null == distanciaMetros
                ? _value.distanciaMetros
                : distanciaMetros // ignore: cast_nullable_to_non_nullable
                      as double,
            duracionSegundos: null == duracionSegundos
                ? _value.duracionSegundos
                : duracionSegundos // ignore: cast_nullable_to_non_nullable
                      as double,
            ordenWaypoints: null == ordenWaypoints
                ? _value.ordenWaypoints
                : ordenWaypoints // ignore: cast_nullable_to_non_nullable
                      as List<int>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RutaOptimizadaImplCopyWith<$Res>
    implements $RutaOptimizadaCopyWith<$Res> {
  factory _$$RutaOptimizadaImplCopyWith(
    _$RutaOptimizadaImpl value,
    $Res Function(_$RutaOptimizadaImpl) then,
  ) = __$$RutaOptimizadaImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String geometriaPolyline,
    double distanciaMetros,
    double duracionSegundos,
    List<int> ordenWaypoints,
  });
}

/// @nodoc
class __$$RutaOptimizadaImplCopyWithImpl<$Res>
    extends _$RutaOptimizadaCopyWithImpl<$Res, _$RutaOptimizadaImpl>
    implements _$$RutaOptimizadaImplCopyWith<$Res> {
  __$$RutaOptimizadaImplCopyWithImpl(
    _$RutaOptimizadaImpl _value,
    $Res Function(_$RutaOptimizadaImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of RutaOptimizada
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? geometriaPolyline = null,
    Object? distanciaMetros = null,
    Object? duracionSegundos = null,
    Object? ordenWaypoints = null,
  }) {
    return _then(
      _$RutaOptimizadaImpl(
        geometriaPolyline: null == geometriaPolyline
            ? _value.geometriaPolyline
            : geometriaPolyline // ignore: cast_nullable_to_non_nullable
                  as String,
        distanciaMetros: null == distanciaMetros
            ? _value.distanciaMetros
            : distanciaMetros // ignore: cast_nullable_to_non_nullable
                  as double,
        duracionSegundos: null == duracionSegundos
            ? _value.duracionSegundos
            : duracionSegundos // ignore: cast_nullable_to_non_nullable
                  as double,
        ordenWaypoints: null == ordenWaypoints
            ? _value._ordenWaypoints
            : ordenWaypoints // ignore: cast_nullable_to_non_nullable
                  as List<int>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RutaOptimizadaImpl implements _RutaOptimizada {
  const _$RutaOptimizadaImpl({
    required this.geometriaPolyline,
    required this.distanciaMetros,
    required this.duracionSegundos,
    required final List<int> ordenWaypoints,
  }) : _ordenWaypoints = ordenWaypoints;

  factory _$RutaOptimizadaImpl.fromJson(Map<String, dynamic> json) =>
      _$$RutaOptimizadaImplFromJson(json);

  @override
  final String geometriaPolyline;
  @override
  final double distanciaMetros;
  @override
  final double duracionSegundos;
  final List<int> _ordenWaypoints;
  @override
  List<int> get ordenWaypoints {
    if (_ordenWaypoints is EqualUnmodifiableListView) return _ordenWaypoints;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_ordenWaypoints);
  }

  @override
  String toString() {
    return 'RutaOptimizada(geometriaPolyline: $geometriaPolyline, distanciaMetros: $distanciaMetros, duracionSegundos: $duracionSegundos, ordenWaypoints: $ordenWaypoints)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RutaOptimizadaImpl &&
            (identical(other.geometriaPolyline, geometriaPolyline) ||
                other.geometriaPolyline == geometriaPolyline) &&
            (identical(other.distanciaMetros, distanciaMetros) ||
                other.distanciaMetros == distanciaMetros) &&
            (identical(other.duracionSegundos, duracionSegundos) ||
                other.duracionSegundos == duracionSegundos) &&
            const DeepCollectionEquality().equals(
              other._ordenWaypoints,
              _ordenWaypoints,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    geometriaPolyline,
    distanciaMetros,
    duracionSegundos,
    const DeepCollectionEquality().hash(_ordenWaypoints),
  );

  /// Create a copy of RutaOptimizada
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RutaOptimizadaImplCopyWith<_$RutaOptimizadaImpl> get copyWith =>
      __$$RutaOptimizadaImplCopyWithImpl<_$RutaOptimizadaImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$RutaOptimizadaImplToJson(this);
  }
}

abstract class _RutaOptimizada implements RutaOptimizada {
  const factory _RutaOptimizada({
    required final String geometriaPolyline,
    required final double distanciaMetros,
    required final double duracionSegundos,
    required final List<int> ordenWaypoints,
  }) = _$RutaOptimizadaImpl;

  factory _RutaOptimizada.fromJson(Map<String, dynamic> json) =
      _$RutaOptimizadaImpl.fromJson;

  @override
  String get geometriaPolyline;
  @override
  double get distanciaMetros;
  @override
  double get duracionSegundos;
  @override
  List<int> get ordenWaypoints;

  /// Create a copy of RutaOptimizada
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RutaOptimizadaImplCopyWith<_$RutaOptimizadaImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
