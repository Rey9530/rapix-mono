// LISTADO DE PEDIDOS — 2 variantes

const PEDIDOS_DATA = [
  { code: 'RPX-7K2M9', cliente: 'María Hernández', dir: 'Col. Escalón, Av. La Capilla #142', fecha: 'Hoy 14:32', estado: 'EN_REPARTO', monto: 24.50, eta: '8 min' },
  { code: 'RPX-3X8L1', cliente: 'José Martínez', dir: 'San Benito, Pje. Los Pinos #7', fecha: 'Hoy 13:15', estado: 'EN_TRANSITO', monto: null, eta: '24 min' },
  { code: 'RPX-9P4Q2', cliente: 'Ana Lucía Rivas', dir: 'Antiguo Cuscatlán, Res. Buenos Aires', fecha: 'Hoy 12:48', estado: 'ASIGNADO', monto: 18.00, eta: null },
  { code: 'RPX-1B6T7', cliente: 'Carlos Pérez', dir: 'Col. San Francisco, Calle 5', fecha: 'Hoy 11:20', estado: 'ENTREGADO', monto: 35.75, eta: null },
  { code: 'RPX-4M2N8', cliente: 'Sofía Mendoza', dir: 'Santa Tecla, Calle El Pedregal', fecha: 'Hoy 10:05', estado: 'PENDIENTE_ASIGNACION', monto: 12.00, eta: null },
  { code: 'RPX-6Y3W4', cliente: 'Luis Romero', dir: 'Col. Médica, 25 Av. Norte', fecha: 'Ayer 18:42', estado: 'ENTREGADO', monto: 42.50, eta: null },
  { code: 'RPX-2H5V9', cliente: 'Patricia Cruz', dir: 'Soyapango, Res. Las Flores', fecha: 'Ayer 15:30', estado: 'FALLIDO', monto: null, eta: null },
];

