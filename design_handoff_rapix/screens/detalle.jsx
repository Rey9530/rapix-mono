// DETALLE DE PEDIDO — 2 variantes

const RXMapInner = ({ height = 200, withTrack = true }) => (
  <div style={{ height, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #d8e6db 0%, #c2d6c8 100%)' }}>
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <path d="M-20 70 L420 100" stroke="#fff" strokeWidth="16" opacity="0.6"/>
      <path d="M50 -10 L110 280" stroke="#fff" strokeWidth="12" opacity="0.6"/>
      <path d="M230 -10 L290 280" stroke="#fff" strokeWidth="12" opacity="0.6"/>
      <path d="M-20 160 L420 180" stroke="#fff" strokeWidth="8" opacity="0.5"/>
      <path d="M-20 220 L420 230" stroke="#fff" strokeWidth="8" opacity="0.5"/>
      <path d="M340 -10 L370 280" stroke="#fff" strokeWidth="8" opacity="0.4"/>
      {withTrack && <path d="M70 165 Q160 110, 240 130 T 290 80" stroke={RX.green} strokeWidth="3" fill="none" strokeDasharray="6 4"/>}
    </svg>
    {withTrack && (
      <>
        {/* Origin */}
        <div style={{ position: 'absolute', left: '18%', top: '70%' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: RX.ink, border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}/>
        </div>
        {/* Driver */}
        <div style={{ position: 'absolute', left: '60%', top: '52%' }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: RX.green, border: '3px solid #fff', boxShadow: '0 4px 10px rgba(37,178,118,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I.truck size={18} color="#fff"/>
          </div>
        </div>
        {/* Destination */}
        <div style={{ position: 'absolute', left: '76%', top: '32%', transform: 'translate(-50%, -100%)' }}>
          <I.pinSolid size={32} color={RX.danger}/>
        </div>
      </>
    )}
  </div>
);

// VARIANTE A — Refinada: scroll vertical, mapa, secciones limpias
const DetalleRefinada = () => {
  const events = [
    { t: 'Recogido', s: 'Hoy 14:48', done: true },
    { t: 'En tránsito', s: 'Hoy 14:52', done: true, active: true },
    { t: 'En reparto', s: '~ ETA 8 min', done: false },
    { t: 'Entregado', s: '', done: false },
  ];
  return (
    <Phone>
      <AppBar
        title={<span style={{ fontFamily: RX.fontMono, fontSize: 15 }}>RPX-7K2M9</span>}
        leading={<I.back size={22}/>}
        trailing={[<IconBtn icon={I.share}/>, <IconBtn icon={I.refresh}/>]}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 0 16px' }}>
        {/* Estado banner */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            background: RX.purpleSoft, borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: RX.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.truck size={20} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: RX.purple, fontWeight: 700 }}>EN REPARTO</div>
              <div style={{ fontSize: 12, color: RX.ink, fontWeight: 500 }}>Llega en aprox. 8 minutos</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: RX.purple, letterSpacing: -0.5 }}>8m</div>
          </div>
        </div>

        {/* Mapa */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${RX.outline}` }}>
            <RXMapInner height={200}/>
          </div>
        </div>

        {/* Repartidor */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ background: RX.surface, borderRadius: 16, padding: 14, border: `1px solid ${RX.outline}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: RX.greenSoft, color: RX.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>JR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: RX.ink }}>Juan Ramírez</div>
              <div style={{ fontSize: 12, color: RX.inkMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                <I.star size={12} color="#f59e0b"/>4.9 · Moto azul · P-2847
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.phone size={18} color={RX.greenDark}/>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.message size={18} color={RX.greenDark}/>
            </div>
          </div>
        </div>

        {/* Datos */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, overflow: 'hidden' }}>
            {[
              { l: 'Cliente', v: 'María Hernández', s: '+503 7892 1340', ic: I.user },
              { l: 'Destino', v: 'Av. La Capilla #142', s: 'Col. Escalón', ic: I.pin },
              { l: 'Pago', v: 'Contra entrega', s: '$24.50', ic: I.cash },
            ].map((r, i, arr) => (
              <div key={i} style={{ padding: '12px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none', display: 'flex', gap: 12, alignItems: 'center' }}>
                <r.ic size={18} color={RX.inkMuted}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{r.l}</div>
                  <div style={{ fontSize: 14, color: RX.ink, fontWeight: 600 }}>{r.v}</div>
                </div>
                <div style={{ fontSize: 12, color: RX.inkMuted, fontWeight: 500 }}>{r.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, padding: '0 4px 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Línea de tiempo</div>
          <div style={{ background: RX.surface, borderRadius: 16, padding: '16px 16px 12px', border: `1px solid ${RX.outline}` }}>
            {events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 7,
                    background: e.done ? RX.green : RX.outline,
                    border: e.active ? `3px solid ${RX.greenSoft}` : 'none',
                    boxSizing: 'content-box',
                  }}/>
                  {i < events.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: e.done ? RX.green : RX.outline, opacity: e.done ? 0.4 : 1 }}/>}
                </div>
                <div style={{ flex: 1, paddingBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: e.done ? RX.ink : RX.inkMuted }}>{e.t}</div>
                  <div style={{ fontSize: 12, color: RX.inkSoft, marginTop: 2 }}>{e.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
};

// VARIANTE B — Atrevida: mapa fullbleed, bottom sheet, hero ETA
const DetalleAtrevida = () => {
  return (
    <Phone>
      {/* Top bar floating over map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, padding: '12px 12px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: RX.shadowMd }}>
            <I.back size={20}/>
          </div>
          <div style={{ flex: 1, height: 40, borderRadius: 20, background: '#fff', boxShadow: RX.shadowMd, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: RX.green, textTransform: 'uppercase', letterSpacing: 0.5 }}>RPX-7K2M9</span>
            <div style={{ width: 1, height: 16, background: RX.outline }}/>
            <EstadoChip estado="EN_REPARTO"/>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: RX.shadowMd }}>
            <I.share size={18}/>
          </div>
        </div>
      </div>

      {/* Full map */}
      <div style={{ flex: '0 0 350px', position: 'relative' }}>
        <RXMapInner height={350}/>
        {/* ETA badge */}
        <div style={{
          position: 'absolute', bottom: 24, left: 16,
          background: RX.ink, color: '#fff', borderRadius: 20,
          padding: '8px 14px 8px 12px', display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: RX.shadowLg,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: RX.green, boxShadow: `0 0 0 4px ${RX.green}33` }}/>
          <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>ETA</span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>8 min</span>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{
        flex: 1, background: RX.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        marginTop: -28, paddingTop: 12, overflow: 'auto', position: 'relative', zIndex: 1,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: RX.outline, margin: '4px auto 14px' }}/>

        <div style={{ padding: '0 18px 16px' }}>
          {/* Hero info */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>Para</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: RX.ink, letterSpacing: -0.6 }}>María Hernández</div>
              <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>Av. La Capilla #142, Escalón</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cobrar</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: RX.green, letterSpacing: -0.5 }}>$24.50</div>
            </div>
          </div>

          {/* Driver pill */}
          <div style={{
            background: RX.ink, color: '#fff', borderRadius: 18, padding: 14,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: RX.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>JR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Juan Ramírez</div>
              <div style={{ fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <I.star size={11} color="#fbbf24"/>4.9 · Moto P-2847
              </div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: RX.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.phone size={18} color="#fff"/>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.message size={18} color="#fff"/>
            </div>
          </div>

          {/* Mini timeline horizontal */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8 }}>
              {['Creado','Recogido','En reparto','Entregado'].map((t, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    width: 12, height: 12, borderRadius: 6,
                    background: i <= 2 ? RX.green : RX.outline,
                    border: i === 2 ? `3px solid ${RX.greenSoft}` : 'none',
                    boxSizing: 'content-box',
                    flexShrink: 0,
                  }}/>
                  {i < 3 && <div style={{ flex: 1, height: 2, background: i < 2 ? RX.green : RX.outline }}/>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: RX.inkMuted, fontWeight: 600 }}>
              <span>14:32</span><span>14:48</span><span style={{ color: RX.green }}>Ahora</span><span>~16:08</span>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
};

window.DetalleRefinada = DetalleRefinada;
window.DetalleAtrevida = DetalleAtrevida;
window.RXMap = RXMapInner;
