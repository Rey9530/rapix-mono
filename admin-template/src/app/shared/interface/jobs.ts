export interface IJobFilter {
  id: number;
  title: string;
  button: string;
  class?: string;
  search?: boolean;
  location?: boolean;
  card_body_class?: string;
  check?: boolean;
  details: IFilterDetails[];
}

export interface IFilterDetails {
  id: number;
  title: string;
  check_id: string;
  badge: boolean;
  badge_text?: number;
  country_code?: string;
}

export interface IJobCard {
  id: number;
  rating: number;
  image: string;
  title?: string;
  sub_title: string;
  description?: string;
  tag?: boolean;
  tag_title?: string;
  ribbon?: boolean;
  ribbon_icon?: string;
  time?: string;
  class?: string;
}

export interface IJobDetails {
  img: string;
  main_title: string;
  subtitle: string;
  rating: number;
  details: IDetails[];
}
export interface IDetails {
  title: string;
  li_class: boolean;
  detail: IDetail[];
}
export interface IDetail {
  description: string;
}

export interface ICandidate {
  id: number;
  img: string;
  class: string;
  name: string;
  label: string;
  projects: string;
  designation: string;
  salary: string;
  experience: string;
  education: IEducationDetails[] | string;
  skills: ISkill[];
}

export interface IEducationDetails {
  degree: string;
}

export interface ISkill {
  name: string;
  class: string;
}

export interface ISelectCandidate {
  title: string;
  item: ICandidateDetails[];
}
export interface ICandidateDetails {
  value: string;
  label: string;
}

export interface IJobFilterCompany {
  id: number;
  title: string;
  details: IFilterDetailsCompany[];
}

export interface IFilterDetailsCompany {
  id: number;
  title: string;
  check_id: string;
  rate_number?: number;
  rating?: boolean;
  badge: boolean;
  badge_text?: string;
}

export interface ICompanyDetails {
  id: number;
  icon: string;
  name: string;
  rating: number;
  reviews: string;
  category: string;
  description: string;
  jobs_posted: string;
}

export interface IDegree {
  value: string;
  label: string;
}

export interface IExperience {
  value: string;
  label: string;
}

export interface IMonth {
  value: string;
  label: string;
}
