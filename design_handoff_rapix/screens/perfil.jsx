// PERFIL — 2 variantes

// VARIANTE A — Refinada: secciones limpias, accesos a editar
const PerfilRefinada = () => {
  return (
    <Phone>
      <AppBar
        title="Mi perfil"
        leading={<I.user size={22}/>}
        trailing={[<IconBtn icon={I.edit}/>]}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 16px' }}>
        {/* Header card */}
        <div style={{
          background: RX.surface, borderRadius: 20, padding: 18,
          border: `1px solid ${RX.outline}`, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: RX.greenSoft, color: RX.greenInk,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 26, letterSpacing: -1,
          }}>DP</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: RX.ink, letterSpacing: -0.3 }}>Don Pedro Vásquez</div>
            <div style={{ fontSize: 12, color: RX.inkMuted, marginTop: 2 }}>Vendedor · Desde marzo 2024</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 6, padding: '3px 8px', borderRadius: 999,
              background: RX.greenSoft, color: RX.greenDark,
              fontSize: 11, fontWeight: 700,
            }}>
              <I.star size={11} color={RX.greenDark}/>4.8 · 247 envíos
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkMuted, padding: '4px 4px 8px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Contacto</div>
        <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, marginBottom: 14 }}>
          {[
            { ic: I.message, l: 'Correo electrónico', v: 'pedro@verduras.sv' },
            { ic: I.phone, l: 'Teléfono', v: '+503 7212 4456' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <r.ic size={18} color={RX.inkMuted}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600 }}>{r.l}</div>
                <div style={{ fontSize: 14, color: RX.ink, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.v}</div>
              </div>
              <I.chevR size={18} color={RX.inkSoft}/>
            </div>
          ))}
        </div>

        {/* Negocio */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>Negocio</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: RX.green, fontWeight: 700 }}>
            <I.edit size={14} color={RX.green}/>Editar
          </div>
        </div>
        <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center', borderBottom: `1px solid ${RX.outlineSoft}` }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: RX.green, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 20,
            }}>V</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: RX.ink }}>Don Pedro Verduras</div>
              <div style={{ fontSize: 11, color: RX.inkMuted, marginTop: 2 }}>RFC: VEDP-840312-K9A</div>
            </div>
          </div>
          {[
            { ic: I.pin, l: 'Dirección', v: 'Mercado Central, Local 47-B' },
            { ic: I.map, l: 'Coordenadas', v: '13.69842, -89.19124' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <r.ic size={18} color={RX.inkMuted}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600 }}>{r.l}</div>
                <div style={{ fontSize: 13, color: RX.ink, fontWeight: 600 }}>{r.v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Preferencias */}
        <div style={{ fontSize: 11, fontWeight: 700, color: RX.inkMuted, padding: '4px 4px 8px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Preferencias</div>
        <div style={{ background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`, marginBottom: 14 }}>
          {[
            { ic: I.bell, l: 'Notificaciones' },
            { ic: I.wallet, l: 'Métodos de pago' },
            { ic: I.alert, l: 'Ayuda y soporte' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '14px', display: 'flex', gap: 12, alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <r.ic size={18} color={RX.inkMuted}/>
              <div style={{ flex: 1, fontSize: 14, color: RX.ink, fontWeight: 600 }}>{r.l}</div>
              <I.chevR size={18} color={RX.inkSoft}/>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{
          padding: '14px', borderRadius: 16,
          background: RX.dangerSoft, color: RX.danger,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 14, fontWeight: 700,
        }}>
          <I.logout size={18} color={RX.danger}/>Cerrar sesión
        </div>
      </div>

      <BottomNav active="perfil"/>
    </Phone>
  );
};

// VARIANTE B — Atrevida: hero con stats, capacidades del negocio
const PerfilAtrevida = () => {
  return (
    <Phone>
      {/* Dark hero */}
      <div style={{ background: RX.ink, color: '#fff' }}>
        <div style={{ padding: '0 4px' }}>
          <AppBar
            title=""
            color="#fff"
            leading={<I.back size={22} color="#fff"/>}
            trailing={[<IconBtn icon={I.edit} color="#fff"/>, <IconBtn icon={I.logout} color="#fff"/>]}
          />
        </div>

        <div style={{ padding: '4px 24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 36,
              background: RX.green, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 28, letterSpacing: -1,
              border: '3px solid rgba(255,255,255,0.15)',
            }}>DP</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>Don Pedro Vásquez</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Don Pedro Verduras · San Salvador</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <I.star size={12} color="#fbbf24"/>
                <span style={{ fontSize: 11, fontWeight: 700 }}>4.8</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>· miembro desde mar 2024</span>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { v: '247', l: 'Envíos totales' },
              { v: '98%', l: 'Entregados' },
              { v: '34', l: 'Saldo' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 12px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Light sheet */}
      <div style={{
        flex: 1, overflow: 'auto', background: RX.bg,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        marginTop: -16, paddingTop: 16, padding: '16px 16px 16px',
      }}>
        {/* Negocio card */}
        <div style={{
          background: RX.surface, borderRadius: 20, padding: 16,
          border: `1px solid ${RX.outline}`, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: RX.greenSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <I.store size={20} color={RX.greenDark}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Tu negocio</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: RX.ink, letterSpacing: -0.2 }}>Don Pedro Verduras</div>
            </div>
            <div style={{ fontSize: 12, color: RX.green, fontWeight: 700 }}>Editar</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 12, background: RX.surfaceAlt,
            fontSize: 12, color: RX.ink,
          }}>
            <I.pin size={14} color={RX.inkMuted}/>
            Mercado Central, Local 47-B
          </div>
        </div>

        {/* Mini menu cards 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { ic: I.bell, l: 'Notificaciones', s: '3 nuevas' },
            { ic: I.wallet, l: 'Pagos', s: 'BAC •• 4456' },
            { ic: I.box, l: 'Mis paquetes', s: '2 activos' },
            { ic: I.alert, l: 'Ayuda', s: 'WhatsApp 24/7' },
          ].map((m, i) => (
            <div key={i} style={{
              background: RX.surface, borderRadius: 16, padding: 14,
              border: `1px solid ${RX.outline}`,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: RX.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <m.ic size={18} color={RX.ink}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: RX.ink, letterSpacing: -0.2 }}>{m.l}</div>
              <div style={{ fontSize: 11, color: RX.inkMuted, marginTop: 2 }}>{m.s}</div>
            </div>
          ))}
        </div>

        {/* Account list */}
        <div style={{
          background: RX.surface, borderRadius: 16, border: `1px solid ${RX.outline}`,
          marginBottom: 12,
        }}>
          {[
            { l: 'Correo', v: 'pedro@verduras.sv' },
            { l: 'Teléfono', v: '+503 7212 4456' },
            { l: 'Contraseña', v: '••••••••' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${RX.outlineSoft}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: RX.inkMuted, fontWeight: 600 }}>{r.l}</div>
                <div style={{ fontSize: 14, color: RX.ink, fontWeight: 600 }}>{r.v}</div>
              </div>
              <I.chevR size={18} color={RX.inkSoft}/>
            </div>
          ))}
        </div>

        <div style={{
          padding: '14px', borderRadius: 14,
          background: 'transparent', color: RX.danger,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 13, fontWeight: 700, border: `1px solid ${RX.dangerSoft}`,
        }}>
          <I.logout size={16} color={RX.danger}/>Cerrar sesión
        </div>
      </div>

      <BottomNav active="perfil"/>
    </Phone>
  );
};

window.PerfilRefinada = PerfilRefinada;
window.PerfilAtrevida = PerfilAtrevida;
