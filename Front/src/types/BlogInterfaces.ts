import { Category } from "./CategoriesAttributesInterfaces";
import { City, Country } from "./CommonInterfaces";
import { TitleType, Template } from "./EnumsInterfaces";
import { PlaceImg, Place } from "./PlacesInterfaces";
import { User } from "./UsersInterfaces";

export interface Post {
    id: number;
    user: User;
    slug: string;
  }
  export interface PostBloc {
    id: number;
    post: Post;
    postImg?: PostImg | null;
    placeImg?: PlaceImg | null;
    position: number;
    titleType: TitleType;
    template: Template;
    city?: City | null;
    place?: Place | null;
    country?: Country | null;
    visible: boolean;
  }
  export interface PostCategorization {
    postId: number;
    categoryId: number;
    post: Post;
    category: Category;
    main?: boolean;
  }
  export interface PostImg {
    id: number;
    slug: string;
    position?: number;
    author?: string;
    license?: string;
    directory?: string;
    source?: string;
  }
        