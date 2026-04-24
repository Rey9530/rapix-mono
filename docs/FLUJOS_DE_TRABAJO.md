# Flujos de Trabajo

Este documento describe los flujos operativos principales del sistema usando diagramas Mermaid y descripciones paso a paso.

## 1. Flujo Completo de un Pedido

```mermaid
flowchart TD
    A[Vendedor crea pedido] --> B{¿Tiene paquete recargado activo?}
    B -- Sí --> C[Descuenta 1 envío del paquete]
    B -- No --> D[Calcula costo: $3 por envío]
    C --> E[Resolver zona origen y destino por coordenadas]
    D --> E
    E --> F[Estado: PENDIENTE_ASIGNACION]
    F --> G[Asignación automática o manual de Repartidor de zona origen]
    G --> H[Notifica a Repartidor Recogida - Push]
    H --> I[Repartidor recoge en tienda]
    I --> J[Estado: RECOGIDO]
    J --> J2[Repartidor marca inicio de viaje]
    J2 --> J3[Estado: EN_TRANSITO]
    J3 --> K[Repartidor llega al Punto de Intercambio]
    K --> L[Estado: EN_PUNTO_INTERCAMBIO]
    L --> M{¿Zona destino = Zona origen?}
    M -- Sí --> N[Mismo Repartidor continúa]
    M -- No --> O[Repartidor de zona destino toma el paquete]
    N --> P[Estado: EN_REPARTO]
    O --> P
    P --> Q[Repartidor entrega al cliente final]
    Q --> R{¿Entrega exitosa?}
    R -- Sí --> S[Sube foto + firma]
    R -- No --> T[Estado: FALLIDO, siguienteAccion]
    S --> U[Estado: ENTREGADO]
    U --> V[Notifica a Vendedor y Cliente]
    T --> W{¿Reprogramar o devolver?}
    W -- Reprogramar --> H
    W -- Devolver --> X[Estado: DEVUELTO]
```

### Descripción detallada

| # | Paso | Actor | Estado resultante |
|---|------|-------|-------------------|
| 1 | Crear pedido | Vendedor | `PENDIENTE_ASIGNACION` |
| 2 | Asignar repartidor (auto/manual) | Admin / Sistema | `ASIGNADO` |
| 3 | Recoger paquete en tienda | Repartidor origen | `RECOGIDO` |
| 4 | Marcar inicio de viaje al punto de intercambio | Repartidor origen | `EN_TRANSITO` |
| 5 | Llegar a punto de intercambio | Repartidor origen | `EN_PUNTO_INTERCAMBIO` |
| 6 | Repartidor destino lo toma | Repartidor destino | `EN_REPARTO` |
| 7 | Entrega efectiva | Repartidor destino | `ENTREGADO` |
| 7b | Entrega fallida | Repartidor destino | `FALLIDO` |
| 8 | Devolución al vendedor | Repartidor | `DEVUELTO` |

> **Nota sobre `EN_TRANSITO`**: es un estado **obligatorio** entre `RECOGIDO` y `EN_PUNTO_INTERCAMBIO`. El repartidor lo dispara con `POST /pedidos/:id/en-transito` al iniciar el trayecto. Habilita la notificación al cliente "tu pedido está en camino" (ver `NOTIFICACIONES.md` evento `PEDIDO_EN_TRANSITO`).
>
> **Cancelaciones**: solo permitidas desde `PENDIENTE_ASIGNACION` o `ASIGNADO`. Una vez en `RECOGIDO` o posterior, el flujo termina en `ENTREGADO`, `FALLIDO` o `DEVUELTO` — no hay transición a `CANCELADO`.

---

## 2. Flujo de Asignación por Zonas

```mermaid
flowchart LR
    A[Nuevo Pedido] --> B[Extrae lat/lng origen]
    B --> C[Consulta zonas activas]
    C --> D{ST_Contains polígono?}
    D -- Sí --> E[Asigna Zona Origen]
    D -- No --> F[Error: PEDIDO_ZONA_INVALIDA]
    E --> G[Busca repartidores disponibles en esa zona]
    G --> H{¿Hay repartidores?}
    H -- Sí --> I[Selecciona repartidor con menor carga]
    H -- No --> J[Deja en pool sin asignar]
    I --> K[Asigna repartidorRecogidaId]
    J --> K
```

