// Pantallas de auth — Login y Registro, 2 variantes cada una

const F = ({ label, value, type, suffix, focused, dark }) => {
  const bg = dark ? '#141414' : RX.surface;
  const bd = focused ? RX.green : (dark ? '#1f1f1f' : RX.outline);
  const lab = dark ? '#9ca3af' : RX.inkMuted;
  const val = dark ? '#fff' : RX.ink;
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: lab, marginBottom: 6, paddingLeft: 2 }}>{label}</div>
      <div style={{
        background: bg, border: `1.5px solid ${bd}`,
        borderRadius: 12, padding: '13px 14px',
        boxShadow: focused ? `0 0 0 4px ${RX.greenSoft}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <span style={{ fontSize: 14, color: val, letterSpacing: type === 'password' ? 3 : 0, fontWeight: 500 }}>{value}</span>
        {suffix && <span style={{ fontSize: 11, fontWeight: 700, color: RX.green, letterSpacing: 0.4 }}>{suffix}</span>}
      </div>
    </div>
  );
};

// LOGIN — Refinada
const LoginRefinada = () => (
  <Phone>
    <div style={{ flex: 1, padding: '32px 24px 16px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ marginTop: 16, marginBottom: 36 }}>
        <Wordmark size={32}/>
        <div style={{ fontSize: 13, color: RX.inkMuted, marginTop: 8 }}>Logística simple para tu negocio</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, marginBottom: 4 }}>Bienvenido de vuelta</div>
        <div style={{ fontSize: 13, color: RX.inkMuted, lineHeight: 1.5 }}>Inicia sesión para gestionar tus envíos.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        <F label="Correo electrónico" value="ana@florerialuna.mx"/>
        <F label="Contraseña" value="••••••••••" type="password" suffix="MOSTRAR" focused/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: RX.green }}>¿Olvidaste tu contraseña?</span>
      </div>
      <div style={{ background: RX.green, color: '#fff', borderRadius: 14, padding: 15, textAlign: 'center', fontSize: 15, fontWeight: 700, boxShadow: '0 6px 16px rgba(37,178,118,0.3)' }}>
        Iniciar sesión
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
        <div style={{ flex: 1, height: 1, background: RX.outline }}/>
        <span style={{ fontSize: 11, color: RX.inkSoft, fontWeight: 600, letterSpacing: 0.5 }}>O CONTINÚA CON</span>
        <div style={{ flex: 1, height: 1, background: RX.outline }}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {['Google', 'Apple'].map(p => (
          <div key={p} style={{ background: RX.surface, border: `1.5px solid ${RX.outline}`, borderRadius: 12, padding: 13, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{p}</div>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ textAlign: 'center', fontSize: 13, color: RX.inkMuted, paddingTop: 24 }}>
        ¿Aún no tienes cuenta? <span style={{ color: RX.green, fontWeight: 700 }}>Regístrate</span>
      </div>
    </div>
  </Phone>
);

// LOGIN — Atrevida (hero verde + sheet)
const LoginAtrevida = () => (
  <Phone bg={RX.green} statusDark>
    <div style={{ padding: '24px 28px 36px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'relative' }}>
        <Wordmark size={28} color="#fff" accent="#0d3a26"/>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.05, marginTop: 38, marginBottom: 8 }}>
          Bienvenido<br/>de vuelta.
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>Tus envíos te están esperando.</div>
      </div>
    </div>
    <div style={{ flex: 1, background: RX.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '28px 24px 16px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        <F label="CORREO" value="ana@florerialuna.mx"/>
        <F label="CONTRASEÑA" value="••••••••••" type="password" suffix="VER" focused/>
      </div>
      <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: RX.ink, marginBottom: 22 }}>
        ¿Olvidaste tu contraseña?
      </div>
      <div style={{ background: RX.ink, color: '#fff', borderRadius: 16, padding: 18, textAlign: 'center', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        Entrar a Rapix <I.chevR size={18} color="#fff"/>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ marginTop: 22, padding: 14, border: `1.5px dashed ${RX.outline}`, borderRadius: 14, textAlign: 'center', fontSize: 13, color: RX.inkMuted }}>
        ¿Primera vez? <span style={{ color: RX.green, fontWeight: 700 }}>Crear cuenta gratis</span>
      </div>
    </div>
  </Phone>
);

// REGISTRO — Refinada (single page)
const RegistroRefinada = () => (
  <Phone>
    <AppBar leading={<I.back size={22}/>} title="Crear cuenta" subtitle="Paso 1 de 2 · Datos personales"/>
    <div style={{ padding: '0 24px 16px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: RX.green }}/>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: RX.outline }}/>
      </div>
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>Cuéntanos sobre ti</div>
        <div style={{ fontSize: 13, color: RX.inkMuted, lineHeight: 1.5 }}>Usaremos estos datos para tu cuenta de vendedor.</div>
      </div>
      <F label="Nombre completo" value="María Fernanda López"/>
      <F label="Correo electrónico" value="maria@florerialuna.mx" focused/>
      <F label="Teléfono (WhatsApp)" value="+52 55 1234 5678"/>
      <F label="Contraseña" value="••••••••" type="password" suffix="MOSTRAR"/>
      <div style={{ background: RX.greenSoft, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: RX.greenInk, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' }}>Seguridad de la contraseña</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[1,1,1,0].map((v,i) => (
            <div key={i} style={{ flex: 1, height: 4, background: v ? RX.green : 'rgba(0,0,0,0.1)', borderRadius: 2 }}/>
          ))}
        </div>
        <div style={{ fontSize: 11, color: RX.greenInk, fontWeight: 600 }}>Fuerte · Falta un símbolo para máxima</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: RX.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <I.check size={14} color="#fff" sw={3}/>
        </div>
        <div style={{ fontSize: 12, color: RX.inkMuted, lineHeight: 1.5 }}>
          Acepto los <span style={{ color: RX.green, fontWeight: 600 }}>términos</span> y la <span style={{ color: RX.green, fontWeight: 600 }}>política de privacidad</span> de Rapix.
        </div>
      </div>
    </div>
    <div style={{ padding: '14px 22px 18px', background: RX.surface, borderTop: `1px solid ${RX.outlineSoft}` }}>
      <div style={{ background: RX.green, color: '#fff', borderRadius: 14, padding: 14, textAlign: 'center', fontSize: 15, fontWeight: 700, boxShadow: '0 6px 16px rgba(37,178,118,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        Continuar <I.chevR size={18} color="#fff"/>
      </div>
    </div>
  </Phone>
);

// REGISTRO — Atrevida (hero + datos del negocio, paso 2)
const RegistroAtrevida = () => (
  <Phone>
    <div style={{ background: RX.ink, color: '#fff', padding: '14px 22px 28px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: RX.green, opacity: 0.18 }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.back size={18} color="#fff"/>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -1, color: RX.green }}>02</span>
          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.5 }}>/ 02</span>
        </div>
      </div>
      <div style={{ marginTop: 20, position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: RX.green, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          <I.spark size={11} color="#fff"/> 5 envíos gratis al registrarte
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
          Cuéntanos de tu<br/>negocio.
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8, lineHeight: 1.5 }}>
          Esto aparecerá en el seguimiento que ven tus clientes.
        </div>
      </div>
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Logo upload */}
      <div style={{ background: RX.surface, border: `1.5px dashed ${RX.outline}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: RX.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.store size={26} color={RX.greenDark}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Logo del negocio</div>
          <div style={{ fontSize: 11, color: RX.inkMuted }}>Opcional · PNG o JPG</div>
        </div>
        <div style={{ padding: '8px 14px', borderRadius: 10, background: RX.greenSoft, color: RX.greenDark, fontSize: 12, fontWeight: 700 }}>SUBIR</div>
      </div>
      <F label="Nombre del negocio" value="Florería Luna" focused/>
      {/* Categoría chips */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: RX.inkMuted, marginBottom: 8, paddingLeft: 2 }}>Categoría</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { l: 'Flores', a: true },
            { l: 'Comida', a: false },
            { l: 'Ropa', a: false },
            { l: 'Repostería', a: false },
            { l: 'Otro', a: false },
          ].map((c, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderRadius: 999,
              background: c.a ? RX.ink : RX.surface,
              border: `1px solid ${c.a ? RX.ink : RX.outline}`,
              color: c.a ? '#fff' : RX.ink,
              fontSize: 13, fontWeight: 600,
            }}>{c.l}</div>
          ))}
        </div>
      </div>
      <F label="Dirección de origen habitual" value="Av. Insurgentes 247, CDMX"/>
      <F label="Teléfono del negocio" value="55 1234 5678"/>
    </div>
    <div style={{ padding: '14px 22px 18px', background: RX.surface, borderTop: `1px solid ${RX.outlineSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, fontSize: 12, color: RX.inkMuted, lineHeight: 1.4 }}>
        Al continuar aceptas nuestros <span style={{ color: RX.green, fontWeight: 600 }}>términos</span>.
      </div>
      <div style={{ background: RX.green, color: '#fff', borderRadius: 14, padding: '12px 18px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(37,178,118,0.28)' }}>
        Crear cuenta <I.chevR size={16} color="#fff"/>
      </div>
    </div>
  </Phone>
);
