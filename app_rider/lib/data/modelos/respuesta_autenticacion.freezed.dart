// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'respuesta_autenticacion.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

RespuestaAutenticacion _$RespuestaAutenticacionFromJson(
  Map<String, dynamic> json,
) {
  return _RespuestaAutenticacion.fromJson(json);
}

/// @nodoc
mixin _$RespuestaAutenticacion {
  Usuario get usuario => throw _privateConstructorUsedError;
  String get tokenAcceso => throw _privateConstructorUsedError;
  String get tokenRefresco => throw _privateConstructorUsedError;

  /// Serializes this RespuestaAutenticacion to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RespuestaAutenticacionCopyWith<RespuestaAutenticacion> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RespuestaAutenticacionCopyWith<$Res> {
  factory $RespuestaAutenticacionCopyWith(
    RespuestaAutenticacion value,
    $Res Function(RespuestaAutenticacion) then,
  ) = _$RespuestaAutenticacionCopyWithImpl<$Res, RespuestaAutenticacion>;
  @useResult
  $Res call({Usuario usuario, String tokenAcceso, String tokenRefresco});

  $UsuarioCopyWith<$Res> get usuario;
}

/// @nodoc
class _$RespuestaAutenticacionCopyWithImpl<
  $Res,
  $Val extends RespuestaAutenticacion
>
    implements $RespuestaAutenticacionCopyWith<$Res> {
  _$RespuestaAutenticacionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? usuario = null,
    Object? tokenAcceso = null,
    Object? tokenRefresco = null,
  }) {
    return _then(
      _value.copyWith(
            usuario: null == usuario
                ? _value.usuario
                : usuario // ignore: cast_nullable_to_non_nullable
                      as Usuario,
            tokenAcceso: null == tokenAcceso
                ? _value.tokenAcceso
                : tokenAcceso // ignore: cast_nullable_to_non_nullable
                      as String,
            tokenRefresco: null == tokenRefresco
                ? _value.tokenRefresco
                : tokenRefresco // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UsuarioCopyWith<$Res> get usuario {
    return $UsuarioCopyWith<$Res>(_value.usuario, (value) {
      return _then(_value.copyWith(usuario: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$RespuestaAutenticacionImplCopyWith<$Res>
    implements $RespuestaAutenticacionCopyWith<$Res> {
  factory _$$RespuestaAutenticacionImplCopyWith(
    _$RespuestaAutenticacionImpl value,
    $Res Function(_$RespuestaAutenticacionImpl) then,
  ) = __$$RespuestaAutenticacionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({Usuario usuario, String tokenAcceso, String tokenRefresco});

  @override
  $UsuarioCopyWith<$Res> get usuario;
}

/// @nodoc
class __$$RespuestaAutenticacionImplCopyWithImpl<$Res>
    extends
        _$RespuestaAutenticacionCopyWithImpl<$Res, _$RespuestaAutenticacionImpl>
    implements _$$RespuestaAutenticacionImplCopyWith<$Res> {
  __$$RespuestaAutenticacionImplCopyWithImpl(
    _$RespuestaAutenticacionImpl _value,
    $Res Function(_$RespuestaAutenticacionImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? usuario = null,
    Object? tokenAcceso = null,
    Object? tokenRefresco = null,
  }) {
    return _then(
      _$RespuestaAutenticacionImpl(
        usuario: null == usuario
            ? _value.usuario
            : usuario // ignore: cast_nullable_to_non_nullable
                  as Usuario,
        tokenAcceso: null == tokenAcceso
            ? _value.tokenAcceso
            : tokenAcceso // ignore: cast_nullable_to_non_nullable
                  as String,
        tokenRefresco: null == tokenRefresco
            ? _value.tokenRefresco
            : tokenRefresco // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RespuestaAutenticacionImpl implements _RespuestaAutenticacion {
  const _$RespuestaAutenticacionImpl({
    required this.usuario,
    required this.tokenAcceso,
    required this.tokenRefresco,
  });

  factory _$RespuestaAutenticacionImpl.fromJson(Map<String, dynamic> json) =>
      _$$RespuestaAutenticacionImplFromJson(json);

  @override
  final Usuario usuario;
  @override
  final String tokenAcceso;
  @override
  final String tokenRefresco;

  @override
  String toString() {
    return 'RespuestaAutenticacion(usuario: $usuario, tokenAcceso: $tokenAcceso, tokenRefresco: $tokenRefresco)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RespuestaAutenticacionImpl &&
            (identical(other.usuario, usuario) || other.usuario == usuario) &&
            (identical(other.tokenAcceso, tokenAcceso) ||
                other.tokenAcceso == tokenAcceso) &&
            (identical(other.tokenRefresco, tokenRefresco) ||
                other.tokenRefresco == tokenRefresco));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, usuario, tokenAcceso, tokenRefresco);

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RespuestaAutenticacionImplCopyWith<_$RespuestaAutenticacionImpl>
  get copyWith =>
      __$$RespuestaAutenticacionImplCopyWithImpl<_$RespuestaAutenticacionImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$RespuestaAutenticacionImplToJson(this);
  }
}

abstract class _RespuestaAutenticacion implements RespuestaAutenticacion {
  const factory _RespuestaAutenticacion({
    required final Usuario usuario,
    required final String tokenAcceso,
    required final String tokenRefresco,
  }) = _$RespuestaAutenticacionImpl;

  factory _RespuestaAutenticacion.fromJson(Map<String, dynamic> json) =
      _$RespuestaAutenticacionImpl.fromJson;

  @override
  Usuario get usuario;
  @override
  String get tokenAcceso;
  @override
  String get tokenRefresco;

  /// Create a copy of RespuestaAutenticacion
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RespuestaAutenticacionImplCopyWith<_$RespuestaAutenticacionImpl>
  get copyWith => throw _privateConstructorUsedError;
}