**Algoritmo de selección de repartidor**:
1. Filtrar repartidores de la zona con `disponible = true`.
2. Ordenar por cantidad de pedidos activos (`RECOGIDO` + `EN_TRANSITO`) ascendente.
3. Desempate: mejor `calificacion`.
4. Si todos están saturados (> 15 pedidos activos), encolar para reintento.

---

## 3. Flujo de Recolección y Redistribución

```mermaid
sequenceDiagram
    participant V as Vendedor
    participant RO as Repartidor Origen (Zona A)
    participant PE as Punto Intercambio
    participant RD as Repartidor Destino (Zona C)
    participant C as Cliente Final

    V->>RO: Paquete disponible (notif)
    RO->>V: Recoge paquete (RECOGIDO)
    RO->>RO: Marca EN_TRANSITO
    RO->>PE: Lleva paquete al punto
    RO->>RO: Marca EN_PUNTO_INTERCAMBIO
    RD->>PE: Llega al punto, revisa paquetes de su zona
    RD->>RD: tomar-entrega (EN_REPARTO)
    RD->>C: Entrega paquete
    C->>RD: Firma / recibe
    RD->>RD: Foto + firma (ENTREGADO)
```

---

## 4. Flujo de Cierre Financiero Diario

```mermaid
flowchart TD
    A[Repartidor termina el día] --> B[Sistema calcula montoEsperado]
    B --> C[Suma montoContraEntrega de todos los ENTREGADO hoy]
    C --> D[Repartidor ve resumen en app]
    D --> E[Repartidor ingresa montoReportado]
    E --> F[Repartidor sube foto del comprobante]
    F --> G[POST /cierres-financieros]
    G --> H{¿montoEsperado == montoReportado?}
    H -- Sí --> I[Estado: PENDIENTE_REVISION]
    H -- No --> J[Estado: CON_DISCREPANCIA]
    I --> K[Admin revisa]
    J --> K
    K --> L{¿Aprobado?}
    L -- Sí --> M[Estado: APROBADO]
    L -- No --> N[Estado: RECHAZADO con motivo]
    N --> O[Repartidor debe corregir / justificar]
```

**Reglas**:
- Solo 1 cierre por repartidor por día (índice único en BD).
- Si hay discrepancia, el admin puede:
  - Aprobar con nota (ej: el repartidor pagó la diferencia).
  - Rechazar y pedir corrección.
  - Escalar a RR.HH. si es recurrente.

---

## 5. Flujo de Compra de Paquete Prepago

```mermaid
flowchart LR
    A[Vendedor consulta paquetes disponibles] --> B[Selecciona: 100 envíos x $250]
    B --> C[POST /paquetes-recargados/comprar]
    C --> D[Sistema registra PaqueteRecargado]
    D --> E[Incrementa saldoRecargado del Vendedor en 100]
    E --> F[Envía comprobante por email]
    F --> G[Cuando crea pedido → descuenta 1 del paquete]
    G --> H{¿enviosRestantes == 0?}
    H -- Sí --> I[Estado: AGOTADO]
    H -- No --> J[Sigue activo]
```

### Lógica de cobro al crear pedido

```typescript
async function resolverFacturacion(vendedor: PerfilVendedor) {
  const paqueteActivo = await prisma.paqueteRecargado.findFirst({
    where: { vendedorId: vendedor.id, estado: 'ACTIVO', enviosRestantes: { gt: 0 } },
    orderBy: { compradoEn: 'asc' }, // FIFO
  });

  if (paqueteActivo) {
    return {
      modoFacturacion: 'PAQUETE',
      paqueteRecargadoId: paqueteActivo.id,
      costoEnvio: 0,
    };
  }

  return {
    modoFacturacion: 'POR_ENVIO',
    costoEnvio: 3.00, // vendrá de ReglaTarifa
  };
}
```

---

## 6. Flujo de Autenticación (JWT)

```mermaid
sequenceDiagram
    participant C as Cliente (App/Web)
    participant API as Backend NestJS
    participant DB as PostgreSQL

    C->>API: POST /autenticacion/iniciar-sesion {email, contrasena}
    API->>DB: buscarUsuario + verificarContrasena
    DB-->>API: usuario válido
    API->>API: Firma tokenAcceso (15m) + tokenRefresco (7d)
    API->>DB: Guarda tokenRefresco
    API-->>C: {tokenAcceso, tokenRefresco, usuario}

    Note over C,API: Peticiones subsecuentes
    C->>API: GET /pedidos (Authorization: Bearer tokenAcceso)
    API->>API: Valida token de acceso
    API-->>C: 200 OK

    Note over C,API: Expiración
    C->>API: GET /pedidos (tokenAcceso expirado)
    API-->>C: 401
    C->>API: POST /autenticacion/refrescar {tokenRefresco}
    API->>DB: Verifica tokenRefresco válido
    API-->>C: Nuevo tokenAcceso
```

