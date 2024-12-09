import { Post, PostBloc, PostImg } from "./BlogInterfaces";
import { Attribute, Category } from "./CategoriesAttributesInterfaces";
import { City, Country } from "./CommonInterfaces";
import { Place } from "./PlacesInterfaces";

export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface TxAttribute {
  attribute_id: number;
  language_id: number;
  name: string;
  slug: string;
  description: string;
  meta_description: string;
  title: string;
  attribute: Attribute;
  language: Language;
}

export interface TxCategory {
  category_id: number;
  language_id: number;
  name: string;
  slug: string;
  description?: string;
  meta_description?: string;
  title?: string;
  category: Category;
  language: Language;
}

export interface TxCategoryCityLang {
  category_id: number;
  city_id: number;
  language_id: number;
  name: string;
  description?: string;
  meta_description?: string;
  title?: string;
  category: Category;
  city: City;
  language: Language;
}

export interface TxCity {
  city_id: number;
  language_id: number;
  slug: string;
  name: string;
  description: string;
  meta_description: string;
  city: City;
  language: Language;
}

export interface TxCountry {
  country_id: number;
  language_id: number;
  slug: string;
  name: string;
  description: string;
  meta_description: string;
  title: string;
  country: Country;
  language: Language;
}

export interface TxPlace {
  place_id: number;
  language_id: number;
  slug: string;
  name: string;
  title: string;
  description: string;
  meta_description: string;
  place: Place;
  language: Language;
}

export interface TxPost {
  postId: number;
  languageId: number;
  name: string;
  description?: string;
  metaDescription?: string;
  title?: string;
  visible: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  planned?: Date;
  post: Post;
  language: Language;
}

export interface TxPostBloc {
  post_bloc_id: number;
  language_id: number;
  content: string;
  title: string;
  postBloc: PostBloc;
  language: Language;
}

export interface TxPostImg {
  post_img_id: number;
  language_id: number;
  alt: string;
  postImg: PostImg;
  language: Language;
}
