export interface IImagesDetails {
  hover_digits: number;
  hover_class: string;
  text?: boolean;
  images: IImages[];
}

export interface IImages {
  src_url: string;
  preview_url: string;
  title?: string;
  description?: string;
  buttons?: IButtons[];
}

export interface IGalleryGridDetails {
  src_url: string;
}

export interface IButtons {
  title: string;
  color: string;
}

export interface IGalleryGridDesc {
  src_url: string;
  title: string;
  text: string;
}

export interface IGalleryPlaceholder {
  src_url: string;
  preview_url: string;
  title: string;
  description: string;
}

export interface IMasonryImage {
  src_url: string;
  preview_url: string;
}

export interface IMasonryImageDesc {
  src_url: string;
  preview_url: string;
}
