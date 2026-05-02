# Handoff: Rediseño de Rapix (App Cliente)

## Overview
Propuesta de rediseño UI/UX para **Rapix**, app de gestión de envíos para vendedores (Flutter + Material 3). Cubre 8 pantallas clave con 2 variantes cada una: **Refinada** (cercana al original, M3 pulido) y **Atrevida** (más expresiva, identidad fuerte).

## Sobre los archivos de diseño
Los archivos en este bundle son **referencias de diseño en HTML/React** — prototipos visuales que muestran el look-and-feel y comportamiento previstos. **No son código de producción listo para copiar**. La tarea es **recrear estos diseños en el codebase actual de Rapix (Flutter/Dart con Material 3, Riverpod, go_router)** usando los patrones y librerías ya establecidos.

## Fidelidad
**High-fidelity (hi-fi)**: mockups con colores, tipografía y espaciados finales. El equipo debe recrearlos pixel-perfect en Flutter respetando los tokens listados abajo.

## Stack original a respetar
- Flutter + Dart, Material 3
- Riverpod (state), go_router (StatefulShellRoute con 4 ramas: inicio, pedidos, paquetes, perfil)
- Mapbox para mapas, Dio para HTTP, image_picker para fotos

## Pantallas incluidas (cada una con variante A "Refinada" y B "Atrevida")

0. **Autenticación** `/login` y `/registro` — login con email/contraseña + Google, recuperar contraseña, link a registro. Registro con campos personales + datos del negocio (logo, dirección, coordenadas opcionales). Variante Atrevida usa hero verde con wordmark a gran escala.
1. **Inicio (dashboard)** `/inicio` — saldo prominente, métricas del día (en tránsito, entregados, pendientes, semana), accesos rápidos.
2. **Listado de pedidos** `/pedidos` — búsqueda, filtros pill, agrupación temporal (Hoy/Ayer), ETA visible, FAB nuevo pedido.
3. **Crear pedido** `/pedidos/nuevo` — **resuelve fricción del URL Maps** con mapa embebido, búsqueda de dirección, "mi ubicación", pegar link como opción secundaria.
4. **Detalle de pedido** `/pedidos/:id` — banner de estado, mapa con marcadores (origen, repartidor, destino), card de repartidor con llamar/mensaje, timeline.
5. **Seguimiento público** `/seguimiento/:codigo` — branding `rapix.` prominente, ETA grande, mapa, timeline. Resuelve la oportunidad de marca para destinatarios.
6. **Tienda de paquetes** `/paquetes/tienda` — destacado "más vendido", costo por envío, ahorro, instrucciones de pago vía banner.
7. **Mi perfil** `/perfil` — header con avatar/rating, contacto, negocio (con coordenadas), preferencias, logout.

## Design Tokens

### Color marca
- Verde primario: `#25b276`
- Verde oscuro: `#1a8f5d`
- Verde suave (bg/chips): `#e6f6ee`
- Verde tinta (sobre verde suave): `#0d3a26`

### Superficies (warm-neutral)
- Background: `#fbfaf7`
- Surface: `#ffffff`
- Surface alt: `#f4f2ee`
- Surface sunken: `#efece6`
- Outline: `#e2dfd8`
- Outline soft: `#eeebe4`

### Texto
- Ink (principal): `#13140f`
- Ink muted: `#5a5b54`
- Ink soft: `#8b8c84`

### Estados (chips de pedido)
- PENDIENTE_ASIGNACION: bg `#fff4e6`, fg `#b45309`, dot `#f59e0b`
- ASIGNADO: bg `#dbeafe`, fg `#1d4ed8`, dot `#3b82f6`
- RECOGIDO: bg `#ede9fe`, fg `#6d28d9`, dot `#8b5cf6`
- EN_TRANSITO: bg `#e9e3fd`, fg `#5b21b6`, dot `#7c3aed`
- EN_REPARTO: bg `#dbeafe`, fg `#1e40af`, dot `#2563eb`
- ENTREGADO: bg `#dcfce7`, fg `#15803d`, dot `#22c55e`
- FALLIDO: bg `#fee2e2`, fg `#b91c1c`, dot `#ef4444`
- DEVUELTO: bg `#fef3c7`, fg `#92400e`, dot `#d97706`
- CANCELADO: bg `#f1f5f9`, fg `#475569`, dot `#94a3b8`

