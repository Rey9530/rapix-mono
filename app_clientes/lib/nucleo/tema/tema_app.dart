import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'tokens_rapix.dart';

class TemaApp {
  TemaApp._();

  static ThemeData claro() {
    final base = ColorScheme.fromSeed(seedColor: TokensRapix.verde);
    final colores = base.copyWith(
      primary: TokensRapix.verde,
      onPrimary: Colors.white,
      primaryContainer: TokensRapix.verdeSuave,
      onPrimaryContainer: TokensRapix.verdeTinta,
      surface: TokensRapix.superficie,
      onSurface: TokensRapix.tinta,
      onSurfaceVariant: TokensRapix.tintaSilenciada,
      surfaceContainerHighest: TokensRapix.superficieAlt,
      outline: TokensRapix.contorno,
      outlineVariant: TokensRapix.contornoSuave,
      error: TokensRapix.peligro,
      onError: Colors.white,
      errorContainer: TokensRapix.peligroSuave,
    );

    final tema = ThemeData(useMaterial3: true, colorScheme: colores);

    return tema.copyWith(
      scaffoldBackgroundColor: TokensRapix.fondo,
      textTheme: GoogleFonts.interTextTheme(tema.textTheme).apply(
        bodyColor: TokensRapix.tinta,
        displayColor: TokensRapix.tinta,
      ),
      primaryTextTheme: GoogleFonts.interTextTheme(tema.primaryTextTheme),
      appBarTheme: AppBarTheme(
        backgroundColor: TokensRapix.superficie,
        foregroundColor: TokensRapix.tinta,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: TokensRapix.tinta,
          letterSpacing: -0.2,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(50),
          backgroundColor: TokensRapix.verde,
          foregroundColor: Colors.white,
          disabledBackgroundColor: TokensRapix.verde.withValues(alpha: 0.5),
          disabledForegroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.1,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: TokensRapix.verde,
          textStyle: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          foregroundColor: TokensRapix.tinta,
          backgroundColor: TokensRapix.superficie,
          side: const BorderSide(color: TokensRapix.contorno, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: TokensRapix.superficie,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 14,
        ),
        hintStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: TokensRapix.tintaSuave,
        ),
        labelStyle: GoogleFonts.inter(
          fontSize: 14,
          color: TokensRapix.tintaSilenciada,
        ),
        floatingLabelStyle: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: TokensRapix.verde,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          borderSide: const BorderSide(color: TokensRapix.contorno, width: 1.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          borderSide: const BorderSide(color: TokensRapix.contorno, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          borderSide: const BorderSide(color: TokensRapix.verde, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          borderSide: const BorderSide(color: TokensRapix.peligro, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          borderSide: const BorderSide(color: TokensRapix.peligro, width: 1.5),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: TokensRapix.contorno,
        thickness: 1,
        space: 1,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: TokensRapix.superficie,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioLg),
          side: const BorderSide(color: TokensRapix.contornoSuave),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: TokensRapix.tinta,
        contentTextStyle: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: Colors.white,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        ),
      ),
    );
  }

  static ThemeData oscuro() {
    final base = ColorScheme.fromSeed(
      seedColor: TokensRapix.verde,
      brightness: Brightness.dark,
    );
    final colores = base.copyWith(
      primary: TokensRapix.verde,
      onPrimary: Colors.white,
    );
    final tema = ThemeData(useMaterial3: true, colorScheme: colores);
    return tema.copyWith(
      textTheme: GoogleFonts.interTextTheme(tema.textTheme),
      primaryTextTheme: GoogleFonts.interTextTheme(tema.primaryTextTheme),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(50),
          backgroundColor: TokensRapix.verde,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
