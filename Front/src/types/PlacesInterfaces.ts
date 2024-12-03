import { City } from "./CommonInterfaces";
import { PlaceType, CrowdStatus } from "./EnumsInterfaces";

export interface Place {
  id: number;
  lat: number;
  lng: number;
  slug: string;
  translation: {
    slug: string;
    name: string;
    title: string;
    description: string | null;
    meta_description: string | null;
  }; // Peut être absent (optionnel)
  description: string;
  address: string;
  link_website?: string; // Peut être absent (optionnel)
  link_insta?: string;   // Peut être absent (optionnel)
  link_fb?: string;      // Peut être absent (optionnel)
  link_maps: string;    // Peut être absent (optionnel)
  reviews_google_rating: number;
  reviews_google_count: number;
  images: {
    id: number;
    slug: string;
    author?: string | null;
    license?: string | null;
    top: number;
    source?: string;
  }[];
}



export interface CrowdLevels {
  id: number;
  place: Place;
  day_of_week: number;
  hour: string;
  status: CrowdStatus;
}


export interface OpeningHours {
  id: number;
  place: Place;
  day_of_week: number;
  start_time_1?: string;
  stop_time_1?: string;
  start_time_2?: string;
  stop_time_2?: string;
}

export interface PlaceImg {
  id: number;
  place: Place;
  slug: string;
  author?: string;
  license?: string;
  top?: number;
  source?: string;
}
export interface Hotel {
  place: Place; // Objet Place imbriqué
  booking_link?: string;
  avg_price_per_night?: number;
  pets_authorized: boolean;
}

export interface RestaurantBar {
  place: Place; // Objet Place imbriqué
  menu?: string;
  price_min?: number;
  price_max?: number;
}

export interface TouristAttraction {
  place: Place; // Objet Place imbriqué
  name_original?: string;
  wiki_link?: string;
  price_regular?: number;
  price_children?: number;
  tickets_gyg: boolean;
  tickets_civitatis: boolean;
  tickets_direct_site?: string;
}