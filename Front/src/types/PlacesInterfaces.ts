import { City } from "./CommonInterfaces";
import { PlaceType, CrowdStatus } from "./EnumsInterfaces";

export interface Place {
    id: number;
    city: City;
    description_scrapio?: string;
    type: PlaceType;
    slug: string;
    google_id?: string;
    google_place_id?: string;
    link_insta?: string;
    link_fb?: string;
    link_maps?: string;
    link_website?: string;
    link_linkedin?: string;
    mails?: string[];
    phone?: string;
    lat?: number;
    lng?: number;
    address?: string;
    zip_code?: string;
    scraped?: Date;
    updated: Date;
    created: Date;
    verified?: Date;
    last_api_scraped: Date;
    public: boolean;
    price_range?: number;
    duration?: number;
    is_closed: boolean;
    set_in_queue: boolean;
    imgs_scraped: boolean;
    reviews_google_rating?: number;
    reviews_google_count?: number;
    reviews_user_rating?: number;
    reviews_user_count?: number;
    reviews_average_rating?: number;
    reviews_average_count?: number;
    img: string;
    category: string;
    description: string;
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