---

## 7. Flujo de Tracking Público (Cliente Final)

```mermaid
flowchart LR
    A[Cliente recibe WhatsApp con link] --> B[Abre /seguimiento/DEL-2025-00342]
    B --> C[Web público sin login]
    C --> D[GET /pedidos/seguimiento/:codigo]
    D --> E[Muestra mapa + línea de tiempo + estado actual]
    E --> F[Polling cada 30s o WebSocket]
    F --> G[Actualiza posición del repartidor cuando aplique]
```

---

## 8. Máquina de Estados de Pedido (Transiciones Válidas)

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE_ASIGNACION
    PENDIENTE_ASIGNACION --> ASIGNADO: asignar
    PENDIENTE_ASIGNACION --> CANCELADO: cancelar
    ASIGNADO --> RECOGIDO: recoger
    ASIGNADO --> CANCELADO: cancelar
    RECOGIDO --> EN_TRANSITO: en-transito
    EN_TRANSITO --> EN_PUNTO_INTERCAMBIO: llegar-intercambio
    EN_PUNTO_INTERCAMBIO --> EN_REPARTO: tomar-entrega
    EN_REPARTO --> ENTREGADO: entregar
    EN_REPARTO --> FALLIDO: fallar
    FALLIDO --> EN_REPARTO: reprogramar
    FALLIDO --> DEVUELTO: devolver
    ENTREGADO --> [*]
    CANCELADO --> [*]
    DEVUELTO --> [*]
```

**Tabla de transiciones permitidas**:

| Desde | Hacia | Quién puede |
|-------|-------|-------------|
| PENDIENTE_ASIGNACION | ASIGNADO | Admin / Sistema |
| PENDIENTE_ASIGNACION | CANCELADO | Vendedor / Admin |
| ASIGNADO | RECOGIDO | Repartidor asignado |
| ASIGNADO | CANCELADO | Vendedor / Admin |
| RECOGIDO | EN_TRANSITO | Repartidor origen |
| EN_TRANSITO | EN_PUNTO_INTERCAMBIO | Repartidor origen |
| EN_PUNTO_INTERCAMBIO | EN_REPARTO | Repartidor destino |
| EN_REPARTO | ENTREGADO | Repartidor destino |
| EN_REPARTO | FALLIDO | Repartidor destino |
| FALLIDO | EN_REPARTO | Admin / Repartidor |
| FALLIDO | DEVUELTO | Admin / Repartidor |

Cualquier otra transición debe rechazarse con `PEDIDO_TRANSICION_INVALIDA`. En particular: no se permite cancelar (`→ CANCELADO`) desde `RECOGIDO`, `EN_TRANSITO`, `EN_PUNTO_INTERCAMBIO` ni `EN_REPARTO`; estos casos deben resolverse vía `FALLIDO → DEVUELTO`.

---

## 9. Flujo de Notificaciones

```mermaid
flowchart TD
    A[Evento de dominio: PedidoEstadoCambiado] --> B["@OnEvent handler (in-process)"]
    B --> C[Determina destinatarios y canales]
    C --> D[Crea fila en notificaciones estado=PENDIENTE]
    D --> E{Canal}
    E -- PUSH --> G[FCM]
    E -- WHATSAPP --> I[WhatsApp Cloud API]
    E -- EMAIL --> J[SMTP nodemailer]
    G --> K[Update notificaciones.estado=ENVIADO/FALLIDO]
    I --> K
    J --> K
```

> Sin colas (BullMQ removido). El envío ocurre en el mismo proceso que dispara el evento; si falla queda como `FALLIDO` en BD para reintento manual o por job programado.

### Matriz de Notificaciones

| Evento | Vendedor | Repartidor | Cliente Final | Admin |
|--------|----------|------------|---------------|-------|
| Pedido creado | Email | - | WhatsApp + link seguimiento | - |
| Pedido asignado | Push | Push | - | - |
| Recogido | Push | - | WhatsApp + Push | - |
| En tránsito | - | - | Push/WhatsApp | - |
| Entregado | Push + Email | - | Email | - |
| Fallido | Push | - | WhatsApp | Push |
| Discrepancia cierre | - | Push | - | Push + Email |

---

> Ver también: [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) para los endpoints que disparan cada flujo.