### Tipografía
- UI: **Inter** (400/500/600/700/800)
- Códigos de seguimiento (RPX-XXXXX): **JetBrains Mono** 500/600
- Letter-spacing negativo en titulares grandes (-0.3 a -2)

### Espaciado / radii
- Radii: 8 (sm), 12 (md), 16 (lg), 20 (xl), 999 (pill)
- Padding base de cards: 14–18
- Margen entre cards: 8–14

### Sombras
- sm: `0 1px 2px rgba(19,20,15,0.05)`
- md: `0 4px 12px rgba(19,20,15,0.06), 0 2px 4px rgba(19,20,15,0.04)`
- lg: `0 12px 32px rgba(19,20,15,0.08), 0 4px 12px rgba(19,20,15,0.05)`

### Wordmark
`rapix` en Inter 800 + punto verde `.` (color marca). Letter-spacing -1.

## Componentes globales

### Bottom navigation (4 tabs)
Inicio · Pedidos (con badge de pendientes) · Paquetes · Perfil. Indicador activo: pill verde suave detrás del icono.

### EstadoChip
Pill 999 radius. Dot 6px del color del estado + label en fontWeight 600 size 11–12. Bg suave + fg oscuro del mismo hue.

### App bar
56 min-height. Leading icon (back/menú), título 18px weight 600, subtítulo 12px muted, trailing icons (search/share/refresh).

### Mapa placeholder
Las pantallas de mapa usan un fondo verde-grisáceo `linear-gradient(135deg, #d8e6db, #c2d6c8)` con calles dibujadas en blanco semi-transparente. **En producción usar Mapbox GL** (ya integrado).

## Cambios funcionales clave (vs. original)

1. **Crear pedido**: el campo "URL de Google Maps" deja de ser obligatorio. Se reemplaza por:
   - Mapa embebido con pin central
   - Buscador de direcciones (geocoding Mapbox)
   - Botón "Mi ubicación" (GPS)
   - "Pegar link de Maps" disponible como opción secundaria
2. **Seguimiento público**: añade mapa en vivo + branding rapix + share button.
3. **Listado de pedidos**: añade búsqueda por código/cliente, filtros pill, agrupación temporal.
4. **Dashboard**: reemplaza dos tiles solos por métricas de hoy/semana + saldo prominente + último pedido activo.
5. **Tienda**: destaca "más vendido", muestra costo unitario y ahorro, agrega banner con instrucciones de pago (transferencia + concepto + tiempo de confirmación).
6. **Perfil**: añade rating del vendedor, secciones de preferencias, logout en color destructivo, accesos a editar credenciales.

## Archivos de diseño
- `Rapix Rediseño.html` — entry point, abre con cualquier servidor estático
- `screens/tokens.js` — design tokens (colores, fuentes, radii, sombras)
- `screens/icons.jsx` — set de iconos SVG estilo Material outline
- `screens/ui.jsx` — primitivos (Phone, AppBar, BottomNav, EstadoChip, Wordmark)
- `screens/auth.jsx`, `inicio.jsx`, `pedidos.jsx`, `crear.jsx`, `detalle.jsx`, `seguimiento.jsx`, `tienda.jsx`, `perfil.jsx`
- `documentacion_original.txt` — documentación de pantallas actuales (referencia)

## Cómo usar este handoff con Claude Code

```
1. Abre el codebase Flutter de Rapix.
2. Ejecuta: claude-code "Implementa el rediseño descrito en design_handoff_rapix/README.md.
   Usa los tokens de color y tipografía listados. Empieza por la pantalla X. Mantén
   los providers de Riverpod existentes y go_router actual."
3. Comparte el HTML como referencia visual: `Rapix Rediseño.html` muestra ambas
   variantes lado a lado. El equipo decide cuál implementar (recomendación: Refinada
   por defecto, Atrevida para pantallas hero como seguimiento público).
```

## Nota sobre tildes
El proyecto original usa español sin tildes por convención de código. Los **strings de UI ahora usan tildes correctas** (más profesional). Si se prefiere mantener la convención sin tildes, hacer find-replace en las strings antes de implementar.
