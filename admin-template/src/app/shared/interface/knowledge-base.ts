export interface IKnowledgeBase {
  title: string;
  description: string;
  icon: string;
}

export interface IBrowserArticle {
  col_class: string;
  see_more: number;
  title: string;
  title_icon: string;
  details: IDetails[];
}
export interface IDetails {
  list_text: string;
  text_icon: string;
  tag: boolean;
  tag_title: string;
}

export interface IFeaturedTutorial {
  id: number;
  rating: number;
  image: string;
  title: string;
  description: string;
  date: string;
}

export interface IArticlesAndVideos {
  row: number;
  class?: string;
  details: IArticleDetails[];
}
export interface IArticleDetails {
  id: number;
  icon: string;
  title: string;
  description: string;
  class?: string;
}
