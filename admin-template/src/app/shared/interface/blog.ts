export interface IComments {
  image: string;
  name: string;
  designation: string;
  hits: number;
  comments: number;
  description: string;
  reply?: boolean;
}

export interface IBlogDetails {
  id: number;
  image: string;
  date: string;
  year: string;
  comment?: number;
  hits: string;
  title: string;
  description?: string;
  created_by?: string;
}

export interface IAddBlogCategory {
  value: string;
  label: string;
}

export interface IBlogType {
  id: string;
  title: string;
  checked?: boolean;
}
