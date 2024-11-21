import { Attribute, Category } from "./CategoriesAttributesInterfaces";
import { City } from "./CommonInterfaces";
import { Place } from "./PlacesInterfaces";
import { User } from "./UsersInterfaces";

export interface People {
    id: number;
    trip: Trip;
    age?: number;
  }
  
  export interface Trip {
    id: number;
    user: User;
    city: City;
    partner_id?: number;
    public: boolean;
    datetime_start: Date;
    datetime_end: Date;
    price_range?: number;
    created: Date;
    modified: Date;
  }
  
  export interface TripAttribute {
    trip_id: number;
    attribute_id: number;
    trip: Trip;
    attribute: Attribute;
  }
  
  export interface TripCategoryFilter {
    trip_id: number;
    category_id: number;
    trip: Trip;
    category: Category;
  }
  
  export interface TripComposition {
    trip_id: number;
    day: number;
    position: number;
    place_id: number;
    datetime?: Date;
    deleted?: boolean;
    trip: Trip;
    place: Place;
  }
  