// Rapix Design Tokens — Material 3 refinado
// Color marca: #25b276

window.RX = {
  // Brand
  green: '#25b276',
  greenDark: '#1a8f5d',
  greenSoft: '#e6f6ee',
  greenInk: '#0d3a26',

  // Surfaces (warm-neutral whites)
  bg: '#fbfaf7',
  surface: '#ffffff',
  surfaceAlt: '#f4f2ee',
  surfaceSunken: '#efece6',
  outline: '#e2dfd8',
  outlineSoft: '#eeebe4',

  // Text
  ink: '#13140f',
  inkMuted: '#5a5b54',
  inkSoft: '#8b8c84',

  // Status
  warning: '#d97706',
  warningSoft: '#fef3c7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  info: '#2563eb',
  infoSoft: '#dbeafe',
  purple: '#7c3aed',
  purpleSoft: '#ede9fe',
  brown: '#92400e',

  // Type
  font: "'Inter', system-ui, -apple-system, sans-serif",
  fontDisplay: "'Inter', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",

  // Radii
  rSm: 8,
  rMd: 12,
  rLg: 16,
  rXl: 20,
  rPill: 999,

  // Shadows
  shadowSm: '0 1px 2px rgba(19,20,15,0.05)',
  shadowMd: '0 4px 12px rgba(19,20,15,0.06), 0 2px 4px rgba(19,20,15,0.04)',
  shadowLg: '0 12px 32px rgba(19,20,15,0.08), 0 4px 12px rgba(19,20,15,0.05)',
};

// Estado chip mapping (preserved from original system)
window.RX_ESTADOS = {
  PENDIENTE_ASIGNACION: { label: 'Pendiente', bg: '#fff4e6', fg: '#b45309', dot: '#f59e0b' },
  ASIGNADO: { label: 'Asignado', bg: '#dbeafe', fg: '#1d4ed8', dot: '#3b82f6' },
  RECOGIDO: { label: 'Recogido', bg: '#ede9fe', fg: '#6d28d9', dot: '#8b5cf6' },
  EN_TRANSITO: { label: 'En tránsito', bg: '#e9e3fd', fg: '#5b21b6', dot: '#7c3aed' },
  EN_PUNTO_INTERCAMBIO: { label: 'En punto de intercambio', bg: '#e0e7ff', fg: '#3730a3', dot: '#4f46e5' },
  EN_REPARTO: { label: 'En reparto', bg: '#dbeafe', fg: '#1e40af', dot: '#2563eb' },
  ENTREGADO: { label: 'Entregado', bg: '#dcfce7', fg: '#15803d', dot: '#22c55e' },
  FALLIDO: { label: 'Fallido', bg: '#fee2e2', fg: '#b91c1c', dot: '#ef4444' },
  DEVUELTO: { label: 'Devuelto', bg: '#fef3c7', fg: '#92400e', dot: '#d97706' },
  CANCELADO: { label: 'Cancelado', bg: '#f1f5f9', fg: '#475569', dot: '#94a3b8' },
};
