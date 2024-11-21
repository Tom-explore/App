// Interfaces.ts

import { Place } from "./PlacesInterfaces";

export interface Attribute {
    id: number;
    slug: string;
    is_food_restriction?: boolean;
    is_atmosphere?: boolean;
  }
  
  export interface Category {
    id: number;
    slug: string;
    main: boolean;
    for_trip_form: boolean;
    for_posts: boolean;
    scrapio_name?: string;
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
  