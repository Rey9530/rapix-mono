// INICIO — Dashboard. 2 variantes.

// ============================================
// VARIANTE A — Refinada (M3 pulido)
// Mantiene el lenguaje original; añade densidad
// con tarjeta de saldo + métricas + accesos rápidos
// ============================================
const InicioRefinada = () => {
  return (
    <Phone>
      <AppBar
        title="Don Pedro Verduras"
        subtitle="Vendedor • San Salvador"
        leading={<div style={{ width: 36, height: 36, borderRadius: 18, background: RX.greenSoft, color: RX.greenInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>DP</div>}
        trailing={[<IconBtn icon={I.bell} badge="2"/>]}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 16px' }}>
        {/* Saldo Card */}
        <div style={{
          background: RX.surface, borderRadius: 20, padding: 18,
          border: `1px solid ${RX.outline}`, boxShadow: RX.shadowSm,
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.wallet size={20} color={RX.greenDark}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: RX.inkMuted, fontWeight: 500 }}>Saldo de envíos</div>
              <div style={{ fontSize: 11, color: RX.inkSoft }}>2 paquetes activos</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.5, color: RX.ink, lineHeight: 1 }}>34</div>
            <div style={{ fontSize: 14, color: RX.inkMuted, fontWeight: 500 }}>envíos disponibles</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: RX.green, color: '#fff', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>Recargar</div>
            <div style={{ padding: '10px 14px', borderRadius: 12, background: RX.surfaceAlt, color: RX.ink, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <I.box size={16}/>Ver paquetes
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'En tránsito', value: '5', icon: I.truck, color: RX.purpleSoft, fg: RX.purple },
            { label: 'Entregados hoy', value: '12', icon: I.check, color: RX.greenSoft, fg: RX.greenDark },
            { label: 'Pendientes', value: '3', icon: I.clock, color: '#fef3c7', fg: '#b45309' },
            { label: 'Esta semana', value: '47', icon: I.trend, color: RX.infoSoft, fg: RX.info },
          ].map((m, i) => (
            <div key={i} style={{
              background: RX.surface, borderRadius: 16, padding: 14,
              border: `1px solid ${RX.outline}`,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <m.icon size={16} color={m.fg}/>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: RX.ink, lineHeight: 1, letterSpacing: -0.5 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div style={{ fontSize: 13, fontWeight: 600, color: RX.inkMuted, padding: '4px 4px 8px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Acciones rápidas</div>
        <div style={{
          background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`,
          overflow: 'hidden',
        }}>
          {[
            { icon: I.plus, label: 'Nuevo pedido', sub: 'Crea un envío para tus clientes', color: RX.green, bg: RX.greenSoft },
            { icon: I.bag, label: 'Comprar paquetes', sub: 'Recarga envíos prepagados', color: RX.info, bg: RX.infoSoft },
          ].map((a, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={22} color={a.color}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: RX.ink }}>{a.label}</div>
                <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>{a.sub}</div>
              </div>
              <I.chevR size={20} color={RX.inkSoft}/>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="inicio"/>
    </Phone>
  );
};

// ============================================
// VARIANTE B — Atrevida (Hero verde + grandes números)
// Más expresiva, tipografía grande, identidad fuerte
// ============================================
const InicioAtrevida = () => {
  return (
    <Phone bg={RX.green}>
      {/* Top: green hero */}
      <div style={{ background: RX.green, color: '#fff', padding: '0 4px' }}>
        <AppBar
          title={<Wordmark size={20} color="#fff" accent="#fff"/>}
          color="#fff"
          leading={<div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>DP</div>}
          trailing={[<IconBtn icon={I.bell} color="#fff" badge="2"/>]}
        />
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: RX.green, color: '#fff' }}>
        {/* Hero saldo */}
        <div style={{ padding: '4px 24px 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.85, marginBottom: 6 }}>Buenas tardes, Pedro</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9, color: '#fff' }}>34</div>
            <div style={{ fontSize: 16, fontWeight: 500, opacity: 0.9, paddingBottom: 14 }}>envíos<br/>disponibles</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: '#fff' }}/>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>2 paquetes activos</div>
          </div>
        </div>

        {/* White content sheet */}
        <div style={{
          background: RX.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
          color: RX.ink, padding: '20px 16px 24px', minHeight: 320,
        }}>
          {/* CTAs grandes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{
              background: RX.ink, color: '#fff', borderRadius: 20, padding: 16,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: RX.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.plus size={22} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4 }}>Nuevo pedido</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Crear envío</div>
              </div>
            </div>
            <div style={{
              background: RX.surface, color: RX.ink, borderRadius: 20, padding: 16,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110,
              border: `1px solid ${RX.outline}`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I.bag size={20} color={RX.greenDark}/>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Recargar</div>
                <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>Comprar paquete</div>
              </div>
            </div>
          </div>

          {/* Hoy */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Hoy</div>
            <div style={{ fontSize: 12, color: RX.inkMuted, fontWeight: 500 }}>Ver todo →</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { val: '5', lab: 'En camino', dot: RX.purple },
              { val: '12', lab: 'Entregados', dot: RX.green },
              { val: '3', lab: 'Pendientes', dot: '#f59e0b' },
            ].map((m, i) => (
              <div key={i} style={{
                background: RX.surface, borderRadius: 14, padding: '12px 10px',
                border: `1px solid ${RX.outline}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: m.dot }}/>
                  <div style={{ fontSize: 10, color: RX.inkMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{m.lab}</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: RX.ink, lineHeight: 1 }}>{m.val}</div>
              </div>
            ))}
          </div>

          {/* Último pedido */}
          <div style={{
            background: RX.surface, borderRadius: 16, padding: 14, border: `1px solid ${RX.outline}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: RX.purpleSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.truck size={20} color={RX.purple}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: RX.ink, marginBottom: 2 }}>RPX-7K2M9 · María Hernández</div>
              <div style={{ fontSize: 11, color: RX.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Repartidor a 3 cuadras del destino</div>
            </div>
            <EstadoChip estado="EN_REPARTO"/>
          </div>
        </div>
      </div>

      <BottomNav active="inicio"/>
    </Phone>
  );
};

window.InicioRefinada = InicioRefinada;
window.InicioAtrevida = InicioAtrevida;
