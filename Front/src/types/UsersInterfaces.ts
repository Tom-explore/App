import { Place } from "./PlacesInterfaces";

export interface User {
    id: number;
    email: string;
    name: string;
    pw: string;
    fb_id?: string;
    google_id?: string;
    apple_id?: string;
    profile_img?: string;
    confirmed_account?: boolean;
    created_at: Date;
    updated_at: Date;
    admin: boolean;
    author: boolean;
    favorite_language?: number;
  }
  
  export interface PlacesAddedByUser {
    user_id: number;
    place_id: number;
    added_at: Date;
    user: User;
    place: Place;
  }
  
  export interface UserPlacesLike {
    user_id: number;
    place_id: number;
    liked: boolean;
    changed_at: Date;
    user: User;
    place: Place;
  }
  
  export interface UserPlacesPreference {
    user_id: number;
    place_id: number;
    wants_to_visit: boolean;
    visited: boolean;
    not_interested: boolean;
    changed_at: Date;
    user: User;
    place: Place;
  }
  