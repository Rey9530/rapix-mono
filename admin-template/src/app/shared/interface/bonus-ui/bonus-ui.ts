export interface IAbsoluteCard {
  bg_color: string;
  heading: string;
  img: string;
  text: string;
}

export interface IAnimatedTimeline {
  year: number;
  events: ITimelineEvents[];
}

export interface ITimelineEvents {
  id: number;
  title: string;
  description: string;
  focused?: boolean;
}
export interface IHorizontalTimeline {
  id: number;
  ul_class: string;
  vertical_line: string;
  details: IDetails[];
}

export interface IDetails {
  div_class: string;
  color_class: string;
  date: string;
  title: string;
  description: string;
  class?: string;
}

export interface IImages {
  image: string;
}

export interface INestedSwiper {
  image?: string;
  images?: IImages[];
}

export interface IDarkVariant {
  img: string;
  title: string;
  description: string;
}

export interface List {
  title: string;
  class?: string;
  card_class?: string;
  card_header_class?: string;
  card_body_class?: string;
  card_footer_class?: string;
  footer_class?: string;
  heading_class?: string;
  card_type: string;
  details: IListDetails[];
}

export interface IListDetails {
  name?: string;
  active?: boolean;
  icon?: string;
  title?: string;
  list?: boolean;
  description?: string;
  title_class?: string;
  description_class?: string;
}

export interface IDraggableList {
  name: string;
  image: string;
  class?: string;
}
export interface IRandomSortable {
  image: string;
}
export interface ISortableList {
  name: string;
  class?: string;
}

export interface ISwapList {
  id: number;
  title: string;
  icon?: string;
  children?: ISwapList[];
}
