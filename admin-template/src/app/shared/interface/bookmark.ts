export interface IBookmark {
  id: number;
  title: string;
  description: string;
  collection: string;
  image: string;
  url: string;
  tag: string;
  is_favorite: boolean;
}
