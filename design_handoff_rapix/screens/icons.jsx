// Material-style icons drawn as SVG (24px). Single-color via currentColor.
const Icon = ({ d, size = 24, color = 'currentColor', stroke = false, sw = 1.8, fill, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
    {stroke ? (
      <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    ) : (
      <path d={d} fill={fill || color}/>
    )}
    {children}
  </svg>
);

// Material outline-ish icons. Stroke style for a refined feel.
const I = {
  home:     (p) => <Icon stroke d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" {...p}/>,
  list:     (p) => <Icon stroke d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...p}/>,
  box:      (p) => <Icon stroke d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12m0 0 8.5-4.5M12 12v9" {...p}/>,
  user:     (p) => <Icon stroke d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-7 8-7s8 3 8 7" {...p}/>,
  plus:     (p) => <Icon stroke d="M12 5v14M5 12h14" sw={2.2} {...p}/>,
  search:   (p) => <Icon stroke d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" {...p}/>,
  filter:   (p) => <Icon stroke d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" {...p}/>,
  bell:     (p) => <Icon stroke d="M6 8a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7Zm4 11a2 2 0 0 0 4 0" {...p}/>,
  chevR:    (p) => <Icon stroke d="m9 6 6 6-6 6" sw={2} {...p}/>,
  back:     (p) => <Icon stroke d="m15 6-6 6 6 6" sw={2} {...p}/>,
  pin:      (p) => <Icon stroke d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...p}/>,
  pinSolid: (p) => <Icon d="M12 22s7.5-7 7.5-12.5a7.5 7.5 0 0 0-15 0C4.5 15 12 22 12 22Zm0-9.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" {...p}/>,
  phone:    (p) => <Icon stroke d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" {...p}/>,
  truck:    (p) => <Icon stroke d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Zm-7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" {...p}/>,
  bag:      (p) => <Icon stroke d="M5 8h14l-1 12H6L5 8Zm3 0a4 4 0 1 1 8 0" {...p}/>,
  wallet:   (p) => <Icon stroke d="M3 7a2 2 0 0 1 2-2h12v4M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3m0 0v-4h-4a2 2 0 1 0 0 4h4Z" {...p}/>,
  refresh:  (p) => <Icon stroke d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5" {...p}/>,
  share:    (p) => <Icon stroke d="M16 6a3 3 0 1 0-3-3M8 12a3 3 0 1 0-3-3M16 21a3 3 0 1 0-3-3M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" {...p}/>,
  check:    (p) => <Icon stroke d="m5 12 5 5 9-11" sw={2.4} {...p}/>,
  camera:   (p) => <Icon stroke d="M4 8h3l2-2h6l2 2h3v11H4V8Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...p}/>,
  note:     (p) => <Icon stroke d="M5 4h10l4 4v12H5V4Zm10 0v4h4M8 12h8M8 16h6" {...p}/>,
  card:     (p) => <Icon stroke d="M3 7h18v10H3V7Zm0 4h18M7 15h3" {...p}/>,
  cash:     (p) => <Icon stroke d="M3 7h18v10H3V7Zm9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7 9v6m10-6v6" {...p}/>,
  inbox:    (p) => <Icon stroke d="M4 13h4l1 3h6l1-3h4M5 13l3-8h8l3 8v6H5v-6Z" {...p}/>,
  store:    (p) => <Icon stroke d="M4 7h16l-1 4a2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0 2 2 0 0 1-4 0L4 7Zm1 5v8h14v-8M9 20v-5h6v5" {...p}/>,
  edit:     (p) => <Icon stroke d="M4 20h4l11-11-4-4L4 16v4Zm9-13 4 4" {...p}/>,
  logout:   (p) => <Icon stroke d="M14 8V5H4v14h10v-3M9 12h12m0 0-3-3m3 3-3 3" {...p}/>,
  trend:    (p) => <Icon stroke d="m4 17 6-6 4 4 6-7M14 8h6v6" {...p}/>,
  clock:    (p) => <Icon stroke d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2" {...p}/>,
  flame:    (p) => <Icon stroke d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 11 12 9 12 3Z M9 17a3 3 0 0 0 6 0" {...p}/>,
  map:      (p) => <Icon stroke d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Zm6-2v14m6-12v14" {...p}/>,
  copy:     (p) => <Icon stroke d="M8 8h11v12H8V8Zm0 0V4h8M5 11v9h9" {...p}/>,
  message:  (p) => <Icon stroke d="M4 5h16v12H8l-4 4V5Z" {...p}/>,
  alert:    (p) => <Icon stroke d="M12 9v4m0 4h.01M12 3 2 21h20L12 3Z" {...p}/>,
  star:     (p) => <Icon d="m12 3 2.6 6.3L21 10l-5 4.4L17.5 21 12 17.5 6.5 21 8 14.4 3 10l6.4-.7L12 3Z"/>,
  spark:    (p) => <Icon d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z"/>,
};

window.I = I;
window.Icon = Icon;
