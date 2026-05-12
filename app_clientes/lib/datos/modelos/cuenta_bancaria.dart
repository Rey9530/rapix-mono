class Banco {
  Banco({required this.id, required this.codigo, required this.nombre});

  final String id;
  final String codigo;
  final String nombre;

  factory Banco.desdeJson(Map<String, dynamic> json) => Banco(
        id: json['id'] as String,
        codigo: json['codigo'] as String,
        nombre: json['nombre'] as String,
      );

  Map<String, dynamic> aJson() => {
        'id': id,
        'codigo': codigo,
        'nombre': nombre,
      };
}

enum TipoCuentaBancaria {
  ahorro,
  corriente;

  String get apiValor => switch (this) {
        TipoCuentaBancaria.ahorro => 'AHORRO',
        TipoCuentaBancaria.corriente => 'CORRIENTE',
      };

  String get etiqueta => switch (this) {
        TipoCuentaBancaria.ahorro => 'Ahorro',
        TipoCuentaBancaria.corriente => 'Corriente',
      };

  static TipoCuentaBancaria desdeApi(String valor) {
    switch (valor) {
      case 'AHORRO':
        return TipoCuentaBancaria.ahorro;
      case 'CORRIENTE':
        return TipoCuentaBancaria.corriente;
      default:
        throw ArgumentError('Tipo de cuenta desconocido: $valor');
    }
  }
}

class CuentaBancaria {
  CuentaBancaria({
    required this.id,
    required this.banco,
    required this.tipoCuenta,
    required this.numeroCuenta,
    required this.esPrincipal,
    this.alias,
  });

  final String id;
  final Banco banco;
  final TipoCuentaBancaria tipoCuenta;
  final String numeroCuenta;
  final String? alias;
  final bool esPrincipal;

  String get numeroEnmascarado {
    if (numeroCuenta.length <= 4) {
      return '*' * numeroCuenta.length;
    }
    return '****${numeroCuenta.substring(numeroCuenta.length - 4)}';
  }

  factory CuentaBancaria.desdeJson(Map<String, dynamic> json) => CuentaBancaria(
        id: json['id'] as String,
        banco: Banco.desdeJson(json['banco'] as Map<String, dynamic>),
        tipoCuenta:
            TipoCuentaBancaria.desdeApi(json['tipoCuenta'] as String),
        numeroCuenta: json['numeroCuenta'] as String,
        alias: json['alias'] as String?,
        esPrincipal: json['esPrincipal'] as bool? ?? false,
      );

  CuentaBancaria copyWith({
    String? alias,
    TipoCuentaBancaria? tipoCuenta,
    bool? esPrincipal,
  }) =>
      CuentaBancaria(
        id: id,
        banco: banco,
        tipoCuenta: tipoCuenta ?? this.tipoCuenta,
        numeroCuenta: numeroCuenta,
        alias: alias ?? this.alias,
        esPrincipal: esPrincipal ?? this.esPrincipal,
      );
}
