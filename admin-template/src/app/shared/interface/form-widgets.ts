export interface ITouchSpin {
  id: number;
  default_value: number;
  outlined_value: number;
  rounded_value: number;
  color: string;
}

export interface ICustomSwitch {
  class: string;
  value: boolean;
}

export interface ICommonSwitch {
  title: string;
  class: string;
  div_class?: string;
  sub_description: string;
  item: ICommonSwitchItem[];
}

export interface ICommonSwitchItem {
  color_class: string;
  text: string;
  value: boolean;
}

export interface IDisabledOutlineSwitch {
  class: string;
  value: boolean;
}

export interface ISwitchSizing {
  class: string;
  text: string;
  value: boolean;
  disable: boolean;
  div_class?: string;
}

export interface ISwitchIcon {
  class: string;
  text: string;
  value: boolean;
  disable: boolean;
}

export interface IState {
  id: number;
  name: string;
}
