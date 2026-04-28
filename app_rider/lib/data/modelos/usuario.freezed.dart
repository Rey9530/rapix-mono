// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'usuario.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Usuario _$UsuarioFromJson(Map<String, dynamic> json) {
  return _Usuario.fromJson(json);
}

/// @nodoc
mixin _$Usuario {
  String get id => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get telefono => throw _privateConstructorUsedError;
  String get nombreCompleto => throw _privateConstructorUsedError;
  String get rol => throw _privateConstructorUsedError;
  String get estado => throw _privateConstructorUsedError;
  String? get urlAvatar => throw _privateConstructorUsedError;
  DateTime? get ultimoIngresoEn => throw _privateConstructorUsedError;
  DateTime? get creadoEn => throw _privateConstructorUsedError;
  DateTime? get actualizadoEn => throw _privateConstructorUsedError;

  /// Serializes this Usuario to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Usuario
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UsuarioCopyWith<Usuario> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UsuarioCopyWith<$Res> {
  factory $UsuarioCopyWith(Usuario value, $Res Function(Usuario) then) =
      _$UsuarioCopyWithImpl<$Res, Usuario>;
  @useResult
  $Res call({
    String id,
    String email,
    String telefono,
    String nombreCompleto,
    String rol,
    String estado,
    String? urlAvatar,
    DateTime? ultimoIngresoEn,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class _$UsuarioCopyWithImpl<$Res, $Val extends Usuario>
    implements $UsuarioCopyWith<$Res> {
  _$UsuarioCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Usuario
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? telefono = null,
    Object? nombreCompleto = null,
    Object? rol = null,
    Object? estado = null,
    Object? urlAvatar = freezed,
    Object? ultimoIngresoEn = freezed,
    Object? creadoEn = freezed,
    Object? actualizadoEn = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            telefono: null == telefono
                ? _value.telefono
                : telefono // ignore: cast_nullable_to_non_nullable
                      as String,
            nombreCompleto: null == nombreCompleto
                ? _value.nombreCompleto
                : nombreCompleto // ignore: cast_nullable_to_non_nullable
                      as String,
            rol: null == rol
                ? _value.rol
                : rol // ignore: cast_nullable_to_non_nullable
                      as String,
            estado: null == estado
                ? _value.estado
                : estado // ignore: cast_nullable_to_non_nullable
                      as String,
            urlAvatar: freezed == urlAvatar
                ? _value.urlAvatar
                : urlAvatar // ignore: cast_nullable_to_non_nullable
                      as String?,
            ultimoIngresoEn: freezed == ultimoIngresoEn
                ? _value.ultimoIngresoEn
                : ultimoIngresoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
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
abstract class _$$UsuarioImplCopyWith<$Res> implements $UsuarioCopyWith<$Res> {
  factory _$$UsuarioImplCopyWith(
    _$UsuarioImpl value,
    $Res Function(_$UsuarioImpl) then,
  ) = __$$UsuarioImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String email,
    String telefono,
    String nombreCompleto,
    String rol,
    String estado,
    String? urlAvatar,
    DateTime? ultimoIngresoEn,
    DateTime? creadoEn,
    DateTime? actualizadoEn,
  });
}

/// @nodoc
class __$$UsuarioImplCopyWithImpl<$Res>
    extends _$UsuarioCopyWithImpl<$Res, _$UsuarioImpl>
    implements _$$UsuarioImplCopyWith<$Res> {
  __$$UsuarioImplCopyWithImpl(
    _$UsuarioImpl _value,
    $Res Function(_$UsuarioImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Usuario
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? telefono = null,
    Object? nombreCompleto = null,
    Object? rol = null,
    Object? estado = null,
    Object? urlAvatar = freezed,
    Object? ultimoIngresoEn = freezed,
    Object? creadoEn = freezed,
    Object? actualizadoEn = freezed,
  }) {
    return _then(
      _$UsuarioImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        telefono: null == telefono
            ? _value.telefono
            : telefono // ignore: cast_nullable_to_non_nullable
                  as String,
        nombreCompleto: null == nombreCompleto
            ? _value.nombreCompleto
            : nombreCompleto // ignore: cast_nullable_to_non_nullable
                  as String,
        rol: null == rol
            ? _value.rol
            : rol // ignore: cast_nullable_to_non_nullable
                  as String,
        estado: null == estado
            ? _value.estado
            : estado // ignore: cast_nullable_to_non_nullable
                  as String,
        urlAvatar: freezed == urlAvatar
            ? _value.urlAvatar
            : urlAvatar // ignore: cast_nullable_to_non_nullable
                  as String?,
        ultimoIngresoEn: freezed == ultimoIngresoEn
            ? _value.ultimoIngresoEn
            : ultimoIngresoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
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
class _$UsuarioImpl implements _Usuario {
  const _$UsuarioImpl({
    required this.id,
    required this.email,
    required this.telefono,
    required this.nombreCompleto,
    required this.rol,
    required this.estado,
    this.urlAvatar,
    this.ultimoIngresoEn,
    this.creadoEn,
    this.actualizadoEn,
  });

  factory _$UsuarioImpl.fromJson(Map<String, dynamic> json) =>
      _$$UsuarioImplFromJson(json);

  @override
  final String id;
  @override
  final String email;
  @override
  final String telefono;
  @override
  final String nombreCompleto;
  @override
  final String rol;
  @override
  final String estado;
  @override
  final String? urlAvatar;
  @override
  final DateTime? ultimoIngresoEn;
  @override
  final DateTime? creadoEn;
  @override
  final DateTime? actualizadoEn;

  @override
  String toString() {
    return 'Usuario(id: $id, email: $email, telefono: $telefono, nombreCompleto: $nombreCompleto, rol: $rol, estado: $estado, urlAvatar: $urlAvatar, ultimoIngresoEn: $ultimoIngresoEn, creadoEn: $creadoEn, actualizadoEn: $actualizadoEn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UsuarioImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.telefono, telefono) ||
                other.telefono == telefono) &&
            (identical(other.nombreCompleto, nombreCompleto) ||
                other.nombreCompleto == nombreCompleto) &&
            (identical(other.rol, rol) || other.rol == rol) &&
            (identical(other.estado, estado) || other.estado == estado) &&
            (identical(other.urlAvatar, urlAvatar) ||
                other.urlAvatar == urlAvatar) &&
            (identical(other.ultimoIngresoEn, ultimoIngresoEn) ||
                other.ultimoIngresoEn == ultimoIngresoEn) &&
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
    email,
    telefono,
    nombreCompleto,
    rol,
    estado,
    urlAvatar,
    ultimoIngresoEn,
    creadoEn,
    actualizadoEn,
  );

  /// Create a copy of Usuario
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UsuarioImplCopyWith<_$UsuarioImpl> get copyWith =>
      __$$UsuarioImplCopyWithImpl<_$UsuarioImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UsuarioImplToJson(this);
  }
}

abstract class _Usuario implements Usuario {
  const factory _Usuario({
    required final String id,
    required final String email,
    required final String telefono,
    required final String nombreCompleto,
    required final String rol,
    required final String estado,
    final String? urlAvatar,
    final DateTime? ultimoIngresoEn,
    final DateTime? creadoEn,
    final DateTime? actualizadoEn,
  }) = _$UsuarioImpl;

  factory _Usuario.fromJson(Map<String, dynamic> json) = _$UsuarioImpl.fromJson;

  @override
  String get id;
  @override
  String get email;
  @override
  String get telefono;
  @override
  String get nombreCompleto;
  @override
  String get rol;
  @override
  String get estado;
  @override
  String? get urlAvatar;
  @override
  DateTime? get ultimoIngresoEn;
  @override
  DateTime? get creadoEn;
  @override
  DateTime? get actualizadoEn;

  /// Create a copy of Usuario
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UsuarioImplCopyWith<_$UsuarioImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
