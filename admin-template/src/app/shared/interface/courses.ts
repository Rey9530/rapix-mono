export interface ICourseFilter {
  id: number;
  title: string;
  button?: string;
  class: string;
  search?: boolean;
  details: IFilterDetails[];
}

export interface IFilterDetails {
  id: number;
  title?: string;
  sub_title?: string;
  class: string;
  created_by?: string;
  badge?: boolean;
  date?: number;
  month?: string;
  rating?: boolean;
  rate?: number;
  item?: IItem[];
}

export interface IItem {
  id: number;
  title: string;
  check_id?: string;
  class?: string;
  badge: boolean;
  badge_text?: number;
}

export interface IComments {
  image: string;
  name: string;
  designation: string;
  hits: number;
  comments: number;
  description: string;
  reply?: boolean;
}

export interface ICourseList {
  id: number;
  image: string;
  date: string;
  year: string;
  title: string;
  created_by: string;
  hits: string;
  description?: string;
}