// ============================================
// VARIANTE A — Refinada: lista limpia, búsqueda, filtros pills
// ============================================
const PedidosRefinada = () => {
  return (
    <Phone>
      <AppBar
        title="Mis pedidos"
        subtitle="47 esta semana · 12 hoy"
        leading={<I.list size={22}/>}
        trailing={[<IconBtn icon={I.search}/>]}
      />

      {/* Search bar */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', background: RX.surfaceAlt, borderRadius: 14,
        }}>
          <I.search size={18} color={RX.inkMuted}/>
          <span style={{ fontSize: 14, color: RX.inkMuted, flex: 1 }}>Buscar por código o cliente</span>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
        {[
          { label: 'Todos', count: 47, active: true },
          { label: 'Activos', count: 8, active: false },
          { label: 'Entregados', count: 35, active: false },
          { label: 'Fallidos', count: 1, active: false },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 999,
            background: f.active ? RX.ink : RX.surface,
            color: f.active ? '#fff' : RX.ink,
            border: `1px solid ${f.active ? RX.ink : RX.outline}`,
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {f.label}
            <span style={{ fontSize: 11, opacity: 0.7 }}>{f.count}</span>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 96px' }}>
        {PEDIDOS_DATA.map((p, i) => (
          <div key={i} style={{
            background: RX.surface, borderRadius: 14, padding: 12,
            border: `1px solid ${RX.outline}`, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: RX_ESTADOS[p.estado].bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <I.box size={20} color={RX_ESTADOS[p.estado].fg}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: RX.ink, fontFamily: RX.fontMono }}>{p.code}</span>
                <EstadoChip estado={p.estado}/>
              </div>
              <div style={{ fontSize: 13, color: RX.ink, fontWeight: 500, marginBottom: 2 }}>{p.cliente}</div>
              <div style={{ fontSize: 11, color: RX.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{p.dir}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: RX.inkSoft }}>
                <span>{p.fecha}</span>
                {p.monto && <span>· <span style={{ fontWeight: 600, color: RX.ink }}>${p.monto.toFixed(2)}</span></span>}
                {p.eta && <span>· <span style={{ color: RX.green, fontWeight: 600 }}>ETA {p.eta}</span></span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{
        position: 'absolute', right: 16, bottom: 78,
        background: RX.green, color: '#fff', borderRadius: 16,
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 20px rgba(37,178,118,0.4)',
        fontWeight: 600, fontSize: 14,
      }}>
        <I.plus size={20}/>
        Nuevo
      </div>

      <BottomNav active="pedidos"/>
    </Phone>
  );
};

// ============================================
// VARIANTE B — Atrevida: agrupado por día, ETA visual, monos para códigos
// ============================================
const PedidosAtrevida = () => {
  const hoy = PEDIDOS_DATA.filter(p => p.fecha.startsWith('Hoy'));
  const ayer = PEDIDOS_DATA.filter(p => p.fecha.startsWith('Ayer'));

  const Tarjeta = ({ p }) => {
    const e = RX_ESTADOS[p.estado];
    const isActive = ['ASIGNADO','EN_TRANSITO','EN_REPARTO','RECOGIDO'].includes(p.estado);
    return (
      <div style={{
        background: RX.surface, borderRadius: 18, padding: 14,
        border: `1px solid ${RX.outline}`, marginBottom: 8,
        display: 'flex', flexDirection: 'column', gap: 10,
        position: 'relative', overflow: 'hidden',
      }}>
        {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: e.dot }}/>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: RX.inkSoft, fontFamily: RX.fontMono, letterSpacing: 0.5 }}>{p.code}</span>
          <EstadoChip estado={p.estado}/>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: RX.ink, letterSpacing: -0.3 }}>{p.cliente}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <I.pin size={12} color={RX.inkSoft}/>
            <div style={{ fontSize: 12, color: RX.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.dir}</div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 10, borderTop: `1px solid ${RX.outlineSoft}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: RX.inkMuted }}>
            <I.clock size={14}/>{p.fecha.replace('Hoy ', '').replace('Ayer ', '')}
          </div>
          {p.eta ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: RX.greenDark }}>
              <I.flame size={14} color={RX.green}/>ETA {p.eta}
            </div>
          ) : p.monto ? (
            <div style={{ fontSize: 14, fontWeight: 700, color: RX.ink, letterSpacing: -0.2 }}>${p.monto.toFixed(2)}</div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <Phone>
      <div style={{ padding: '0 4px' }}>
        <AppBar
          title="Pedidos"
          leading={<I.list size={22}/>}
          trailing={[<IconBtn icon={I.filter}/>, <IconBtn icon={I.search}/>]}
        />
      </div>

      {/* Stat strip */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: RX.ink, color: '#fff', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2, fontWeight: 500 }}>Activos ahora</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>8</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>en ruta</span>
          </div>
        </div>
        <div style={{ flex: 1, background: RX.greenSoft, color: RX.greenInk, borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, color: RX.greenDark, marginBottom: 2, fontWeight: 600 }}>Hoy</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>12</span>
            <span style={{ fontSize: 11, color: RX.greenDark }}>entregados</span>
          </div>
        </div>
      </div>

      {/* Filter chips horizontal */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {['Todos', 'En reparto', 'En tránsito', 'Pendientes', 'Entregados'].map((l, i) => (
          <div key={i} style={{
            padding: '6px 12px', borderRadius: 999,
            background: i === 0 ? RX.green : 'transparent',
            color: i === 0 ? '#fff' : RX.inkMuted,
            border: i === 0 ? 'none' : `1px solid ${RX.outline}`,
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>{l}</div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 96px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkSoft, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 4px 8px' }}>HOY · {hoy.length}</div>
        {hoy.map((p, i) => <Tarjeta key={i} p={p}/>)}
        <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkSoft, textTransform: 'uppercase', letterSpacing: 1, padding: '12px 4px 8px' }}>AYER · {ayer.length}</div>
        {ayer.map((p, i) => <Tarjeta key={i} p={p}/>)}
      </div>

      <div style={{
        position: 'absolute', right: 16, bottom: 78,
        width: 56, height: 56, borderRadius: 18, background: RX.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 24px rgba(37,178,118,0.45)',
      }}>
        <I.plus size={26} color="#fff"/>
      </div>

      <BottomNav active="pedidos"/>
    </Phone>
  );
};

window.PedidosRefinada = PedidosRefinada;
window.PedidosAtrevida = PedidosAtrevida;
