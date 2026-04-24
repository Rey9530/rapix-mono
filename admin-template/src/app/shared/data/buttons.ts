export const flatButton = [
  'Primary',
  'Secondary',
  'Success',
  'Info',
  'Warning',
  'Danger',
  'Light',
];

export const buttonSize = [
  {
    class: 'primary btn-lg b-r-8',
    title: 'Large',
  },
  {
    class: 'secondary b-r-8',
    title: 'Default',
  },
  {
    class: 'warning btn-sm b-r-8',
    title: 'Small',
  },
  {
    class: 'success btn-xs b-r-6',
    title: 'Extra small',
  },
];

export const roundedButton = [
  {
    class: 'primary',
    title: 'Contacts',
  },
  {
    class: 'dark',
    title: 'Users',
  },
  {
    class: 'success',
    title: 'Chats',
  },
  {
    class: 'info',
    title: 'Animation',
  },
  {
    class: 'warning',
    title: 'Widgets',
  },
  {
    class: 'danger',
    title: 'Project',
  },
  {
    class: 'light',
    title: 'Icons',
  },
];

export const roundedSize = [
  {
    class: 'primary btn-lg',
    name: 'Large',
  },
  {
    class: 'secondary',
    name: 'Default',
  },
  {
    class: 'warning btn-sm',
    name: 'Small',
  },
  {
    class: 'success btn-xs',
    name: 'Extra small',
  },
];

export const disableButton = [
  {
    class: 'primary disabled',
    name: "I'm disabled",
  },
  {
    class: 'pill btn-warning disabled',
    name: 'Having problems',
  },
  {
    class: 'outline-primary disabled',
    name: 'Inaccessible',
  },
  {
    class: 'pill btn-outline-warning disabled',
    name: 'Disabled',
  },
];

export const iconsButton = [
  {
    class: 'btn b-ln-height btn-primary btn-square',
    icon: 'help-circle',
  },
  {
    class: 'btn b-ln-height btn-secondary btn-square',
    icon: 'clock',
  },
  {
    class: 'btn b-ln-height btn-warning',
    icon: 'loader',
  },
  {
    class: 'btn b-ln-height button-light-primary',
    icon: 'radio',
  },
  {
    class: 'btn-pill button-light-secondary',
    icon: 'loader',
  },
  {
    class: 'btn-pill button-light-warning',
    icon: 'radio',
  },
  {
    class: 'btn b-ln-height btn-outline-primary',
    icon: 'radio',
  },
  {
    class: 'btn-pill btn-outline-secondary border border-secondary',
    icon: 'loader',
  },
  {
    class: 'btn-pill btn-outline-warning border border-warning',
    icon: 'radio',
  },
];

export const iconTitle = [
  {
    class: 'btn b-ln-height btn-secondary btn-square',
    icon: 'clock',
    title: 'Secondary',
  },
  {
    class: 'btn b-ln-height btn-warning',
    icon: 'alert-triangle',
    title: 'Warning',
  },
  {
    class: 'btn-pill button-light-success',
    icon: 'check-square',
    title: 'Success',
  },
  {
    class: 'btn b-ln-height btn-outline-info',
    icon: 'volume-1',
    title: 'Info',
  },
  {
    class: 'btn-pill btn-outline-primary border border-primary',
    icon: 'loader',
    title: 'Primary',
  },
];

export const dashedBorder = [
  'Primary',
  'Secondary',
  'Success',
  'Info',
  'Warning',
  'Danger',
  'Dark',
];

export const loaderButton = [
  {
    class: 'primary',
    title: 'Initiating Connection...',
    icon: 'circle-notch fa-spin',
  },
  {
    class: 'secondary',
    title: 'Spooling Data...',
    icon: 'arrows-rotate fa-spin',
  },
  {
    class: 'success',
    title: 'Compiling Request...',
    icon: 'spinner fa-spin-pulse',
  },
];

export interface ButtonGroup {
  title: string;
  class: string;
  sub_class?: string;
  button_groups: ButtonGroupItem[];
}

