// SEGUIMIENTO PÚBLICO — Para destinatarios. Sin login. Gran oportunidad de marca.

// VARIANTE A — Refinada: branded header, mapa, timeline, share
const SeguimientoRefinada = () => {
  const events = [
    { t: 'Pedido creado', s: 'Hoy 14:32', done: true },
    { t: 'Asignado a repartidor', s: 'Hoy 14:35', done: true },
    { t: 'Paquete recogido', s: 'Hoy 14:48', done: true },
    { t: 'En camino a tu dirección', s: 'Hoy 14:52', done: true, active: true },
    { t: 'Entregado', s: '', done: false },
  ];
  return (
    <Phone>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Branded hero */}
        <div style={{ background: RX.green, color: '#fff', padding: '0 4px' }}>
          <AppBar
            title={<Wordmark size={20} color="#fff" accent="#fff"/>}
            color="#fff"
            trailing={[<IconBtn icon={I.share} color="#fff"/>]}
          />
          <div style={{ padding: '8px 20px 24px' }}>
            <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 500, marginBottom: 4 }}>Tu paquete está</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 8 }}>en camino 🛵</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>RPX-7K2M9</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>De Don Pedro Verduras</span>
            </div>
          </div>
        </div>

        {/* ETA card overlap */}
        <div style={{ padding: '0 16px', marginTop: -16 }}>
          <div style={{
            background: RX.surface, borderRadius: 16, padding: 14,
            border: `1px solid ${RX.outline}`, boxShadow: RX.shadowMd,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.clock size={22} color={RX.greenDark}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Llega en aproximadamente</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: RX.ink, letterSpacing: -0.5 }}>8 minutos</div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div style={{ padding: '14px 16px 14px' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${RX.outline}` }}>
            <RXMap height={180}/>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, padding: '0 4px 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Progreso</div>
          <div style={{ background: RX.surface, borderRadius: 16, padding: '16px', border: `1px solid ${RX.outline}` }}>
            {events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 7,
                    background: e.done ? RX.green : RX.outline,
                    border: e.active ? `3px solid ${RX.greenSoft}` : 'none',
                    boxSizing: 'content-box',
                  }}/>
                  {i < events.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 22, background: e.done ? RX.green : RX.outline, opacity: e.done ? 0.4 : 1 }}/>}
                </div>
                <div style={{ flex: 1, paddingBottom: i < events.length - 1 ? 14 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: e.active ? 700 : 600, color: e.done ? RX.ink : RX.inkSoft }}>{e.t}</div>
                  {e.s && <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>{e.s}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer brand */}
        <div style={{ padding: '0 16px 24px', textAlign: 'center', fontSize: 11, color: RX.inkSoft }}>
          Enviado con <Wordmark size={12} accent={RX.green}/>
        </div>
      </div>
    </Phone>
  );
};

// VARIANTE B — Atrevida: full bleed map + bottom sheet, branding fuerte
const SeguimientoAtrevida = () => {
  return (
    <Phone>
      {/* Top brand strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ background: '#fff', borderRadius: 999, padding: '6px 12px', boxShadow: RX.shadowMd, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Wordmark size={14} accent={RX.green}/>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: RX.shadowMd }}>
          <I.share size={18}/>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: '0 0 320px', position: 'relative' }}>
        <RXMap height={320}/>
      </div>

      {/* Bottom sheet */}
      <div style={{
        flex: 1, background: RX.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32,
        marginTop: -32, paddingTop: 12, overflow: 'auto', position: 'relative', zIndex: 1,
        boxShadow: '0 -10px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: RX.outline, margin: '4px auto 16px' }}/>

        <div style={{ padding: '0 20px 20px' }}>
          {/* Hero ETA */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: RX.green, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>EN CAMINO</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: -3, lineHeight: 0.9, color: RX.ink }}>8</span>
              <div style={{ paddingBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: RX.ink }}>minutos</div>
                <div style={{ fontSize: 11, color: RX.inkMuted }}>de Don Pedro Verduras</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: RX.inkSoft, fontFamily: RX.fontMono, fontWeight: 600 }}>RPX-7K2M9 · Para María H.</div>
          </div>

          {/* Driver card */}
          <div style={{
            background: RX.surface, borderRadius: 18, padding: 14,
            border: `1px solid ${RX.outline}`,
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: RX.greenSoft, color: RX.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>JR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600 }}>Tu repartidor</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: RX.ink }}>Juan Ramírez</div>
            </div>
            <div style={{ background: RX.green, color: '#fff', padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
              <I.phone size={14} color="#fff"/>Llamar
            </div>
          </div>

          {/* Steps compact */}
          <div style={{
            background: RX.surface, borderRadius: 16, padding: '14px 16px',
            border: `1px solid ${RX.outline}`,
          }}>
            {[
              { t: 'Pedido recibido', s: '14:32', done: true },
              { t: 'Recogido en tienda', s: '14:48', done: true },
              { t: 'En camino', s: 'Ahora', done: true, active: true },
              { t: 'Entregado', s: '~16:08', done: false },
            ].map((e, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '6px 0' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: e.done ? RX.green : RX.outlineSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: e.active ? `3px solid ${RX.greenSoft}` : 'none',
                  boxSizing: 'content-box',
                }}>
                  {e.done && <I.check size={12} color="#fff" sw={3}/>}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: e.active ? 700 : 500, color: e.done ? RX.ink : RX.inkMuted }}>{e.t}</div>
                <div style={{ fontSize: 11, color: e.active ? RX.green : RX.inkSoft, fontWeight: e.active ? 700 : 500 }}>{e.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
};

window.SeguimientoRefinada = SeguimientoRefinada;
window.SeguimientoAtrevida = SeguimientoAtrevida;
