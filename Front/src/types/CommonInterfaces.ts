// Interfaces.ts

import { Language } from "./TranslationsInterfaces";
import { Place } from "./PlacesInterfaces";
export interface Country {
  id: number;
  slug: string;
  code: string;
}

export interface City {
  id: number;
  slug?: string;
  lat: number;
  lng: number;
  video?: string | null;
  main_img?: string | null;
  img_marker?: string | null;
  attraction_min_reviews?: number;
  visible?: boolean;
  scrapio?: string;
  gyg?: string;
  timezone?: string;
  duration?: number;
  link_city_card?: string | null;
  link_taxi?: string | null;
  link_car_rental?: string | null;
  link_bike_rental?: string | null;

  country: {
    id: number;
    code: string;
    slug: string;
    translation: {
      slug: string;
      name: string;
      description: string;
      meta_description: string;
    };
  };

  translation: {
    slug: string;
    name: string;
    description: string;
    meta_description: string;
  };

  places: {
    restaurantsBars: Place[];
    hotels: Place[];
    touristAttractions: Place[];
  };
}

export interface CityMap {
  id: number;
  slug: string;
  name: string;
  description: string;
  markerIcon: string;
  img: string;
  lat: number;
  lng: number;
}
export interface Partner {
  id: number;
  name: string;
  website?: string;
  contact_mail?: string;
  phone?: string;
  gyg_id?: string;
  booking_id?: string;
  favorite_language?: Language;
}
