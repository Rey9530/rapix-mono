// Shared Rapix UI primitives — phone shell + chrome
const { useState } = React;

// --- Status bar (Android) ---
const StatusBar = ({ dark = false }) => {
  const c = dark ? '#fff' : RX.ink;
  return (
    <div style={{
      height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', position: 'relative',
      fontFamily: RX.font, fontWeight: 600, fontSize: 13, color: c,
      flexShrink: 0,
    }}>
      <span style={{ letterSpacing: 0.2 }}>9:30</span>
      <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 18, height: 18, borderRadius: '50%', background: '#1a1a1a' }}/>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="14" height="11" viewBox="0 0 14 11"><path d="M7 11 0 4a9 9 0 0 1 14 0L7 11Z" fill={c}/></svg>
        <svg width="13" height="11" viewBox="0 0 13 11"><path d="M12 11V0L1 11h11Z" fill={c}/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0" y="1" width="19" height="9" rx="2" stroke={c} strokeWidth="1" fill="none"/><rect x="2" y="3" width="13" height="5" fill={c}/><rect x="20" y="4" width="1.5" height="3" fill={c}/></svg>
      </div>
    </div>
  );
};

// --- Bottom gesture bar ---
const NavBar = ({ dark = false }) => (
  <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <div style={{ width: 120, height: 4, borderRadius: 2, background: dark ? '#fff' : RX.ink, opacity: 0.7 }}/>
  </div>
);

// --- Phone frame wrapper ---
const Phone = ({ children, dark = false, statusDark, bg }) => (
  <div style={{
    width: 380, height: 780, borderRadius: 36, overflow: 'hidden',
    background: dark ? '#0a0a0a' : (bg || RX.bg),
    border: '7px solid #18181b',
    boxShadow: '0 24px 60px rgba(19,20,15,0.18), 0 6px 16px rgba(19,20,15,0.08)',
    display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
    fontFamily: RX.font, color: RX.ink,
  }}>
    <StatusBar dark={statusDark ?? dark}/>
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {children}
    </div>
    <NavBar dark={statusDark ?? dark}/>
  </div>
);

// --- App bar ---
const AppBar = ({ title, subtitle, leading, trailing, transparent = false, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '10px 8px 10px 8px', minHeight: 56,
    background: transparent ? 'transparent' : 'transparent',
    color: color || RX.ink,
    flexShrink: 0,
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {leading}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.2 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: color ? 'rgba(255,255,255,0.7)' : RX.inkMuted, marginTop: 2 }}>{subtitle}</div>}
    </div>
    {Array.isArray(trailing) ? trailing.map((t, i) => (
      <div key={i} style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t}</div>
    )) : trailing && (
      <div style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{trailing}</div>
    )}
  </div>
);

// --- Bottom tabs ---
const BottomNav = ({ active = 'inicio', dark = false }) => {
  const tabs = [
    { id: 'inicio', icon: I.home, label: 'Inicio' },
    { id: 'pedidos', icon: I.list, label: 'Pedidos', badge: 3 },
    { id: 'paquetes', icon: I.box, label: 'Paquetes' },
    { id: 'perfil', icon: I.user, label: 'Perfil' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
      padding: '10px 8px 8px',
      background: dark ? '#0f0f0f' : RX.surface,
      borderTop: `1px solid ${dark ? '#222' : RX.outline}`,
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const fg = isActive ? RX.green : (dark ? '#9ca3af' : RX.inkMuted);
        return (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, position: 'relative' }}>
            <div style={{
              width: 56, height: 30, borderRadius: 16,
              background: isActive ? RX.greenSoft : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <t.icon size={22} color={fg}/>
              {t.badge && (
                <div style={{
                  position: 'absolute', top: 2, right: 8,
                  minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px',
                  background: RX.danger, color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${dark ? '#0f0f0f' : RX.surface}`,
                }}>{t.badge}</div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: isActive ? 600 : 500, color: fg }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- Estado chip ---
const EstadoChip = ({ estado, size = 'sm' }) => {
  const e = RX_ESTADOS[estado] || RX_ESTADOS.CANCELADO;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '3px 9px' : '5px 11px',
      borderRadius: 999, background: e.bg, color: e.fg,
      fontSize: sm ? 11 : 12, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: e.dot }}/>
      {e.label}
    </span>
  );
};

// --- Round icon button ---
const IconBtn = ({ icon: IcEl, color = RX.ink, bg, onClick, badge }) => (
  <div style={{
    width: 40, height: 40, borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg || 'transparent',
    position: 'relative',
  }} onClick={onClick}>
    <IcEl size={22} color={color}/>
    {badge && (
      <div style={{
        position: 'absolute', top: 4, right: 4,
        minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px',
        background: RX.danger, color: '#fff', fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #fff',
      }}>{badge}</div>
    )}
  </div>
);

// --- Wordmark ---
const Wordmark = ({ size = 22, color = RX.ink, accent = RX.green }) => (
  <div style={{
    fontFamily: RX.font, fontWeight: 800, fontSize: size,
    letterSpacing: -1, color, display: 'inline-flex', alignItems: 'baseline',
  }}>
    rapix<span style={{ color: accent }}>.</span>
  </div>
);

Object.assign(window, { Phone, AppBar, BottomNav, EstadoChip, IconBtn, Wordmark, StatusBar, NavBar });
