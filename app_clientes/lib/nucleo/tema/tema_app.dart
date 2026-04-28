import 'package:flutter/material.dart';

class TemaApp {
  TemaApp._();

  static const _semilla = Color(0xFF1565C0);

  static ThemeData claro() {
    final colores = ColorScheme.fromSeed(seedColor: _semilla);
    return ThemeData(
      useMaterial3: true,
      colorScheme: colores,
      appBarTheme: AppBarTheme(
        backgroundColor: colores.surface,
        foregroundColor: colores.onSurface,
        elevation: 0,
        centerTitle: false,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: colores.outlineVariant),
        ),
      ),
    );
  }

  static ThemeData oscuro() {
    final colores = ColorScheme.fromSeed(
      seedColor: _semilla,
      brightness: Brightness.dark,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: colores,
    );
  }
}
