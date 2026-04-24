export interface IFileTypes {
  name: string;
  total_files: number;
  size: string;
  icon: string;
}

export interface IPricingPlan {
  name: string;
  price: string;
  storage: string;
  status: string;
  image: string;
}

export interface IFiles {
  id: number;
  parent_id?: number;
  name: string;
  type: string;
  text?: string;
  children?: IFiles[];
}
