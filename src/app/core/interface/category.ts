export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  image: string;
}

export interface subCategory {
  _id?: string;
  name: string;
  slug?: string;
  image: string;
  category: string;
}
