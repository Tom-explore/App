// Interfaces.ts

import { Place } from "./PlacesInterfaces";
import { TxAttribute, TxCategory } from "./TranslationsInterfaces";

export interface Attribute {
  id: number;
  slug: string;
  is_food_restriction?: boolean;
  is_atmosphere?: boolean;
  translations: TxAttribute[];

}

export interface Category {
  id: number;
  slug: string;
  main: boolean;
  for_trip_form: boolean;
  for_posts: boolean;
  scrapio_name?: string;
  translations?: TxCategory[]
}

export interface PlaceAttribute {
  id: number;
  place: Place;
  attribute: Attribute;
  value: number;
}

export interface PlaceCategory {
  id: number;
  place: Place;
  category: Category;
  main: boolean;
}