export interface ButtonGroupItem {
  class?: string;
  buttons: ButtonItem[];
}

export interface ButtonItem {
  label?: string;
  icon?: string;
  class?: string;
}

export const buttonGroups: ButtonGroup[] = [
  {
    title: 'Button Group Variation',
    class: 'col-xxl-4 col-md-6 box-col-6',
    sub_class: 'button-variation',
    button_groups: [
      {
        class: 'btn-group-square',
        buttons: [
          { label: 'Left', class: 'btn-primary' },
          { label: 'Middle', class: 'button-light-primary' },
          { label: 'Right', class: 'btn-primary' },
        ],
      },
      {
        class: 'btn-group-pill',
        buttons: [
          { label: 'Left', class: 'button-light-primary' },
          { label: 'Middle', class: 'btn-primary' },
          { label: 'Right', class: 'button-light-primary' },
        ],
      },
      {
        buttons: [
          { label: 'Left', class: 'btn-primary' },
          { label: 'Middle', class: 'button-light-primary' },
          { label: 'Right', class: 'btn-primary' },
        ],
      },
    ],
  },
  {
    title: 'Outline Button Group',
    class: 'col-xxl-4 col-md-6 box-col-6',
    sub_class: 'button-outlined',
    button_groups: [
      {
        class: 'btn-group-square',
        buttons: [
          { icon: 'arrow-left', class: 'btn-outline-primary' },
          { icon: 'arrow-up', class: 'btn-outline-primary' },
          { icon: 'arrow-right', class: 'btn-outline-primary' },
        ],
      },
      {
        class: 'btn-group-pill',
        buttons: [
          { icon: 'arrow-left-circle', class: 'btn-outline-primary' },
          { icon: 'arrow-up-circle', class: 'btn-outline-primary' },
          { icon: 'arrow-right-circle', class: 'btn-outline-primary' },
        ],
      },
      {
        buttons: [
          { icon: 'align-left', class: 'btn-outline-primary' },
          { icon: 'align-center', class: 'btn-outline-primary' },
          { icon: 'align-right', class: 'btn-outline-primary' },
        ],
      },
    ],
  },
  {
    title: 'Button Group Sizes',
    class: 'col-xxl-4 col-12 box-col-12',
    button_groups: [
      {
        buttons: [
          { label: 'Left', class: 'btn-outline-primary btn-lg' },
          { label: 'Middle', class: 'btn-outline-primary btn-lg' },
          { label: 'Right', class: 'btn-outline-primary btn-lg' },
        ],
      },
      {
        buttons: [
          { label: 'Left', class: 'btn-outline-primary' },
          { label: 'Middle', class: 'btn-outline-primary' },
          { label: 'Right', class: 'btn-outline-primary' },
        ],
      },
      {
        buttons: [
          { label: 'Left', class: 'btn-outline-primary btn-sm' },
          { label: 'Middle', class: 'btn-outline-primary btn-sm' },
          { label: 'Right', class: 'btn-outline-primary btn-sm' },
        ],
      },
    ],
  },
];

export const blockButton = [
  {
    title: 'Block Button',
    class: 'buttons-box',
    buttons: [
      {
        class: 'btn button-light-primary',
        text: 'Click here, there is a big surprise with you, Hurry Up!!',
      },
      {
        class: 'btn btn-primary',
        text: '40% off all B-Stock Sale!! Hurry Up!!',
      },
    ],
  },
  {
    title: 'Button Center',
    class: 'col-6 mx-auto buttons-box',
    buttons: [
      {
        class: 'btn button-light-primary',
        text: 'Center Button',
      },
      {
        class: 'btn btn-primary',
        text: 'Center Button',
      },
    ],
  },
  {
    title: 'Button End',
    class: ' d-md-flex justify-content-md-end buttons-box',
    buttons: [
      {
        class: 'btn button-light-primary me-md-2',
        text: 'Cancel',
      },
      {
        class: 'btn btn-primary',
        text: 'Submit',
      },
    ],
  },
];

