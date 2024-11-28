// Interfaces.ts

import { Language } from "./TranslationsInterfaces";

export interface Country {
    id: number;
    slug: string;
    code: string;
  }
  
  export interface City {
    id: number;
    parent_city_id?: number;
    slug: string;
    lat?: number;
    lng?: number;
    video?: string;
    main_img?: string;
    img_marker?: string;
    attraction_min_reviews?: number;
    visible: boolean;
    scrapio?: string;
    gyg?: string;
    timezone?: string;
    duration?: number;
    link_city_card?: string;
    link_taxi?: string;
    link_car_rental?: string;
    link_bike_rental?: string;
    country: Country;
  }
  export interface CityMap {
    id: number;
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
  