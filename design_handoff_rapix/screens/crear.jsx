// CREAR PEDIDO — 2 variantes. Resuelve fricción del URL Google Maps.

// ============================================
// VARIANTE A — Refinada: form clásico mejorado, mapa embebido,
// foto ya añadida, validación visible, CTA fijo
// ============================================
const CrearRefinada = () => {
  const Section = ({ children, title, num }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 10px' }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: RX.greenSoft, color: RX.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{num}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</div>
      </div>
      <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, overflow: 'hidden' }}>{children}</div>
    </div>
  );

  const Field = ({ label, value, icon: IcEl, hint, last, error }) => (
    <div style={{
      padding: '12px 14px',
      borderBottom: last ? 'none' : `1px solid ${RX.outlineSoft}`,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      {IcEl && <div style={{ paddingTop: 2 }}><IcEl size={18} color={RX.inkMuted}/></div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
        <div style={{ fontSize: 15, color: value ? RX.ink : RX.inkSoft, fontWeight: value ? 500 : 400 }}>{value || hint}</div>
        {error && <div style={{ fontSize: 11, color: RX.danger, marginTop: 3 }}>{error}</div>}
      </div>
    </div>
  );

  return (
    <Phone>
      <AppBar
        title="Nuevo pedido"
        leading={<I.back size={22}/>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 100px' }}>
        <Section num="1" title="Cliente">
          <Field label="Nombre completo" icon={I.user} value="María Hernández"/>
          <Field label="Teléfono" icon={I.phone} value="+503 7892 1340" last/>
        </Section>

        <Section num="2" title="Destino">
          {/* Mapa embebido */}
          <div style={{
            height: 160, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #e8f0e6 0%, #d8e6db 100%)',
          }}>
            {/* Streets */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <path d="M-20 60 L420 90" stroke="#fff" strokeWidth="14" opacity="0.7"/>
              <path d="M40 -10 L100 200" stroke="#fff" strokeWidth="10" opacity="0.7"/>
              <path d="M200 -10 L260 200" stroke="#fff" strokeWidth="10" opacity="0.7"/>
              <path d="M-20 130 L420 110" stroke="#fff" strokeWidth="8" opacity="0.5"/>
              <path d="M320 -10 L350 200" stroke="#fff" strokeWidth="8" opacity="0.5"/>
            </svg>
            {/* Pin */}
            <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -100%)' }}>
              <I.pinSolid size={36} color={RX.green}/>
            </div>
            {/* Search bar overlay */}
            <div style={{
              position: 'absolute', top: 10, left: 10, right: 10,
              background: '#fff', borderRadius: 12, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <I.search size={16} color={RX.inkMuted}/>
              <span style={{ fontSize: 13, color: RX.inkMuted, flex: 1 }}>Buscar dirección...</span>
              <div style={{ width: 1, height: 16, background: RX.outline }}/>
              <I.map size={16} color={RX.green}/>
            </div>
          </div>
          <Field label="Dirección" icon={I.pin} value="Col. Escalón, Av. La Capilla #142"/>
          <div style={{ display: 'flex', gap: 6, padding: '8px 14px 4px', flexWrap: 'wrap' }}>
            {[
              { ic: I.copy, l: 'Pegar link' },
              { ic: I.pin, l: 'Mi ubicación' },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 999,
                background: RX.surfaceAlt, fontSize: 12, fontWeight: 600, color: RX.ink,
              }}>
                <c.ic size={13}/>{c.l}
              </div>
            ))}
          </div>
          <Field label="Notas para el repartidor" icon={I.note} value="Portón verde, tocar timbre 2 veces" last/>
        </Section>

        <Section num="3" title="Paquete">
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${RX.outlineSoft}`, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: 'repeating-linear-gradient(45deg, #ddd, #ddd 4px, #e8e8e8 4px, #e8e8e8 8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <I.camera size={20} color={RX.inkMuted}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: RX.ink }}>Foto del paquete</div>
              <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>Opcional · Cámara o galería</div>
            </div>
            <I.chevR size={18} color={RX.inkSoft}/>
          </div>

          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Método de pago</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <div style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: RX.greenSoft, border: `1.5px solid ${RX.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <I.cash size={20} color={RX.greenDark}/>
                <div style={{ fontSize: 12, fontWeight: 700, color: RX.greenDark }}>Contra entrega</div>
              </div>
              <div style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: RX.surface, border: `1px solid ${RX.outline}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <I.card size={20} color={RX.inkMuted}/>
                <div style={{ fontSize: 12, fontWeight: 600, color: RX.inkMuted }}>Prepagado</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Monto a cobrar</div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 4,
              padding: '12px 14px', borderRadius: 12,
              background: RX.surfaceAlt,
            }}>
              <span style={{ fontSize: 18, color: RX.inkMuted, fontWeight: 600 }}>$</span>
              <span style={{ fontSize: 22, color: RX.ink, fontWeight: 700, letterSpacing: -0.5 }}>24.50</span>
            </div>
          </div>
        </Section>
      </div>

      {/* Sticky CTA */}
      <div style={{
        padding: '12px 16px 12px', background: RX.surface,
        borderTop: `1px solid ${RX.outline}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 500 }}>Costará</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: RX.ink }}>1 envío del paquete</div>
        </div>
        <div style={{
          background: RX.green, color: '#fff',
          padding: '12px 22px', borderRadius: 14, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Crear pedido
          <I.chevR size={18} color="#fff"/>
        </div>
      </div>
    </Phone>
  );
};

// ============================================
// VARIANTE B — Atrevida: wizard de pasos visuales,
// inputs más grandes, mapa hero, número como display
// ============================================
const CrearAtrevida = () => {
  return (
    <Phone>
      <div style={{ padding: '0 4px' }}>
        <AppBar
          title="Paso 2 de 3"
          subtitle="Destino del envío"
          leading={<I.back size={22}/>}
          trailing={[<div style={{ fontSize: 13, color: RX.green, fontWeight: 600 }}>Guardar</div>]}
        />
      </div>

      {/* Step indicator */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6 }}>
        {[1,2,3].map((n) => (
          <div key={n} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: n <= 2 ? RX.green : RX.outline,
          }}/>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0 100px' }}>
        {/* Hero map */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            height: 240, borderRadius: 20, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #d8e6db 0%, #bfd5c3 100%)',
            border: `1px solid ${RX.outline}`,
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <path d="M-20 100 L420 130" stroke="#fff" strokeWidth="18" opacity="0.7"/>
              <path d="M60 -10 L120 280" stroke="#fff" strokeWidth="14" opacity="0.7"/>
              <path d="M240 -10 L300 280" stroke="#fff" strokeWidth="14" opacity="0.7"/>
              <path d="M-20 60 L420 70" stroke="#fff" strokeWidth="6" opacity="0.4"/>
              <path d="M-20 200 L420 210" stroke="#fff" strokeWidth="6" opacity="0.4"/>
              <circle cx="80" cy="120" r="6" fill={RX.ink} opacity="0.4"/>
              <circle cx="280" cy="180" r="6" fill={RX.ink} opacity="0.4"/>
            </svg>

            {/* Search overlay */}
            <div style={{
              position: 'absolute', top: 12, left: 12, right: 12,
              background: '#fff', borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: RX.shadowMd,
            }}>
              <I.search size={18} color={RX.inkMuted}/>
              <span style={{ fontSize: 14, color: RX.inkMuted, flex: 1, fontWeight: 500 }}>Buscar dirección o pegar link</span>
            </div>

            {/* Pin */}
            <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -100%)' }}>
              <I.pinSolid size={42} color={RX.green}/>
              <div style={{
                width: 14, height: 6, borderRadius: '50%',
                background: 'rgba(0,0,0,0.2)', margin: '0 auto',
              }}/>
            </div>

            {/* Bottom sheet on map */}
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              background: '#fff', borderRadius: 14, padding: 12,
              boxShadow: RX.shadowMd,
            }}>
              <div style={{ fontSize: 11, color: RX.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>UBICACIÓN ELEGIDA</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: RX.ink }}>Av. La Capilla #142, Col. Escalón</div>
              <div style={{ fontSize: 11, color: RX.inkMuted, marginTop: 2 }}>13.70128, -89.23847</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {[
              { ic: I.pin, l: 'Mi ubicación', primary: false },
              { ic: I.copy, l: 'Pegar link de Maps', primary: false },
              { ic: I.search, l: 'Buscar', primary: false },
            ].map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 999,
                background: RX.surface, border: `1px solid ${RX.outline}`,
                fontSize: 12, fontWeight: 600, color: RX.ink,
              }}>
                <c.ic size={14}/>{c.l}
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, marginBottom: 8, letterSpacing: -0.2 }}>Instrucciones</div>
          <div style={{
            background: RX.surface, borderRadius: 16, padding: '14px 16px',
            border: `1px solid ${RX.outline}`, minHeight: 80,
          }}>
            <div style={{ fontSize: 14, color: RX.ink, lineHeight: 1.5 }}>
              Portón verde a la derecha. Tocar timbre 2 veces. Si no responde llamar a María.
            </div>
          </div>

          {/* Sugerencias rápidas */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['Dejar en portería', 'Llamar al llegar', 'Tocar timbre', 'Casa con portón'].map((s, i) => (
              <div key={i} style={{
                padding: '6px 11px', borderRadius: 999,
                background: RX.surface, border: `1px dashed ${RX.outline}`,
                fontSize: 11, color: RX.inkMuted, fontWeight: 500,
              }}>+ {s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: '12px 16px', background: RX.surface,
        borderTop: `1px solid ${RX.outline}`,
        display: 'flex', gap: 10,
      }}>
        <div style={{
          padding: '14px 18px', borderRadius: 14,
          background: RX.surfaceAlt, color: RX.ink,
          fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <I.back size={18}/>Atrás
        </div>
        <div style={{
          flex: 1, background: RX.ink, color: '#fff',
          padding: '14px 20px', borderRadius: 14,
          fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Continuar al paquete
          <I.chevR size={18} color="#fff"/>
        </div>
      </div>
    </Phone>
  );
};

window.CrearRefinada = CrearRefinada;
window.CrearAtrevida = CrearAtrevida;