export const verticalVariationColor = [
  'Primary',
  'Secondary',
  'Success',
  'Danger',
  'Warning',
];

export const verticalVariationRadio = [
  {
    id: 'vbtn-radio1',
    title: 'Radio 1',
    checked: true,
  },
  {
    id: 'vbtn-radio2',
    title: 'Radio 2',
    checked: false,
  },
  {
    id: 'vbtn-radio3',
    title: 'Radio 3',
    checked: false,
  },
];

export const horizontalVariationCheckbox = [
  {
    id: 'btncheck1',
    title: 'Checkbox 1',
    class: 'success mb-0',
  },
  {
    id: 'btncheck2',
    title: 'Checkbox 2',
    class: 'primary mb-0',
  },
  {
    id: 'btncheck3',
    title: 'Checkbox 3',
    class: 'success mb-0',
  },
];

export const boldBorder = [
  {
    class: 'primary-2x',
    title: 'Animation',
  },
  {
    class: 'secondary-2x',
    title: 'Icons',
  },
  {
    class: 'success-2x',
    title: 'Blog',
  },
  {
    class: 'info-2x',
    title: 'Widgets',
  },
  {
    class: 'warning-2x',
    title: 'Chat',
  },
  {
    class: 'danger-2x',
    title: 'Users',
  },
  {
    class: 'light-2x txt-dark',
    title: 'FAQ',
  },
];

export const radioButton = [
  {
    id: 'radio7',
    title: 'Theme',
    checked: false,
  },
  {
    id: 'radio8',
    title: 'E-commerce',
    checked: true,
  },
];

export const checkboxButton = [
  {
    id: 'checkbox-primary-1',
    title: 'Theme',
  },
  {
    id: 'checkbox-primary-2',
    title: 'E-commerce',
  },
];

export const radialButton = [
  {
    title: 'Default Gradient Buttons',
    class: 'col-xl-4 col-sm-6',
    details: [
      { text: 'Icons', class: 'btn btn-primary-gradien' },
      { text: 'Animation', class: 'btn btn-secondary-gradien' },
      { text: 'Tasks', class: 'btn btn-success-gradien' },
      { text: 'Letter box', class: 'btn btn-info-gradien' },
      { text: 'Chat', class: 'btn btn-warning-gradien' },
      { text: 'Blog', class: 'btn btn-danger-gradien' },
      { text: 'Gallery', class: 'btn btn-light-gradien text-dark' },
    ],
  },
  {
    title: 'Flat Gradient Buttons',
    class: 'col-xl-4 col-sm-6',
    details: [
      { text: 'Icons', class: 'btn btn-square btn-primary-gradien' },
      { text: 'Animation', class: 'btn btn-square btn-secondary-gradien' },
      { text: 'Tasks', class: 'btn btn-square btn-success-gradien' },
      { text: 'Letter box', class: 'btn btn-square btn-info-gradien' },
      { text: 'Chat', class: 'btn btn-square btn-warning-gradien' },
      { text: 'Blog', class: 'btn btn-square btn-danger-gradien' },
      { text: 'Gallery', class: 'btn btn-square btn-light-gradien text-dark' },
    ],
  },
  {
    title: 'Rounded Gradient Buttons',
    class: 'col-xl-4 col-sm-12',
    details: [
      {
        text: 'Icons',
        class: 'btn btn-pill btn-air-primary btn-primary-gradien',
      },
      {
        text: 'Animation',
        class: 'btn btn-pill btn-air-secondary btn-secondary-gradien',
      },
      {
        text: 'Tasks',
        class: 'btn btn-pill btn-air-success btn-success-gradien',
      },
      {
        text: 'Letter box',
        class: 'btn btn-pill btn-air-info btn-info-gradien',
      },
      {
        text: 'Chat',
        class: 'btn btn-pill btn-air-warning btn-warning-gradien',
      },
      { text: 'Blog', class: 'btn btn-pill btn-air-danger btn-danger-gradien' },
      {
        text: 'Gallery',
        class: 'btn btn-pill btn-air-light btn-light-gradien txt-dark',
      },
    ],
  },
];
