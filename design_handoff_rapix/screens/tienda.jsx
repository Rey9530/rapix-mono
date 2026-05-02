// TIENDA DE PAQUETES — 2 variantes

const PAQUETES = [
  { nombre: 'Inicial', envios: 10, precio: 25, costo: 2.50, dias: 30, badge: null },
  { nombre: 'Negocio', envios: 50, precio: 100, costo: 2.00, dias: 60, badge: 'Más vendido' },
  { nombre: 'Pro', envios: 150, precio: 270, costo: 1.80, dias: 90, badge: 'Mejor precio' },
  { nombre: 'Empresarial', envios: 500, precio: 800, costo: 1.60, dias: 180, badge: null },
];

// VARIANTE A — Refinada: tarjetas claras, badge destacado, ahorro visible
const TiendaRefinada = () => {
  return (
    <Phone>
      <AppBar
        title="Comprar paquetes"
        subtitle="Saldo actual: 34 envíos"
        leading={<I.back size={22}/>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 16px' }}>
        {/* Banner ahorro */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: 16, padding: 14, marginBottom: 14,
          border: `1px solid ${RX.greenSoft}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: RX.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.spark size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: RX.greenInk }}>Ahorra hasta 36% por envío</div>
            <div style={{ fontSize: 11, color: RX.greenDark, marginTop: 1 }}>Compra paquetes más grandes para mejor tarifa</div>
          </div>
        </div>

        {PAQUETES.map((p, i) => {
          const featured = p.badge === 'Más vendido';
          return (
            <div key={i} style={{
              background: featured ? RX.ink : RX.surface,
              color: featured ? '#fff' : RX.ink,
              borderRadius: 16, padding: 16, marginBottom: 10,
              border: featured ? 'none' : `1px solid ${RX.outline}`,
              position: 'relative',
            }}>
              {p.badge && (
                <div style={{
                  position: 'absolute', top: -8, right: 14,
                  background: featured ? RX.green : RX.greenSoft,
                  color: featured ? '#fff' : RX.greenDark,
                  fontSize: 10, fontWeight: 700, padding: '4px 10px',
                  borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{p.badge}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: featured ? 'rgba(255,255,255,0.1)' : RX.greenSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I.box size={22} color={featured ? '#fff' : RX.greenDark}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Paquete {p.nombre}</div>
                  <div style={{ fontSize: 12, opacity: featured ? 0.7 : 1, color: featured ? '#fff' : RX.inkMuted, marginTop: 2 }}>
                    {p.envios} envíos · Válido {p.dias} días
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>${p.precio}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>${p.costo.toFixed(2)} c/u</div>
                </div>
              </div>
              <div style={{
                background: featured ? RX.green : RX.surfaceAlt,
                color: featured ? '#fff' : RX.ink,
                padding: '10px', borderRadius: 12, textAlign: 'center',
                fontWeight: 700, fontSize: 14,
              }}>Comprar</div>
            </div>
          );
        })}
      </div>
    </Phone>
  );
};

// VARIANTE B — Atrevida: comparador horizontal, slider mental
const TiendaAtrevida = () => {
  return (
    <Phone>
      <div style={{ padding: '0 4px' }}>
        <AppBar title="Recargar envíos" leading={<I.back size={22}/>}/>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {/* Hero saldo */}
        <div style={{
          background: RX.ink, color: '#fff', borderRadius: 20, padding: 18,
          marginBottom: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Saldo actual</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>34</span>
            <span style={{ fontSize: 14, opacity: 0.7 }}>envíos</span>
          </div>
          <div style={{ marginTop: 10, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '34%', height: '100%', background: RX.green }}/>
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>Recomendamos recargar antes de quedar bajo</div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, marginBottom: 10, letterSpacing: -0.2 }}>Elige tu paquete</div>

        {/* Big featured */}
        <div style={{
          background: 'linear-gradient(135deg, #25b276 0%, #1a8f5d 100%)',
          color: '#fff', borderRadius: 20, padding: 18, marginBottom: 12,
          position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.15 }} width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="50" stroke="#fff" strokeWidth="2" fill="none"/>
            <circle cx="70" cy="70" r="30" stroke="#fff" strokeWidth="2" fill="none"/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ background: '#fff', color: RX.green, fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.6 }}>Más vendido</div>
            <I.flame size={14} color="#fff"/>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, marginBottom: 2 }}>Paquete Negocio</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 14 }}>50 envíos · Válido 60 días</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>$100</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>$2.00 por envío</div>
            </div>
            <div style={{ background: '#fff', color: RX.greenDark, padding: '12px 18px', borderRadius: 14, fontWeight: 700, fontSize: 14 }}>Comprar →</div>
          </div>
        </div>

        {/* Otros como tabla */}
        <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, overflow: 'hidden' }}>
          {PAQUETES.filter(p => p.badge !== 'Más vendido').map((p, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: RX.ink }}>Paquete {p.nombre}</span>
                  {p.badge && <span style={{ fontSize: 9, fontWeight: 700, color: RX.green, textTransform: 'uppercase', letterSpacing: 0.5, background: RX.greenSoft, padding: '2px 6px', borderRadius: 999 }}>{p.badge}</span>}
                </div>
                <div style={{ fontSize: 11, color: RX.inkMuted, marginTop: 2 }}>{p.envios} envíos · ${p.costo.toFixed(2)} c/u</div>
              </div>
              <div style={{ flex: 1 }}/>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: RX.ink, letterSpacing: -0.3 }}>${p.precio}</div>
              </div>
              <I.chevR size={18} color={RX.inkSoft}/>
            </div>
          ))}
        </div>

        {/* Pago info */}
        <div style={{
          marginTop: 14, padding: 12, borderRadius: 12,
          background: '#fef9c3', display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <I.alert size={16} color="#a16207"/>
          <div style={{ flex: 1, fontSize: 11, color: '#713f12', lineHeight: 1.5 }}>
            <strong>Cómo pagar:</strong> Transfiere al BAC #1234-5678-90 con concepto del paquete. El admin confirmará tu pago en máx. 30 minutos.
          </div>
        </div>
      </div>
    </Phone>
  );
};

window.TiendaRefinada = TiendaRefinada;
window.TiendaAtrevida = TiendaAtrevida;
