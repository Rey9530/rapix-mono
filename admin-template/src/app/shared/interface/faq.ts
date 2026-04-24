export interface IFaqQuestionAnswer {
  header_title?: string;
  details: IDetails[];
}

export interface IDetails {
  id: number;
  title: string;
  description: string;
}

export interface INavigation {
  icon?: string;
  title?: string;
  badge?: boolean;
  badge_text?: number;
  section?: boolean;
}
