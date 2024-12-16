// src/types/TripsInterfaces.ts

import { Attribute, Category } from "./CategoriesAttributesInterfaces";
import { City } from "./CommonInterfaces"; // Removed CityPreview as it's no longer needed
import { Place } from "./PlacesInterfaces";
import { User } from "./UsersInterfaces";

export interface People {
  id: number; // Assuming People IDs remain numeric
  trip: Trip;
  age?: number;
}

export interface TripData {
  tripName: string;
  description: string;
  city: City; // Changed from City | CityPreview to City to ensure consistency
  guests: {
    adults: number;
    children: number;
  };
  dates: {
    arrival: string; // ISO date string (e.g., "2024-12-13")
    departure: string; // ISO date string
  };
  budget: number;
  foodPreferences: string[];
  activityTypes: string[];
}

export interface Trip {
  id: number; // Changed from string to number
  user: User;
  city: City;
  partner_id?: number;
  public: boolean;
  datetime_start: Date;
  datetime_end: Date;
  price_range?: number;
  created: Date;
  modified: Date;
  tripCompositions: TripComposition[];
}

export interface TripAttribute {
  trip_id: number; // Changed from string to number
  attribute_id: number;
  trip: Trip;
  attribute: Attribute;
}

export interface TripCategoryFilter {
  trip_id: number; // Changed from string to number
  category_id: number;
  trip: Trip;
  category: Category;
}

export interface TripComposition {
  day: number;
  position: number;
  datetime?: Date;
  deleted?: boolean;
  place: Place;
}
