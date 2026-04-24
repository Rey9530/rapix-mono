export interface IDefaultCheckbox {
  id: number;
  title: string;
  details: IDetails[];
}

export interface IDetails {
  text: string;
  value: boolean;
  id: string;
  disable: boolean;
}

export interface IBorderCheckbox {
  class: string;
  for: string;
  text: string;
  value: boolean;
}

export interface IIconsCheckbox {
  text: string;
  for: string;
  icon: string;
  value: boolean;
}

export interface IFilledCheckbox {
  class: string;
  text: string;
  value: boolean;
  id: string;
}

export interface IDefaultRadio {
  id: number;
  title: string;
  details: IRadioDetails[];
}

export interface IRadioDetails {
  for: string;
  text: string;
  name: string;
  value: boolean;
  disable: boolean;
}

export interface IImageCheckbox {
  id: number;
  title: string;
  img: string;
  check: boolean;
  disabled: boolean;
}

export interface IImageRadio {
  id: number;
  title: string;
  img: string;
  check: boolean;
  disabled: boolean;
}

export interface IBorderRadio {
  text: string;
  check: boolean;
  class: string;
  id: string;
}

export interface IIconsRadio {
  text: string;
  icon: string;
  check: boolean;
  id: string;
}

export interface IFilledRadio {
  class: string;
  text: string;
  check: boolean;
  id: string;
}

export interface IDefaultSwitch {
  id: number;
  title: string;
  class: string;
  details: ISwitchDetails[];
}

export interface ISwitchDetails {
  text: string;
  value: boolean;
  id: string;
  disable: boolean;
}

export interface IInlineCheckbox {
  id: string;
  value: string;
  text: string;
  checked: boolean;
  disable: boolean;
}

export interface IInlineRadio {
  id: string;
  value: string;
  text: string;
  checked: boolean;
  disable: boolean;
}

export interface IInlineSwitch {
  id: string;
  value: string;
  checked: boolean;
  disable: boolean;
}

export interface IPaymentDetails {
  text: string;
  value: boolean;
  class: string;
}

export interface ISocialMedia {
  text: string;
  value: boolean;
  class: string;
}

export interface IBasicCheckbox {
  text: string;
  value: boolean;
  id: string;
}

export interface ISimpleRadio {
  text: string;
  check: boolean;
  id: string;
}

export interface IRadioToggle {
  id: string;
  text: string;
  checked: boolean;
  disabled: boolean;
}

export interface IOutlineCheckbox {
  id: string;
  class: string;
  type: string;
  text: string;
  checked: boolean;
  disabled: boolean;
}

export interface IVariationRadio {
  class: string;
  sub_title: string;
  details: IVariationRadioDetails[];
}

export interface IVariationRadioDetails {
  id: string;
  label: string;
  image?: string;
  name: string;
  check: boolean;
  icon?: string;
  class?: string;
}

export interface IDefaultStyle {
  id: string;
  name: string;
  value: string;
  label: string;
  badge: string;
  description: string;
  badge_class: string;
  radio_class: string;
}

export interface IWithoutBorderStyle {
  id: string;
  type: string;
  checked: boolean;
  price: string;
  speed: string;
  badge_class: string;
  description: string;
  checkbox_class: string;
}

export interface IInlineStyle {
  label: string;
  title: string;
  digit: string;
  class: string;
  id: string;
}

export interface IVerticalStyle {
  title: string;
  details: IVerticalStyleDetail[];
}

export interface IVerticalStyleDetail {
  label?: string;
  title: string;
  digit: string;
  class?: string;
  div_class?: string;
  id: string;
  check: boolean;
  rating?: number;
  name: string;
  badge_class?: string;
  description?: string;
  value: string;
}

export interface ISolidBorderStyle {
  id: string;
  name: string;
  value: string;
  image_src: string;
  image_alt: string;
  description: string;
}

export interface IOfferStyleBorder {
  id: string;
  type: string;
  checked: boolean;
  image_src: string;
  image_alt: string;
  description: string;
}

export interface ICheckBox {
  label: string;
  id: string;
  class: string;
  check: boolean;
}

export interface IThemeSales {
  list: string;
  sales: string;
  check: boolean;
}

export interface IDynamicForm {
  items: string;
  price: string;
  qty: string;
  total_price: string;
}
