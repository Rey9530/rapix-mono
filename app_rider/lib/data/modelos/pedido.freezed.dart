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
  String? get nombreCliente => throw _privateConstructorUsedError;
  String? get telefonoCliente => throw _privateConstructorUsedError;
  String? get emailCliente => throw _privateConstructorUsedError;
  String? get direccionOrigen => throw _privateConstructorUsedError;
  double? get latitudOrigen => throw _privateConstructorUsedError;
  double? get longitudOrigen => throw _privateConstructorUsedError;
  String? get notasOrigen => throw _privateConstructorUsedError;
  String? get direccionDestino => throw _privateConstructorUsedError;
  double? get latitudDestino => throw _privateConstructorUsedError;
  double? get longitudDestino => throw _privateConstructorUsedError;
  String? get notasDestino => throw _privateConstructorUsedError;
  String? get descripcionPaquete => throw _privateConstructorUsedError;
  String? get pesoPaqueteKg => throw _privateConstructorUsedError;
  String? get valorDeclarado => throw _privateConstructorUsedError;
  String? get urlFotoPaquete => throw _privateConstructorUsedError;
  String? get metodoPago => throw _privateConstructorUsedError;
  String? get modoFacturacion => throw _privateConstructorUsedError;
  String? get costoEnvio => throw _privateConstructorUsedError;
  String? get montoContraEntrega => throw _privateConstructorUsedError;
  DateTime? get recogidoEn => throw _privateConstructorUsedError;
  DateTime? get enIntercambioEn => throw _privateConstructorUsedError;
  DateTime? get entregadoEn => throw _privateConstructorUsedError;
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
    String? nombreCliente,
    String? telefonoCliente,
    String? emailCliente,
    String? direccionOrigen,
    double? latitudOrigen,
    double? longitudOrigen,
    String? notasOrigen,
    String? direccionDestino,
    double? latitudDestino,
    double? longitudDestino,
    String? notasDestino,
    String? descripcionPaquete,
    String? pesoPaqueteKg,
    String? valorDeclarado,
    String? urlFotoPaquete,
    String? metodoPago,
    String? modoFacturacion,
    String? costoEnvio,
    String? montoContraEntrega,
    DateTime? recogidoEn,
    DateTime? enIntercambioEn,
    DateTime? entregadoEn,
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
    Object? nombreCliente = freezed,
    Object? telefonoCliente = freezed,
    Object? emailCliente = freezed,
    Object? direccionOrigen = freezed,
    Object? latitudOrigen = freezed,
    Object? longitudOrigen = freezed,
    Object? notasOrigen = freezed,
    Object? direccionDestino = freezed,
    Object? latitudDestino = freezed,
    Object? longitudDestino = freezed,
    Object? notasDestino = freezed,
    Object? descripcionPaquete = freezed,
    Object? pesoPaqueteKg = freezed,
    Object? valorDeclarado = freezed,
    Object? urlFotoPaquete = freezed,
    Object? metodoPago = freezed,
    Object? modoFacturacion = freezed,
    Object? costoEnvio = freezed,
    Object? montoContraEntrega = freezed,
    Object? recogidoEn = freezed,
    Object? enIntercambioEn = freezed,
    Object? entregadoEn = freezed,
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
            nombreCliente: freezed == nombreCliente
                ? _value.nombreCliente
                : nombreCliente // ignore: cast_nullable_to_non_nullable
                      as String?,
            telefonoCliente: freezed == telefonoCliente
                ? _value.telefonoCliente
                : telefonoCliente // ignore: cast_nullable_to_non_nullable
                      as String?,
            emailCliente: freezed == emailCliente
                ? _value.emailCliente
                : emailCliente // ignore: cast_nullable_to_non_nullable
                      as String?,
            direccionOrigen: freezed == direccionOrigen
                ? _value.direccionOrigen
                : direccionOrigen // ignore: cast_nullable_to_non_nullable
                      as String?,
            latitudOrigen: freezed == latitudOrigen
                ? _value.latitudOrigen
                : latitudOrigen // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitudOrigen: freezed == longitudOrigen
                ? _value.longitudOrigen
                : longitudOrigen // ignore: cast_nullable_to_non_nullable
                      as double?,
            notasOrigen: freezed == notasOrigen
                ? _value.notasOrigen
                : notasOrigen // ignore: cast_nullable_to_non_nullable
                      as String?,
            direccionDestino: freezed == direccionDestino
                ? _value.direccionDestino
                : direccionDestino // ignore: cast_nullable_to_non_nullable
                      as String?,
            latitudDestino: freezed == latitudDestino
                ? _value.latitudDestino
                : latitudDestino // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitudDestino: freezed == longitudDestino
                ? _value.longitudDestino
                : longitudDestino // ignore: cast_nullable_to_non_nullable
                      as double?,
            notasDestino: freezed == notasDestino
                ? _value.notasDestino
                : notasDestino // ignore: cast_nullable_to_non_nullable
                      as String?,
            descripcionPaquete: freezed == descripcionPaquete
                ? _value.descripcionPaquete
                : descripcionPaquete // ignore: cast_nullable_to_non_nullable
                      as String?,
            pesoPaqueteKg: freezed == pesoPaqueteKg
                ? _value.pesoPaqueteKg
                : pesoPaqueteKg // ignore: cast_nullable_to_non_nullable
                      as String?,
            valorDeclarado: freezed == valorDeclarado
                ? _value.valorDeclarado
                : valorDeclarado // ignore: cast_nullable_to_non_nullable
                      as String?,
            urlFotoPaquete: freezed == urlFotoPaquete
                ? _value.urlFotoPaquete
                : urlFotoPaquete // ignore: cast_nullable_to_non_nullable
                      as String?,
            metodoPago: freezed == metodoPago
                ? _value.metodoPago
                : metodoPago // ignore: cast_nullable_to_non_nullable
                      as String?,
            modoFacturacion: freezed == modoFacturacion
                ? _value.modoFacturacion
                : modoFacturacion // ignore: cast_nullable_to_non_nullable
                      as String?,
            costoEnvio: freezed == costoEnvio
                ? _value.costoEnvio
                : costoEnvio // ignore: cast_nullable_to_non_nullable
                      as String?,
            montoContraEntrega: freezed == montoContraEntrega
                ? _value.montoContraEntrega
                : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                      as String?,
            recogidoEn: freezed == recogidoEn
                ? _value.recogidoEn
                : recogidoEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            enIntercambioEn: freezed == enIntercambioEn
                ? _value.enIntercambioEn
                : enIntercambioEn // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            entregadoEn: freezed == entregadoEn
                ? _value.entregadoEn
                : entregadoEn // ignore: cast_nullable_to_non_nullable
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
    String? nombreCliente,
    String? telefonoCliente,
    String? emailCliente,
    String? direccionOrigen,
    double? latitudOrigen,
    double? longitudOrigen,
    String? notasOrigen,
    String? direccionDestino,
    double? latitudDestino,
    double? longitudDestino,
    String? notasDestino,
    String? descripcionPaquete,
    String? pesoPaqueteKg,
    String? valorDeclarado,
    String? urlFotoPaquete,
    String? metodoPago,
    String? modoFacturacion,
    String? costoEnvio,
    String? montoContraEntrega,
    DateTime? recogidoEn,
    DateTime? enIntercambioEn,
    DateTime? entregadoEn,
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
    Object? nombreCliente = freezed,
    Object? telefonoCliente = freezed,
    Object? emailCliente = freezed,
    Object? direccionOrigen = freezed,
    Object? latitudOrigen = freezed,
    Object? longitudOrigen = freezed,
    Object? notasOrigen = freezed,
    Object? direccionDestino = freezed,
    Object? latitudDestino = freezed,
    Object? longitudDestino = freezed,
    Object? notasDestino = freezed,
    Object? descripcionPaquete = freezed,
    Object? pesoPaqueteKg = freezed,
    Object? valorDeclarado = freezed,
    Object? urlFotoPaquete = freezed,
    Object? metodoPago = freezed,
    Object? modoFacturacion = freezed,
    Object? costoEnvio = freezed,
    Object? montoContraEntrega = freezed,
    Object? recogidoEn = freezed,
    Object? enIntercambioEn = freezed,
    Object? entregadoEn = freezed,
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
        nombreCliente: freezed == nombreCliente
            ? _value.nombreCliente
            : nombreCliente // ignore: cast_nullable_to_non_nullable
                  as String?,
        telefonoCliente: freezed == telefonoCliente
            ? _value.telefonoCliente
            : telefonoCliente // ignore: cast_nullable_to_non_nullable
                  as String?,
        emailCliente: freezed == emailCliente
            ? _value.emailCliente
            : emailCliente // ignore: cast_nullable_to_non_nullable
                  as String?,
        direccionOrigen: freezed == direccionOrigen
            ? _value.direccionOrigen
            : direccionOrigen // ignore: cast_nullable_to_non_nullable
                  as String?,
        latitudOrigen: freezed == latitudOrigen
            ? _value.latitudOrigen
            : latitudOrigen // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitudOrigen: freezed == longitudOrigen
            ? _value.longitudOrigen
            : longitudOrigen // ignore: cast_nullable_to_non_nullable
                  as double?,
        notasOrigen: freezed == notasOrigen
            ? _value.notasOrigen
            : notasOrigen // ignore: cast_nullable_to_non_nullable
                  as String?,
        direccionDestino: freezed == direccionDestino
            ? _value.direccionDestino
            : direccionDestino // ignore: cast_nullable_to_non_nullable
                  as String?,
        latitudDestino: freezed == latitudDestino
            ? _value.latitudDestino
            : latitudDestino // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitudDestino: freezed == longitudDestino
            ? _value.longitudDestino
            : longitudDestino // ignore: cast_nullable_to_non_nullable
                  as double?,
        notasDestino: freezed == notasDestino
            ? _value.notasDestino
            : notasDestino // ignore: cast_nullable_to_non_nullable
                  as String?,
        descripcionPaquete: freezed == descripcionPaquete
            ? _value.descripcionPaquete
            : descripcionPaquete // ignore: cast_nullable_to_non_nullable
                  as String?,
        pesoPaqueteKg: freezed == pesoPaqueteKg
            ? _value.pesoPaqueteKg
            : pesoPaqueteKg // ignore: cast_nullable_to_non_nullable
                  as String?,
        valorDeclarado: freezed == valorDeclarado
            ? _value.valorDeclarado
            : valorDeclarado // ignore: cast_nullable_to_non_nullable
                  as String?,
        urlFotoPaquete: freezed == urlFotoPaquete
            ? _value.urlFotoPaquete
            : urlFotoPaquete // ignore: cast_nullable_to_non_nullable
                  as String?,
        metodoPago: freezed == metodoPago
            ? _value.metodoPago
            : metodoPago // ignore: cast_nullable_to_non_nullable
                  as String?,
        modoFacturacion: freezed == modoFacturacion
            ? _value.modoFacturacion
            : modoFacturacion // ignore: cast_nullable_to_non_nullable
                  as String?,
        costoEnvio: freezed == costoEnvio
            ? _value.costoEnvio
            : costoEnvio // ignore: cast_nullable_to_non_nullable
                  as String?,
        montoContraEntrega: freezed == montoContraEntrega
            ? _value.montoContraEntrega
            : montoContraEntrega // ignore: cast_nullable_to_non_nullable
                  as String?,
        recogidoEn: freezed == recogidoEn
            ? _value.recogidoEn
            : recogidoEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        enIntercambioEn: freezed == enIntercambioEn
            ? _value.enIntercambioEn
            : enIntercambioEn // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        entregadoEn: freezed == entregadoEn
            ? _value.entregadoEn
            : entregadoEn // ignore: cast_nullable_to_non_nullable
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
class _$PedidoImpl implements _Pedido {
  const _$PedidoImpl({
    required this.id,
    required this.codigoSeguimiento,
    required this.estado,
    this.nombreCliente,
    this.telefonoCliente,
    this.emailCliente,
    this.direccionOrigen,
    this.latitudOrigen,
    this.longitudOrigen,
    this.notasOrigen,
    this.direccionDestino,
    this.latitudDestino,
    this.longitudDestino,
    this.notasDestino,
    this.descripcionPaquete,
    this.pesoPaqueteKg,
    this.valorDeclarado,
    this.urlFotoPaquete,
    this.metodoPago,
    this.modoFacturacion,
    this.costoEnvio,
    this.montoContraEntrega,
    this.recogidoEn,
    this.enIntercambioEn,
    this.entregadoEn,
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
  final String? nombreCliente;
  @override
  final String? telefonoCliente;
  @override
  final String? emailCliente;
  @override
  final String? direccionOrigen;
  @override
  final double? latitudOrigen;
  @override
  final double? longitudOrigen;
  @override
  final String? notasOrigen;
  @override
  final String? direccionDestino;
  @override
  final double? latitudDestino;
  @override
  final double? longitudDestino;
  @override
  final String? notasDestino;
  @override
  final String? descripcionPaquete;
  @override
  final String? pesoPaqueteKg;
  @override
  final String? valorDeclarado;
  @override
  final String? urlFotoPaquete;
  @override
  final String? metodoPago;
  @override
  final String? modoFacturacion;
  @override
  final String? costoEnvio;
  @override
  final String? montoContraEntrega;
  @override
  final DateTime? recogidoEn;
  @override
  final DateTime? enIntercambioEn;
  @override
  final DateTime? entregadoEn;
  @override
  final DateTime? creadoEn;
  @override
  final DateTime? actualizadoEn;

  @override
  String toString() {
    return 'Pedido(id: $id, codigoSeguimiento: $codigoSeguimiento, estado: $estado, nombreCliente: $nombreCliente, telefonoCliente: $telefonoCliente, emailCliente: $emailCliente, direccionOrigen: $direccionOrigen, latitudOrigen: $latitudOrigen, longitudOrigen: $longitudOrigen, notasOrigen: $notasOrigen, direccionDestino: $direccionDestino, latitudDestino: $latitudDestino, longitudDestino: $longitudDestino, notasDestino: $notasDestino, descripcionPaquete: $descripcionPaquete, pesoPaqueteKg: $pesoPaqueteKg, valorDeclarado: $valorDeclarado, urlFotoPaquete: $urlFotoPaquete, metodoPago: $metodoPago, modoFacturacion: $modoFacturacion, costoEnvio: $costoEnvio, montoContraEntrega: $montoContraEntrega, recogidoEn: $recogidoEn, enIntercambioEn: $enIntercambioEn, entregadoEn: $entregadoEn, creadoEn: $creadoEn, actualizadoEn: $actualizadoEn)';
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
            (identical(other.nombreCliente, nombreCliente) ||
                other.nombreCliente == nombreCliente) &&
            (identical(other.telefonoCliente, telefonoCliente) ||
                other.telefonoCliente == telefonoCliente) &&
            (identical(other.emailCliente, emailCliente) ||
                other.emailCliente == emailCliente) &&
            (identical(other.direccionOrigen, direccionOrigen) ||
                other.direccionOrigen == direccionOrigen) &&
            (identical(other.latitudOrigen, latitudOrigen) ||
                other.latitudOrigen == latitudOrigen) &&
            (identical(other.longitudOrigen, longitudOrigen) ||
                other.longitudOrigen == longitudOrigen) &&
            (identical(other.notasOrigen, notasOrigen) ||
                other.notasOrigen == notasOrigen) &&
            (identical(other.direccionDestino, direccionDestino) ||
                other.direccionDestino == direccionDestino) &&
            (identical(other.latitudDestino, latitudDestino) ||
                other.latitudDestino == latitudDestino) &&
            (identical(other.longitudDestino, longitudDestino) ||
                other.longitudDestino == longitudDestino) &&
            (identical(other.notasDestino, notasDestino) ||
                other.notasDestino == notasDestino) &&
            (identical(other.descripcionPaquete, descripcionPaquete) ||
                other.descripcionPaquete == descripcionPaquete) &&
            (identical(other.pesoPaqueteKg, pesoPaqueteKg) ||
                other.pesoPaqueteKg == pesoPaqueteKg) &&
            (identical(other.valorDeclarado, valorDeclarado) ||
                other.valorDeclarado == valorDeclarado) &&
            (identical(other.urlFotoPaquete, urlFotoPaquete) ||
                other.urlFotoPaquete == urlFotoPaquete) &&
            (identical(other.metodoPago, metodoPago) ||
                other.metodoPago == metodoPago) &&
            (identical(other.modoFacturacion, modoFacturacion) ||
                other.modoFacturacion == modoFacturacion) &&
            (identical(other.costoEnvio, costoEnvio) ||
                other.costoEnvio == costoEnvio) &&
            (identical(other.montoContraEntrega, montoContraEntrega) ||
                other.montoContraEntrega == montoContraEntrega) &&
            (identical(other.recogidoEn, recogidoEn) ||
                other.recogidoEn == recogidoEn) &&
            (identical(other.enIntercambioEn, enIntercambioEn) ||
                other.enIntercambioEn == enIntercambioEn) &&
            (identical(other.entregadoEn, entregadoEn) ||
                other.entregadoEn == entregadoEn) &&
            (identical(other.creadoEn, creadoEn) ||
                other.creadoEn == creadoEn) &&
            (identical(other.actualizadoEn, actualizadoEn) ||
                other.actualizadoEn == actualizadoEn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    codigoSeguimiento,
    estado,
    nombreCliente,
    telefonoCliente,
    emailCliente,
    direccionOrigen,
    latitudOrigen,
    longitudOrigen,
    notasOrigen,
    direccionDestino,
    latitudDestino,
    longitudDestino,
    notasDestino,
    descripcionPaquete,
    pesoPaqueteKg,
    valorDeclarado,
    urlFotoPaquete,
    metodoPago,
    modoFacturacion,
    costoEnvio,
    montoContraEntrega,
    recogidoEn,
    enIntercambioEn,
    entregadoEn,
    creadoEn,
    actualizadoEn,
  ]);

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
    final String? nombreCliente,
    final String? telefonoCliente,
    final String? emailCliente,
    final String? direccionOrigen,
    final double? latitudOrigen,
    final double? longitudOrigen,
    final String? notasOrigen,
    final String? direccionDestino,
    final double? latitudDestino,
    final double? longitudDestino,
    final String? notasDestino,
    final String? descripcionPaquete,
    final String? pesoPaqueteKg,
    final String? valorDeclarado,
    final String? urlFotoPaquete,
    final String? metodoPago,
    final String? modoFacturacion,
    final String? costoEnvio,
    final String? montoContraEntrega,
    final DateTime? recogidoEn,
    final DateTime? enIntercambioEn,
    final DateTime? entregadoEn,
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
  String? get nombreCliente;
  @override
  String? get telefonoCliente;
  @override
  String? get emailCliente;
  @override
  String? get direccionOrigen;
  @override
  double? get latitudOrigen;
  @override
  double? get longitudOrigen;
  @override
  String? get notasOrigen;
  @override
  String? get direccionDestino;
  @override
  double? get latitudDestino;
  @override
  double? get longitudDestino;
  @override
  String? get notasDestino;
  @override
  String? get descripcionPaquete;
  @override
  String? get pesoPaqueteKg;
  @override
  String? get valorDeclarado;
  @override
  String? get urlFotoPaquete;
  @override
  String? get metodoPago;
  @override
  String? get modoFacturacion;
  @override
  String? get costoEnvio;
  @override
  String? get montoContraEntrega;
  @override
  DateTime? get recogidoEn;
  @override
  DateTime? get enIntercambioEn;
  @override
  DateTime? get entregadoEn;
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
