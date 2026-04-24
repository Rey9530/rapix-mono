import { Select2Data } from 'ng-select2-component';

export const stackingToast = [
  {
    id: 1,
    icon: 'bell',
    icon_color: 'primary',
    title: 'Wool theme',
    time: 'just now',
    description: "Hello, I'm a web-designer.",
    time_out: 700000,
    show: true,
  },
  {
    id: 2,
    icon: 'bell',
    icon_color: 'warning',
    title: 'Roxo theme',
    time: '2 sec ago',
    description: "Hello, I'm a UX-designer.",
    time_out: 1000000,
    show: true,
  },
  {
    id: 3,
    icon: 'bell',
    icon_color: 'danger',
    title: 'Zeta theme',
    time: '6 min ago',
    description: "Hello, I'm a Software developer.",
    show: true,
    time_out: 1500000,
  },
  {
    id: 4,
    icon: 'bell',
    icon_color: 'success',
    title: 'Voxo theme',
    time: '3 sec ago',
    description: "Hello, I'm a professional web-designer.",
    show: true,
    time_out: 2000000,
  },
];

export const translucentToasts = [
  {
    id: 1,
    icon_color: 'info',
    title: 'wool theme',
    time: '11 mins ago',
    description: "Hello, I'm a web-designer.",
    show: true,
    time_out: 900000,
  },
  {
    id: 2,
    icon_color: 'dark',
    title: 'Koho theme',
    time: '1 sec ago',
    description: " Hello, I'm a full-stack developer.",
    show: true,
    time_out: 1200000,
  },
  {
    id: 3,
    icon_color: 'secondary',
    title: 'Fastkart theme',
    time: 'just now',
    description: " Hello, I'm a UX-designer.",
    show: true,
    time_out: 1700000,
  },
  {
    id: 4,
    icon_color: 'success',
    title: 'Oslo theme',
    time: '44 min ago',
    description: "Hello, I'm a professional web-designer.",
    show: true,
    time_out: 2200000,
  },
];

export const toastPosition: Select2Data = [
  {
    label: 'Top left',
    value: 'top-0 start-0',
  },
  {
    label: 'Top center',
    value: 'top-0 start-50 translate-middle-x',
  },
  {
    label: 'Top right',
    value: 'top-0 end-0',
  },
  {
    label: 'Middle left',
    value: 'top-50 start-0 translate-middle-y',
  },
  {
    label: 'Middle center',
    value: 'top-50 start-50 translate-middle',
  },
  {
    label: 'Middle right',
    value: 'top-50 end-0 translate-middle-y',
  },
  {
    label: 'Bottom left',
    value: 'bottom-0 start-0',
  },
  {
    label: 'Bottom center',
    value: 'bottom-0 start-50 translate-middle-x',
  },
  {
    label: 'Bottom right',
    value: 'bottom-0 end-0',
  },
];
