--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg120+1)
-- Dumped by pg_dump version 15.8 (Debian 15.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: crowd_levels_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.crowd_levels_status_enum AS ENUM (
    'usually_not_busy',
    'usually_not_too_busy',
    'usually_as_busy_as_it_gets',
    'usually_a_little_busy'
);


ALTER TYPE public.crowd_levels_status_enum OWNER TO postgres;

--
-- Name: crowdstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.crowdstatus AS ENUM (
    'usually_not_busy',
    'usually_not_too_busy',
    'usually_as_busy_as_it_gets',
    'usually_a_little_busy'
);


ALTER TYPE public.crowdstatus OWNER TO postgres;

--
-- Name: hotels_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.hotels_type_enum AS ENUM (
    'tourist_attraction',
    'hotel',
    'restaurant_bar'
);


ALTER TYPE public.hotels_type_enum OWNER TO postgres;

--
-- Name: places_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.places_type_enum AS ENUM (
    'tourist_attraction',
    'hotel',
    'restaurant_bar'
);


ALTER TYPE public.places_type_enum OWNER TO postgres;

--
-- Name: post_blocs_template_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.post_blocs_template_enum AS ENUM (
    't1',
    't2',
    't3',
    't4'
);


ALTER TYPE public.post_blocs_template_enum OWNER TO postgres;

--
-- Name: post_blocs_titletype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.post_blocs_titletype_enum AS ENUM (
    'h1',
    'h2',
    'h3',
    'h4'
);


ALTER TYPE public.post_blocs_titletype_enum OWNER TO postgres;

--
-- Name: restaurant_bars_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.restaurant_bars_type_enum AS ENUM (
    'tourist_attraction',
    'hotel',
    'restaurant_bar'
);


ALTER TYPE public.restaurant_bars_type_enum OWNER TO postgres;

--
-- Name: template; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.template AS ENUM (
    't1',
    't2',
    't3',
    't4'
);


ALTER TYPE public.template OWNER TO postgres;

--
-- Name: titletype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.titletype AS ENUM (
    'h1',
    'h2',
    'h3',
    'h4'
);


ALTER TYPE public.titletype OWNER TO postgres;

--
-- Name: tourist_attractions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tourist_attractions_type_enum AS ENUM (
    'tourist_attraction',
    'hotel',
    'restaurant_bar'
);


ALTER TYPE public.tourist_attractions_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    id integer NOT NULL,
    slug character varying NOT NULL,
    is_food_restriction boolean,
    is_atmosphere boolean
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attributes_id_seq OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_id_seq OWNED BY public.attributes.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    slug character varying NOT NULL,
    place_type boolean DEFAULT false NOT NULL,
    for_trip_form boolean DEFAULT false NOT NULL,
    for_feed boolean DEFAULT false NOT NULL,
    for_posts boolean DEFAULT false NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    parent_city_id integer,
    slug character varying NOT NULL,
    lat double precision,
    lng double precision,
    video character varying,
    main_img character varying,
    img_marker character varying,
    attraction_min_reviews integer,
    visible boolean DEFAULT false NOT NULL,
    scrapio character varying,
    gyg character varying,
    timezone character varying,
    duration smallint,
    link_city_card character varying,
    link_taxi character varying,
    link_car_rental character varying,
    link_bike_rental character varying,
    country_id integer
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cities_id_seq OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    slug character varying NOT NULL,
    code character varying NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: crowd_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crowd_levels (
    id integer NOT NULL,
    day_of_week smallint NOT NULL,
    hour time without time zone NOT NULL,
    status public.crowd_levels_status_enum NOT NULL,
    place_id integer NOT NULL
);


ALTER TABLE public.crowd_levels OWNER TO postgres;

--
-- Name: crowd_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crowd_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.crowd_levels_id_seq OWNER TO postgres;

--
-- Name: crowd_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crowd_levels_id_seq OWNED BY public.crowd_levels.id;


--
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
    id integer NOT NULL,
    booking_link character varying,
    avg_price_per_night smallint,
    pets_authorized boolean DEFAULT false NOT NULL,
    place_id integer
);


ALTER TABLE public.hotels OWNER TO postgres;

--
-- Name: hotels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hotels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hotels_id_seq OWNER TO postgres;

--
-- Name: hotels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hotels_id_seq OWNED BY public.hotels.id;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.languages_id_seq OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opening_hours (
    id integer NOT NULL,
    day_of_week smallint NOT NULL,
    start_time_1 time without time zone,
    stop_time_1 time without time zone,
    start_time_2 time without time zone,
    stop_time_2 time without time zone,
    place_id integer NOT NULL
);


ALTER TABLE public.opening_hours OWNER TO postgres;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.opening_hours_id_seq OWNER TO postgres;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying NOT NULL,
    website character varying,
    contact_mail character varying,
    phone character varying,
    gyg_id character varying,
    booking_id character varying,
    favorite_language integer
);


ALTER TABLE public.partners OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.partners_id_seq OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people (
    id integer NOT NULL,
    age smallint,
    trip_id integer NOT NULL
);


ALTER TABLE public.people OWNER TO postgres;

--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.people_id_seq OWNER TO postgres;

--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.people_id_seq OWNED BY public.people.id;


--
-- Name: place_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_attributes (
    id integer NOT NULL,
    value smallint NOT NULL,
    place_id integer,
    attribute_id integer
);


ALTER TABLE public.place_attributes OWNER TO postgres;

--
-- Name: place_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.place_attributes_id_seq OWNER TO postgres;

--
-- Name: place_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_attributes_id_seq OWNED BY public.place_attributes.id;


--
-- Name: place_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_categories (
    id integer NOT NULL,
    best_for boolean DEFAULT false NOT NULL,
    place_id integer,
    category_id integer
);


ALTER TABLE public.place_categories OWNER TO postgres;

--
-- Name: place_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.place_categories_id_seq OWNER TO postgres;

--
-- Name: place_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_categories_id_seq OWNED BY public.place_categories.id;


--
-- Name: place_imgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_imgs (
    id integer NOT NULL,
    slug character varying NOT NULL,
    author character varying,
    license character varying,
    top smallint,
    source character varying,
    place_id integer
);


ALTER TABLE public.place_imgs OWNER TO postgres;

--
-- Name: place_imgs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_imgs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.place_imgs_id_seq OWNER TO postgres;

--
-- Name: place_imgs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_imgs_id_seq OWNED BY public.place_imgs.id;


--
-- Name: places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.places (
    id integer NOT NULL,
    description_scrapio character varying,
    slug character varying NOT NULL,
    google_id character varying,
    google_place_id character varying,
    link_insta character varying,
    link_fb character varying,
    link_maps character varying,
    link_website character varying,
    link_linkedin character varying,
    mails character varying[],
    phone character varying,
    lat double precision,
    lng double precision,
    address character varying,
    zip_code character varying,
    scraped timestamp without time zone,
    updated timestamp without time zone DEFAULT now() NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    verified timestamp without time zone,
    last_api_scraped timestamp without time zone NOT NULL,
    public boolean DEFAULT true NOT NULL,
    price_range smallint,
    duration smallint,
    is_closed boolean DEFAULT false NOT NULL,
    set_in_queue boolean DEFAULT false NOT NULL,
    imgs_scraped boolean DEFAULT false NOT NULL,
    reviews_google_rating double precision,
    reviews_google_count integer,
    reviews_user_rating double precision,
    reviews_user_count integer,
    reviews_average_rating double precision,
    reviews_average_count integer,
    city_id integer NOT NULL
);


ALTER TABLE public.places OWNER TO postgres;

--
-- Name: places_added_by_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.places_added_by_user (
    user_id integer NOT NULL,
    place_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.places_added_by_user OWNER TO postgres;

--
-- Name: places_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.places_id_seq OWNER TO postgres;

--
-- Name: places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.places_id_seq OWNED BY public.places.id;


--
-- Name: post_blocs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_blocs (
    id integer NOT NULL,
    "position" smallint NOT NULL,
    "titleType" public.post_blocs_titletype_enum NOT NULL,
    template public.post_blocs_template_enum NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    post_id integer NOT NULL,
    post_img_id integer,
    place_img_id integer,
    city_id integer,
    place_id integer,
    country_id integer
);


ALTER TABLE public.post_blocs OWNER TO postgres;

--
-- Name: post_blocs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_blocs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_blocs_id_seq OWNER TO postgres;

--
-- Name: post_blocs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_blocs_id_seq OWNED BY public.post_blocs.id;


--
-- Name: post_categorizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_categorizations (
    post_id integer NOT NULL,
    category_id integer NOT NULL,
    main boolean
);


ALTER TABLE public.post_categorizations OWNER TO postgres;

--
-- Name: post_imgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_imgs (
    id integer NOT NULL,
    slug character varying NOT NULL,
    "position" smallint,
    author character varying,
    license character varying,
    directory character varying,
    source character varying
);


ALTER TABLE public.post_imgs OWNER TO postgres;

--
-- Name: post_imgs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_imgs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_imgs_id_seq OWNER TO postgres;

--
-- Name: post_imgs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_imgs_id_seq OWNED BY public.post_imgs.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    slug character varying NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: restaurant_bars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_bars (
    id integer NOT NULL,
    menu character varying,
    price_min smallint,
    price_max smallint,
    place_id integer
);


ALTER TABLE public.restaurant_bars OWNER TO postgres;

--
-- Name: restaurant_bars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_bars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_bars_id_seq OWNER TO postgres;

--
-- Name: restaurant_bars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_bars_id_seq OWNED BY public.restaurant_bars.id;


--
-- Name: restaurants_bars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants_bars (
    place_id integer NOT NULL,
    menu character varying,
    price_min smallint,
    price_max smallint
);


ALTER TABLE public.restaurants_bars OWNER TO postgres;

--
-- Name: tourist_attractions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tourist_attractions (
    id integer NOT NULL,
    name_original character varying,
    wiki_link character varying,
    price_regular smallint,
    price_children smallint,
    tickets_gyg boolean DEFAULT false NOT NULL,
    tickets_civitatis boolean DEFAULT false NOT NULL,
    tickets_direct_site character varying,
    place_id integer
);


ALTER TABLE public.tourist_attractions OWNER TO postgres;

--
-- Name: tourist_attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tourist_attractions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tourist_attractions_id_seq OWNER TO postgres;

--
-- Name: tourist_attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tourist_attractions_id_seq OWNED BY public.tourist_attractions.id;


--
-- Name: trip_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_attributes (
    trip_id integer NOT NULL,
    attribute_id integer NOT NULL
);


ALTER TABLE public.trip_attributes OWNER TO postgres;

--
-- Name: trip_category_filter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_category_filter (
    trip_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.trip_category_filter OWNER TO postgres;

--
-- Name: trip_composition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_composition (
    trip_id integer NOT NULL,
    day integer NOT NULL,
    "position" integer NOT NULL,
    place_id integer NOT NULL,
    datetime timestamp without time zone,
    deleted boolean
);


ALTER TABLE public.trip_composition OWNER TO postgres;

--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    id integer NOT NULL,
    partner_id integer,
    public boolean DEFAULT false NOT NULL,
    datetime_start timestamp without time zone NOT NULL,
    datetime_end timestamp without time zone NOT NULL,
    price_range smallint,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    city_id integer NOT NULL
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trips_id_seq OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trips_id_seq OWNED BY public.trips.id;


--
-- Name: tx_attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_attribute (
    attribute_id integer NOT NULL,
    language_id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying NOT NULL,
    meta_description character varying NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.tx_attribute OWNER TO postgres;

--
-- Name: tx_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_categories (
    category_id integer NOT NULL,
    language_id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying,
    meta_description character varying,
    title character varying
);


ALTER TABLE public.tx_categories OWNER TO postgres;

--
-- Name: tx_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_category (
    category_id integer NOT NULL,
    language_id integer NOT NULL,
    slug character varying NOT NULL,
    name character varying NOT NULL,
    title character varying NOT NULL,
    description character varying,
    meta_description character varying
);


ALTER TABLE public.tx_category OWNER TO postgres;

--
-- Name: tx_category_city_lang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_category_city_lang (
    category_id integer NOT NULL,
    city_id integer NOT NULL,
    language_id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    meta_description character varying,
    title character varying
);


ALTER TABLE public.tx_category_city_lang OWNER TO postgres;

--
-- Name: tx_city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_city (
    city_id integer NOT NULL,
    language_id integer NOT NULL,
    slug character varying NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    meta_description character varying NOT NULL
);


ALTER TABLE public.tx_city OWNER TO postgres;

--
-- Name: tx_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_country (
    country_id integer NOT NULL,
    language_id integer NOT NULL,
    slug character varying NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    meta_description character varying NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.tx_country OWNER TO postgres;

--
-- Name: tx_place; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_place (
    place_id integer NOT NULL,
    language_id integer NOT NULL,
    slug character varying NOT NULL,
    name character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    meta_description character varying NOT NULL
);


ALTER TABLE public.tx_place OWNER TO postgres;

--
-- Name: tx_place_img; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_place_img (
    place_img_id integer NOT NULL,
    language_id integer NOT NULL,
    alt character varying
);


ALTER TABLE public.tx_place_img OWNER TO postgres;

--
-- Name: tx_post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_post (
    post_id integer NOT NULL,
    language_id integer NOT NULL,
    slug character varying NOT NULL,
    name character varying NOT NULL,
    title character varying NOT NULL,
    description character varying,
    meta_description character varying,
    visible boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    planned timestamp without time zone
);


ALTER TABLE public.tx_post OWNER TO postgres;

--
-- Name: tx_post_bloc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_post_bloc (
    post_bloc_id integer NOT NULL,
    language_id integer NOT NULL,
    content character varying NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.tx_post_bloc OWNER TO postgres;

--
-- Name: tx_post_img; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_post_img (
    post_img_id integer NOT NULL,
    language_id integer NOT NULL,
    alt character varying NOT NULL
);


ALTER TABLE public.tx_post_img OWNER TO postgres;

--
-- Name: tx_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tx_posts (
    post_id integer NOT NULL,
    language_id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "metaDescription" character varying,
    title character varying,
    visible boolean DEFAULT false NOT NULL,
    slug character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    planned timestamp without time zone
);


ALTER TABLE public.tx_posts OWNER TO postgres;

--
-- Name: user_places_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_places_likes (
    user_id integer NOT NULL,
    place_id integer NOT NULL,
    liked boolean NOT NULL,
    changed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_places_likes OWNER TO postgres;

--
-- Name: user_places_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_places_preferences (
    user_id integer NOT NULL,
    place_id integer NOT NULL,
    wants_to_visit boolean DEFAULT false NOT NULL,
    visited boolean DEFAULT false NOT NULL,
    not_interested boolean DEFAULT false NOT NULL,
    changed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_places_preferences OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    pw character varying NOT NULL,
    fb_id character varying,
    google_id character varying,
    apple_id character varying,
    profile_img character varying,
    confirmed_account boolean,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    author boolean DEFAULT false NOT NULL,
    favorite_language integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes ALTER COLUMN id SET DEFAULT nextval('public.attributes_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: crowd_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowd_levels ALTER COLUMN id SET DEFAULT nextval('public.crowd_levels_id_seq'::regclass);


--
-- Name: hotels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels ALTER COLUMN id SET DEFAULT nextval('public.hotels_id_seq'::regclass);


--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: people id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people ALTER COLUMN id SET DEFAULT nextval('public.people_id_seq'::regclass);


--
-- Name: place_attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes ALTER COLUMN id SET DEFAULT nextval('public.place_attributes_id_seq'::regclass);


--
-- Name: place_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories ALTER COLUMN id SET DEFAULT nextval('public.place_categories_id_seq'::regclass);


--
-- Name: place_imgs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_imgs ALTER COLUMN id SET DEFAULT nextval('public.place_imgs_id_seq'::regclass);


--
-- Name: places id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places ALTER COLUMN id SET DEFAULT nextval('public.places_id_seq'::regclass);


--
-- Name: post_blocs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs ALTER COLUMN id SET DEFAULT nextval('public.post_blocs_id_seq'::regclass);


--
-- Name: post_imgs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_imgs ALTER COLUMN id SET DEFAULT nextval('public.post_imgs_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: restaurant_bars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_bars ALTER COLUMN id SET DEFAULT nextval('public.restaurant_bars_id_seq'::regclass);


--
-- Name: tourist_attractions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tourist_attractions ALTER COLUMN id SET DEFAULT nextval('public.tourist_attractions_id_seq'::regclass);


--
-- Name: trips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips ALTER COLUMN id SET DEFAULT nextval('public.trips_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (id, slug, is_food_restriction, is_atmosphere) FROM stdin;
7	Test Attribute	\N	\N
133	Test Attribute	\N	\N
14	Test Attribute	\N	\N
21	Test Attribute	\N	\N
22	Test Attribute	\N	\N
83	attribute-1	\N	\N
84	attribute-2	\N	\N
85	attribute-3	\N	\N
93	Test Attribute	\N	\N
101	Test Attribute	\N	\N
109	Test Attribute	\N	\N
117	Test Attribute	\N	\N
125	Test Attribute	\N	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, slug, place_type, for_trip_form, for_feed, for_posts) FROM stdin;
1	bar_restaurant	t	f	f	f
2	tourist_attraction	t	f	f	f
3	hotel	t	f	f	f
4	nice_surroundings	t	f	f	f
9	updated-category	f	f	f	f
64	updated-category	f	f	f	f
14	updated-category	f	f	f	f
19	updated-category	f	f	f	f
21	updated-category	f	f	f	f
71	updated-category	f	f	f	f
78	updated-category	f	f	f	f
85	updated-category	f	f	f	f
92	updated-category	f	f	f	f
99	updated-category	f	f	f	f
57	test-category	f	f	f	f
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, parent_city_id, slug, lat, lng, video, main_img, img_marker, attraction_min_reviews, visible, scrapio, gyg, timezone, duration, link_city_card, link_taxi, link_car_rental, link_bike_rental, country_id) FROM stdin;
1	\N	amsterdam	52.3722	4.90019	\N	Amsterdam-NL.jpg	Amsterdam-NL-marker.png	3000	f	Amsterdam	amsterdam-l36	Europe/Paris	7	\N	\N	\N	\N	1
2	\N	antwerp	51.2178	4.40175	\N	Antwerp-BE.jpg	Antwerp-BE-marker.png	300	f	Antwerp		Europe/Paris	7	\N	\N	\N	\N	2
3	\N	athens	37.9787	23.728	\N	Athens-GR.jpg	Athens-GR-marker.png	300	f	Athens		Europe/Athens	7	\N	\N	\N	\N	3
4	\N	barcelona	41.3863	2.16906	\N	Barcelona-ES.jpg	Barcelona-ES-marker.png	300	f	Barcelona		Europe/Paris	7	\N	\N	\N	\N	4
5	\N	berlin	52.5176	13.4	\N	Berlin-DE.jpg	Berlin-DE-marker.png	3000	f	Berlin		Europe/Paris	7	\N	\N	\N	\N	5
6	\N	bordeaux	44.8414	-0.569533	\N	Bordeaux-FR.jpg	Bordeaux-FR-marker.png	300	f	Bordeaux		Europe/Paris	7	\N	\N	\N	\N	6
7	\N	brussels	50.8488	4.35099	\N	Brussels-BE.jpg	Brussels-BE-marker.png	300	f	Brussels		Europe/Paris	4	\N	\N	\N	\N	2
8	\N	bucharest	44.4317	26.0995	\N	Bucharest-RO.jpg	Bucharest-RO-marker.png	300	f	Bucharest		Europe/Athens	7	\N	\N	\N	\N	7
9	\N	budapest	47.4974	19.0486	\N	Budapest-HU.jpg	Budapest-HU-marker.png	300	f	Budapest		Europe/Paris	7	\N	\N	\N	\N	8
10	\N	cluj-napoca	46.7698	23.5898	\N	Cluj-Napoca-RO.jpg	Cluj-Napoca-RO-marker.png	300	f	Cluj-Napoca		Europe/Athens	7	\N	\N	\N	\N	7
11	\N	copenhagen	55.6747	12.5664	\N	Copenhagen-DK.jpg	Copenhagen-DK-marker.png	300	f	Copenhagen		Europe/Paris	7	\N	\N	\N	\N	9
12	\N	krakow	50.061	19.9371	\N	Krakow-PL.jpg	Krakow-PL-marker.png	300	f	Krakow		Europe/Paris	7	\N	\N	\N	\N	10
13	\N	dublin	53.3461	-6.26356	\N	Dublin-IE.jpg	Dublin-IE-marker.png	300	f	Dublin		Europe/London	7	\N	\N	\N	\N	11
14	\N	dubrovnik	42.6406	18.1078	\N	Dubrovnik-HR.jpg	Dubrovnik-HR-marker.png	300	f	Dubrovnik		Europe/Paris	7	\N	\N	\N	\N	12
15	\N	florence	43.7711	11.2556	\N	Florence-IT.jpg	Florence-IT-marker.png	300	f	Florence		Europe/Paris	7	\N	\N	\N	\N	13
16	\N	gdansk	54.3506	18.6537	\N	Gdansk-PL.jpg	Gdansk-PL-marker.png	300	f	Gdansk		Europe/Paris	7	\N	\N	\N	\N	10
17	\N	hamburg	53.5514	9.99021	\N	Hamburg-DE.jpg	Hamburg-DE-marker.png	300	f	Hamburg		Europe/Paris	7	\N	\N	\N	\N	5
18	\N	lille	50.6362	3.06389	\N	Lille-FR.jpg	Lille-FR-marker.png	300	f	Lille		Europe/Paris	7	\N	\N	\N	\N	6
19	\N	lisbon	38.723	-9.13758	\N	Lisbon-PT.jpg	Lisbon-PT-marker.png	300	f	Lisbon		Europe/London	7	\N	\N	\N	\N	14
20	\N	london	51.509	-0.122372	\N	London-GB.jpg	London-GB-marker.png	300	f	London		Europe/London	7	\N	\N	\N	\N	15
21	\N	lyon	45.7577	4.83187	\N	Lyon-FR.jpg	Lyon-FR-marker.png	300	f	Lyon		Europe/Paris	7	\N	\N	\N	\N	6
22	\N	madrid	40.4164	-3.70381	\N	Madrid-ES.jpg	Madrid-ES-marker.png	300	f	Madrid		Europe/Paris	7	\N	\N	\N	\N	4
23	\N	marseille	43.2918	5.36485	\N	Marseille-FR.jpg	Marseille-FR-marker.png	300	f	Marseille		Europe/Paris	7	\N	\N	\N	\N	6
24	\N	milan	45.466	9.18752	\N	Milano-IT.jpg	Milano-IT-marker.png	300	f	Milan		Europe/Paris	7	\N	\N	\N	\N	13
25	\N	munich	48.134	11.5799	\N	Munich-DE.jpg	Munich-DE-marker.png	300	f	Munich		Europe/Paris	7	\N	\N	\N	\N	5
26	\N	nantes	47.2139	-1.55295	\N	Nantes-FR.jpg	Nantes-FR-marker.png	300	f	Nantes		Europe/Paris	2	\N	\N	\N	\N	6
27	\N	naples	40.848	14.2693	\N	Naples-IT.jpg	Naples-IT-marker.png	300	f	Naples		Europe/Paris	7	\N	\N	\N	\N	13
28	\N	nice	43.7016	7.26723	\N	Nice-FR.jpg	Nice-FR-marker.png	300	f	Nice		Europe/Paris	7	\N	\N	\N	\N	6
29	\N	paris	48.8594	2.34085	\N	Paris-FR.jpg	Paris-FR-marker.png	300	f	Paris	paris-l16	Europe/Paris	7	\N	\N	\N	\N	6
30	\N	porto	41.1453	-8.60856	\N	Porto-PT.jpg	Porto-PT-marker.png	300	f	Porto		Europe/London	7	\N	\N	\N	\N	14
31	\N	rennes	48.1112	-1.68003	\N	Rennes-FR.jpg	Rennes-FR-marker.png	300	t	Rennes		Europe/Paris	7	\N	\N	\N	\N	6
32	\N	rome	41.9044	12.4848	\N	Rome-IT.jpg	Rome-IT-marker.png	300	t	Rome		Europe/Paris	10	\N	\N	\N	\N	13
33	\N	rotterdam	51.9206	4.47718	\N	Rotterdam-NL.jpg	Rotterdam-NL-marker.png	300	t	Rotterdam		Europe/Paris	7	\N	\N	\N	\N	1
34	\N	seville	37.3906	-5.9936	\N	Seville-ES.jpg	Seville-ES-marker.png	300	t	Seville		Europe/Paris	7	\N	\N	\N	\N	4
35	\N	stockholm	59.3256	18.0697	\N	Stockholm-SE.jpg	Stockholm-SE-marker.png	300	t	Stockholm		Europe/Paris	7	\N	\N	\N	\N	16
36	\N	strasbourg	48.5825	7.74352	\N	Strasbourg-FR.jpg	Strasbourg-FR-marker.png	300	t	Strasbourg		Europe/Paris	7	\N	\N	\N	\N	6
37	\N	tallinn	59.4374	24.7678	\N	Tallinn-EE.jpg	Tallinn-EE-marker.png	300	t	Tallinn		Europe/Athens	7	\N	\N	\N	\N	17
38	\N	timisoara	45.7562	21.2284	\N	Timisoara-RO.jpg	Timisoara-RO-marker.png	300	t	Timisoara		Europe/Athens	7	\N	\N	\N	\N	7
39	\N	toulouse	43.6025	1.44342	\N	Toulouse-FR.jpg	Toulouse-FR-marker.png	300	t	Toulouse		Europe/Paris	7	\N	\N	\N	\N	6
40	\N	valencia	39.4729	-0.375616	\N	Valencia-ES.jpg	Valencia-ES-marker.png	300	t	Valencia		Europe/Paris	7	\N	\N	\N	\N	4
41	\N	vannes	47.6572	-2.75743	\N	Vannes-FR.jpg	Vannes-FR-marker.png	30	t	Vannes		Europe/Paris	2	\N	\N	\N	\N	6
42	\N	warsaw	52.2286	21.0172	\N	Warsaw-PL.jpg	Warsaw-PL-marker.png	300	t	Warsaw		Europe/Paris	7	\N	\N	\N	\N	10
43	\N	venice	45.4376	12.3323	\N	Venice-IT.jpg	Venice-IT-marker.png	300	t	Venice		Europe/Paris	7	\N	\N	\N	\N	13
44	\N	vienna	48.2074	16.3693	\N	Vienna-AT.jpg	Vienna-AT-marker.png	300	t	Vienna		Europe/Paris	7	\N	\N	\N	\N	18
45	\N	la-roche-bernard	47.5181	-2.30273	\N	La-Roche-Bernard-FR.jpg	La-Roche-Bernard-FR-marker.png	10	f	La Roche-Bernard		Europe/Paris	1	\N	\N	\N	\N	6
46	\N	la-rochelle	46.1583	-1.15106	\N	La-Rochelle-FR.jpg	La-Rochelle-FR-marker.png	30	t	La Rochelle		Europe/Paris	2	\N	\N	\N	\N	6
47	\N	edinburgh	55.95	-3.19772	\N	Edinburgh-GB.jpg	Edinburgh-GB-marker.png	100	t	edinburgh		Europe/London	4	\N	\N	\N	\N	15
76	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	\N	updated-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
86	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	\N	updated-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
94	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	\N	updated-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	\N	updated-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	\N	test-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	\N	updated-city	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	\N	prague	50.0866	14.4208	\N	Prague-CZ.jpg	Prague-CZ-marker.png	300	t	admin1_code=52		Europe/Paris	7	\N	\N	\N	\N	19
49	\N	aachen	50.7749	6.08612	\N	Aachen-DE.jpg	Aachen-DE-marker.png	300	t	Aachen		Europe/Paris	7	\N	\N	\N	\N	5
50	\N	cologne	50.9393	6.9582	\N	Cologne-DE.jpg	Cologne-DE-marker.png	500	t	Cologne		Europe/Paris	7	\N	\N	\N	\N	5
51	\N	istanbul	41.0169	28.9938	\N	Istanbul-TR.jpg	Istanbul-TR-marker.png	300	t	admin1_code=34	istanbul-l56	Europe/Istanbul	7	\N	\N	\N	\N	20
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, slug, code) FROM stdin;
91	test-country	TC
92	updated-country	TC
1	netherlands	nl
2	belgium	be
3	greece	gr
4	spain	es
5	germany	de
6	france	fr
7	romania	ro
8	hungary	hu
9	denmark	dk
10	poland	pl
11	ireland	ie
12	croatia	hr
13	italy	it
14	portugal	pt
15	united-kingdom	gb
16	sweden	se
17	estonia	ee
18	austria	at
19	czech-republic	cz
20	turkey	tr
63	test-country	TC
64	updated-country	TC
70	test-country	TC
71	updated-country	TC
77	test-country	TC
78	updated-country	TC
84	test-country	TC
85	updated-country	TC
\.


--
-- Data for Name: crowd_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crowd_levels (id, day_of_week, hour, status, place_id) FROM stdin;
\.


--
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, booking_link, avg_price_per_night, pets_authorized, place_id) FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, code, name) FROM stdin;
1	en	Anglais
2	fr	Fran├ºais
154	EN	English
165	EN	English
176	EN	English
187	EN	English
198	EN	English
\.


--
-- Data for Name: opening_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opening_hours (id, day_of_week, start_time_1, stop_time_1, start_time_2, stop_time_2, place_id) FROM stdin;
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partners (id, name, website, contact_mail, phone, gyg_id, booking_id, favorite_language) FROM stdin;
1	Updated Partner	\N	\N	\N	\N	\N	\N
2	Updated Partner	\N	\N	\N	\N	\N	\N
3	Updated Partner	\N	\N	\N	\N	\N	\N
4	Updated Partner	\N	\N	\N	\N	\N	\N
5	Updated Partner	\N	\N	\N	\N	\N	\N
6	Updated Partner	\N	\N	\N	\N	\N	\N
7	Updated Partner	\N	\N	\N	\N	\N	\N
8	Updated Partner	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.people (id, age, trip_id) FROM stdin;
\.


--
-- Data for Name: place_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_attributes (id, value, place_id, attribute_id) FROM stdin;
\.


--
-- Data for Name: place_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_categories (id, best_for, place_id, category_id) FROM stdin;
20	f	188	3
21	f	189	1
22	f	190	2
24	f	188	3
25	f	189	1
26	f	190	2
28	f	188	3
29	f	189	1
30	f	190	2
32	f	188	3
33	f	189	1
34	f	190	2
36	f	188	3
37	f	189	1
38	f	190	2
\.


--
-- Data for Name: place_imgs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_imgs (id, slug, author, license, top, source, place_id) FROM stdin;
\.


--
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.places (id, description_scrapio, slug, google_id, google_place_id, link_insta, link_fb, link_maps, link_website, link_linkedin, mails, phone, lat, lng, address, zip_code, scraped, updated, created, verified, last_api_scraped, public, price_range, duration, is_closed, set_in_queue, imgs_scraped, reviews_google_rating, reviews_google_count, reviews_user_rating, reviews_user_count, reviews_average_rating, reviews_average_count, city_id) FROM stdin;
230	\N	test-place	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	123 Test Street	12345	\N	2024-11-27 15:16:20.149852	2024-11-27 15:16:20.149852	\N	2024-11-27 16:16:20.143	t	2	60	f	f	f	\N	\N	\N	\N	\N	\N	94
247	\N	test-place	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	123 Test Street	12345	\N	2024-11-27 16:02:40.315107	2024-11-27 16:02:40.315107	\N	2024-11-27 17:02:40.31	t	2	60	f	f	f	\N	\N	\N	\N	\N	\N	102
264	\N	test-place	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	123 Test Street	12345	\N	2024-11-29 10:28:44.292209	2024-11-29 10:28:44.292209	\N	2024-11-29 11:28:44.289	t	2	60	f	f	f	\N	\N	\N	\N	\N	\N	110
188	\N	test-hotel	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	Hotel Address	12345	\N	2024-11-27 11:03:52.397017	2024-11-27 11:03:52.397017	\N	2024-11-27 12:03:52.339	t	\N	\N	f	f	f	\N	\N	\N	\N	\N	\N	76
189	\N	test-restaurant	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	Restaurant Address	54321	\N	2024-11-27 11:03:53.197508	2024-11-27 11:03:53.197508	\N	2024-11-27 12:03:53.144	t	\N	\N	f	f	f	\N	\N	\N	\N	\N	\N	76
190	\N	test-attraction	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	Attraction Address	67890	\N	2024-11-27 11:03:53.977142	2024-11-27 11:03:53.977142	\N	2024-11-27 12:03:53.925	t	\N	\N	f	f	f	\N	\N	\N	\N	\N	\N	76
196	\N	test-place	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	123 Test Street	12345	\N	2024-11-27 11:04:07.142279	2024-11-27 11:04:07.142279	\N	2024-11-27 12:04:07.134	t	2	60	f	f	f	\N	\N	\N	\N	\N	\N	78
213	\N	test-place	\N	\N	\N	\N	\N	\N	\N	\N	\N	48.8566	2.3522	123 Test Street	12345	\N	2024-11-27 13:40:01.587137	2024-11-27 13:40:01.587137	\N	2024-11-27 14:40:01.583	t	2	60	f	f	f	\N	\N	\N	\N	\N	\N	86
\.


--
-- Data for Name: places_added_by_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.places_added_by_user (user_id, place_id, added_at) FROM stdin;
\.


--
-- Data for Name: post_blocs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_blocs (id, "position", "titleType", template, visible, post_id, post_img_id, place_img_id, city_id, place_id, country_id) FROM stdin;
\.


--
-- Data for Name: post_categorizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_categorizations (post_id, category_id, main) FROM stdin;
\.


--
-- Data for Name: post_imgs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_imgs (id, slug, "position", author, license, directory, source) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, slug, user_id) FROM stdin;
\.


--
-- Data for Name: restaurant_bars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_bars (id, menu, price_min, price_max, place_id) FROM stdin;
\.


--
-- Data for Name: restaurants_bars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurants_bars (place_id, menu, price_min, price_max) FROM stdin;
1535	\N	\N	\N
1536	\N	\N	\N
1537	\N	\N	\N
1538	\N	\N	\N
1539	\N	\N	\N
1540	\N	\N	\N
1541	\N	\N	\N
1542	\N	\N	\N
1553	\N	\N	\N
1554	\N	\N	\N
1555	\N	\N	\N
1556	\N	\N	\N
1557	\N	\N	\N
1558	\N	\N	\N
1559	\N	\N	\N
1560	\N	\N	\N
1561	\N	\N	\N
1562	\N	\N	\N
1563	\N	\N	\N
1564	\N	\N	\N
1565	\N	\N	\N
1566	\N	\N	\N
1567	\N	\N	\N
1568	\N	\N	\N
1569	\N	\N	\N
1570	\N	\N	\N
1571	\N	\N	\N
1572	\N	\N	\N
1573	\N	\N	\N
1574	\N	\N	\N
1575	\N	\N	\N
1576	\N	\N	\N
1603	\N	\N	\N
1604	\N	\N	\N
1605	\N	\N	\N
1606	\N	\N	\N
1607	\N	\N	\N
1608	\N	\N	\N
1609	\N	\N	\N
1610	\N	\N	\N
1611	\N	\N	\N
1612	\N	\N	\N
1613	\N	\N	\N
1614	\N	\N	\N
1615	\N	\N	\N
1616	\N	\N	\N
1617	\N	\N	\N
1618	\N	\N	\N
1619	\N	\N	\N
1620	\N	\N	\N
1621	\N	\N	\N
1622	\N	\N	\N
1623	\N	\N	\N
1624	\N	\N	\N
1625	\N	\N	\N
1626	\N	\N	\N
1627	\N	\N	\N
1628	\N	\N	\N
1629	\N	\N	\N
1630	\N	\N	\N
1631	\N	\N	\N
1632	\N	\N	\N
1633	\N	\N	\N
1634	\N	\N	\N
1635	\N	\N	\N
2978	\N	\N	\N
2979	\N	\N	\N
2980	\N	\N	\N
3065	\N	\N	\N
3066	\N	\N	\N
3067	\N	\N	\N
3068	\N	\N	\N
3069	\N	\N	\N
3070	\N	\N	\N
3071	\N	\N	\N
3072	\N	\N	\N
3073	\N	\N	\N
3074	\N	\N	\N
3075	\N	\N	\N
3076	\N	\N	\N
3077	\N	\N	\N
3078	\N	\N	\N
3079	\N	\N	\N
3080	\N	\N	\N
3081	\N	\N	\N
3082	\N	\N	\N
3083	\N	\N	\N
3084	\N	\N	\N
3085	\N	\N	\N
3086	\N	\N	\N
3087	\N	\N	\N
3088	\N	\N	\N
3089	\N	\N	\N
3090	\N	\N	\N
3091	\N	\N	\N
3092	\N	\N	\N
3093	\N	\N	\N
3094	\N	\N	\N
3095	\N	\N	\N
3096	\N	\N	\N
3097	\N	\N	\N
3098	\N	\N	\N
3099	\N	\N	\N
3100	\N	\N	\N
3101	\N	\N	\N
4519	\N	\N	\N
4520	\N	\N	\N
4521	\N	\N	\N
4522	\N	\N	\N
4523	\N	\N	\N
4524	\N	\N	\N
4525	\N	\N	\N
4526	\N	\N	\N
4527	\N	\N	\N
4528	\N	\N	\N
4529	\N	\N	\N
4530	\N	\N	\N
4531	\N	\N	\N
4532	\N	\N	\N
4533	\N	\N	\N
4557	\N	\N	\N
4591	\N	\N	\N
4592	\N	\N	\N
4593	\N	\N	\N
4594	\N	\N	\N
4595	\N	\N	\N
4596	\N	\N	\N
4597	\N	\N	\N
4598	\N	\N	\N
4599	\N	\N	\N
4600	\N	\N	\N
4601	\N	\N	\N
4602	\N	\N	\N
4603	\N	\N	\N
4604	\N	\N	\N
4605	\N	\N	\N
4606	\N	\N	\N
4607	\N	\N	\N
4608	\N	\N	\N
4609	\N	\N	\N
4610	\N	\N	\N
4611	\N	\N	\N
4612	\N	\N	\N
4613	\N	\N	\N
4614	\N	\N	\N
4615	\N	\N	\N
4616	\N	\N	\N
4617	\N	\N	\N
4618	\N	\N	\N
4619	\N	\N	\N
4620	\N	\N	\N
4621	\N	\N	\N
4622	\N	\N	\N
4623	\N	\N	\N
4624	\N	\N	\N
4625	\N	\N	\N
4626	\N	\N	\N
4627	\N	\N	\N
4628	\N	\N	\N
4629	\N	\N	\N
4630	\N	\N	\N
4698	\N	\N	\N
4699	\N	\N	\N
4700	\N	50	60
4701	\N	\N	\N
4702	\N	\N	\N
4703	\N	\N	\N
4704	\N	\N	\N
4705	\N	\N	\N
4706	\N	\N	\N
6031	\N	\N	\N
6032	\N	\N	\N
6033	\N	\N	\N
6034	\N	\N	\N
6035	\N	\N	\N
6036	\N	\N	\N
6037	\N	\N	\N
6038	\N	\N	\N
6039	\N	\N	\N
6040	\N	\N	\N
6041	\N	\N	\N
6042	\N	\N	\N
6043	\N	\N	\N
6044	\N	\N	\N
6045	\N	\N	\N
6046	\N	\N	\N
6047	\N	\N	\N
6048	\N	\N	\N
6049	\N	\N	\N
6050	\N	\N	\N
6051	\N	\N	\N
6052	\N	\N	\N
6053	\N	\N	\N
6054	\N	\N	\N
6055	\N	\N	\N
6056	\N	\N	\N
6057	\N	\N	\N
6058	\N	\N	\N
6059	\N	\N	\N
6060	\N	\N	\N
6061	\N	\N	\N
6062	\N	\N	\N
6063	\N	\N	\N
6064	\N	\N	\N
6065	\N	\N	\N
6066	\N	\N	\N
6067	\N	\N	\N
6068	\N	\N	\N
6069	\N	\N	\N
6070	\N	\N	\N
6071	\N	\N	\N
6072	\N	\N	\N
6073	\N	\N	\N
6074	\N	\N	\N
6075	\N	\N	\N
6076	\N	\N	\N
6077	\N	\N	\N
6078	\N	\N	\N
6079	\N	\N	\N
6080	\N	\N	\N
6081	\N	\N	\N
6082	\N	\N	\N
6083	\N	\N	\N
6089	\N	\N	\N
6092	\N	\N	\N
6095	\N	\N	\N
6098	\N	\N	\N
6100	\N	\N	\N
6102	\N	\N	\N
6104	\N	\N	\N
6112	\N	\N	\N
6115	\N	\N	\N
6118	\N	\N	\N
6119	\N	\N	\N
6121	\N	\N	\N
7318	\N	\N	\N
7319	\N	\N	\N
7320	\N	\N	\N
7321	\N	\N	\N
7322	\N	\N	\N
7323	\N	\N	\N
7324	\N	\N	\N
7325	\N	\N	\N
2	\N	\N	\N
3	\N	\N	\N
4	\N	\N	\N
5	\N	\N	\N
6	\N	\N	\N
7	\N	\N	\N
8	\N	\N	\N
9	\N	\N	\N
10	\N	\N	\N
11	\N	\N	\N
12	\N	\N	\N
13	\N	15	20
14	\N	\N	\N
15	\N	\N	\N
16	\N	\N	\N
17	\N	\N	\N
18	\N	\N	\N
20	\N	\N	\N
21	\N	12	15
22	\N	13	17
23	\N	15	20
24	\N	\N	\N
25	\N	\N	\N
26	\N	12	18
27	\N	\N	\N
28	\N	\N	\N
29	\N	\N	\N
30	\N	\N	\N
31	\N	\N	\N
32	\N	12	15
33	\N	\N	\N
34	\N	\N	\N
35	\N	\N	\N
36	\N	\N	\N
37	\N	\N	\N
38	\N	\N	\N
39	\N	\N	\N
40	\N	12	18
41	\N	\N	\N
42	\N	\N	\N
43	\N	\N	\N
44	\N	\N	\N
45	\N	\N	\N
46	\N	\N	\N
47	\N	\N	\N
48	\N	\N	\N
49	\N	\N	\N
50	\N	\N	\N
51	\N	\N	\N
52	\N	\N	\N
53	\N	\N	\N
54	\N	\N	\N
55	\N	\N	\N
56	\N	\N	\N
57	\N	\N	\N
58	\N	\N	\N
59	\N	\N	\N
60	\N	25	35
61	\N	100	100
62	\N	\N	\N
64	\N	\N	\N
65	\N	\N	\N
66	\N	\N	\N
67	\N	\N	\N
68	\N	\N	\N
69	\N	\N	\N
70	\N	\N	\N
71	\N	\N	\N
72	\N	20	35
73	\N	\N	\N
74	\N	40	60
75	\N	\N	\N
76	\N	\N	\N
77	\N	\N	\N
78	\N	\N	\N
79	\N	\N	\N
81	\N	\N	\N
82	\N	\N	\N
83	\N	\N	\N
84	\N	\N	\N
85	\N	\N	\N
86	\N	\N	\N
87	\N	\N	\N
88	\N	15	20
138	\N	\N	\N
139	\N	\N	\N
141	\N	\N	\N
142	\N	\N	\N
143	\N	\N	\N
144	\N	\N	\N
145	\N	\N	\N
146	\N	\N	\N
147	\N	\N	\N
148	\N	\N	\N
149	\N	\N	\N
150	\N	\N	\N
151	\N	\N	\N
152	\N	\N	\N
153	\N	\N	\N
154	\N	\N	\N
155	\N	\N	\N
156	\N	\N	\N
157	\N	\N	\N
158	\N	\N	\N
159	\N	\N	\N
160	\N	\N	\N
161	\N	\N	\N
162	\N	\N	\N
163	\N	\N	\N
164	\N	\N	\N
165	\N	\N	\N
166	\N	\N	\N
167	\N	\N	\N
168	\N	\N	\N
169	\N	\N	\N
170	\N	\N	\N
171	\N	\N	\N
172	\N	\N	\N
173	\N	\N	\N
174	\N	\N	\N
175	\N	\N	\N
176	\N	\N	\N
177	\N	\N	\N
178	\N	\N	\N
179	\N	\N	\N
180	\N	\N	\N
181	\N	\N	\N
182	\N	\N	\N
183	\N	\N	\N
184	\N	\N	\N
185	\N	\N	\N
186	\N	\N	\N
187	\N	\N	\N
188	\N	\N	\N
189	\N	\N	\N
190	\N	\N	\N
191	\N	\N	\N
192	\N	\N	\N
193	\N	\N	\N
194	\N	\N	\N
195	\N	\N	\N
196	\N	\N	\N
197	\N	\N	\N
198	\N	\N	\N
199	\N	\N	\N
200	\N	\N	\N
201	\N	\N	\N
202	\N	\N	\N
203	\N	\N	\N
204	\N	\N	\N
205	\N	\N	\N
206	\N	\N	\N
207	\N	\N	\N
208	\N	\N	\N
209	\N	\N	\N
210	\N	\N	\N
211	\N	\N	\N
212	\N	\N	\N
213	\N	\N	\N
214	\N	\N	\N
215	\N	\N	\N
216	\N	\N	\N
217	\N	\N	\N
218	\N	\N	\N
219	\N	\N	\N
220	\N	\N	\N
221	\N	\N	\N
222	\N	\N	\N
223	\N	\N	\N
224	\N	\N	\N
225	\N	\N	\N
226	\N	\N	\N
227	\N	\N	\N
228	\N	\N	\N
229	\N	\N	\N
230	\N	\N	\N
231	\N	\N	\N
232	\N	\N	\N
233	\N	\N	\N
234	\N	\N	\N
235	\N	\N	\N
236	\N	\N	\N
237	\N	\N	\N
238	\N	\N	\N
239	\N	\N	\N
240	\N	\N	\N
241	\N	\N	\N
242	\N	\N	\N
243	\N	\N	\N
244	\N	\N	\N
245	\N	\N	\N
246	\N	\N	\N
247	\N	\N	\N
248	\N	\N	\N
249	\N	\N	\N
250	\N	\N	\N
251	\N	\N	\N
252	\N	\N	\N
253	\N	\N	\N
254	\N	\N	\N
255	\N	\N	\N
256	\N	\N	\N
257	\N	\N	\N
258	\N	\N	\N
259	\N	\N	\N
260	\N	\N	\N
261	\N	\N	\N
262	\N	\N	\N
263	\N	\N	\N
264	\N	\N	\N
265	\N	\N	\N
266	\N	\N	\N
267	\N	\N	\N
268	\N	\N	\N
269	\N	\N	\N
314	\N	\N	\N
315	\N	\N	\N
316	\N	\N	\N
317	\N	\N	\N
318	\N	\N	\N
319	\N	\N	\N
320	\N	\N	\N
321	\N	\N	\N
322	\N	\N	\N
323	\N	\N	\N
324	\N	\N	\N
325	\N	\N	\N
326	\N	\N	\N
327	\N	\N	\N
328	\N	\N	\N
329	\N	\N	\N
330	\N	\N	\N
331	\N	\N	\N
332	\N	\N	\N
333	\N	\N	\N
334	\N	\N	\N
335	\N	\N	\N
336	\N	\N	\N
337	\N	\N	\N
338	\N	\N	\N
339	\N	\N	\N
340	\N	\N	\N
341	\N	\N	\N
342	\N	\N	\N
343	\N	\N	\N
344	\N	\N	\N
345	\N	\N	\N
346	\N	\N	\N
347	\N	\N	\N
348	\N	\N	\N
349	\N	\N	\N
350	\N	\N	\N
351	\N	\N	\N
352	\N	\N	\N
353	\N	\N	\N
354	\N	\N	\N
355	\N	\N	\N
360	\N	\N	\N
361	\N	\N	\N
363	\N	\N	\N
364	\N	10	25
416	\N	15	20
417	\N	\N	\N
418	\N	\N	\N
419	\N	\N	\N
420	\N	\N	\N
421	\N	\N	\N
422	\N	\N	\N
423	\N	\N	\N
424	\N	\N	\N
425	\N	\N	\N
426	\N	\N	\N
427	\N	\N	\N
428	\N	\N	\N
429	\N	\N	\N
430	\N	\N	\N
431	\N	\N	\N
432	\N	\N	\N
433	\N	\N	\N
434	\N	\N	\N
435	\N	\N	\N
436	\N	\N	\N
437	\N	\N	\N
438	\N	\N	\N
439	\N	\N	\N
440	\N	\N	\N
441	\N	\N	\N
442	\N	\N	\N
443	\N	\N	\N
444	\N	\N	\N
445	\N	\N	\N
446	\N	\N	\N
447	\N	\N	\N
448	\N	\N	\N
449	\N	\N	\N
450	\N	\N	\N
451	\N	\N	\N
452	\N	\N	\N
453	\N	\N	\N
454	\N	\N	\N
455	\N	\N	\N
456	\N	\N	\N
457	\N	\N	\N
458	\N	\N	\N
459	\N	\N	\N
460	\N	10	20
461	\N	\N	\N
462	\N	\N	\N
463	\N	\N	\N
464	\N	\N	\N
465	\N	\N	\N
466	\N	\N	\N
467	\N	\N	\N
468	\N	\N	\N
469	\N	\N	\N
470	\N	\N	\N
471	\N	\N	\N
472	\N	\N	\N
473	\N	\N	\N
474	\N	\N	\N
475	\N	\N	\N
476	\N	\N	\N
477	\N	\N	\N
478	\N	\N	\N
479	\N	\N	\N
480	\N	\N	\N
481	\N	\N	\N
482	\N	\N	\N
483	\N	\N	\N
484	\N	\N	\N
485	\N	\N	\N
486	\N	\N	\N
488	\N	\N	\N
489	\N	\N	\N
490	\N	\N	\N
491	\N	\N	\N
493	\N	\N	\N
494	\N	\N	\N
495	\N	\N	\N
496	\N	\N	\N
497	\N	\N	\N
498	\N	\N	\N
499	\N	\N	\N
500	\N	\N	\N
501	\N	\N	\N
502	\N	\N	\N
503	\N	\N	\N
504	\N	\N	\N
505	\N	\N	\N
506	\N	\N	\N
507	\N	\N	\N
508	\N	\N	\N
509	\N	\N	\N
510	\N	\N	\N
511	\N	\N	\N
512	\N	\N	\N
513	\N	\N	\N
514	\N	\N	\N
515	\N	\N	\N
516	\N	\N	\N
517	\N	\N	\N
518	\N	\N	\N
519	\N	\N	\N
520	\N	\N	\N
521	\N	\N	\N
522	\N	\N	\N
523	\N	\N	\N
524	\N	\N	\N
525	\N	\N	\N
526	\N	\N	\N
527	\N	\N	\N
528	\N	\N	\N
529	\N	\N	\N
530	\N	\N	\N
531	\N	\N	\N
532	\N	\N	\N
533	\N	\N	\N
534	\N	\N	\N
535	\N	\N	\N
536	\N	\N	\N
537	\N	\N	\N
538	\N	\N	\N
539	\N	\N	\N
540	\N	\N	\N
541	\N	\N	\N
542	\N	\N	\N
543	\N	\N	\N
544	\N	\N	\N
545	\N	\N	\N
546	\N	\N	\N
547	\N	\N	\N
548	\N	\N	\N
549	\N	\N	\N
550	\N	\N	\N
551	\N	\N	\N
552	\N	\N	\N
553	\N	\N	\N
554	\N	\N	\N
555	\N	\N	\N
556	\N	\N	\N
557	\N	\N	\N
558	\N	\N	\N
559	\N	\N	\N
560	\N	\N	\N
561	\N	\N	\N
562	\N	\N	\N
563	\N	\N	\N
564	\N	\N	\N
565	\N	\N	\N
566	\N	\N	\N
567	\N	\N	\N
568	\N	\N	\N
569	\N	\N	\N
570	\N	\N	\N
571	\N	\N	\N
572	\N	\N	\N
573	\N	\N	\N
574	\N	\N	\N
575	\N	\N	\N
576	\N	\N	\N
577	\N	\N	\N
578	\N	\N	\N
579	\N	\N	\N
580	\N	\N	\N
581	\N	\N	\N
582	\N	\N	\N
583	\N	\N	\N
584	\N	\N	\N
585	\N	\N	\N
586	\N	\N	\N
587	\N	\N	\N
588	\N	\N	\N
589	\N	\N	\N
590	\N	\N	\N
591	\N	\N	\N
592	\N	\N	\N
593	\N	\N	\N
594	\N	\N	\N
595	\N	\N	\N
596	\N	\N	\N
597	\N	\N	\N
598	\N	\N	\N
599	\N	\N	\N
600	\N	\N	\N
601	\N	\N	\N
602	\N	\N	\N
603	\N	\N	\N
604	\N	\N	\N
605	\N	\N	\N
655	\N	\N	\N
656	\N	\N	\N
657	\N	\N	\N
658	\N	\N	\N
659	\N	\N	\N
660	\N	\N	\N
661	\N	\N	\N
662	\N	\N	\N
663	\N	\N	\N
664	\N	\N	\N
665	\N	\N	\N
666	\N	\N	\N
667	\N	\N	\N
668	\N	\N	\N
669	\N	\N	\N
670	\N	\N	\N
671	\N	\N	\N
672	\N	\N	\N
673	\N	\N	\N
674	\N	\N	\N
675	\N	\N	\N
676	\N	\N	\N
677	\N	\N	\N
678	\N	\N	\N
679	\N	\N	\N
680	\N	\N	\N
681	\N	\N	\N
682	\N	\N	\N
683	\N	\N	\N
684	\N	\N	\N
685	\N	\N	\N
686	\N	\N	\N
687	\N	\N	\N
688	\N	\N	\N
689	\N	\N	\N
690	\N	\N	\N
691	\N	\N	\N
692	\N	\N	\N
693	\N	\N	\N
750	\N	\N	\N
751	\N	\N	\N
752	\N	\N	\N
753	\N	\N	\N
754	\N	\N	\N
755	\N	\N	\N
756	\N	\N	\N
757	\N	\N	\N
758	\N	\N	\N
759	\N	\N	\N
760	\N	\N	\N
761	\N	\N	\N
762	\N	\N	\N
763	\N	\N	\N
764	\N	\N	\N
765	\N	\N	\N
766	\N	\N	\N
792	\N	\N	\N
793	\N	\N	\N
794	\N	\N	\N
795	\N	\N	\N
796	\N	\N	\N
797	\N	\N	\N
798	\N	\N	\N
799	\N	\N	\N
800	\N	\N	\N
801	\N	\N	\N
802	\N	\N	\N
803	\N	\N	\N
804	\N	\N	\N
805	\N	\N	\N
806	\N	\N	\N
807	\N	\N	\N
808	\N	\N	\N
809	\N	\N	\N
810	\N	\N	\N
811	\N	\N	\N
812	\N	\N	\N
813	\N	\N	\N
814	\N	\N	\N
815	\N	\N	\N
816	\N	\N	\N
817	\N	\N	\N
818	\N	\N	\N
819	\N	\N	\N
820	\N	\N	\N
821	\N	\N	\N
822	\N	\N	\N
823	\N	\N	\N
824	\N	\N	\N
825	\N	\N	\N
826	\N	\N	\N
827	\N	\N	\N
828	\N	\N	\N
829	\N	\N	\N
830	\N	\N	\N
831	\N	\N	\N
832	\N	\N	\N
833	\N	\N	\N
834	\N	\N	\N
835	\N	\N	\N
836	\N	\N	\N
837	\N	\N	\N
838	\N	\N	\N
839	\N	\N	\N
840	\N	\N	\N
841	\N	\N	\N
842	\N	\N	\N
843	\N	\N	\N
844	\N	\N	\N
845	\N	\N	\N
846	\N	\N	\N
847	\N	\N	\N
848	\N	\N	\N
849	\N	\N	\N
850	\N	\N	\N
851	\N	\N	\N
852	\N	\N	\N
853	\N	\N	\N
854	\N	\N	\N
855	\N	\N	\N
856	\N	\N	\N
857	\N	10	20
858	\N	\N	\N
859	\N	\N	\N
860	\N	\N	\N
861	\N	\N	\N
862	\N	\N	\N
863	\N	\N	\N
864	\N	\N	\N
865	\N	\N	\N
866	\N	\N	\N
867	\N	\N	\N
868	\N	\N	\N
869	\N	\N	\N
917	\N	\N	\N
918	\N	\N	\N
919	\N	\N	\N
920	\N	\N	\N
921	\N	\N	\N
922	\N	\N	\N
923	\N	\N	\N
924	\N	\N	\N
925	\N	\N	\N
926	\N	\N	\N
927	\N	\N	\N
928	\N	\N	\N
929	\N	\N	\N
930	\N	\N	\N
931	\N	\N	\N
932	\N	\N	\N
933	\N	\N	\N
934	\N	\N	\N
935	\N	\N	\N
936	\N	\N	\N
937	\N	\N	\N
938	\N	\N	\N
939	\N	\N	\N
940	\N	\N	\N
941	\N	\N	\N
942	\N	\N	\N
943	\N	\N	\N
944	\N	\N	\N
945	\N	\N	\N
946	\N	\N	\N
947	\N	\N	\N
948	\N	\N	\N
949	\N	\N	\N
950	\N	\N	\N
951	\N	\N	\N
952	\N	\N	\N
953	\N	\N	\N
954	\N	\N	\N
955	\N	\N	\N
956	\N	\N	\N
957	\N	\N	\N
958	\N	\N	\N
959	\N	\N	\N
960	\N	\N	\N
961	\N	\N	\N
962	\N	\N	\N
963	\N	\N	\N
964	\N	\N	\N
965	\N	\N	\N
966	\N	\N	\N
967	\N	\N	\N
968	\N	\N	\N
969	\N	\N	\N
970	\N	\N	\N
971	\N	\N	\N
972	\N	\N	\N
973	\N	\N	\N
974	\N	\N	\N
975	\N	\N	\N
976	\N	\N	\N
977	\N	\N	\N
978	\N	\N	\N
979	\N	\N	\N
980	\N	\N	\N
981	\N	\N	\N
982	\N	\N	\N
983	\N	\N	\N
984	\N	\N	\N
985	\N	\N	\N
986	\N	\N	\N
987	\N	\N	\N
988	\N	\N	\N
989	\N	\N	\N
990	\N	\N	\N
991	\N	\N	\N
992	\N	\N	\N
993	\N	\N	\N
994	\N	\N	\N
995	\N	\N	\N
996	\N	\N	\N
997	\N	\N	\N
998	\N	\N	\N
999	\N	\N	\N
1000	\N	\N	\N
1001	\N	\N	\N
1002	\N	\N	\N
1003	\N	\N	\N
1004	\N	\N	\N
1005	\N	\N	\N
1006	\N	\N	\N
1007	\N	\N	\N
1008	\N	\N	\N
1009	\N	\N	\N
1060	\N	\N	\N
1061	\N	\N	\N
1062	\N	\N	\N
1063	\N	\N	\N
1064	\N	\N	\N
1065	\N	\N	\N
1066	\N	\N	\N
1067	\N	\N	\N
1068	\N	\N	\N
1069	\N	\N	\N
1070	\N	\N	\N
1071	\N	\N	\N
1072	\N	\N	\N
1073	\N	\N	\N
1074	\N	\N	\N
1075	\N	\N	\N
1076	\N	\N	\N
1077	\N	\N	\N
1078	\N	\N	\N
1079	\N	\N	\N
1080	\N	\N	\N
1081	\N	\N	\N
1082	\N	\N	\N
1083	\N	\N	\N
1084	\N	\N	\N
1085	\N	\N	\N
1086	\N	\N	\N
1087	\N	\N	\N
1088	\N	\N	\N
1089	\N	\N	\N
1090	\N	\N	\N
1091	\N	\N	\N
1092	\N	\N	\N
1093	\N	\N	\N
1094	\N	\N	\N
1095	\N	\N	\N
1096	\N	\N	\N
1097	\N	\N	\N
1098	\N	\N	\N
1099	\N	\N	\N
1100	\N	\N	\N
1101	\N	\N	\N
1102	\N	\N	\N
1103	\N	\N	\N
1104	\N	\N	\N
1105	\N	\N	\N
1106	\N	\N	\N
1107	\N	\N	\N
1108	\N	\N	\N
1109	\N	\N	\N
1110	\N	\N	\N
1111	\N	\N	\N
1112	\N	\N	\N
1113	\N	\N	\N
1114	\N	\N	\N
1115	\N	\N	\N
1116	\N	\N	\N
1117	\N	\N	\N
1118	\N	\N	\N
1119	\N	\N	\N
1120	\N	\N	\N
1121	\N	\N	\N
1122	\N	\N	\N
1123	\N	\N	\N
1124	\N	\N	\N
1125	\N	\N	\N
1126	\N	\N	\N
1127	\N	\N	\N
1128	\N	\N	\N
1129	\N	\N	\N
1130	\N	\N	\N
1131	\N	\N	\N
1132	\N	\N	\N
1133	\N	\N	\N
1134	\N	\N	\N
1135	\N	\N	\N
1136	\N	\N	\N
1137	\N	\N	\N
1138	\N	\N	\N
1139	\N	\N	\N
1140	\N	\N	\N
1141	\N	\N	\N
1142	\N	\N	\N
1143	\N	\N	\N
1144	\N	\N	\N
1145	\N	\N	\N
1146	\N	\N	\N
1147	\N	\N	\N
1148	\N	\N	\N
1149	\N	\N	\N
1150	\N	\N	\N
1151	\N	\N	\N
1152	\N	\N	\N
1153	\N	\N	\N
1154	\N	\N	\N
1155	\N	\N	\N
1156	\N	\N	\N
1157	\N	\N	\N
1158	\N	\N	\N
1159	\N	\N	\N
1160	\N	\N	\N
1161	\N	\N	\N
1162	\N	\N	\N
1163	\N	\N	\N
1164	\N	\N	\N
1165	\N	\N	\N
1166	\N	\N	\N
1167	\N	\N	\N
1168	\N	\N	\N
1169	\N	\N	\N
1170	\N	\N	\N
1171	\N	\N	\N
1172	\N	\N	\N
1173	\N	\N	\N
1174	\N	\N	\N
1175	\N	\N	\N
1176	\N	\N	\N
1177	\N	\N	\N
1178	\N	\N	\N
1179	\N	\N	\N
1180	\N	\N	\N
1181	\N	\N	\N
1182	\N	\N	\N
1183	\N	\N	\N
1184	\N	\N	\N
1185	\N	\N	\N
1186	\N	\N	\N
1187	\N	\N	\N
1188	\N	\N	\N
1189	\N	\N	\N
1190	\N	\N	\N
1191	\N	\N	\N
1192	\N	\N	\N
1193	\N	\N	\N
1194	\N	\N	\N
1195	\N	\N	\N
1196	\N	\N	\N
1247	\N	\N	\N
1248	\N	\N	\N
1249	\N	\N	\N
1250	\N	\N	\N
1251	\N	\N	\N
1252	\N	\N	\N
1253	\N	\N	\N
1254	\N	\N	\N
1255	\N	\N	\N
1256	\N	\N	\N
1257	\N	\N	\N
1258	\N	\N	\N
1259	\N	\N	\N
1260	\N	\N	\N
1261	\N	\N	\N
1262	\N	\N	\N
1263	\N	\N	\N
1264	\N	\N	\N
1265	\N	\N	\N
1266	\N	\N	\N
1267	\N	\N	\N
1268	\N	\N	\N
1269	\N	\N	\N
1270	\N	\N	\N
1271	\N	\N	\N
1272	\N	\N	\N
1273	\N	\N	\N
1274	\N	\N	\N
1275	\N	\N	\N
1276	\N	\N	\N
1277	\N	\N	\N
1278	\N	\N	\N
1279	\N	\N	\N
1280	\N	\N	\N
1281	\N	\N	\N
1282	\N	\N	\N
1283	\N	\N	\N
1284	\N	\N	\N
1285	\N	\N	\N
1286	\N	\N	\N
1287	\N	\N	\N
1288	\N	\N	\N
1289	\N	\N	\N
1290	\N	\N	\N
1291	\N	\N	\N
1292	\N	\N	\N
1293	\N	\N	\N
1294	\N	\N	\N
1295	\N	\N	\N
1296	\N	\N	\N
1297	\N	\N	\N
1298	\N	\N	\N
1299	\N	\N	\N
1300	\N	\N	\N
1301	\N	\N	\N
1302	\N	\N	\N
1303	\N	\N	\N
1304	\N	\N	\N
1305	\N	\N	\N
1306	\N	\N	\N
1307	\N	\N	\N
1308	\N	\N	\N
1309	\N	\N	\N
1310	\N	\N	\N
1311	\N	\N	\N
1312	\N	\N	\N
1313	\N	\N	\N
1314	\N	\N	\N
1315	\N	\N	\N
1316	\N	\N	\N
1317	\N	\N	\N
1318	\N	\N	\N
1319	\N	\N	\N
1320	\N	\N	\N
1321	\N	\N	\N
1322	\N	\N	\N
1323	\N	\N	\N
1324	\N	\N	\N
1325	\N	\N	\N
1326	\N	\N	\N
1327	\N	\N	\N
1328	\N	\N	\N
1329	\N	\N	\N
1330	\N	\N	\N
1331	\N	\N	\N
1332	\N	\N	\N
1333	\N	\N	\N
1334	\N	\N	\N
1335	\N	\N	\N
1336	\N	\N	\N
1337	\N	\N	\N
1338	\N	\N	\N
1339	\N	\N	\N
1340	\N	\N	\N
1341	\N	\N	\N
1342	\N	\N	\N
1343	\N	\N	\N
1344	\N	\N	\N
1345	\N	\N	\N
1346	\N	\N	\N
1347	\N	\N	\N
1348	\N	\N	\N
1349	\N	\N	\N
1350	\N	\N	\N
1351	\N	\N	\N
1352	\N	\N	\N
1353	\N	\N	\N
1354	\N	\N	\N
1355	\N	\N	\N
1356	\N	\N	\N
1357	\N	\N	\N
1358	\N	\N	\N
1359	\N	\N	\N
1360	\N	\N	\N
1361	\N	\N	\N
1362	\N	\N	\N
1363	\N	\N	\N
1364	\N	\N	\N
1365	\N	\N	\N
1366	\N	\N	\N
1367	\N	\N	\N
1368	\N	\N	\N
1369	\N	\N	\N
1370	\N	\N	\N
1371	\N	\N	\N
1372	\N	\N	\N
1373	\N	\N	\N
1374	\N	\N	\N
1375	\N	\N	\N
1376	\N	\N	\N
1377	\N	\N	\N
1378	\N	\N	\N
1379	\N	\N	\N
1380	\N	\N	\N
1381	\N	\N	\N
1382	\N	\N	\N
1383	\N	\N	\N
1384	\N	\N	\N
1385	\N	\N	\N
1386	\N	\N	\N
1387	\N	\N	\N
1487	\N	\N	\N
1488	\N	\N	\N
1489	\N	\N	\N
1490	\N	\N	\N
1491	\N	\N	\N
1492	\N	\N	\N
1493	\N	\N	\N
1494	\N	\N	\N
1495	\N	\N	\N
1496	\N	\N	\N
1497	\N	\N	\N
1498	\N	\N	\N
1499	\N	\N	\N
1500	\N	\N	\N
1501	\N	\N	\N
1502	\N	\N	\N
1503	\N	\N	\N
1504	\N	\N	\N
1505	\N	\N	\N
1506	\N	\N	\N
1507	\N	\N	\N
1508	\N	\N	\N
1509	\N	\N	\N
1510	\N	\N	\N
1511	\N	\N	\N
1512	\N	\N	\N
1513	\N	\N	\N
1514	\N	\N	\N
1515	\N	\N	\N
1516	\N	\N	\N
1517	\N	\N	\N
1518	\N	\N	\N
1519	\N	\N	\N
1520	\N	\N	\N
1521	\N	\N	\N
1522	\N	\N	\N
1523	\N	\N	\N
1524	\N	\N	\N
1525	\N	\N	\N
1526	\N	\N	\N
1527	\N	\N	\N
1528	\N	\N	\N
1529	\N	\N	\N
1530	\N	\N	\N
1531	\N	\N	\N
1532	\N	\N	\N
1543	\N	\N	\N
1544	\N	\N	\N
1545	\N	\N	\N
1546	\N	\N	\N
1547	\N	\N	\N
1548	\N	\N	\N
1549	\N	\N	\N
1550	\N	\N	\N
1551	\N	\N	\N
1552	\N	\N	\N
1636	\N	\N	\N
1637	\N	\N	\N
1638	\N	\N	\N
1639	\N	\N	\N
1640	\N	\N	\N
1641	\N	\N	\N
1642	\N	\N	\N
1643	\N	\N	\N
1644	\N	\N	\N
1645	\N	\N	\N
1646	\N	\N	\N
1647	\N	\N	\N
1648	\N	\N	\N
1649	\N	\N	\N
1650	\N	\N	\N
1651	\N	\N	\N
1652	\N	\N	\N
1653	\N	\N	\N
1654	\N	\N	\N
1655	\N	\N	\N
1656	\N	\N	\N
1657	\N	\N	\N
1658	\N	\N	\N
1659	\N	\N	\N
1660	\N	\N	\N
1661	\N	\N	\N
1662	\N	\N	\N
1663	\N	\N	\N
1664	\N	\N	\N
1665	\N	\N	\N
1666	\N	\N	\N
1667	\N	\N	\N
1668	\N	\N	\N
1669	\N	\N	\N
1670	\N	\N	\N
1671	\N	\N	\N
1672	\N	\N	\N
1673	\N	\N	\N
1674	\N	\N	\N
1675	\N	\N	\N
1676	\N	\N	\N
1677	\N	\N	\N
1678	\N	\N	\N
1679	\N	\N	\N
1680	\N	\N	\N
1681	\N	\N	\N
1682	\N	\N	\N
1683	\N	\N	\N
1684	\N	\N	\N
1685	\N	\N	\N
1686	\N	\N	\N
1687	\N	\N	\N
1688	\N	\N	\N
1689	\N	\N	\N
1690	\N	\N	\N
1691	\N	\N	\N
1692	\N	\N	\N
1693	\N	\N	\N
1694	\N	\N	\N
1695	\N	\N	\N
1696	\N	\N	\N
1697	\N	\N	\N
1698	\N	\N	\N
1699	\N	\N	\N
1700	\N	\N	\N
1701	\N	\N	\N
1702	\N	\N	\N
1703	\N	\N	\N
1704	\N	\N	\N
1705	\N	\N	\N
1706	\N	\N	\N
1707	\N	\N	\N
1708	\N	\N	\N
1709	\N	\N	\N
1710	\N	\N	\N
1711	\N	\N	\N
1712	\N	\N	\N
1713	\N	\N	\N
1714	\N	\N	\N
1715	\N	\N	\N
1716	\N	\N	\N
1717	\N	\N	\N
1718	\N	\N	\N
1719	\N	\N	\N
1720	\N	\N	\N
1721	\N	\N	\N
1722	\N	\N	\N
1723	\N	\N	\N
1724	\N	\N	\N
1725	\N	\N	\N
1726	\N	\N	\N
1727	\N	\N	\N
1728	\N	\N	\N
1729	\N	\N	\N
1730	\N	\N	\N
1731	\N	\N	\N
1732	\N	\N	\N
1733	\N	\N	\N
1734	\N	\N	\N
1735	\N	\N	\N
1736	\N	\N	\N
1737	\N	\N	\N
1738	\N	\N	\N
1739	\N	\N	\N
1740	\N	\N	\N
1741	\N	\N	\N
1792	\N	\N	\N
1793	\N	\N	\N
1794	\N	\N	\N
1795	\N	\N	\N
1796	\N	\N	\N
1797	\N	\N	\N
1798	\N	\N	\N
1799	\N	\N	\N
1800	\N	\N	\N
1801	\N	\N	\N
1802	\N	\N	\N
1803	\N	\N	\N
1804	\N	\N	\N
1805	\N	\N	\N
1806	\N	\N	\N
1807	\N	\N	\N
1808	\N	\N	\N
1809	\N	\N	\N
1810	\N	\N	\N
1811	\N	\N	\N
1812	\N	\N	\N
1813	\N	\N	\N
1814	\N	\N	\N
1815	\N	\N	\N
1816	\N	\N	\N
1817	\N	\N	\N
1818	\N	\N	\N
1819	\N	\N	\N
1820	\N	\N	\N
1821	\N	\N	\N
1822	\N	\N	\N
1823	\N	\N	\N
1824	\N	\N	\N
1825	\N	\N	\N
1826	\N	\N	\N
1827	\N	\N	\N
1828	\N	\N	\N
1829	\N	\N	\N
1830	\N	\N	\N
1831	\N	\N	\N
1832	\N	\N	\N
1833	\N	\N	\N
1834	\N	\N	\N
1835	\N	\N	\N
1836	\N	\N	\N
1837	\N	\N	\N
1838	\N	\N	\N
1839	\N	\N	\N
1840	\N	\N	\N
1841	\N	\N	\N
1842	\N	\N	\N
1843	\N	\N	\N
1844	\N	\N	\N
1845	\N	\N	\N
1846	\N	\N	\N
1847	\N	\N	\N
1848	\N	\N	\N
1849	\N	\N	\N
1850	\N	\N	\N
1851	\N	\N	\N
1852	\N	\N	\N
1853	\N	\N	\N
1854	\N	\N	\N
1855	\N	\N	\N
1856	\N	\N	\N
1857	\N	\N	\N
1858	\N	\N	\N
1859	\N	\N	\N
1860	\N	\N	\N
1861	\N	\N	\N
1862	\N	\N	\N
1863	\N	\N	\N
1864	\N	\N	\N
1865	\N	\N	\N
1866	\N	\N	\N
1867	\N	\N	\N
1868	\N	\N	\N
1869	\N	\N	\N
1870	\N	\N	\N
1871	\N	\N	\N
1872	\N	\N	\N
1873	\N	\N	\N
1874	\N	\N	\N
1875	\N	\N	\N
1876	\N	\N	\N
1877	\N	\N	\N
1878	\N	\N	\N
1879	\N	\N	\N
1880	\N	\N	\N
1931	\N	\N	\N
1932	\N	\N	\N
1933	\N	\N	\N
1934	\N	\N	\N
1935	\N	\N	\N
1936	\N	\N	\N
1937	\N	\N	\N
1938	\N	\N	\N
1939	\N	\N	\N
1940	\N	\N	\N
1941	\N	\N	\N
1942	\N	\N	\N
1943	\N	\N	\N
1944	\N	\N	\N
1945	\N	\N	\N
1946	\N	\N	\N
1947	\N	\N	\N
1948	\N	\N	\N
1949	\N	\N	\N
1950	\N	\N	\N
1951	\N	\N	\N
1952	\N	\N	\N
1953	\N	\N	\N
1954	\N	\N	\N
1955	\N	\N	\N
1956	\N	\N	\N
1957	\N	\N	\N
1958	\N	\N	\N
1959	\N	\N	\N
1960	\N	\N	\N
1961	\N	\N	\N
1962	\N	\N	\N
1963	\N	\N	\N
1964	\N	\N	\N
1965	\N	\N	\N
1966	\N	\N	\N
1967	\N	\N	\N
1968	\N	\N	\N
1969	\N	\N	\N
1970	\N	\N	\N
1971	\N	\N	\N
1972	\N	\N	\N
1973	\N	\N	\N
1974	\N	\N	\N
1975	\N	\N	\N
1976	\N	\N	\N
1977	\N	\N	\N
1978	\N	\N	\N
2029	\N	\N	\N
2030	\N	50	70
2031	\N	\N	\N
2032	\N	80	120
2033	\N	\N	\N
2034	\N	\N	\N
2035	\N	50	80
2036	\N	\N	\N
2037	\N	\N	\N
2038	\N	\N	\N
2039	\N	\N	\N
2040	\N	\N	\N
2041	\N	\N	\N
2042	\N	\N	\N
2043	\N	\N	\N
2044	\N	\N	\N
2045	\N	\N	\N
2046	\N	\N	\N
2047	\N	\N	\N
2048	\N	\N	\N
2049	\N	\N	\N
2050	\N	\N	\N
2051	\N	\N	\N
2052	\N	\N	\N
2053	\N	\N	\N
2054	\N	\N	\N
2055	\N	\N	\N
2056	\N	\N	\N
2057	\N	\N	\N
2058	\N	\N	\N
2059	\N	\N	\N
2060	\N	\N	\N
2061	\N	\N	\N
2062	\N	\N	\N
2063	\N	\N	\N
2064	\N	\N	\N
2065	\N	\N	\N
2066	\N	\N	\N
2067	\N	\N	\N
2068	\N	\N	\N
2069	\N	\N	\N
2070	\N	\N	\N
2071	\N	\N	\N
2072	\N	\N	\N
2073	\N	\N	\N
2074	\N	\N	\N
2075	\N	\N	\N
2076	\N	\N	\N
2077	\N	\N	\N
2078	\N	\N	\N
2079	\N	\N	\N
2080	\N	\N	\N
2081	\N	\N	\N
2082	\N	\N	\N
2083	\N	\N	\N
2084	\N	\N	\N
2085	\N	\N	\N
2086	\N	\N	\N
2087	\N	\N	\N
2088	\N	\N	\N
2089	\N	\N	\N
2090	\N	\N	\N
2091	\N	\N	\N
2092	\N	\N	\N
2093	\N	\N	\N
2094	\N	\N	\N
2095	\N	\N	\N
2096	\N	\N	\N
2097	\N	\N	\N
2098	\N	\N	\N
2099	\N	\N	\N
2100	\N	\N	\N
2101	\N	\N	\N
2102	\N	\N	\N
2103	\N	\N	\N
2104	\N	\N	\N
2105	\N	\N	\N
2106	\N	\N	\N
2107	\N	\N	\N
2108	\N	\N	\N
2109	\N	\N	\N
2110	\N	\N	\N
2111	\N	\N	\N
2112	\N	\N	\N
2113	\N	\N	\N
2114	\N	\N	\N
2115	\N	\N	\N
2116	\N	\N	\N
2117	\N	\N	\N
2118	\N	\N	\N
2119	\N	\N	\N
2120	\N	\N	\N
2121	\N	\N	\N
2122	\N	\N	\N
2123	\N	\N	\N
2124	\N	\N	\N
2125	\N	\N	\N
2126	\N	\N	\N
2127	\N	\N	\N
2128	\N	\N	\N
2129	\N	\N	\N
2130	\N	\N	\N
2131	\N	\N	\N
2132	\N	\N	\N
2133	\N	\N	\N
2134	\N	\N	\N
2135	\N	\N	\N
2136	\N	\N	\N
2137	\N	\N	\N
2138	\N	\N	\N
2139	\N	\N	\N
2140	\N	\N	\N
2141	\N	\N	\N
2142	\N	\N	\N
2143	\N	\N	\N
2144	\N	\N	\N
2145	\N	\N	\N
2146	\N	\N	\N
2147	\N	\N	\N
2148	\N	\N	\N
2149	\N	\N	\N
2150	\N	\N	\N
2151	\N	\N	\N
2152	\N	\N	\N
2153	\N	\N	\N
2154	\N	\N	\N
2155	\N	\N	\N
2156	\N	\N	\N
2157	\N	\N	\N
2158	\N	\N	\N
2159	\N	\N	\N
2160	\N	\N	\N
2161	\N	\N	\N
2162	\N	\N	\N
2163	\N	\N	\N
2164	\N	\N	\N
2165	\N	\N	\N
2166	\N	\N	\N
2167	\N	\N	\N
2168	\N	\N	\N
2169	\N	\N	\N
2170	\N	\N	\N
2171	\N	\N	\N
2172	\N	\N	\N
2173	\N	\N	\N
2174	\N	\N	\N
2175	\N	\N	\N
2176	\N	\N	\N
2177	\N	\N	\N
2178	\N	\N	\N
2179	\N	\N	\N
2180	\N	\N	\N
2181	\N	\N	\N
2182	\N	\N	\N
2183	\N	\N	\N
2184	\N	\N	\N
2185	\N	\N	\N
2186	\N	\N	\N
2187	\N	\N	\N
2188	\N	\N	\N
2189	\N	\N	\N
2190	\N	\N	\N
2191	\N	\N	\N
2192	\N	\N	\N
2193	\N	\N	\N
2194	\N	\N	\N
2195	\N	\N	\N
2196	\N	\N	\N
2197	\N	\N	\N
2198	\N	\N	\N
2199	\N	\N	\N
2200	\N	\N	\N
2201	\N	\N	\N
2202	\N	\N	\N
2203	\N	\N	\N
2204	\N	\N	\N
2205	\N	\N	\N
2206	\N	\N	\N
2207	\N	\N	\N
2208	\N	\N	\N
2209	\N	\N	\N
2295	\N	\N	\N
2296	\N	\N	\N
2297	\N	\N	\N
2298	\N	\N	\N
2299	\N	\N	\N
2300	\N	\N	\N
2301	\N	\N	\N
2302	\N	\N	\N
2303	\N	\N	\N
2304	\N	\N	\N
2305	\N	\N	\N
2306	\N	\N	\N
2307	\N	\N	\N
2308	\N	\N	\N
2309	\N	\N	\N
2310	\N	\N	\N
2311	\N	\N	\N
2312	\N	\N	\N
2313	\N	\N	\N
2314	\N	\N	\N
2315	\N	\N	\N
2316	\N	\N	\N
2317	\N	\N	\N
2318	\N	\N	\N
2319	\N	\N	\N
2320	\N	\N	\N
2321	\N	\N	\N
2322	\N	\N	\N
2323	\N	\N	\N
2324	\N	\N	\N
2325	\N	\N	\N
2326	\N	\N	\N
2327	\N	\N	\N
2328	\N	\N	\N
2329	\N	\N	\N
2330	\N	\N	\N
2331	\N	\N	\N
2332	\N	\N	\N
2333	\N	\N	\N
2334	\N	\N	\N
2335	\N	\N	\N
2336	\N	\N	\N
2337	\N	\N	\N
2338	\N	\N	\N
2339	\N	\N	\N
2340	\N	\N	\N
2341	\N	\N	\N
2342	\N	\N	\N
2343	\N	\N	\N
2344	\N	\N	\N
2345	\N	\N	\N
2346	\N	\N	\N
2347	\N	\N	\N
2348	\N	\N	\N
2349	\N	\N	\N
2350	\N	\N	\N
2351	\N	\N	\N
2352	\N	\N	\N
2353	\N	\N	\N
2354	\N	\N	\N
2355	\N	\N	\N
2356	\N	\N	\N
2357	\N	\N	\N
2358	\N	\N	\N
2359	\N	\N	\N
2360	\N	\N	\N
2361	\N	\N	\N
2362	\N	\N	\N
2363	\N	\N	\N
2414	\N	\N	\N
2415	\N	\N	\N
2416	\N	\N	\N
2417	\N	\N	\N
2418	\N	\N	\N
2419	\N	\N	\N
2420	\N	\N	\N
2421	\N	\N	\N
2422	\N	\N	\N
2423	\N	\N	\N
2424	\N	\N	\N
2425	\N	\N	\N
2426	\N	\N	\N
2427	\N	\N	\N
2428	\N	\N	\N
2429	\N	\N	\N
2430	\N	\N	\N
2431	\N	\N	\N
2432	\N	\N	\N
2433	\N	\N	\N
2434	\N	\N	\N
2435	\N	\N	\N
2436	\N	\N	\N
2437	\N	\N	\N
2438	\N	\N	\N
2439	\N	\N	\N
2440	\N	\N	\N
2441	\N	\N	\N
2442	\N	\N	\N
2443	\N	\N	\N
2444	\N	\N	\N
2445	\N	\N	\N
2446	\N	\N	\N
2447	\N	\N	\N
2448	\N	\N	\N
2449	\N	\N	\N
2450	\N	\N	\N
2451	\N	\N	\N
2452	\N	\N	\N
2453	\N	\N	\N
2454	\N	\N	\N
2455	\N	\N	\N
2456	\N	\N	\N
2457	\N	\N	\N
2458	\N	\N	\N
2459	\N	\N	\N
2460	\N	\N	\N
2461	\N	\N	\N
2462	\N	\N	\N
2463	\N	\N	\N
2464	\N	\N	\N
2465	\N	\N	\N
2466	\N	\N	\N
2467	\N	\N	\N
2468	\N	\N	\N
2469	\N	\N	\N
2470	\N	\N	\N
2471	\N	\N	\N
2472	\N	\N	\N
2473	\N	\N	\N
2474	\N	\N	\N
2475	\N	\N	\N
2476	\N	\N	\N
2477	\N	\N	\N
2478	\N	\N	\N
2479	\N	\N	\N
2480	\N	\N	\N
2481	\N	\N	\N
2482	\N	\N	\N
2483	\N	\N	\N
2484	\N	\N	\N
2535	\N	\N	\N
2536	\N	\N	\N
2537	\N	\N	\N
2538	\N	\N	\N
2539	\N	\N	\N
2540	\N	\N	\N
2541	\N	\N	\N
2542	\N	\N	\N
2543	\N	\N	\N
2544	\N	\N	\N
2545	\N	\N	\N
2554	\N	\N	\N
2555	\N	\N	\N
2556	\N	\N	\N
2557	\N	\N	\N
2558	\N	\N	\N
2559	\N	\N	\N
2560	\N	\N	\N
2561	\N	\N	\N
2562	\N	\N	\N
2563	\N	\N	\N
2564	\N	\N	\N
2565	\N	\N	\N
2566	\N	\N	\N
2567	\N	\N	\N
2568	\N	\N	\N
2569	\N	\N	\N
2570	\N	\N	\N
2571	\N	\N	\N
2572	\N	\N	\N
2573	\N	\N	\N
2574	\N	\N	\N
2575	\N	\N	\N
2576	\N	\N	\N
2577	\N	\N	\N
2578	\N	\N	\N
2579	\N	\N	\N
2580	\N	\N	\N
2581	\N	\N	\N
2582	\N	\N	\N
2583	\N	\N	\N
2584	\N	\N	\N
2585	\N	\N	\N
2586	\N	\N	\N
2587	\N	\N	\N
2588	\N	\N	\N
2589	\N	\N	\N
2590	\N	\N	\N
2591	\N	\N	\N
2592	\N	\N	\N
2593	\N	\N	\N
2594	\N	\N	\N
2595	\N	\N	\N
2596	\N	\N	\N
2597	\N	\N	\N
2598	\N	\N	\N
2599	\N	\N	\N
2600	\N	\N	\N
2601	\N	\N	\N
2602	\N	\N	\N
2627	\N	\N	\N
2628	\N	\N	\N
2629	\N	\N	\N
2630	\N	\N	\N
2631	\N	\N	\N
2632	\N	\N	\N
2633	\N	\N	\N
2634	\N	\N	\N
2635	\N	\N	\N
2636	\N	\N	\N
2637	\N	\N	\N
2638	\N	\N	\N
2639	\N	\N	\N
2640	\N	\N	\N
2641	\N	\N	\N
2642	\N	\N	\N
2643	\N	\N	\N
2644	\N	\N	\N
2645	\N	\N	\N
2646	\N	\N	\N
2647	\N	\N	\N
2648	\N	\N	\N
2649	\N	\N	\N
2650	\N	\N	\N
2651	\N	\N	\N
2652	\N	\N	\N
2653	\N	\N	\N
2654	\N	\N	\N
2655	\N	\N	\N
2656	\N	\N	\N
2657	\N	\N	\N
2658	\N	\N	\N
2659	\N	\N	\N
2660	\N	\N	\N
2661	\N	\N	\N
2662	\N	\N	\N
2663	\N	\N	\N
2664	\N	\N	\N
2665	\N	\N	\N
2666	\N	\N	\N
2667	\N	\N	\N
2718	\N	\N	\N
2719	\N	\N	\N
2720	\N	\N	\N
2721	\N	\N	\N
2722	\N	\N	\N
2723	\N	\N	\N
2724	\N	\N	\N
2725	\N	\N	\N
2726	\N	\N	\N
2727	\N	\N	\N
2728	\N	\N	\N
2729	\N	\N	\N
2730	\N	\N	\N
2731	\N	\N	\N
2732	\N	\N	\N
2733	\N	\N	\N
2734	\N	\N	\N
2735	\N	\N	\N
2736	\N	\N	\N
2737	\N	\N	\N
2738	\N	\N	\N
2739	\N	\N	\N
2740	\N	\N	\N
2741	\N	\N	\N
2742	\N	\N	\N
2743	\N	\N	\N
2744	\N	\N	\N
2745	\N	\N	\N
2746	\N	\N	\N
2747	\N	\N	\N
2748	\N	\N	\N
2749	\N	\N	\N
2750	\N	\N	\N
2751	\N	\N	\N
2752	\N	\N	\N
2753	\N	\N	\N
2754	\N	\N	\N
2755	\N	\N	\N
2756	\N	\N	\N
2757	\N	\N	\N
2758	\N	\N	\N
2759	\N	\N	\N
2760	\N	\N	\N
2761	\N	\N	\N
2762	\N	\N	\N
2763	\N	\N	\N
2764	\N	\N	\N
2765	\N	\N	\N
2766	\N	\N	\N
2767	\N	\N	\N
2768	\N	\N	\N
2769	\N	\N	\N
2770	\N	\N	\N
2771	\N	\N	\N
2772	\N	\N	\N
2773	\N	\N	\N
2774	\N	\N	\N
2775	\N	\N	\N
2776	\N	\N	\N
2777	\N	\N	\N
2778	\N	\N	\N
2779	\N	\N	\N
2780	\N	\N	\N
2781	\N	\N	\N
2782	\N	\N	\N
2783	\N	\N	\N
2784	\N	\N	\N
2785	\N	\N	\N
2786	\N	\N	\N
2787	\N	\N	\N
2788	\N	\N	\N
2789	\N	\N	\N
2790	\N	\N	\N
2791	\N	\N	\N
2792	\N	\N	\N
2793	\N	\N	\N
2794	\N	\N	\N
2795	\N	\N	\N
2796	\N	\N	\N
2797	\N	\N	\N
2798	\N	\N	\N
2799	\N	\N	\N
2800	\N	\N	\N
2801	\N	\N	\N
2802	\N	\N	\N
2803	\N	\N	\N
2804	\N	\N	\N
2805	\N	\N	\N
2806	\N	\N	\N
2807	\N	\N	\N
2808	\N	\N	\N
2809	\N	\N	\N
2810	\N	\N	\N
2811	\N	\N	\N
2812	\N	\N	\N
2813	\N	\N	\N
2814	\N	\N	\N
2815	\N	\N	\N
2816	\N	\N	\N
2817	\N	\N	\N
2818	\N	\N	\N
2819	\N	\N	\N
2820	\N	\N	\N
2821	\N	\N	\N
2822	\N	\N	\N
2823	\N	\N	\N
2824	\N	\N	\N
2825	\N	\N	\N
2826	\N	\N	\N
2827	\N	\N	\N
2828	\N	\N	\N
2829	\N	\N	\N
2830	\N	\N	\N
2831	\N	\N	\N
2832	\N	\N	\N
2833	\N	\N	\N
2834	\N	\N	\N
2835	\N	\N	\N
2836	\N	\N	\N
2837	\N	\N	\N
2838	\N	\N	\N
2839	\N	\N	\N
2840	\N	\N	\N
2841	\N	\N	\N
2842	\N	\N	\N
2843	\N	\N	\N
2844	\N	\N	\N
2845	\N	\N	\N
2846	\N	\N	\N
2847	\N	\N	\N
2848	\N	\N	\N
2849	\N	\N	\N
2850	\N	\N	\N
2851	\N	\N	\N
2852	\N	\N	\N
2853	\N	\N	\N
2854	\N	\N	\N
2855	\N	\N	\N
2856	\N	\N	\N
2857	\N	\N	\N
2858	\N	\N	\N
2859	\N	\N	\N
2860	\N	\N	\N
2861	\N	\N	\N
2862	\N	\N	\N
2863	\N	\N	\N
2864	\N	\N	\N
2865	\N	\N	\N
2866	\N	\N	\N
2867	\N	\N	\N
2868	\N	\N	\N
2869	\N	\N	\N
2870	\N	\N	\N
2871	\N	\N	\N
2872	\N	\N	\N
2873	\N	\N	\N
2874	\N	\N	\N
2875	\N	\N	\N
2876	\N	\N	\N
2877	\N	\N	\N
2878	\N	\N	\N
2879	\N	\N	\N
2880	\N	\N	\N
2881	\N	\N	\N
2882	\N	\N	\N
2883	\N	\N	\N
2884	\N	\N	\N
2885	\N	\N	\N
2886	\N	\N	\N
2887	\N	\N	\N
2888	\N	\N	\N
2889	\N	\N	\N
2890	\N	\N	\N
2891	\N	\N	\N
2892	\N	\N	\N
2893	\N	\N	\N
2894	\N	\N	\N
2895	\N	\N	\N
2896	\N	\N	\N
2897	\N	\N	\N
2898	\N	\N	\N
2899	\N	\N	\N
2900	\N	\N	\N
2901	\N	\N	\N
2902	\N	\N	\N
2903	\N	\N	\N
2904	\N	\N	\N
2905	\N	\N	\N
2906	\N	\N	\N
2907	\N	\N	\N
2908	\N	\N	\N
2909	\N	\N	\N
2910	\N	\N	\N
2911	\N	\N	\N
2912	\N	\N	\N
2913	\N	\N	\N
2914	\N	\N	\N
2915	\N	\N	\N
2916	\N	\N	\N
2917	\N	\N	\N
2918	\N	\N	\N
2919	\N	\N	\N
2920	\N	\N	\N
2921	\N	\N	\N
2922	\N	\N	\N
2923	\N	\N	\N
2924	\N	\N	\N
2925	\N	\N	\N
2926	\N	\N	\N
2927	\N	\N	\N
2928	\N	\N	\N
2929	\N	\N	\N
2930	\N	\N	\N
2931	\N	\N	\N
2932	\N	\N	\N
2933	\N	\N	\N
2934	\N	\N	\N
2935	\N	\N	\N
2936	\N	\N	\N
2937	\N	\N	\N
2938	\N	\N	\N
2939	\N	\N	\N
2940	\N	\N	\N
2941	\N	\N	\N
2942	\N	\N	\N
2943	\N	\N	\N
2944	\N	\N	\N
2945	\N	\N	\N
2946	\N	\N	\N
2947	\N	\N	\N
2948	\N	\N	\N
2949	\N	\N	\N
2950	\N	\N	\N
2951	\N	\N	\N
2952	\N	\N	\N
2953	\N	\N	\N
2954	\N	\N	\N
2955	\N	\N	\N
2956	\N	\N	\N
2957	\N	\N	\N
2958	\N	\N	\N
2959	\N	\N	\N
2960	\N	\N	\N
2961	\N	\N	\N
2962	\N	\N	\N
2963	\N	\N	\N
2964	\N	\N	\N
2965	\N	\N	\N
2966	\N	\N	\N
2967	\N	\N	\N
2968	\N	\N	\N
2969	\N	\N	\N
2970	\N	\N	\N
2971	\N	\N	\N
2972	\N	\N	\N
2973	\N	\N	\N
2974	\N	\N	\N
2975	\N	\N	\N
2976	\N	\N	\N
2977	\N	\N	\N
2981	\N	\N	\N
2982	\N	\N	\N
2983	\N	\N	\N
2984	\N	\N	\N
2985	\N	\N	\N
2986	\N	\N	\N
2987	\N	\N	\N
2988	\N	\N	\N
2989	\N	\N	\N
2990	\N	\N	\N
2991	\N	\N	\N
2992	\N	\N	\N
2993	\N	\N	\N
2994	\N	\N	\N
2995	\N	\N	\N
2996	\N	\N	\N
2997	\N	\N	\N
2998	\N	\N	\N
2999	\N	\N	\N
3000	\N	\N	\N
3001	\N	\N	\N
3002	\N	\N	\N
3003	\N	\N	\N
3004	\N	\N	\N
3005	\N	\N	\N
3006	\N	\N	\N
3007	\N	\N	\N
3008	\N	\N	\N
3009	\N	\N	\N
3010	\N	\N	\N
3011	\N	\N	\N
3012	\N	\N	\N
3013	\N	\N	\N
3014	\N	\N	\N
3102	\N	\N	\N
3103	\N	\N	\N
3104	\N	\N	\N
3105	\N	\N	\N
3106	\N	\N	\N
3107	\N	\N	\N
3108	\N	\N	\N
3109	\N	\N	\N
3110	\N	\N	\N
3111	\N	\N	\N
3112	\N	\N	\N
3113	\N	\N	\N
3114	\N	\N	\N
3115	\N	\N	\N
3116	\N	\N	\N
3117	\N	\N	\N
3118	\N	\N	\N
3119	\N	\N	\N
3120	\N	\N	\N
3121	\N	\N	\N
3122	\N	\N	\N
3123	\N	\N	\N
3124	\N	\N	\N
3125	\N	\N	\N
3126	\N	\N	\N
3127	\N	\N	\N
3128	\N	\N	\N
3129	\N	\N	\N
3130	\N	\N	\N
3131	\N	\N	\N
3132	\N	\N	\N
3133	\N	\N	\N
3134	\N	\N	\N
3135	\N	\N	\N
3136	\N	\N	\N
3137	\N	\N	\N
3138	\N	\N	\N
3139	\N	\N	\N
3140	\N	\N	\N
3141	\N	\N	\N
3142	\N	\N	\N
3143	\N	\N	\N
3144	\N	\N	\N
3145	\N	\N	\N
3146	\N	\N	\N
3147	\N	\N	\N
3148	\N	\N	\N
3149	\N	\N	\N
3150	\N	\N	\N
3151	\N	\N	\N
3152	\N	\N	\N
3153	\N	\N	\N
3154	\N	\N	\N
3155	\N	\N	\N
3156	\N	\N	\N
3157	\N	\N	\N
3158	\N	\N	\N
3159	\N	\N	\N
3160	\N	\N	\N
3161	\N	\N	\N
3162	\N	\N	\N
3163	\N	\N	\N
3164	\N	\N	\N
3215	\N	\N	\N
3216	\N	\N	\N
3217	\N	\N	\N
3218	\N	\N	\N
3219	\N	\N	\N
3220	\N	\N	\N
3221	\N	\N	\N
3222	\N	\N	\N
3223	\N	\N	\N
3224	\N	\N	\N
3225	\N	\N	\N
3226	\N	\N	\N
3227	\N	\N	\N
3228	\N	\N	\N
3229	\N	\N	\N
3230	\N	\N	\N
3231	\N	\N	\N
3232	\N	\N	\N
3233	\N	\N	\N
3234	\N	\N	\N
3235	\N	\N	\N
3236	\N	\N	\N
3237	\N	\N	\N
3238	\N	\N	\N
3239	\N	\N	\N
3240	\N	\N	\N
3241	\N	\N	\N
3242	\N	\N	\N
3243	\N	\N	\N
3244	\N	\N	\N
3245	\N	\N	\N
3246	\N	\N	\N
3247	\N	\N	\N
3248	\N	\N	\N
3249	\N	\N	\N
3250	\N	\N	\N
3251	\N	\N	\N
3252	\N	\N	\N
3253	\N	\N	\N
3254	\N	\N	\N
3255	\N	\N	\N
3256	\N	\N	\N
3257	\N	\N	\N
3258	\N	\N	\N
3259	\N	\N	\N
3260	\N	\N	\N
3261	\N	\N	\N
3262	\N	\N	\N
3263	\N	\N	\N
3264	\N	\N	\N
3265	\N	\N	\N
3266	\N	\N	\N
3267	\N	\N	\N
3268	\N	\N	\N
3269	\N	\N	\N
3270	\N	\N	\N
3271	\N	\N	\N
3272	\N	\N	\N
3273	\N	\N	\N
3274	\N	\N	\N
3275	\N	\N	\N
3276	\N	\N	\N
3277	\N	\N	\N
3278	\N	\N	\N
3279	\N	\N	\N
3280	\N	\N	\N
3281	\N	\N	\N
3282	\N	\N	\N
3283	\N	\N	\N
3284	\N	\N	\N
3285	\N	\N	\N
3286	\N	\N	\N
3287	\N	\N	\N
3288	\N	\N	\N
3289	\N	\N	\N
3290	\N	\N	\N
3291	\N	\N	\N
3292	\N	\N	\N
3293	\N	\N	\N
3294	\N	\N	\N
3295	\N	\N	\N
3296	\N	\N	\N
3297	\N	\N	\N
3298	\N	\N	\N
3299	\N	\N	\N
3300	\N	\N	\N
3301	\N	\N	\N
3302	\N	\N	\N
3303	\N	\N	\N
3304	\N	\N	\N
3305	\N	\N	\N
3306	\N	\N	\N
3307	\N	\N	\N
3308	\N	\N	\N
3309	\N	\N	\N
3310	\N	\N	\N
3311	\N	\N	\N
3312	\N	\N	\N
3313	\N	\N	\N
3314	\N	\N	\N
3315	\N	\N	\N
3316	\N	\N	\N
3317	\N	\N	\N
3318	\N	\N	\N
3319	\N	\N	\N
3320	\N	\N	\N
3321	\N	\N	\N
3322	\N	\N	\N
3323	\N	\N	\N
3324	\N	\N	\N
3325	\N	\N	\N
3326	\N	\N	\N
3327	\N	\N	\N
3328	\N	\N	\N
3329	\N	\N	\N
3330	\N	\N	\N
3331	\N	\N	\N
3332	\N	\N	\N
3333	\N	\N	\N
3334	\N	\N	\N
3335	\N	\N	\N
3336	\N	\N	\N
3337	\N	\N	\N
3338	\N	\N	\N
3339	\N	\N	\N
3340	\N	\N	\N
3341	\N	\N	\N
3342	\N	\N	\N
3343	\N	\N	\N
3344	\N	\N	\N
3345	\N	\N	\N
3346	\N	\N	\N
3347	\N	\N	\N
3348	\N	\N	\N
3349	\N	\N	\N
3350	\N	\N	\N
3351	\N	\N	\N
3352	\N	\N	\N
3353	\N	\N	\N
3354	\N	\N	\N
3355	\N	\N	\N
3356	\N	\N	\N
3357	\N	\N	\N
3358	\N	\N	\N
3359	\N	\N	\N
3360	\N	\N	\N
3361	\N	\N	\N
3362	\N	\N	\N
3363	\N	\N	\N
3364	\N	\N	\N
3365	\N	\N	\N
3366	\N	\N	\N
3367	\N	\N	\N
3368	\N	\N	\N
3369	\N	\N	\N
3370	\N	\N	\N
3371	\N	\N	\N
3372	\N	\N	\N
3373	\N	\N	\N
3374	\N	\N	\N
3375	\N	\N	\N
3376	\N	\N	\N
3377	\N	\N	\N
3378	\N	\N	\N
3379	\N	\N	\N
3380	\N	\N	\N
3381	\N	\N	\N
3382	\N	\N	\N
3383	\N	\N	\N
3384	\N	\N	\N
3385	\N	\N	\N
3386	\N	\N	\N
3387	\N	\N	\N
3388	\N	\N	\N
3389	\N	\N	\N
3390	\N	\N	\N
3391	\N	\N	\N
3392	\N	\N	\N
3393	\N	\N	\N
3394	\N	\N	\N
3395	\N	\N	\N
3396	\N	\N	\N
3397	\N	\N	\N
3398	\N	\N	\N
3399	\N	\N	\N
3449	\N	\N	\N
3450	\N	\N	\N
3451	\N	\N	\N
3452	\N	\N	\N
3453	\N	\N	\N
3454	\N	\N	\N
3455	\N	\N	\N
3456	\N	\N	\N
3457	\N	\N	\N
3458	\N	\N	\N
3459	\N	\N	\N
3460	\N	\N	\N
3461	\N	\N	\N
3462	\N	\N	\N
3463	\N	\N	\N
3464	\N	\N	\N
3465	\N	\N	\N
3466	\N	\N	\N
3467	\N	\N	\N
3468	\N	\N	\N
3469	\N	\N	\N
3470	\N	\N	\N
3471	\N	\N	\N
3472	\N	\N	\N
3473	\N	\N	\N
3474	\N	\N	\N
3475	\N	\N	\N
3476	\N	\N	\N
3477	\N	\N	\N
3478	\N	\N	\N
3479	\N	\N	\N
3480	\N	\N	\N
3481	\N	\N	\N
3482	\N	\N	\N
3483	\N	\N	\N
3484	\N	\N	\N
3485	\N	\N	\N
3486	\N	\N	\N
3487	\N	\N	\N
3488	\N	\N	\N
3489	\N	\N	\N
3490	\N	\N	\N
3491	\N	\N	\N
3492	\N	\N	\N
3493	\N	\N	\N
3494	\N	\N	\N
3495	\N	\N	\N
3496	\N	\N	\N
3546	\N	\N	\N
3547	\N	\N	\N
3548	\N	\N	\N
3549	\N	\N	\N
3550	\N	\N	\N
3551	\N	\N	\N
3552	\N	\N	\N
3553	\N	\N	\N
3554	\N	\N	\N
3555	\N	\N	\N
3556	\N	\N	\N
3557	\N	\N	\N
3558	\N	\N	\N
3559	\N	\N	\N
3560	\N	\N	\N
3561	\N	\N	\N
3562	\N	\N	\N
3563	\N	\N	\N
3564	\N	\N	\N
3565	\N	\N	\N
3566	\N	\N	\N
3567	\N	\N	\N
3568	\N	\N	\N
3569	\N	\N	\N
3570	\N	\N	\N
3571	\N	\N	\N
3572	\N	\N	\N
3573	\N	\N	\N
3574	\N	\N	\N
3575	\N	\N	\N
3576	\N	\N	\N
3577	\N	\N	\N
3578	\N	\N	\N
3579	\N	\N	\N
3580	\N	\N	\N
3581	\N	\N	\N
3582	\N	\N	\N
3583	\N	\N	\N
3584	\N	\N	\N
3585	\N	\N	\N
3586	\N	\N	\N
3587	\N	\N	\N
3588	\N	\N	\N
3589	\N	\N	\N
3590	\N	\N	\N
3591	\N	\N	\N
3592	\N	\N	\N
3593	\N	\N	\N
3644	\N	\N	\N
3645	\N	\N	\N
3646	\N	\N	\N
3647	\N	\N	\N
3648	\N	\N	\N
3649	\N	\N	\N
3650	\N	\N	\N
3651	\N	\N	\N
3652	\N	\N	\N
3653	\N	\N	\N
3654	\N	\N	\N
3655	\N	\N	\N
3656	\N	\N	\N
3657	\N	\N	\N
3658	\N	\N	\N
3659	\N	\N	\N
3660	\N	\N	\N
3661	\N	\N	\N
3662	\N	\N	\N
3663	\N	\N	\N
3664	\N	\N	\N
3665	\N	\N	\N
3666	\N	\N	\N
3667	\N	\N	\N
3668	\N	\N	\N
3669	\N	\N	\N
3670	\N	\N	\N
3671	\N	\N	\N
3672	\N	\N	\N
3673	\N	\N	\N
3674	\N	\N	\N
3675	\N	\N	\N
3676	\N	\N	\N
3677	\N	\N	\N
3678	\N	\N	\N
3679	\N	\N	\N
3680	\N	\N	\N
3681	\N	\N	\N
3682	\N	\N	\N
3683	\N	\N	\N
3684	\N	\N	\N
3715	\N	\N	\N
3716	\N	\N	\N
3717	\N	\N	\N
3718	\N	\N	\N
3719	\N	\N	\N
3720	\N	\N	\N
3721	\N	\N	\N
3722	\N	\N	\N
3723	\N	\N	\N
3724	\N	\N	\N
3725	\N	\N	\N
3726	\N	\N	\N
3727	\N	\N	\N
3728	\N	\N	\N
3729	\N	\N	\N
3730	\N	\N	\N
3731	\N	\N	\N
3732	\N	\N	\N
3733	\N	\N	\N
3734	\N	\N	\N
3735	\N	\N	\N
3736	\N	\N	\N
3737	\N	\N	\N
3738	\N	\N	\N
3739	\N	\N	\N
3740	\N	\N	\N
3741	\N	\N	\N
3742	\N	\N	\N
3743	\N	\N	\N
3744	\N	\N	\N
3745	\N	\N	\N
3746	\N	\N	\N
3747	\N	\N	\N
3748	\N	\N	\N
3749	\N	\N	\N
3750	\N	\N	\N
3751	\N	\N	\N
3752	\N	\N	\N
3753	\N	\N	\N
3754	\N	\N	\N
3755	\N	\N	\N
3756	\N	\N	\N
3757	\N	\N	\N
3758	\N	\N	\N
3759	\N	\N	\N
3760	\N	\N	\N
3761	\N	\N	\N
3762	\N	\N	\N
3763	\N	\N	\N
3764	\N	\N	\N
3765	\N	\N	\N
3766	\N	\N	\N
3767	\N	\N	\N
3768	\N	\N	\N
3769	\N	\N	\N
3770	\N	\N	\N
3771	\N	\N	\N
3772	\N	\N	\N
3773	\N	\N	\N
3774	\N	\N	\N
3775	\N	\N	\N
3776	\N	\N	\N
3777	\N	\N	\N
3778	\N	\N	\N
3779	\N	\N	\N
3780	\N	\N	\N
3781	\N	\N	\N
3782	\N	\N	\N
3783	\N	\N	\N
3784	\N	\N	\N
3785	\N	\N	\N
3786	\N	\N	\N
3787	\N	\N	\N
3788	\N	\N	\N
3789	\N	\N	\N
3790	\N	\N	\N
3791	\N	\N	\N
3792	\N	\N	\N
3793	\N	\N	\N
3794	\N	\N	\N
3795	\N	\N	\N
3796	\N	\N	\N
3797	\N	\N	\N
3798	\N	\N	\N
3799	\N	\N	\N
3800	\N	\N	\N
3801	\N	\N	\N
3802	\N	\N	\N
3803	\N	\N	\N
3804	\N	\N	\N
3805	\N	\N	\N
3806	\N	\N	\N
3807	\N	\N	\N
3808	\N	\N	\N
3809	\N	\N	\N
3810	\N	\N	\N
3811	\N	\N	\N
3812	\N	\N	\N
3813	\N	\N	\N
3814	\N	\N	\N
3815	\N	\N	\N
3816	\N	\N	\N
3817	\N	\N	\N
3818	\N	\N	\N
3819	\N	\N	\N
3820	\N	\N	\N
3821	\N	\N	\N
3822	\N	\N	\N
3823	\N	\N	\N
3824	\N	\N	\N
3825	\N	\N	\N
3826	\N	\N	\N
3827	\N	\N	\N
3828	\N	\N	\N
3829	\N	\N	\N
3830	\N	\N	\N
3831	\N	\N	\N
3832	\N	\N	\N
3833	\N	\N	\N
3834	\N	\N	\N
3835	\N	\N	\N
3836	\N	\N	\N
3837	\N	\N	\N
3838	\N	\N	\N
3839	\N	\N	\N
3840	\N	\N	\N
3841	\N	\N	\N
3842	\N	\N	\N
3843	\N	\N	\N
3844	\N	\N	\N
3845	\N	\N	\N
3846	\N	\N	\N
3847	\N	\N	\N
3848	\N	\N	\N
3849	\N	\N	\N
3850	\N	\N	\N
3851	\N	\N	\N
3852	\N	\N	\N
3853	\N	\N	\N
3854	\N	\N	\N
3855	\N	\N	\N
3856	\N	\N	\N
3857	\N	\N	\N
3858	\N	\N	\N
3859	\N	\N	\N
3860	\N	\N	\N
3861	\N	\N	\N
3862	\N	\N	\N
3863	\N	\N	\N
3864	\N	\N	\N
3865	\N	\N	\N
3866	\N	\N	\N
3867	\N	\N	\N
3868	\N	\N	\N
3869	\N	\N	\N
3870	\N	\N	\N
3871	\N	\N	\N
3872	\N	\N	\N
3873	\N	\N	\N
3874	\N	\N	\N
3875	\N	\N	\N
3876	\N	\N	\N
3877	\N	\N	\N
3878	\N	\N	\N
3879	\N	\N	\N
3880	\N	\N	\N
3881	\N	\N	\N
3882	\N	\N	\N
3883	\N	\N	\N
3884	\N	\N	\N
3885	\N	\N	\N
3886	\N	\N	\N
3887	\N	\N	\N
3888	\N	\N	\N
3889	\N	\N	\N
3890	\N	\N	\N
3891	\N	\N	\N
3892	\N	\N	\N
3893	\N	\N	\N
3894	\N	\N	\N
3895	\N	\N	\N
3896	\N	\N	\N
3947	\N	\N	\N
3948	\N	\N	\N
3949	\N	\N	\N
3950	\N	\N	\N
3951	\N	\N	\N
3952	\N	\N	\N
3953	\N	\N	\N
3954	\N	\N	\N
3955	\N	\N	\N
3956	\N	\N	\N
3957	\N	\N	\N
3958	\N	\N	\N
3959	\N	\N	\N
3960	\N	\N	\N
3961	\N	\N	\N
3962	\N	\N	\N
3963	\N	\N	\N
3964	\N	\N	\N
3965	\N	\N	\N
3966	\N	\N	\N
3967	\N	\N	\N
3968	\N	\N	\N
3969	\N	\N	\N
3970	\N	\N	\N
3971	\N	\N	\N
3972	\N	\N	\N
3973	\N	\N	\N
3974	\N	\N	\N
3975	\N	\N	\N
3976	\N	\N	\N
3977	\N	\N	\N
3978	\N	\N	\N
3979	\N	\N	\N
3980	\N	\N	\N
3981	\N	\N	\N
3982	\N	\N	\N
3983	\N	\N	\N
3984	\N	\N	\N
3985	\N	\N	\N
3986	\N	\N	\N
4037	\N	\N	\N
4038	\N	\N	\N
4039	\N	\N	\N
4040	\N	\N	\N
4041	\N	\N	\N
4042	\N	\N	\N
4043	\N	\N	\N
4044	\N	\N	\N
4045	\N	\N	\N
4046	\N	\N	\N
4047	\N	\N	\N
4048	\N	\N	\N
4049	\N	\N	\N
4050	\N	\N	\N
4051	\N	\N	\N
4052	\N	\N	\N
4053	\N	\N	\N
4054	\N	\N	\N
4055	\N	\N	\N
4056	\N	\N	\N
4057	\N	\N	\N
4058	\N	\N	\N
4059	\N	\N	\N
4060	\N	\N	\N
4061	\N	\N	\N
4062	\N	\N	\N
4063	\N	\N	\N
4064	\N	\N	\N
4065	\N	\N	\N
4066	\N	\N	\N
4067	\N	\N	\N
4068	\N	\N	\N
4069	\N	\N	\N
4070	\N	\N	\N
4071	\N	\N	\N
4072	\N	\N	\N
4073	\N	\N	\N
4074	\N	\N	\N
4075	\N	\N	\N
4076	\N	\N	\N
4077	\N	\N	\N
4078	\N	\N	\N
4079	\N	\N	\N
4080	\N	\N	\N
4081	\N	\N	\N
4082	\N	\N	\N
4083	\N	\N	\N
4084	\N	\N	\N
4085	\N	\N	\N
4086	\N	\N	\N
4087	\N	\N	\N
4088	\N	\N	\N
4089	\N	\N	\N
4090	\N	\N	\N
4091	\N	\N	\N
4092	\N	\N	\N
4093	\N	\N	\N
4094	\N	\N	\N
4095	\N	\N	\N
4096	\N	\N	\N
4097	\N	\N	\N
4098	\N	\N	\N
4099	\N	\N	\N
4100	\N	\N	\N
4101	\N	\N	\N
4102	\N	\N	\N
4103	\N	\N	\N
4104	\N	\N	\N
4105	\N	\N	\N
4106	\N	\N	\N
4107	\N	\N	\N
4108	\N	\N	\N
4109	\N	\N	\N
4110	\N	\N	\N
4111	\N	\N	\N
4112	\N	\N	\N
4113	\N	\N	\N
4114	\N	\N	\N
4115	\N	\N	\N
4116	\N	\N	\N
4117	\N	\N	\N
4118	\N	\N	\N
4119	\N	\N	\N
4120	\N	\N	\N
4121	\N	\N	\N
4122	\N	\N	\N
4123	\N	\N	\N
4174	\N	\N	\N
4175	\N	\N	\N
4176	\N	\N	\N
4177	\N	\N	\N
4178	\N	\N	\N
4179	\N	\N	\N
4180	\N	\N	\N
4181	\N	\N	\N
4182	\N	\N	\N
4183	\N	\N	\N
4184	\N	\N	\N
4185	\N	\N	\N
4186	\N	\N	\N
4187	\N	\N	\N
4188	\N	\N	\N
4189	\N	\N	\N
4190	\N	\N	\N
4191	\N	\N	\N
4192	\N	\N	\N
4193	\N	\N	\N
4194	\N	\N	\N
4195	\N	\N	\N
4196	\N	\N	\N
4197	\N	\N	\N
4198	\N	\N	\N
4199	\N	\N	\N
4200	\N	\N	\N
4201	\N	\N	\N
4202	\N	\N	\N
4203	\N	\N	\N
4204	\N	\N	\N
4205	\N	\N	\N
4206	\N	\N	\N
4207	\N	\N	\N
4208	\N	\N	\N
4209	\N	\N	\N
4210	\N	\N	\N
4211	\N	\N	\N
4212	\N	\N	\N
4213	\N	\N	\N
4214	\N	\N	\N
4215	\N	\N	\N
4216	\N	\N	\N
4217	\N	\N	\N
4218	\N	\N	\N
4219	\N	\N	\N
4234	\N	\N	\N
4235	\N	\N	\N
4236	\N	\N	\N
4237	\N	\N	\N
4238	\N	\N	\N
4239	\N	\N	\N
4240	\N	\N	\N
4241	\N	\N	\N
4242	\N	\N	\N
4243	\N	\N	\N
4244	\N	\N	\N
4245	\N	\N	\N
4246	\N	\N	\N
4247	\N	\N	\N
4248	\N	\N	\N
4249	\N	\N	\N
4250	\N	\N	\N
4251	\N	\N	\N
4252	\N	\N	\N
4253	\N	\N	\N
4254	\N	\N	\N
4255	\N	\N	\N
4256	\N	\N	\N
4257	\N	\N	\N
4258	\N	\N	\N
4259	\N	\N	\N
4260	\N	\N	\N
4261	\N	\N	\N
4262	\N	\N	\N
4263	\N	\N	\N
4264	\N	\N	\N
4265	\N	\N	\N
4266	\N	\N	\N
4267	\N	\N	\N
4268	\N	\N	\N
4269	\N	\N	\N
4270	\N	\N	\N
4271	\N	\N	\N
4272	\N	\N	\N
4273	\N	\N	\N
4274	\N	\N	\N
4275	\N	\N	\N
4276	\N	\N	\N
4277	\N	\N	\N
4278	\N	\N	\N
4279	\N	\N	\N
4280	\N	\N	\N
4281	\N	\N	\N
4282	\N	\N	\N
4283	\N	\N	\N
4284	\N	\N	\N
4285	\N	\N	\N
4286	\N	\N	\N
4287	\N	\N	\N
4288	\N	\N	\N
4289	\N	\N	\N
4290	\N	\N	\N
4291	\N	\N	\N
4292	\N	\N	\N
4293	\N	\N	\N
4294	\N	\N	\N
4295	\N	\N	\N
4296	\N	\N	\N
4297	\N	\N	\N
4298	\N	\N	\N
4299	\N	\N	\N
4300	\N	\N	\N
4301	\N	\N	\N
4302	\N	\N	\N
4303	\N	\N	\N
4304	\N	\N	\N
4305	\N	\N	\N
4306	\N	\N	\N
4307	\N	\N	\N
4308	\N	\N	\N
4309	\N	\N	\N
4310	\N	\N	\N
4311	\N	\N	\N
4312	\N	\N	\N
4313	\N	\N	\N
4314	\N	\N	\N
4315	\N	20	30
4316	\N	\N	\N
4317	\N	\N	\N
4318	\N	\N	\N
4319	\N	\N	\N
4320	\N	\N	\N
4321	\N	\N	\N
4322	\N	\N	\N
4323	\N	\N	\N
4324	\N	\N	\N
4325	\N	\N	\N
4326	\N	20	30
4327	\N	15	18
4328	\N	\N	\N
4329	\N	\N	\N
4330	\N	\N	\N
4331	\N	\N	\N
4332	\N	\N	\N
4333	\N	\N	\N
4334	\N	\N	\N
4335	\N	\N	\N
4336	\N	\N	\N
4337	\N	\N	\N
4339	\N	\N	\N
4340	\N	\N	\N
4341	\N	\N	\N
4343	\N	\N	\N
4344	\N	\N	\N
4346	\N	\N	\N
4347	\N	\N	\N
4349	\N	\N	\N
4350	\N	\N	\N
4353	\N	\N	\N
4356	\N	\N	\N
4358	\N	\N	\N
4360	\N	\N	\N
4362	\N	\N	\N
4364	\N	\N	\N
4366	\N	\N	\N
4368	\N	\N	\N
4369	\N	15	20
4406	\N	\N	\N
4407	\N	\N	\N
4408	\N	\N	\N
4409	\N	\N	\N
4410	\N	\N	\N
4411	\N	\N	\N
4412	\N	\N	\N
4413	\N	\N	\N
4414	\N	\N	\N
4415	\N	\N	\N
4416	\N	\N	\N
4417	\N	\N	\N
4418	\N	\N	\N
4419	\N	\N	\N
4420	\N	\N	\N
4421	\N	\N	\N
4422	\N	\N	\N
4423	\N	\N	\N
4424	\N	\N	\N
4425	\N	\N	\N
4426	\N	\N	\N
4427	\N	\N	\N
4428	\N	\N	\N
4429	\N	\N	\N
4430	\N	\N	\N
4431	\N	\N	\N
4432	\N	\N	\N
4433	\N	\N	\N
4434	\N	\N	\N
4435	\N	\N	\N
4436	\N	\N	\N
4486	\N	\N	\N
4487	\N	\N	\N
4488	\N	\N	\N
4489	\N	\N	\N
4490	\N	\N	\N
4491	\N	\N	\N
4492	\N	\N	\N
4493	\N	\N	\N
4494	\N	\N	\N
4495	\N	\N	\N
4496	\N	\N	\N
4497	\N	\N	\N
4498	\N	\N	\N
4499	\N	\N	\N
4500	\N	\N	\N
4501	\N	\N	\N
4502	\N	\N	\N
4503	\N	\N	\N
4504	\N	\N	\N
4505	\N	\N	\N
4506	\N	\N	\N
4507	\N	\N	\N
4508	\N	\N	\N
4509	\N	\N	\N
4510	\N	\N	\N
4511	\N	\N	\N
4512	\N	\N	\N
4513	\N	\N	\N
4514	\N	\N	\N
4515	\N	\N	\N
4516	\N	\N	\N
4517	\N	\N	\N
4518	\N	\N	\N
4534	\N	\N	\N
4535	\N	\N	\N
4536	\N	\N	\N
4537	\N	\N	\N
4538	\N	\N	\N
4539	\N	\N	\N
4540	\N	\N	\N
4541	\N	\N	\N
4542	\N	\N	\N
4543	\N	\N	\N
4544	\N	\N	\N
4545	\N	10	15
4546	\N	\N	\N
4547	\N	\N	\N
4548	\N	\N	\N
4549	\N	\N	\N
4550	\N	\N	\N
4551	\N	\N	\N
4552	\N	\N	\N
4553	\N	\N	\N
4554	\N	\N	\N
4555	\N	\N	\N
4556	\N	\N	\N
4558	\N	\N	\N
4559	\N	\N	\N
4560	\N	\N	\N
4561	\N	\N	\N
4562	\N	\N	\N
4563	\N	\N	\N
4564	\N	\N	\N
4565	\N	\N	\N
4566	\N	\N	\N
4567	\N	\N	\N
4568	\N	\N	\N
4569	\N	\N	\N
4570	\N	\N	\N
4571	\N	\N	\N
4572	\N	\N	\N
4573	\N	12	18
4574	\N	\N	\N
4575	\N	\N	\N
4576	\N	\N	\N
4577	\N	\N	\N
4578	\N	\N	\N
4579	\N	\N	\N
4580	\N	\N	\N
4581	\N	\N	\N
4582	\N	\N	\N
4583	\N	\N	\N
4584	\N	\N	\N
4585	\N	\N	\N
4586	\N	\N	\N
4587	\N	\N	\N
4588	\N	\N	\N
4589	\N	\N	\N
4590	\N	\N	\N
4631	\N	\N	\N
4632	\N	\N	\N
4633	\N	\N	\N
4634	\N	\N	\N
4635	\N	\N	\N
4636	\N	\N	\N
4637	\N	\N	\N
4638	\N	\N	\N
4639	\N	\N	\N
4640	\N	\N	\N
4641	\N	\N	\N
4642	\N	\N	\N
4643	\N	\N	\N
4644	\N	\N	\N
4645	\N	\N	\N
4646	\N	\N	\N
4647	\N	\N	\N
4707	\N	\N	\N
4708	\N	\N	\N
4709	\N	\N	\N
4710	\N	\N	\N
4711	\N	\N	\N
4712	\N	\N	\N
4713	\N	\N	\N
4714	\N	\N	\N
4716	\N	\N	\N
4717	\N	\N	\N
4718	\N	\N	\N
4719	\N	\N	\N
4720	\N	\N	\N
4721	\N	\N	\N
4722	\N	\N	\N
4723	\N	\N	\N
4724	\N	\N	\N
4725	\N	\N	\N
4726	\N	\N	\N
4727	\N	\N	\N
4728	\N	\N	\N
4729	\N	\N	\N
4730	\N	\N	\N
4731	\N	\N	\N
4732	\N	\N	\N
4733	\N	\N	\N
4734	\N	\N	\N
4736	\N	\N	\N
4737	\N	10	15
4738	\N	\N	\N
4739	\N	\N	\N
4740	\N	\N	\N
4741	\N	\N	\N
4742	\N	\N	\N
4743	\N	\N	\N
4744	\N	\N	\N
4745	\N	\N	\N
4746	\N	\N	\N
4747	\N	\N	\N
4748	\N	\N	\N
4749	\N	\N	\N
4750	\N	\N	\N
4751	\N	\N	\N
4752	\N	\N	\N
4753	\N	\N	\N
4754	\N	\N	\N
4755	\N	\N	\N
4756	\N	\N	\N
4757	\N	\N	\N
4758	\N	\N	\N
4759	\N	\N	\N
4760	\N	\N	\N
4761	\N	\N	\N
4762	\N	\N	\N
4763	\N	\N	\N
4764	\N	\N	\N
4765	\N	\N	\N
4766	\N	\N	\N
4767	\N	\N	\N
4768	\N	\N	\N
4769	\N	\N	\N
4770	\N	\N	\N
4771	\N	\N	\N
4772	\N	\N	\N
4773	\N	\N	\N
4774	\N	\N	\N
4775	\N	\N	\N
4776	\N	\N	\N
4777	\N	\N	\N
4778	\N	\N	\N
4779	\N	\N	\N
4780	\N	\N	\N
4781	\N	\N	\N
4782	\N	\N	\N
4783	\N	\N	\N
4784	\N	\N	\N
4785	\N	\N	\N
4786	\N	\N	\N
4787	\N	\N	\N
4788	\N	\N	\N
4839	\N	\N	\N
4840	\N	\N	\N
4841	\N	\N	\N
4842	\N	\N	\N
4843	\N	\N	\N
4844	\N	\N	\N
4845	\N	\N	\N
4846	\N	\N	\N
4847	\N	\N	\N
4848	\N	\N	\N
4849	\N	\N	\N
4850	\N	\N	\N
4851	\N	\N	\N
4852	\N	\N	\N
4853	\N	\N	\N
4854	\N	\N	\N
4855	\N	\N	\N
4856	\N	\N	\N
4857	\N	\N	\N
4858	\N	\N	\N
4859	\N	\N	\N
4860	\N	\N	\N
4861	\N	\N	\N
4862	\N	\N	\N
4863	\N	\N	\N
4864	\N	\N	\N
4865	\N	\N	\N
4866	\N	\N	\N
4867	\N	\N	\N
4868	\N	\N	\N
4869	\N	\N	\N
4870	\N	\N	\N
4871	\N	\N	\N
4872	\N	\N	\N
4873	\N	\N	\N
4874	\N	\N	\N
4875	\N	\N	\N
4876	\N	\N	\N
4877	\N	\N	\N
4879	\N	\N	\N
4880	\N	\N	\N
4930	\N	\N	\N
4931	\N	\N	\N
4932	\N	\N	\N
4933	\N	\N	\N
4934	\N	\N	\N
4935	\N	\N	\N
4936	\N	\N	\N
4937	\N	\N	\N
4938	\N	\N	\N
4939	\N	\N	\N
4940	\N	\N	\N
4941	\N	\N	\N
4942	\N	\N	\N
4943	\N	\N	\N
4944	\N	\N	\N
4945	\N	\N	\N
4946	\N	\N	\N
4947	\N	\N	\N
4948	\N	\N	\N
4949	\N	\N	\N
4950	\N	\N	\N
4951	\N	\N	\N
4952	\N	\N	\N
4953	\N	\N	\N
4954	\N	\N	\N
4955	\N	\N	\N
4956	\N	\N	\N
4957	\N	\N	\N
4958	\N	\N	\N
4959	\N	\N	\N
4960	\N	\N	\N
4961	\N	\N	\N
4962	\N	\N	\N
4963	\N	\N	\N
4964	\N	\N	\N
4965	\N	\N	\N
4966	\N	\N	\N
4967	\N	\N	\N
4968	\N	\N	\N
4969	\N	\N	\N
4970	\N	\N	\N
4971	\N	\N	\N
4972	\N	\N	\N
4973	\N	\N	\N
4974	\N	\N	\N
4975	\N	\N	\N
4976	\N	\N	\N
4977	\N	\N	\N
4978	\N	\N	\N
4979	\N	\N	\N
4980	\N	\N	\N
4981	\N	\N	\N
4982	\N	\N	\N
4983	\N	\N	\N
4984	\N	\N	\N
4985	\N	\N	\N
4986	\N	\N	\N
4987	\N	\N	\N
4988	\N	\N	\N
4989	\N	\N	\N
4990	\N	\N	\N
4991	\N	\N	\N
4992	\N	\N	\N
4993	\N	\N	\N
4994	\N	\N	\N
4995	\N	\N	\N
4996	\N	\N	\N
4997	\N	\N	\N
4998	\N	\N	\N
4999	\N	\N	\N
5000	\N	\N	\N
5001	\N	\N	\N
5002	\N	\N	\N
5003	\N	\N	\N
5004	\N	\N	\N
5005	\N	\N	\N
5006	\N	\N	\N
5007	\N	\N	\N
5008	\N	\N	\N
5009	\N	\N	\N
5010	\N	\N	\N
5011	\N	\N	\N
5012	\N	\N	\N
5013	\N	\N	\N
5014	\N	\N	\N
5015	\N	\N	\N
5016	\N	\N	\N
5017	\N	\N	\N
5018	\N	\N	\N
5019	\N	\N	\N
5020	\N	\N	\N
5021	\N	\N	\N
5022	\N	\N	\N
5023	\N	\N	\N
5024	\N	\N	\N
5025	\N	\N	\N
5026	\N	\N	\N
5027	\N	\N	\N
5028	\N	\N	\N
5029	\N	\N	\N
5030	\N	\N	\N
5031	\N	\N	\N
5032	\N	\N	\N
5033	\N	\N	\N
5034	\N	\N	\N
5035	\N	\N	\N
5036	\N	\N	\N
5037	\N	\N	\N
5038	\N	\N	\N
5039	\N	\N	\N
5040	\N	\N	\N
5041	\N	\N	\N
5042	\N	\N	\N
5043	\N	\N	\N
5044	\N	\N	\N
5045	\N	\N	\N
5046	\N	\N	\N
5047	\N	\N	\N
5048	\N	\N	\N
5049	\N	\N	\N
5050	\N	\N	\N
5051	\N	\N	\N
5052	\N	\N	\N
5053	\N	\N	\N
5054	\N	\N	\N
5055	\N	\N	\N
5056	\N	\N	\N
5057	\N	\N	\N
5058	\N	\N	\N
5059	\N	\N	\N
5060	\N	\N	\N
5061	\N	\N	\N
5062	\N	\N	\N
5063	\N	\N	\N
5064	\N	\N	\N
5065	\N	\N	\N
5066	\N	\N	\N
5067	\N	\N	\N
5068	\N	\N	\N
5069	\N	\N	\N
5070	\N	\N	\N
5071	\N	\N	\N
5072	\N	\N	\N
5073	\N	\N	\N
5074	\N	\N	\N
5075	\N	\N	\N
5076	\N	\N	\N
5077	\N	\N	\N
5078	\N	\N	\N
5079	\N	\N	\N
5080	\N	\N	\N
5081	\N	\N	\N
5082	\N	\N	\N
5083	\N	\N	\N
5084	\N	\N	\N
5085	\N	\N	\N
5086	\N	\N	\N
5087	\N	\N	\N
5088	\N	\N	\N
5089	\N	\N	\N
5090	\N	\N	\N
5091	\N	\N	\N
5092	\N	\N	\N
5093	\N	\N	\N
5094	\N	\N	\N
5095	\N	\N	\N
5096	\N	\N	\N
5097	\N	\N	\N
5098	\N	\N	\N
5099	\N	\N	\N
5100	\N	\N	\N
5101	\N	\N	\N
5102	\N	\N	\N
5103	\N	\N	\N
5104	\N	\N	\N
5182	\N	\N	\N
5183	\N	\N	\N
5184	\N	\N	\N
5185	\N	\N	\N
5186	\N	\N	\N
5187	\N	\N	\N
5188	\N	\N	\N
5189	\N	\N	\N
5190	\N	\N	\N
5191	\N	\N	\N
5192	\N	\N	\N
5193	\N	\N	\N
5194	\N	\N	\N
5195	\N	\N	\N
5196	\N	\N	\N
5197	\N	\N	\N
5198	\N	\N	\N
5199	\N	\N	\N
5200	\N	\N	\N
5201	\N	\N	\N
5202	\N	\N	\N
5203	\N	\N	\N
5204	\N	\N	\N
5205	\N	\N	\N
5206	\N	\N	\N
5207	\N	\N	\N
5208	\N	\N	\N
5209	\N	\N	\N
5210	\N	\N	\N
5211	\N	\N	\N
5212	\N	\N	\N
5213	\N	\N	\N
5214	\N	\N	\N
5215	\N	\N	\N
5216	\N	\N	\N
5217	\N	\N	\N
5218	\N	\N	\N
5219	\N	\N	\N
5220	\N	\N	\N
5221	\N	\N	\N
5222	\N	\N	\N
5223	\N	\N	\N
5224	\N	\N	\N
5225	\N	\N	\N
5226	\N	\N	\N
5227	\N	\N	\N
5228	\N	\N	\N
5229	\N	\N	\N
5235	\N	\N	\N
5236	\N	\N	\N
5237	\N	\N	\N
5238	\N	\N	\N
5239	\N	\N	\N
5240	\N	\N	\N
5241	\N	\N	\N
5242	\N	\N	\N
5243	\N	\N	\N
5244	\N	\N	\N
5245	\N	\N	\N
5246	\N	\N	\N
5247	\N	\N	\N
5248	\N	\N	\N
5249	\N	\N	\N
5250	\N	\N	\N
5251	\N	\N	\N
5252	\N	\N	\N
5253	\N	\N	\N
5254	\N	\N	\N
5255	\N	\N	\N
5256	\N	\N	\N
5257	\N	\N	\N
5258	\N	\N	\N
5259	\N	\N	\N
5260	\N	\N	\N
5261	\N	\N	\N
5262	\N	\N	\N
5263	\N	\N	\N
5264	\N	\N	\N
5265	\N	\N	\N
5266	\N	\N	\N
5267	\N	\N	\N
5268	\N	\N	\N
5269	\N	\N	\N
5270	\N	\N	\N
5271	\N	\N	\N
5272	\N	\N	\N
5273	\N	\N	\N
5274	\N	\N	\N
5275	\N	\N	\N
5276	\N	\N	\N
5277	\N	\N	\N
5278	\N	\N	\N
5279	\N	\N	\N
5280	\N	\N	\N
5281	\N	\N	\N
5282	\N	\N	\N
5283	\N	\N	\N
5284	\N	\N	\N
5285	\N	\N	\N
5286	\N	\N	\N
5287	\N	\N	\N
5288	\N	\N	\N
5289	\N	\N	\N
5290	\N	\N	\N
5291	\N	\N	\N
5292	\N	\N	\N
5293	\N	\N	\N
5294	\N	\N	\N
5295	\N	\N	\N
5296	\N	\N	\N
5297	\N	\N	\N
5298	\N	\N	\N
5299	\N	\N	\N
5300	\N	\N	\N
5301	\N	\N	\N
5302	\N	\N	\N
5303	\N	\N	\N
5304	\N	\N	\N
5305	\N	\N	\N
5306	\N	\N	\N
5307	\N	\N	\N
5308	\N	\N	\N
5309	\N	\N	\N
5310	\N	\N	\N
5311	\N	\N	\N
5312	\N	\N	\N
5313	\N	\N	\N
5314	\N	\N	\N
5315	\N	\N	\N
5316	\N	\N	\N
5317	\N	\N	\N
5318	\N	\N	\N
5319	\N	\N	\N
5320	\N	\N	\N
5321	\N	\N	\N
5322	\N	\N	\N
5323	\N	\N	\N
5324	\N	\N	\N
5325	\N	\N	\N
5326	\N	\N	\N
5327	\N	\N	\N
5328	\N	\N	\N
5329	\N	\N	\N
5330	\N	\N	\N
5331	\N	\N	\N
5332	\N	\N	\N
5333	\N	\N	\N
5334	\N	\N	\N
5335	\N	\N	\N
5336	\N	\N	\N
5337	\N	\N	\N
5338	\N	\N	\N
5339	\N	\N	\N
5340	\N	\N	\N
5341	\N	\N	\N
5342	\N	\N	\N
5343	\N	\N	\N
5344	\N	\N	\N
5345	\N	\N	\N
5346	\N	\N	\N
5347	\N	\N	\N
5348	\N	\N	\N
5349	\N	\N	\N
5350	\N	\N	\N
5351	\N	\N	\N
5352	\N	\N	\N
5353	\N	\N	\N
5354	\N	\N	\N
5355	\N	\N	\N
5356	\N	\N	\N
5357	\N	\N	\N
5358	\N	\N	\N
5359	\N	\N	\N
5360	\N	\N	\N
5361	\N	\N	\N
5362	\N	\N	\N
5363	\N	\N	\N
5364	\N	\N	\N
5365	\N	\N	\N
5366	\N	\N	\N
5367	\N	\N	\N
5368	\N	\N	\N
5369	\N	\N	\N
5370	\N	\N	\N
5371	\N	\N	\N
5372	\N	\N	\N
5373	\N	\N	\N
5374	\N	\N	\N
5375	\N	\N	\N
5376	\N	\N	\N
5377	\N	\N	\N
5378	\N	\N	\N
5379	\N	\N	\N
5380	\N	\N	\N
5381	\N	\N	\N
5382	\N	\N	\N
5383	\N	\N	\N
5384	\N	\N	\N
5385	\N	\N	\N
5386	\N	\N	\N
5387	\N	\N	\N
5388	\N	\N	\N
5389	\N	\N	\N
5390	\N	\N	\N
5441	\N	\N	\N
5442	\N	\N	\N
5443	\N	\N	\N
5444	\N	\N	\N
5445	\N	\N	\N
5446	\N	\N	\N
5447	\N	\N	\N
5448	\N	\N	\N
5449	\N	\N	\N
5450	\N	\N	\N
5451	\N	\N	\N
5452	\N	\N	\N
5453	\N	\N	\N
5454	\N	\N	\N
5455	\N	\N	\N
5456	\N	\N	\N
5457	\N	\N	\N
5458	\N	\N	\N
5459	\N	\N	\N
5460	\N	\N	\N
5461	\N	\N	\N
5462	\N	\N	\N
5463	\N	\N	\N
5464	\N	\N	\N
5465	\N	\N	\N
5466	\N	\N	\N
5467	\N	\N	\N
5468	\N	\N	\N
5469	\N	\N	\N
5470	\N	\N	\N
5471	\N	\N	\N
5472	\N	\N	\N
5473	\N	\N	\N
5474	\N	\N	\N
5475	\N	\N	\N
5476	\N	\N	\N
5477	\N	\N	\N
5478	\N	\N	\N
5479	\N	\N	\N
5480	\N	\N	\N
5481	\N	\N	\N
5482	\N	\N	\N
5483	\N	\N	\N
5484	\N	\N	\N
5485	\N	\N	\N
5486	\N	\N	\N
5487	\N	\N	\N
5488	\N	\N	\N
5489	\N	\N	\N
5490	\N	\N	\N
5491	\N	\N	\N
5492	\N	\N	\N
5493	\N	\N	\N
5494	\N	\N	\N
5495	\N	\N	\N
5496	\N	\N	\N
5497	\N	\N	\N
5498	\N	\N	\N
5499	\N	\N	\N
5500	\N	\N	\N
5501	\N	\N	\N
5502	\N	\N	\N
5503	\N	\N	\N
5504	\N	\N	\N
5505	\N	\N	\N
5506	\N	\N	\N
5507	\N	\N	\N
5508	\N	\N	\N
5509	\N	\N	\N
5510	\N	\N	\N
5511	\N	\N	\N
5512	\N	\N	\N
5513	\N	\N	\N
5514	\N	\N	\N
5515	\N	\N	\N
5516	\N	\N	\N
5517	\N	\N	\N
5518	\N	\N	\N
5519	\N	\N	\N
5520	\N	\N	\N
5521	\N	\N	\N
5522	\N	\N	\N
5523	\N	\N	\N
5524	\N	\N	\N
5525	\N	\N	\N
5526	\N	\N	\N
5527	\N	\N	\N
5528	\N	\N	\N
5529	\N	\N	\N
5530	\N	\N	\N
5531	\N	\N	\N
5532	\N	\N	\N
5533	\N	\N	\N
5534	\N	\N	\N
5535	\N	\N	\N
5536	\N	\N	\N
5537	\N	\N	\N
5538	\N	\N	\N
5539	\N	\N	\N
5540	\N	\N	\N
5541	\N	\N	\N
5542	\N	\N	\N
5543	\N	\N	\N
5544	\N	\N	\N
5545	\N	\N	\N
5584	\N	\N	\N
5585	\N	\N	\N
5586	\N	\N	\N
5587	\N	\N	\N
5588	\N	\N	\N
5589	\N	\N	\N
5590	\N	\N	\N
5591	\N	\N	\N
5592	\N	\N	\N
5593	\N	\N	\N
5594	\N	\N	\N
5595	\N	\N	\N
5596	\N	\N	\N
5606	\N	\N	\N
5609	\N	\N	\N
5612	\N	\N	\N
5616	\N	\N	\N
5618	\N	\N	\N
5619	\N	\N	\N
5621	\N	\N	\N
5623	\N	\N	\N
5625	\N	\N	\N
5627	\N	\N	\N
5629	\N	\N	\N
5631	\N	\N	\N
5634	\N	\N	\N
5636	\N	\N	\N
5639	\N	\N	\N
5641	\N	\N	\N
5643	\N	\N	\N
5645	\N	\N	\N
5647	\N	\N	\N
5649	\N	\N	\N
5652	\N	\N	\N
5654	\N	\N	\N
5656	\N	\N	\N
5658	\N	\N	\N
5660	\N	\N	\N
5661	\N	\N	\N
5663	\N	\N	\N
5665	\N	\N	\N
5669	\N	\N	\N
5673	\N	\N	\N
5676	\N	\N	\N
5678	\N	\N	\N
5679	\N	\N	\N
5680	\N	\N	\N
5681	\N	\N	\N
5682	\N	\N	\N
5683	\N	\N	\N
5684	\N	\N	\N
5685	\N	\N	\N
5686	\N	\N	\N
5687	\N	\N	\N
5688	\N	\N	\N
5689	\N	\N	\N
5690	\N	\N	\N
5691	\N	\N	\N
5692	\N	\N	\N
5693	\N	\N	\N
5694	\N	\N	\N
5695	\N	\N	\N
5696	\N	\N	\N
5697	\N	\N	\N
5698	\N	\N	\N
5699	\N	\N	\N
5700	\N	\N	\N
5701	\N	\N	\N
5702	\N	\N	\N
5703	\N	\N	\N
5704	\N	\N	\N
5705	\N	\N	\N
5706	\N	\N	\N
5707	\N	\N	\N
5708	\N	\N	\N
5709	\N	\N	\N
5710	\N	\N	\N
5711	\N	\N	\N
5712	\N	\N	\N
5713	\N	\N	\N
5714	\N	\N	\N
5715	\N	\N	\N
5716	\N	\N	\N
5717	\N	\N	\N
5718	\N	\N	\N
5719	\N	\N	\N
5720	\N	\N	\N
5721	\N	\N	\N
5722	\N	\N	\N
5723	\N	\N	\N
5724	\N	\N	\N
5725	\N	\N	\N
5726	\N	\N	\N
5727	\N	\N	\N
5728	\N	\N	\N
5729	\N	\N	\N
5730	\N	\N	\N
5731	\N	\N	\N
5732	\N	\N	\N
5733	\N	\N	\N
5734	\N	\N	\N
5735	\N	\N	\N
5736	\N	\N	\N
5737	\N	\N	\N
5738	\N	\N	\N
5739	\N	\N	\N
5740	\N	\N	\N
5741	\N	\N	\N
5742	\N	\N	\N
5743	\N	\N	\N
5744	\N	\N	\N
5745	\N	\N	\N
5746	\N	\N	\N
5747	\N	\N	\N
5748	\N	\N	\N
5749	\N	\N	\N
5750	\N	\N	\N
5751	\N	\N	\N
5752	\N	\N	\N
5753	\N	\N	\N
5754	\N	\N	\N
5755	\N	\N	\N
5756	\N	\N	\N
5757	\N	\N	\N
5758	\N	\N	\N
5759	\N	\N	\N
5760	\N	\N	\N
5761	\N	\N	\N
5762	\N	\N	\N
5763	\N	\N	\N
5764	\N	\N	\N
5765	\N	\N	\N
5766	\N	\N	\N
5767	\N	\N	\N
5768	\N	\N	\N
5769	\N	\N	\N
5770	\N	\N	\N
5771	\N	\N	\N
5772	\N	\N	\N
5773	\N	\N	\N
5774	\N	\N	\N
5775	\N	\N	\N
5776	\N	\N	\N
5777	\N	\N	\N
5778	\N	\N	\N
5779	\N	\N	\N
5780	\N	\N	\N
5781	\N	\N	\N
5782	\N	\N	\N
5783	\N	\N	\N
5834	\N	\N	\N
5835	\N	\N	\N
5836	\N	10	12
5837	\N	\N	\N
5838	\N	\N	\N
5839	\N	\N	\N
5840	\N	\N	\N
5841	\N	\N	\N
5842	\N	\N	\N
5843	\N	\N	\N
5844	\N	\N	\N
5845	\N	\N	\N
5846	\N	\N	\N
5847	\N	\N	\N
5848	\N	\N	\N
5849	\N	\N	\N
5850	\N	\N	\N
5851	\N	\N	\N
5852	\N	\N	\N
5853	\N	\N	\N
5854	\N	\N	\N
5855	\N	\N	\N
5856	\N	\N	\N
5857	\N	18	25
5858	\N	\N	\N
5859	\N	\N	\N
5860	\N	\N	\N
5861	\N	\N	\N
5862	\N	\N	\N
5863	\N	\N	\N
5864	\N	\N	\N
5865	\N	25	30
5866	\N	\N	\N
5867	\N	\N	\N
5868	\N	\N	\N
5869	\N	\N	\N
5870	\N	\N	\N
5871	\N	\N	\N
5872	\N	\N	\N
5873	\N	\N	\N
5874	\N	\N	\N
5875	\N	\N	\N
5876	\N	\N	\N
5877	\N	\N	\N
5878	\N	35	45
5929	\N	\N	\N
5930	\N	\N	\N
5931	\N	\N	\N
5932	\N	\N	\N
5933	\N	\N	\N
5934	\N	\N	\N
5935	\N	\N	\N
5936	\N	\N	\N
5937	\N	\N	\N
5938	\N	\N	\N
5939	\N	\N	\N
5940	\N	\N	\N
5941	\N	\N	\N
5942	\N	\N	\N
5943	\N	\N	\N
5944	\N	\N	\N
5945	\N	\N	\N
5946	\N	\N	\N
5947	\N	\N	\N
5948	\N	\N	\N
5949	\N	\N	\N
5950	\N	\N	\N
5951	\N	\N	\N
5952	\N	\N	\N
5953	\N	\N	\N
5954	\N	\N	\N
5955	\N	\N	\N
5956	\N	\N	\N
5957	\N	\N	\N
5958	\N	\N	\N
5959	\N	\N	\N
6000	\N	\N	\N
6001	\N	\N	\N
6002	\N	\N	\N
6003	\N	\N	\N
6004	\N	\N	\N
6005	\N	\N	\N
6006	\N	\N	\N
6007	\N	\N	\N
6008	\N	\N	\N
6009	\N	\N	\N
6010	\N	\N	\N
6011	\N	\N	\N
6012	\N	\N	\N
6013	\N	\N	\N
6014	\N	\N	\N
6015	\N	\N	\N
6016	\N	\N	\N
6017	\N	\N	\N
6018	\N	\N	\N
6019	\N	\N	\N
6020	\N	\N	\N
6021	\N	\N	\N
6022	\N	\N	\N
6023	\N	\N	\N
6024	\N	\N	\N
6025	\N	\N	\N
6026	\N	\N	\N
6027	\N	\N	\N
6028	\N	\N	\N
6029	\N	\N	\N
6030	\N	\N	\N
6122	\N	\N	\N
6124	\N	\N	\N
6125	\N	\N	\N
6127	\N	\N	\N
6128	\N	\N	\N
6151	\N	\N	\N
6152	\N	\N	\N
6153	\N	\N	\N
6154	\N	\N	\N
6155	\N	\N	\N
6156	\N	\N	\N
6157	\N	\N	\N
6158	\N	\N	\N
6159	\N	\N	\N
6160	\N	\N	\N
6161	\N	\N	\N
6162	\N	\N	\N
6163	\N	\N	\N
6164	\N	\N	\N
6165	\N	\N	\N
6166	\N	\N	\N
6167	\N	\N	\N
6168	\N	\N	\N
6169	\N	\N	\N
6170	\N	\N	\N
6171	\N	\N	\N
6172	\N	\N	\N
6173	\N	\N	\N
6174	\N	\N	\N
6175	\N	\N	\N
6176	\N	\N	\N
6177	\N	\N	\N
6178	\N	\N	\N
6179	\N	\N	\N
6180	\N	\N	\N
6181	\N	\N	\N
6182	\N	\N	\N
6183	\N	\N	\N
6184	\N	\N	\N
6185	\N	\N	\N
6186	\N	\N	\N
6187	\N	\N	\N
6188	\N	\N	\N
6189	\N	\N	\N
6190	\N	\N	\N
6191	\N	\N	\N
6192	\N	\N	\N
6193	\N	\N	\N
6194	\N	\N	\N
6195	\N	\N	\N
6196	\N	\N	\N
6197	\N	\N	\N
6198	\N	\N	\N
6199	\N	\N	\N
6200	\N	\N	\N
6201	\N	\N	\N
6202	\N	\N	\N
6203	\N	\N	\N
6204	\N	\N	\N
6205	\N	\N	\N
6206	\N	\N	\N
6207	\N	\N	\N
6208	\N	\N	\N
6209	\N	\N	\N
6210	\N	\N	\N
6211	\N	\N	\N
6212	\N	\N	\N
6213	\N	\N	\N
6214	\N	\N	\N
6215	\N	\N	\N
6216	\N	\N	\N
6217	\N	\N	\N
6218	\N	\N	\N
6219	\N	\N	\N
6220	\N	\N	\N
6221	\N	\N	\N
6222	\N	\N	\N
6223	\N	\N	\N
6224	\N	\N	\N
6225	\N	\N	\N
6226	\N	\N	\N
6227	\N	\N	\N
6228	\N	\N	\N
6229	\N	12	15
6230	\N	\N	\N
6231	\N	\N	\N
6242	\N	\N	\N
6243	\N	\N	\N
6244	\N	\N	\N
6245	\N	\N	\N
6246	\N	\N	\N
6247	\N	\N	\N
6248	\N	\N	\N
6249	\N	\N	\N
6250	\N	\N	\N
6251	\N	\N	\N
6252	\N	\N	\N
6253	\N	\N	\N
6254	\N	\N	\N
6255	\N	\N	\N
6256	\N	\N	\N
6257	\N	\N	\N
6258	\N	\N	\N
6259	\N	\N	\N
6260	\N	\N	\N
6261	\N	\N	\N
6262	\N	\N	\N
6263	\N	\N	\N
6264	\N	\N	\N
6265	\N	\N	\N
6266	\N	\N	\N
6267	\N	\N	\N
6268	\N	\N	\N
6269	\N	\N	\N
6270	\N	\N	\N
6271	\N	\N	\N
6272	\N	\N	\N
6274	\N	\N	\N
6275	\N	\N	\N
6276	\N	\N	\N
6277	\N	\N	\N
6279	\N	\N	\N
6280	\N	\N	\N
6281	\N	\N	\N
6282	\N	\N	\N
6283	\N	\N	\N
6284	\N	\N	\N
6285	\N	\N	\N
6286	\N	\N	\N
6288	\N	\N	\N
6289	\N	\N	\N
6290	\N	\N	\N
6291	\N	\N	\N
6292	\N	\N	\N
6294	\N	\N	\N
6296	\N	\N	\N
6297	\N	\N	\N
6298	\N	\N	\N
6302	\N	\N	\N
6303	\N	\N	\N
6305	\N	\N	\N
6306	\N	\N	\N
6307	\N	\N	\N
6308	\N	\N	\N
6309	\N	\N	\N
6310	\N	\N	\N
6311	\N	\N	\N
6312	\N	\N	\N
6313	\N	\N	\N
6314	\N	\N	\N
6315	\N	\N	\N
6316	\N	\N	\N
6317	\N	\N	\N
6318	\N	\N	\N
6319	\N	\N	\N
6320	\N	\N	\N
6321	\N	\N	\N
6322	\N	\N	\N
6323	\N	\N	\N
6324	\N	\N	\N
6325	\N	\N	\N
6326	\N	\N	\N
6327	\N	\N	\N
6328	\N	\N	\N
6329	\N	\N	\N
6330	\N	\N	\N
6331	\N	\N	\N
6332	\N	\N	\N
6333	\N	\N	\N
6334	\N	\N	\N
6335	\N	\N	\N
6336	\N	\N	\N
6337	\N	\N	\N
6338	\N	\N	\N
6339	\N	\N	\N
6340	\N	\N	\N
6341	\N	\N	\N
6342	\N	\N	\N
6343	\N	\N	\N
6344	\N	\N	\N
6345	\N	\N	\N
6346	\N	\N	\N
6347	\N	\N	\N
6348	\N	\N	\N
6349	\N	\N	\N
6350	\N	\N	\N
6351	\N	\N	\N
6352	\N	\N	\N
6353	\N	\N	\N
6354	\N	\N	\N
6355	\N	\N	\N
6356	\N	\N	\N
6357	\N	\N	\N
6358	\N	\N	\N
6359	\N	\N	\N
6360	\N	\N	\N
6361	\N	\N	\N
6362	\N	\N	\N
6363	\N	\N	\N
6364	\N	\N	\N
6365	\N	\N	\N
6366	\N	\N	\N
6367	\N	\N	\N
6368	\N	\N	\N
6369	\N	\N	\N
6370	\N	\N	\N
6371	\N	\N	\N
6372	\N	\N	\N
6373	\N	\N	\N
6374	\N	\N	\N
6375	\N	\N	\N
6376	\N	\N	\N
6377	\N	\N	\N
6378	\N	\N	\N
6379	\N	\N	\N
6380	\N	\N	\N
6381	\N	\N	\N
6382	\N	\N	\N
6383	\N	\N	\N
6384	\N	\N	\N
6385	\N	\N	\N
6386	\N	\N	\N
6387	\N	\N	\N
6388	\N	\N	\N
6389	\N	\N	\N
6390	\N	\N	\N
6391	\N	\N	\N
6392	\N	\N	\N
6393	\N	\N	\N
6394	\N	\N	\N
6395	\N	\N	\N
6396	\N	\N	\N
6397	\N	\N	\N
6398	\N	\N	\N
6433	\N	\N	\N
6434	\N	10	15
6435	\N	10	15
6436	\N	20	30
6437	\N	10	12
6438	\N	10	12
6439	\N	20	30
6440	\N	8	10
6441	\N	20	30
6442	\N	10	15
6443	\N	8	10
6444	\N	\N	\N
6445	\N	15	25
6446	\N	\N	\N
6447	\N	10	12
6448	\N	8	10
6449	\N	\N	\N
6450	\N	8	10
6451	\N	\N	\N
6452	\N	\N	\N
6453	\N	8	15
6454	\N	10	15
6455	\N	\N	\N
6456	\N	8	10
6457	\N	\N	\N
6458	\N	\N	\N
6459	\N	\N	\N
6460	\N	12	18
6461	\N	10	15
6462	\N	10	12
6463	\N	\N	\N
6464	\N	\N	\N
6465	\N	\N	\N
6466	\N	\N	\N
6467	\N	\N	\N
6468	\N	\N	\N
6469	\N	\N	\N
6470	\N	\N	\N
6471	\N	\N	\N
6472	\N	\N	\N
6473	\N	\N	\N
6474	\N	\N	\N
6475	\N	\N	\N
6476	\N	\N	\N
6477	\N	\N	\N
6479	\N	\N	\N
6480	\N	\N	\N
6481	\N	\N	\N
6482	\N	\N	\N
6483	\N	\N	\N
6484	\N	\N	\N
6485	\N	\N	\N
6486	\N	\N	\N
6488	\N	\N	\N
6489	\N	\N	\N
6490	\N	\N	\N
6491	\N	\N	\N
6493	\N	\N	\N
6494	\N	\N	\N
6495	\N	\N	\N
6496	\N	\N	\N
6499	\N	\N	\N
6500	\N	\N	\N
6501	\N	\N	\N
6506	\N	\N	\N
6507	\N	\N	\N
6508	\N	\N	\N
6509	\N	\N	\N
6510	\N	\N	\N
6511	\N	\N	\N
6512	\N	\N	\N
6563	\N	\N	\N
6564	\N	\N	\N
6565	\N	\N	\N
6566	\N	\N	\N
6567	\N	\N	\N
6568	\N	\N	\N
6569	\N	\N	\N
6570	\N	\N	\N
6571	\N	\N	\N
6572	\N	\N	\N
6573	\N	\N	\N
6574	\N	\N	\N
6575	\N	\N	\N
6576	\N	\N	\N
6577	\N	\N	\N
6578	\N	\N	\N
6579	\N	\N	\N
6580	\N	\N	\N
6581	\N	\N	\N
6582	\N	\N	\N
6583	\N	\N	\N
6584	\N	\N	\N
6585	\N	\N	\N
6586	\N	\N	\N
6587	\N	\N	\N
6588	\N	\N	\N
6589	\N	\N	\N
6590	\N	\N	\N
6591	\N	\N	\N
6592	\N	\N	\N
6593	\N	\N	\N
6594	\N	\N	\N
6595	\N	\N	\N
6596	\N	\N	\N
6597	\N	\N	\N
6598	\N	\N	\N
6599	\N	\N	\N
6600	\N	\N	\N
6601	\N	\N	\N
6602	\N	\N	\N
6603	\N	\N	\N
6604	\N	\N	\N
6605	\N	\N	\N
6606	\N	\N	\N
6607	\N	\N	\N
6608	\N	\N	\N
6609	\N	\N	\N
6610	\N	\N	\N
6614	\N	\N	\N
6615	\N	\N	\N
6616	\N	\N	\N
6617	\N	\N	\N
6618	\N	\N	\N
6619	\N	\N	\N
6620	\N	20	30
6621	\N	\N	\N
6622	\N	\N	\N
6623	\N	\N	\N
6624	\N	\N	\N
6625	\N	\N	\N
6626	\N	\N	\N
6627	\N	\N	\N
6628	\N	\N	\N
6629	\N	\N	\N
6630	\N	\N	\N
6631	\N	\N	\N
6632	\N	\N	\N
6633	\N	\N	\N
6634	\N	\N	\N
6635	\N	\N	\N
6636	\N	\N	\N
6637	\N	\N	\N
6638	\N	\N	\N
6639	\N	\N	\N
6640	\N	\N	\N
6641	\N	\N	\N
6642	\N	\N	\N
6643	\N	\N	\N
6644	\N	\N	\N
6645	\N	\N	\N
6646	\N	\N	\N
6647	\N	\N	\N
6648	\N	\N	\N
6649	\N	\N	\N
6650	\N	\N	\N
6651	\N	\N	\N
6652	\N	\N	\N
6653	\N	\N	\N
6654	\N	\N	\N
6655	\N	\N	\N
6656	\N	\N	\N
6657	\N	\N	\N
6658	\N	\N	\N
6659	\N	\N	\N
6660	\N	\N	\N
6661	\N	\N	\N
6662	\N	\N	\N
6663	\N	\N	\N
6664	\N	\N	\N
6665	\N	\N	\N
6666	\N	\N	\N
6667	\N	\N	\N
6668	\N	\N	\N
6669	\N	\N	\N
6670	\N	\N	\N
6671	\N	\N	\N
6672	\N	\N	\N
6673	\N	\N	\N
6674	\N	\N	\N
6675	\N	\N	\N
6676	\N	\N	\N
6677	\N	\N	\N
6678	\N	\N	\N
6679	\N	\N	\N
6680	\N	\N	\N
6681	\N	\N	\N
6682	\N	\N	\N
6683	\N	\N	\N
6684	\N	\N	\N
6685	\N	\N	\N
6686	\N	\N	\N
6687	\N	\N	\N
6688	\N	\N	\N
6689	\N	\N	\N
6690	\N	20	30
6691	\N	\N	\N
6692	\N	\N	\N
6693	\N	\N	\N
6694	\N	\N	\N
6695	\N	\N	\N
6696	\N	\N	\N
6697	\N	\N	\N
6698	\N	\N	\N
6699	\N	\N	\N
6700	\N	\N	\N
6701	\N	\N	\N
6702	\N	\N	\N
6703	\N	\N	\N
6704	\N	\N	\N
6705	\N	\N	\N
6706	\N	\N	\N
6707	\N	\N	\N
6708	\N	\N	\N
6709	\N	\N	\N
6710	\N	\N	\N
6711	\N	\N	\N
6712	\N	\N	\N
6713	\N	\N	\N
6714	\N	\N	\N
6715	\N	\N	\N
6716	\N	\N	\N
6717	\N	\N	\N
6718	\N	\N	\N
6719	\N	\N	\N
6720	\N	\N	\N
6721	\N	\N	\N
6722	\N	\N	\N
6723	\N	\N	\N
6724	\N	\N	\N
6725	\N	\N	\N
6726	\N	\N	\N
6727	\N	\N	\N
6728	\N	\N	\N
6729	\N	\N	\N
6730	\N	\N	\N
6731	\N	\N	\N
6732	\N	\N	\N
6733	\N	\N	\N
6734	\N	\N	\N
6735	\N	\N	\N
6736	\N	\N	\N
6737	\N	\N	\N
6738	\N	\N	\N
6739	\N	\N	\N
6740	\N	\N	\N
6741	\N	\N	\N
6742	\N	\N	\N
6743	\N	\N	\N
6744	\N	\N	\N
6745	\N	\N	\N
6746	\N	\N	\N
6747	\N	\N	\N
6748	\N	\N	\N
6749	\N	\N	\N
6750	\N	\N	\N
6751	\N	\N	\N
6752	\N	\N	\N
6753	\N	\N	\N
6754	\N	\N	\N
6755	\N	\N	\N
6756	\N	\N	\N
6757	\N	\N	\N
6758	\N	\N	\N
6759	\N	\N	\N
6760	\N	\N	\N
6761	\N	8	10
6762	\N	\N	\N
6763	\N	\N	\N
6764	\N	\N	\N
6765	\N	\N	\N
6766	\N	\N	\N
6767	\N	\N	\N
6768	\N	\N	\N
6769	\N	\N	\N
6770	\N	\N	\N
6771	\N	\N	\N
6772	\N	\N	\N
6773	\N	\N	\N
6774	\N	\N	\N
6775	\N	\N	\N
6776	\N	\N	\N
6777	\N	\N	\N
6778	\N	\N	\N
6779	\N	\N	\N
6780	\N	\N	\N
6781	\N	\N	\N
6782	\N	\N	\N
6783	\N	\N	\N
6784	\N	\N	\N
6785	\N	\N	\N
6786	\N	\N	\N
6787	\N	\N	\N
6788	\N	\N	\N
6789	\N	\N	\N
6790	\N	\N	\N
6791	\N	\N	\N
6792	\N	\N	\N
6793	\N	\N	\N
6794	\N	\N	\N
6795	\N	\N	\N
6796	\N	\N	\N
6797	\N	\N	\N
6798	\N	\N	\N
6799	\N	\N	\N
6800	\N	\N	\N
6801	\N	\N	\N
6802	\N	\N	\N
6803	\N	\N	\N
6804	\N	\N	\N
6805	\N	\N	\N
6806	\N	\N	\N
6807	\N	\N	\N
6808	\N	\N	\N
6809	\N	\N	\N
6810	\N	\N	\N
6811	\N	8	12
6812	\N	\N	\N
6813	\N	\N	\N
6814	\N	\N	\N
6815	\N	\N	\N
6816	\N	\N	\N
6817	\N	\N	\N
6818	\N	\N	\N
6819	\N	\N	\N
6822	\N	\N	\N
6823	\N	\N	\N
6824	\N	\N	\N
6825	\N	\N	\N
6826	\N	\N	\N
6827	\N	\N	\N
6828	\N	\N	\N
6830	\N	\N	\N
6831	\N	15	20
6832	\N	\N	\N
6833	\N	\N	\N
6834	\N	\N	\N
6835	\N	\N	\N
6836	\N	\N	\N
6837	\N	\N	\N
6838	\N	\N	\N
6839	\N	\N	\N
6840	\N	\N	\N
6841	\N	\N	\N
6842	\N	\N	\N
6843	\N	\N	\N
6844	\N	\N	\N
6845	\N	\N	\N
6846	\N	\N	\N
6847	\N	\N	\N
6848	\N	\N	\N
6849	\N	\N	\N
6850	\N	\N	\N
6851	\N	\N	\N
6852	\N	\N	\N
6853	\N	\N	\N
6854	\N	\N	\N
6855	\N	\N	\N
6856	\N	\N	\N
6857	\N	\N	\N
6858	\N	\N	\N
6859	\N	\N	\N
6860	\N	\N	\N
6861	\N	\N	\N
6862	\N	\N	\N
6863	\N	\N	\N
6864	\N	\N	\N
6865	\N	\N	\N
6866	\N	\N	\N
6867	\N	\N	\N
6868	\N	\N	\N
6869	\N	\N	\N
6870	\N	\N	\N
6871	\N	\N	\N
6872	\N	\N	\N
6873	\N	\N	\N
6874	\N	\N	\N
6875	\N	\N	\N
6876	\N	\N	\N
6877	\N	\N	\N
6878	\N	\N	\N
6879	\N	\N	\N
6880	\N	\N	\N
6881	\N	\N	\N
6882	\N	\N	\N
6883	\N	\N	\N
6884	\N	\N	\N
6885	\N	\N	\N
6886	\N	\N	\N
6887	\N	\N	\N
6888	\N	\N	\N
6889	\N	\N	\N
6890	\N	\N	\N
6891	\N	\N	\N
6892	\N	\N	\N
6943	\N	\N	\N
6944	\N	\N	\N
6945	\N	\N	\N
6946	\N	\N	\N
6947	\N	\N	\N
6948	\N	\N	\N
6949	\N	\N	\N
6950	\N	\N	\N
6951	\N	\N	\N
6952	\N	\N	\N
6953	\N	\N	\N
6954	\N	\N	\N
6955	\N	\N	\N
6956	\N	\N	\N
6957	\N	\N	\N
6958	\N	\N	\N
6959	\N	\N	\N
6960	\N	\N	\N
6961	\N	\N	\N
6962	\N	\N	\N
6963	\N	\N	\N
6964	\N	\N	\N
6965	\N	\N	\N
6966	\N	\N	\N
6967	\N	\N	\N
6968	\N	\N	\N
6970	\N	\N	\N
6971	\N	\N	\N
6972	\N	\N	\N
6973	\N	\N	\N
6974	\N	\N	\N
6975	\N	\N	\N
6976	\N	\N	\N
6977	\N	\N	\N
6978	\N	\N	\N
6979	\N	\N	\N
6980	\N	\N	\N
6981	\N	\N	\N
6982	\N	\N	\N
6983	\N	\N	\N
6984	\N	\N	\N
6985	\N	\N	\N
6986	\N	\N	\N
6987	\N	\N	\N
6988	\N	\N	\N
6989	\N	\N	\N
6990	\N	\N	\N
6991	\N	\N	\N
6992	\N	\N	\N
6993	\N	\N	\N
6994	\N	\N	\N
6995	\N	\N	\N
6996	\N	\N	\N
6998	\N	\N	\N
6999	\N	30	40
7000	\N	\N	\N
7002	\N	\N	\N
7003	\N	\N	\N
7005	\N	\N	\N
7006	\N	\N	\N
7007	\N	\N	\N
7008	\N	\N	\N
7009	\N	\N	\N
7010	\N	\N	\N
7011	\N	\N	\N
7012	\N	\N	\N
7013	\N	\N	\N
7015	\N	\N	\N
7017	\N	8	10
7023	\N	20	25
7024	\N	\N	\N
7025	\N	12	18
7034	\N	10	12
7035	\N	10	12
7036	\N	\N	\N
7037	\N	10	12
7038	\N	15	20
7039	\N	\N	\N
7042	\N	\N	\N
7043	\N	\N	\N
7044	\N	\N	\N
7045	\N	\N	\N
7046	\N	\N	\N
7048	\N	10	12
7049	\N	15	20
7051	\N	10	12
7052	\N	\N	\N
7053	\N	\N	\N
7054	\N	\N	\N
7055	\N	\N	\N
7056	\N	\N	\N
7057	\N	\N	\N
7058	\N	\N	\N
7059	\N	\N	\N
7060	\N	\N	\N
7061	\N	\N	\N
7062	\N	\N	\N
7063	\N	\N	\N
7064	\N	12	17
7065	\N	15	20
7066	\N	\N	\N
7083	\N	\N	\N
7084	\N	\N	\N
7085	\N	\N	\N
7086	\N	\N	\N
7087	\N	\N	\N
7088	\N	\N	\N
7089	\N	\N	\N
7090	\N	\N	\N
7091	\N	\N	\N
7092	\N	\N	\N
7093	\N	\N	\N
7094	\N	\N	\N
7095	\N	\N	\N
7096	\N	\N	\N
7097	\N	\N	\N
7098	\N	\N	\N
7099	\N	\N	\N
7100	\N	\N	\N
7101	\N	\N	\N
7102	\N	\N	\N
7103	\N	\N	\N
7104	\N	\N	\N
7105	\N	\N	\N
7106	\N	\N	\N
7107	\N	\N	\N
7108	\N	\N	\N
7109	\N	\N	\N
7110	\N	\N	\N
7111	\N	\N	\N
7112	\N	\N	\N
7113	\N	\N	\N
7114	\N	\N	\N
7115	\N	\N	\N
7116	\N	\N	\N
7117	\N	\N	\N
7118	\N	\N	\N
7119	\N	\N	\N
7120	\N	\N	\N
7121	\N	\N	\N
7122	\N	\N	\N
7123	\N	\N	\N
7124	\N	\N	\N
7125	\N	\N	\N
7126	\N	\N	\N
7127	\N	\N	\N
7128	\N	\N	\N
7129	\N	\N	\N
7130	\N	\N	\N
7131	\N	\N	\N
7132	\N	\N	\N
7133	\N	\N	\N
7134	\N	\N	\N
7135	\N	\N	\N
7136	\N	\N	\N
7137	\N	\N	\N
7138	\N	\N	\N
7139	\N	\N	\N
7140	\N	\N	\N
7141	\N	\N	\N
7142	\N	\N	\N
7143	\N	\N	\N
7144	\N	\N	\N
7145	\N	\N	\N
7146	\N	\N	\N
7147	\N	\N	\N
7148	\N	\N	\N
7149	\N	\N	\N
7150	\N	\N	\N
7151	\N	\N	\N
7152	\N	\N	\N
7153	\N	\N	\N
7154	\N	\N	\N
7155	\N	\N	\N
7156	\N	\N	\N
7157	\N	\N	\N
7158	\N	\N	\N
7159	\N	\N	\N
7160	\N	\N	\N
7161	\N	\N	\N
7162	\N	\N	\N
7163	\N	\N	\N
7164	\N	\N	\N
7165	\N	\N	\N
7166	\N	\N	\N
7167	\N	\N	\N
7168	\N	\N	\N
7169	\N	\N	\N
7170	\N	\N	\N
7171	\N	\N	\N
7172	\N	\N	\N
7173	\N	\N	\N
7174	\N	\N	\N
7175	\N	\N	\N
7176	\N	\N	\N
7177	\N	\N	\N
7208	\N	\N	\N
7209	\N	\N	\N
7210	\N	\N	\N
7211	\N	\N	\N
7212	\N	\N	\N
7213	\N	\N	\N
7214	\N	\N	\N
7215	\N	\N	\N
7216	\N	\N	\N
7217	\N	\N	\N
7218	\N	\N	\N
7219	\N	\N	\N
7220	\N	\N	\N
7221	\N	\N	\N
7222	\N	\N	\N
7223	\N	\N	\N
7224	\N	\N	\N
7225	\N	\N	\N
7226	\N	\N	\N
7227	\N	\N	\N
7228	\N	\N	\N
7229	\N	\N	\N
7230	\N	\N	\N
7231	\N	\N	\N
7232	\N	\N	\N
7233	\N	\N	\N
7234	\N	\N	\N
7235	\N	\N	\N
7236	\N	\N	\N
7237	\N	\N	\N
7238	\N	\N	\N
7239	\N	\N	\N
7240	\N	\N	\N
7241	\N	\N	\N
7242	\N	\N	\N
7243	\N	\N	\N
7244	\N	\N	\N
7245	\N	\N	\N
7246	\N	\N	\N
7247	\N	\N	\N
7248	\N	\N	\N
7249	\N	\N	\N
7250	\N	\N	\N
7251	\N	\N	\N
7252	\N	\N	\N
7253	\N	\N	\N
7254	\N	\N	\N
7255	\N	\N	\N
7256	\N	\N	\N
7257	\N	\N	\N
7258	\N	\N	\N
7259	\N	\N	\N
7260	\N	\N	\N
7261	\N	\N	\N
7262	\N	\N	\N
7263	\N	\N	\N
7264	\N	\N	\N
7265	\N	\N	\N
7266	\N	\N	\N
7267	\N	\N	\N
7268	\N	\N	\N
7269	\N	\N	\N
7270	\N	\N	\N
7271	\N	\N	\N
7272	\N	\N	\N
7273	\N	\N	\N
7274	\N	\N	\N
7275	\N	\N	\N
7276	\N	\N	\N
7277	\N	\N	\N
7278	\N	\N	\N
7279	\N	\N	\N
7280	\N	\N	\N
7281	\N	\N	\N
7282	\N	\N	\N
7283	\N	\N	\N
7284	\N	\N	\N
7285	\N	\N	\N
7286	\N	\N	\N
7287	\N	\N	\N
7288	\N	\N	\N
7289	\N	\N	\N
7290	\N	\N	\N
7291	\N	\N	\N
7292	\N	\N	\N
7293	\N	\N	\N
7294	\N	\N	\N
7295	\N	\N	\N
7296	\N	\N	\N
7297	\N	\N	\N
7298	\N	\N	\N
7299	\N	\N	\N
7300	\N	\N	\N
7301	\N	\N	\N
7302	\N	\N	\N
7303	\N	\N	\N
7304	\N	\N	\N
7305	\N	\N	\N
7306	\N	\N	\N
7307	\N	\N	\N
7308	\N	\N	\N
7309	\N	\N	\N
7310	\N	\N	\N
7311	\N	\N	\N
7312	\N	\N	\N
7313	\N	\N	\N
7314	\N	\N	\N
7315	\N	\N	\N
7316	\N	\N	\N
7317	\N	\N	\N
7326	\N	\N	\N
7327	\N	\N	\N
7328	\N	\N	\N
7329	\N	\N	\N
7330	\N	\N	\N
7331	\N	\N	\N
7332	\N	\N	\N
7333	\N	\N	\N
7334	\N	\N	\N
7335	\N	\N	\N
7336	\N	\N	\N
7353	\N	\N	\N
7354	\N	\N	\N
7355	\N	\N	\N
7356	\N	\N	\N
7357	\N	\N	\N
7358	\N	\N	\N
7359	\N	\N	\N
7360	\N	\N	\N
7361	\N	\N	\N
7362	\N	\N	\N
7363	\N	\N	\N
7364	\N	\N	\N
7365	\N	\N	\N
7366	\N	\N	\N
7367	\N	\N	\N
7368	\N	\N	\N
7369	\N	\N	\N
7370	\N	\N	\N
7371	\N	\N	\N
7372	\N	\N	\N
7373	\N	\N	\N
7374	\N	\N	\N
7375	\N	\N	\N
7376	\N	\N	\N
7377	\N	\N	\N
7378	\N	\N	\N
7379	\N	\N	\N
7380	\N	\N	\N
7381	\N	\N	\N
7382	\N	\N	\N
7383	\N	\N	\N
7384	\N	\N	\N
7385	\N	\N	\N
7386	\N	\N	\N
7387	\N	\N	\N
7388	\N	\N	\N
7389	\N	\N	\N
7390	\N	\N	\N
7391	\N	\N	\N
7392	\N	\N	\N
7393	\N	\N	\N
7394	\N	\N	\N
7395	\N	\N	\N
7396	\N	\N	\N
7397	\N	\N	\N
7398	\N	\N	\N
7399	\N	\N	\N
7400	\N	\N	\N
7401	\N	\N	\N
7402	\N	\N	\N
7403	\N	\N	\N
7404	\N	\N	\N
7405	\N	\N	\N
7406	\N	\N	\N
7407	\N	\N	\N
7408	\N	\N	\N
7409	\N	\N	\N
7410	\N	\N	\N
7411	\N	\N	\N
7412	\N	\N	\N
7413	\N	\N	\N
7414	\N	\N	\N
7415	\N	\N	\N
7416	\N	10	12
7417	\N	10	20
7418	\N	10	20
7419	\N	1	10
7420	\N	8	10
7421	\N	\N	\N
7422	\N	\N	\N
7423	\N	10	12
7425	\N	8	10
7426	\N	\N	\N
7427	\N	\N	\N
7428	\N	\N	\N
7429	\N	\N	\N
7430	\N	5	7
7431	\N	\N	\N
7432	\N	\N	\N
7433	\N	\N	\N
7434	\N	\N	\N
7435	\N	8	10
7436	\N	7	9
7437	\N	\N	\N
7438	\N	\N	\N
7439	\N	\N	\N
7440	\N	\N	\N
7441	\N	\N	\N
7442	\N	\N	\N
7443	\N	\N	\N
7444	\N	\N	\N
7445	\N	\N	\N
7446	\N	\N	\N
7447	\N	\N	\N
7448	\N	\N	\N
7449	\N	\N	\N
7450	\N	\N	\N
7451	\N	\N	\N
7456	\N	\N	\N
7457	\N	\N	\N
7459	\N	\N	\N
7460	\N	\N	\N
7461	\N	\N	\N
7462	\N	\N	\N
7463	\N	\N	\N
7464	\N	\N	\N
7465	\N	30	60
7466	\N	\N	\N
7467	\N	\N	\N
7468	\N	\N	\N
7469	\N	\N	\N
7470	\N	\N	\N
7471	\N	\N	\N
7472	\N	\N	\N
7473	\N	\N	\N
7474	\N	10	20
7475	\N	\N	\N
7476	\N	\N	\N
7477	\N	\N	\N
7478	\N	\N	\N
7479	\N	\N	\N
7480	\N	\N	\N
7481	\N	\N	\N
7482	\N	\N	\N
7483	\N	\N	\N
7484	\N	20	30
7485	\N	\N	\N
7486	\N	10	20
7487	\N	\N	\N
7488	\N	\N	\N
7489	\N	\N	\N
7490	\N	\N	\N
7491	\N	\N	\N
7492	\N	\N	\N
7493	\N	\N	\N
7494	\N	\N	\N
7495	\N	\N	\N
7496	\N	\N	\N
7497	\N	\N	\N
7498	\N	\N	\N
7499	\N	\N	\N
7500	\N	\N	\N
7501	\N	20	40
7502	\N	\N	\N
7503	\N	\N	\N
7504	\N	\N	\N
7505	\N	\N	\N
7506	\N	\N	\N
7507	\N	\N	\N
7508	\N	10	20
7509	\N	\N	\N
7510	\N	\N	\N
7511	\N	\N	\N
7512	\N	\N	\N
7519	\N	\N	\N
7652	\N	\N	\N
7656	\N	\N	\N
7657	\N	\N	\N
7658	\N	\N	\N
7659	\N	\N	\N
7660	\N	\N	\N
7661	\N	\N	\N
7662	\N	\N	\N
7663	\N	\N	\N
7664	\N	\N	\N
7665	\N	\N	\N
7666	\N	\N	\N
7667	\N	\N	\N
7668	\N	\N	\N
7669	\N	\N	\N
7670	\N	\N	\N
7671	\N	\N	\N
7672	\N	\N	\N
7673	\N	\N	\N
7674	\N	\N	\N
7675	\N	\N	\N
7676	\N	\N	\N
7677	\N	\N	\N
7678	\N	\N	\N
7679	\N	\N	\N
7680	\N	\N	\N
7681	\N	\N	\N
7682	\N	\N	\N
7683	\N	\N	\N
7684	\N	\N	\N
7685	\N	\N	\N
7686	\N	\N	\N
7687	\N	\N	\N
7688	\N	\N	\N
7689	\N	\N	\N
7690	\N	\N	\N
7691	\N	\N	\N
7692	\N	\N	\N
7693	\N	\N	\N
7694	\N	\N	\N
7695	\N	\N	\N
7696	\N	\N	\N
7697	\N	\N	\N
\.


--
-- Data for Name: tourist_attractions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tourist_attractions (id, name_original, wiki_link, price_regular, price_children, tickets_gyg, tickets_civitatis, tickets_direct_site, place_id) FROM stdin;
\.


--
-- Data for Name: trip_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_attributes (trip_id, attribute_id) FROM stdin;
\.


--
-- Data for Name: trip_category_filter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_category_filter (trip_id, category_id) FROM stdin;
\.


--
-- Data for Name: trip_composition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_composition (trip_id, day, "position", place_id, datetime, deleted) FROM stdin;
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (id, partner_id, public, datetime_start, datetime_end, price_range, created, modified, user_id, city_id) FROM stdin;
\.


--
-- Data for Name: tx_attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_attribute (attribute_id, language_id, name, slug, description, meta_description, title) FROM stdin;
\.


--
-- Data for Name: tx_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_categories (category_id, language_id, name, slug, description, meta_description, title) FROM stdin;
\.


--
-- Data for Name: tx_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_category (category_id, language_id, slug, name, title, description, meta_description) FROM stdin;
254	1	choir	Choir	Choir	\N	\N
96	1	hostel	Hostel	Hostel	\N	\N
80	1	park	Park	Park	\N	\N
174	1	acai-shop	Acai Shop	Acai Shop	\N	\N
725	1	villa	Villa	Villa	\N	\N
1785	1	3d-printing-service	3d Printing Service	3d Printing Service	\N	\N
1785	2	3d-printing-service	3d Printing Service (fr)	3d Printing Service (fr)	\N	\N
1062	1	abbey	Abbey	Abbey	\N	\N
1062	2	abbey	Abbey (fr)	Abbey (fr)	\N	\N
374	1	convent	Convent	Convent	\N	\N
336	1	painting	Painting	Painting	\N	\N
28	1	pub	Pub	Pub	\N	\N
25	1	creperie	Creperie	Creperie	\N	\N
174	2	acai-shop	Acai Shop (fr)	Acai Shop (fr)	\N	\N
1747	1	adult-education-school	Adult Education School	Adult Education School	\N	\N
1747	2	adult-education-school	Adult Education School (fr)	Adult Education School (fr)	\N	\N
307	1	adult-entertainment-club	Adult Entertainment Club	Adult Entertainment Club	\N	\N
307	2	adult-entertainment-club	Adult Entertainment Club (fr)	Adult Entertainment Club (fr)	\N	\N
1150	1	adventure-sports	Adventure Sports	Adventure Sports	\N	\N
1150	2	adventure-sports	Adventure Sports (fr)	Adventure Sports (fr)	\N	\N
1976	1	adventure-sports-center	Adventure Sports Center	Adventure Sports Center	\N	\N
1976	2	adventure-sports-center	Adventure Sports Center (fr)	Adventure Sports Center (fr)	\N	\N
343	1	aerial-photographer	Aerial Photographer	Aerial Photographer	\N	\N
343	2	aerial-photographer	Aerial Photographer (fr)	Aerial Photographer (fr)	\N	\N
3140	1	afghani-restaurant	Afghani Restaurant	Afghani Restaurant	\N	\N
3140	2	afghani-restaurant	Afghani Restaurant (fr)	Afghani Restaurant (fr)	\N	\N
1419	1	african-restaurant	African Restaurant	African Restaurant	\N	\N
1419	2	african-restaurant	African Restaurant (fr)	African Restaurant (fr)	\N	\N
2719	1	after-school-program	After School Program	After School Program	\N	\N
2719	2	after-school-program	After School Program (fr)	After School Program (fr)	\N	\N
2536	1	airport	Airport	Airport	\N	\N
2536	2	airport	Airport (fr)	Airport (fr)	\N	\N
2537	1	airstrip	Airstrip	Airstrip	\N	\N
2537	2	airstrip	Airstrip (fr)	Airstrip (fr)	\N	\N
1754	1	alsace-restaurant	Alsace Restaurant	Alsace Restaurant	\N	\N
1754	2	alsace-restaurant	Alsace Restaurant (fr)	Alsace Restaurant (fr)	\N	\N
48	1	american-restaurant	American Restaurant	American Restaurant	\N	\N
48	2	american-restaurant	American Restaurant (fr)	American Restaurant (fr)	\N	\N
324	1	amphitheater	Amphitheater	Amphitheater	\N	\N
324	2	amphitheater	Amphitheater (fr)	Amphitheater (fr)	\N	\N
205	1	amusement-center	Amusement Center	Amusement Center	\N	\N
205	2	amusement-center	Amusement Center (fr)	Amusement Center (fr)	\N	\N
309	1	amusement-park	Amusement Park	Amusement Park	\N	\N
309	2	amusement-park	Amusement Park (fr)	Amusement Park (fr)	\N	\N
427	1	amusement-park-ride	Amusement Park Ride	Amusement Park Ride	\N	\N
427	2	amusement-park-ride	Amusement Park Ride (fr)	Amusement Park Ride (fr)	\N	\N
1523	1	andalusian-restaurant	Andalusian Restaurant	Andalusian Restaurant	\N	\N
1523	2	andalusian-restaurant	Andalusian Restaurant (fr)	Andalusian Restaurant (fr)	\N	\N
730	1	angler-fish-restaurant	Angler Fish Restaurant	Angler Fish Restaurant	\N	\N
730	2	angler-fish-restaurant	Angler Fish Restaurant (fr)	Angler Fish Restaurant (fr)	\N	\N
1311	1	anglican-church	Anglican Church	Anglican Church	\N	\N
1311	2	anglican-church	Anglican Church (fr)	Anglican Church (fr)	\N	\N
1224	1	animal-park	Animal Park	Animal Park	\N	\N
1224	2	animal-park	Animal Park (fr)	Animal Park (fr)	\N	\N
1687	1	antique-store	Antique Store	Antique Store	\N	\N
1687	2	antique-store	Antique Store (fr)	Antique Store (fr)	\N	\N
844	1	apartment-building	Apartment Building	Apartment Building	\N	\N
844	2	apartment-building	Apartment Building (fr)	Apartment Building (fr)	\N	\N
2163	1	apartment-complex	Apartment Complex	Apartment Complex	\N	\N
2163	2	apartment-complex	Apartment Complex (fr)	Apartment Complex (fr)	\N	\N
367	1	apartment-rental-agency	Apartment Rental Agency	Apartment Rental Agency	\N	\N
367	2	apartment-rental-agency	Apartment Rental Agency (fr)	Apartment Rental Agency (fr)	\N	\N
100	1	aquarium	Aquarium	Aquarium	\N	\N
100	2	aquarium	Aquarium (fr)	Aquarium (fr)	\N	\N
3076	1	aquatic-centre	Aquatic Centre	Aquatic Centre	\N	\N
3076	2	aquatic-centre	Aquatic Centre (fr)	Aquatic Centre (fr)	\N	\N
2160	1	arboretum	Arboretum	Arboretum	\N	\N
2160	2	arboretum	Arboretum (fr)	Arboretum (fr)	\N	\N
200	1	archaeological-museum	Archaeological Museum	Archaeological Museum	\N	\N
200	2	archaeological-museum	Archaeological Museum (fr)	Archaeological Museum (fr)	\N	\N
1282	1	architect	Architect	Architect	\N	\N
1282	2	architect	Architect (fr)	Architect (fr)	\N	\N
1786	1	architecture-firm	Architecture Firm	Architecture Firm	\N	\N
1786	2	architecture-firm	Architecture Firm (fr)	Architecture Firm (fr)	\N	\N
339	1	archive	Archive	Archive	\N	\N
339	2	archive	Archive (fr)	Archive (fr)	\N	\N
242	1	arena	Arena	Arena	\N	\N
242	2	arena	Arena (fr)	Arena (fr)	\N	\N
384	1	argentinian-restaurant	Argentinian Restaurant	Argentinian Restaurant	\N	\N
384	2	argentinian-restaurant	Argentinian Restaurant (fr)	Argentinian Restaurant (fr)	\N	\N
676	1	armenian-church	Armenian Church	Armenian Church	\N	\N
676	2	armenian-church	Armenian Church (fr)	Armenian Church (fr)	\N	\N
1299	1	armenian-restaurant	Armenian Restaurant	Armenian Restaurant	\N	\N
1299	2	armenian-restaurant	Armenian Restaurant (fr)	Armenian Restaurant (fr)	\N	\N
345	1	army-museum	Army Museum	Army Museum	\N	\N
345	2	army-museum	Army Museum (fr)	Army Museum (fr)	\N	\N
139	1	art-cafe	Art Cafe	Art Cafe	\N	\N
139	2	art-cafe	Art Cafe (fr)	Art Cafe (fr)	\N	\N
213	1	art-center	Art Center	Art Center	\N	\N
213	2	art-center	Art Center (fr)	Art Center (fr)	\N	\N
22	1	art-gallery	Art Gallery	Art Gallery	\N	\N
22	2	art-gallery	Art Gallery (fr)	Art Gallery (fr)	\N	\N
492	1	art-handcraft	Art Handcraft	Art Handcraft	\N	\N
492	2	art-handcraft	Art Handcraft (fr)	Art Handcraft (fr)	\N	\N
73	1	art-museum	Art Museum	Art Museum	\N	\N
73	2	art-museum	Art Museum (fr)	Art Museum (fr)	\N	\N
1084	1	art-restoration-service	Art Restoration Service	Art Restoration Service	\N	\N
1084	2	art-restoration-service	Art Restoration Service (fr)	Art Restoration Service (fr)	\N	\N
523	1	art-school	Art School	Art School	\N	\N
523	2	art-school	Art School (fr)	Art School (fr)	\N	\N
225	1	art-studio	Art Studio	Art Studio	\N	\N
225	2	art-studio	Art Studio (fr)	Art Studio (fr)	\N	\N
1790	1	art-supply-store	Art Supply Store	Art Supply Store	\N	\N
1790	2	art-supply-store	Art Supply Store (fr)	Art Supply Store (fr)	\N	\N
299	1	artist	Artist	Artist	\N	\N
299	2	artist	Artist (fr)	Artist (fr)	\N	\N
409	1	arts-organization	Arts Organization	Arts Organization	\N	\N
409	2	arts-organization	Arts Organization (fr)	Arts Organization (fr)	\N	\N
115	1	asian-fusion-restaurant	Asian Fusion Restaurant	Asian Fusion Restaurant	\N	\N
115	2	asian-fusion-restaurant	Asian Fusion Restaurant (fr)	Asian Fusion Restaurant (fr)	\N	\N
41	1	asian-restaurant	Asian Restaurant	Asian Restaurant	\N	\N
41	2	asian-restaurant	Asian Restaurant (fr)	Asian Restaurant (fr)	\N	\N
109	1	association-or-organization	Association Or Organization	Association Or Organization	\N	\N
109	2	association-or-organization	Association Or Organization (fr)	Association Or Organization (fr)	\N	\N
380	1	athletic-club	Athletic Club	Athletic Club	\N	\N
380	2	athletic-club	Athletic Club (fr)	Athletic Club (fr)	\N	\N
402	1	athletic-park	Athletic Park	Athletic Park	\N	\N
402	2	athletic-park	Athletic Park (fr)	Athletic Park (fr)	\N	\N
1341	1	audio-visual-equipment-rental-service	Audio Visual Equipment Rental Service	Audio Visual Equipment Rental Service	\N	\N
1341	2	audio-visual-equipment-rental-service	Audio Visual Equipment Rental Service (fr)	Audio Visual Equipment Rental Service (fr)	\N	\N
1342	1	audio-visual-equipment-repair-service	Audio Visual Equipment Repair Service	Audio Visual Equipment Repair Service	\N	\N
1342	2	audio-visual-equipment-repair-service	Audio Visual Equipment Repair Service (fr)	Audio Visual Equipment Repair Service (fr)	\N	\N
326	1	auditorium	Auditorium	Auditorium	\N	\N
326	2	auditorium	Auditorium (fr)	Auditorium (fr)	\N	\N
51	1	australian-restaurant	Australian Restaurant	Australian Restaurant	\N	\N
51	2	australian-restaurant	Australian Restaurant (fr)	Australian Restaurant (fr)	\N	\N
270	1	austrian-restaurant	Austrian Restaurant	Austrian Restaurant	\N	\N
270	2	austrian-restaurant	Austrian Restaurant (fr)	Austrian Restaurant (fr)	\N	\N
116	1	authentic-japanese-restaurant	Authentic Japanese Restaurant	Authentic Japanese Restaurant	\N	\N
116	2	authentic-japanese-restaurant	Authentic Japanese Restaurant (fr)	Authentic Japanese Restaurant (fr)	\N	\N
1979	1	auto-machine-shop	Auto Machine Shop	Auto Machine Shop	\N	\N
1979	2	auto-machine-shop	Auto Machine Shop (fr)	Auto Machine Shop (fr)	\N	\N
1980	1	auto-parts-store	Auto Parts Store	Auto Parts Store	\N	\N
1980	2	auto-parts-store	Auto Parts Store (fr)	Auto Parts Store (fr)	\N	\N
223	1	auto-repair-shop	Auto Repair Shop	Auto Repair Shop	\N	\N
223	2	auto-repair-shop	Auto Repair Shop (fr)	Auto Repair Shop (fr)	\N	\N
3269	1	badminton-complex	Badminton Complex	Badminton Complex	\N	\N
3269	2	badminton-complex	Badminton Complex (fr)	Badminton Complex (fr)	\N	\N
3270	1	badminton-court	Badminton Court	Badminton Court	\N	\N
3270	2	badminton-court	Badminton Court (fr)	Badminton Court (fr)	\N	\N
50	1	bagel-shop	Bagel Shop	Bagel Shop	\N	\N
50	2	bagel-shop	Bagel Shop (fr)	Bagel Shop (fr)	\N	\N
111	1	bakery	Bakery	Bakery	\N	\N
111	2	bakery	Bakery (fr)	Bakery (fr)	\N	\N
160	1	bakery-equipment	Bakery Equipment	Bakery Equipment	\N	\N
160	2	bakery-equipment	Bakery Equipment (fr)	Bakery Equipment (fr)	\N	\N
1130	1	baking-supply-store	Baking Supply Store	Baking Supply Store	\N	\N
1130	2	baking-supply-store	Baking Supply Store (fr)	Baking Supply Store (fr)	\N	\N
252	1	ballet-theater	Ballet Theater	Ballet Theater	\N	\N
252	2	ballet-theater	Ballet Theater (fr)	Ballet Theater (fr)	\N	\N
2973	1	bangladeshi-restaurant	Bangladeshi Restaurant	Bangladeshi Restaurant	\N	\N
2973	2	bangladeshi-restaurant	Bangladeshi Restaurant (fr)	Bangladeshi Restaurant (fr)	\N	\N
1086	1	bank	Bank	Bank	\N	\N
1086	2	bank	Bank (fr)	Bank (fr)	\N	\N
135	1	banquet-hall	Banquet Hall	Banquet Hall	\N	\N
135	2	banquet-hall	Banquet Hall (fr)	Banquet Hall (fr)	\N	\N
10	1	bar	Bar	Bar	\N	\N
10	2	bar	Bar (fr)	Bar (fr)	\N	\N
1942	1	bar-pmu	Bar Pmu	Bar Pmu	\N	\N
1942	2	bar-pmu	Bar Pmu (fr)	Bar Pmu (fr)	\N	\N
371	1	bar-tabac	Bar Tabac	Bar Tabac	\N	\N
371	2	bar-tabac	Bar Tabac (fr)	Bar Tabac (fr)	\N	\N
2512	1	barbecue-area	Barbecue Area	Barbecue Area	\N	\N
2512	2	barbecue-area	Barbecue Area (fr)	Barbecue Area (fr)	\N	\N
62	1	barbecue-restaurant	Barbecue Restaurant	Barbecue Restaurant	\N	\N
62	2	barbecue-restaurant	Barbecue Restaurant (fr)	Barbecue Restaurant (fr)	\N	\N
360	1	barber-school	Barber School	Barber School	\N	\N
360	2	barber-school	Barber School (fr)	Barber School (fr)	\N	\N
357	1	barber-shop	Barber Shop	Barber Shop	\N	\N
357	2	barber-shop	Barber Shop (fr)	Barber Shop (fr)	\N	\N
358	1	barber-supply-store	Barber Supply Store	Barber Supply Store	\N	\N
358	2	barber-supply-store	Barber Supply Store (fr)	Barber Supply Store (fr)	\N	\N
923	1	bartending-school	Bartending School	Bartending School	\N	\N
923	2	bartending-school	Bartending School (fr)	Bartending School (fr)	\N	\N
199	1	basilica	Basilica	Basilica	\N	\N
199	2	basilica	Basilica (fr)	Basilica (fr)	\N	\N
530	1	basque-restaurant	Basque Restaurant	Basque Restaurant	\N	\N
2037	2	chapel	Chapel (fr)	Chapel (fr)	\N	\N
530	2	basque-restaurant	Basque Restaurant (fr)	Basque Restaurant (fr)	\N	\N
3016	1	batak-restaurant	Batak Restaurant	Batak Restaurant	\N	\N
3016	2	batak-restaurant	Batak Restaurant (fr)	Batak Restaurant (fr)	\N	\N
1713	1	bavarian-restaurant	Bavarian Restaurant	Bavarian Restaurant	\N	\N
1713	2	bavarian-restaurant	Bavarian Restaurant (fr)	Bavarian Restaurant (fr)	\N	\N
293	1	bbq-area	Bbq Area	Bbq Area	\N	\N
293	2	bbq-area	Bbq Area (fr)	Bbq Area (fr)	\N	\N
1736	1	beach-volleyball-court	Beach Volleyball Court	Beach Volleyball Court	\N	\N
1736	2	beach-volleyball-court	Beach Volleyball Court (fr)	Beach Volleyball Court (fr)	\N	\N
361	1	beautician	Beautician	Beautician	\N	\N
361	2	beautician	Beautician (fr)	Beautician (fr)	\N	\N
1065	1	beauty-product-supplier	Beauty Product Supplier	Beauty Product Supplier	\N	\N
1065	2	beauty-product-supplier	Beauty Product Supplier (fr)	Beauty Product Supplier (fr)	\N	\N
362	1	beauty-salon	Beauty Salon	Beauty Salon	\N	\N
362	2	beauty-salon	Beauty Salon (fr)	Beauty Salon (fr)	\N	\N
1066	1	beauty-supply-store	Beauty Supply Store	Beauty Supply Store	\N	\N
1066	2	beauty-supply-store	Beauty Supply Store (fr)	Beauty Supply Store (fr)	\N	\N
264	1	bed-breakfast	Bed Breakfast	Bed Breakfast	\N	\N
264	2	bed-breakfast	Bed Breakfast (fr)	Bed Breakfast (fr)	\N	\N
1354	1	beer-distributor	Beer Distributor	Beer Distributor	\N	\N
1354	2	beer-distributor	Beer Distributor (fr)	Beer Distributor (fr)	\N	\N
125	1	beer-garden	Beer Garden	Beer Garden	\N	\N
125	2	beer-garden	Beer Garden (fr)	Beer Garden (fr)	\N	\N
127	1	beer-hall	Beer Hall	Beer Hall	\N	\N
127	2	beer-hall	Beer Hall (fr)	Beer Hall (fr)	\N	\N
68	1	beer-store	Beer Store	Beer Store	\N	\N
68	2	beer-store	Beer Store (fr)	Beer Store (fr)	\N	\N
391	1	belgian-restaurant	Belgian Restaurant	Belgian Restaurant	\N	\N
391	2	belgian-restaurant	Belgian Restaurant (fr)	Belgian Restaurant (fr)	\N	\N
1122	1	beverage-distributor	Beverage Distributor	Beverage Distributor	\N	\N
1122	2	beverage-distributor	Beverage Distributor (fr)	Beverage Distributor (fr)	\N	\N
1015	1	bicycle-rental-service	Bicycle Rental Service	Bicycle Rental Service	\N	\N
1015	2	bicycle-rental-service	Bicycle Rental Service (fr)	Bicycle Rental Service (fr)	\N	\N
266	1	bicycle-repair-shop	Bicycle Repair Shop	Bicycle Repair Shop	\N	\N
266	2	bicycle-repair-shop	Bicycle Repair Shop (fr)	Bicycle Repair Shop (fr)	\N	\N
267	1	bicycle-shop	Bicycle Shop	Bicycle Shop	\N	\N
267	2	bicycle-shop	Bicycle Shop (fr)	Bicycle Shop (fr)	\N	\N
268	1	bicycle-store	Bicycle Store	Bicycle Store	\N	\N
268	2	bicycle-store	Bicycle Store (fr)	Bicycle Store (fr)	\N	\N
1018	1	bike-wash	Bike Wash	Bike Wash	\N	\N
1018	2	bike-wash	Bike Wash (fr)	Bike Wash (fr)	\N	\N
36	1	bistro	Bistro	Bistro	\N	\N
36	2	bistro	Bistro (fr)	Bistro (fr)	\N	\N
1237	1	blueprint-service	Blueprint Service	Blueprint Service	\N	\N
1237	2	blueprint-service	Blueprint Service (fr)	Blueprint Service (fr)	\N	\N
951	1	blues-club	Blues Club	Blues Club	\N	\N
951	2	blues-club	Blues Club (fr)	Blues Club (fr)	\N	\N
228	1	board-game-club	Board Game Club	Board Game Club	\N	\N
228	2	board-game-club	Board Game Club (fr)	Board Game Club (fr)	\N	\N
2613	1	boat-builders	Boat Builders	Boat Builders	\N	\N
2613	2	boat-builders	Boat Builders (fr)	Boat Builders (fr)	\N	\N
294	1	boat-club	Boat Club	Boat Club	\N	\N
294	2	boat-club	Boat Club (fr)	Boat Club (fr)	\N	\N
295	1	boat-rental-service	Boat Rental Service	Boat Rental Service	\N	\N
295	2	boat-rental-service	Boat Rental Service (fr)	Boat Rental Service (fr)	\N	\N
2614	1	boat-repair-shop	Boat Repair Shop	Boat Repair Shop	\N	\N
2614	2	boat-repair-shop	Boat Repair Shop (fr)	Boat Repair Shop (fr)	\N	\N
98	1	boat-tour-agency	Boat Tour Agency	Boat Tour Agency	\N	\N
98	2	boat-tour-agency	Boat Tour Agency (fr)	Boat Tour Agency (fr)	\N	\N
304	1	book-store	Book Store	Book Store	\N	\N
304	2	book-store	Book Store (fr)	Book Store (fr)	\N	\N
104	1	botanical-garden	Botanical Garden	Botanical Garden	\N	\N
104	2	botanical-garden	Botanical Garden (fr)	Botanical Garden (fr)	\N	\N
1258	1	boutique	Boutique	Boutique	\N	\N
1258	2	boutique	Boutique (fr)	Boutique (fr)	\N	\N
684	1	bowling-alley	Bowling Alley	Bowling Alley	\N	\N
684	2	bowling-alley	Bowling Alley (fr)	Bowling Alley (fr)	\N	\N
685	1	bowling-club	Bowling Club	Bowling Club	\N	\N
685	2	bowling-club	Bowling Club (fr)	Bowling Club (fr)	\N	\N
2456	1	bowling-supply-shop	Bowling Supply Shop	Bowling Supply Shop	\N	\N
2456	2	bowling-supply-shop	Bowling Supply Shop (fr)	Bowling Supply Shop (fr)	\N	\N
161	1	box-lunch-supplier	Box Lunch Supplier	Box Lunch Supplier	\N	\N
161	2	box-lunch-supplier	Box Lunch Supplier (fr)	Box Lunch Supplier (fr)	\N	\N
2094	1	boxing-club	Boxing Club	Boxing Club	\N	\N
2094	2	boxing-club	Boxing Club (fr)	Boxing Club (fr)	\N	\N
701	1	boxing-gym	Boxing Gym	Boxing Gym	\N	\N
701	2	boxing-gym	Boxing Gym (fr)	Boxing Gym (fr)	\N	\N
46	1	brasserie	Brasserie	Brasserie	\N	\N
46	2	brasserie	Brasserie (fr)	Brasserie (fr)	\N	\N
1627	1	brazilian-pastelaria	Brazilian Pastelaria	Brazilian Pastelaria	\N	\N
1627	2	brazilian-pastelaria	Brazilian Pastelaria (fr)	Brazilian Pastelaria (fr)	\N	\N
33	1	brazilian-restaurant	Brazilian Restaurant	Brazilian Restaurant	\N	\N
33	2	brazilian-restaurant	Brazilian Restaurant (fr)	Brazilian Restaurant (fr)	\N	\N
2	1	breakfast-restaurant	Breakfast Restaurant	Breakfast Restaurant	\N	\N
2	2	breakfast-restaurant	Breakfast Restaurant (fr)	Breakfast Restaurant (fr)	\N	\N
90	1	brewery	Brewery	Brewery	\N	\N
90	2	brewery	Brewery (fr)	Brewery (fr)	\N	\N
140	1	brewpub	Brewpub	Brewpub	\N	\N
140	2	brewpub	Brewpub (fr)	Brewpub (fr)	\N	\N
92	1	bridge	Bridge	Bridge	\N	\N
92	2	bridge	Bridge (fr)	Bridge (fr)	\N	\N
13	1	british-restaurant	British Restaurant	British Restaurant	\N	\N
13	2	british-restaurant	British Restaurant (fr)	British Restaurant (fr)	\N	\N
1	1	brunch-restaurant	Brunch Restaurant	Brunch Restaurant	\N	\N
1	2	brunch-restaurant	Brunch Restaurant (fr)	Brunch Restaurant (fr)	\N	\N
42	1	bubble-tea-store	Bubble Tea Store	Bubble Tea Store	\N	\N
42	2	bubble-tea-store	Bubble Tea Store (fr)	Bubble Tea Store (fr)	\N	\N
262	1	buffet-restaurant	Buffet Restaurant	Buffet Restaurant	\N	\N
262	2	buffet-restaurant	Buffet Restaurant (fr)	Buffet Restaurant (fr)	\N	\N
2194	1	bullring	Bullring	Bullring	\N	\N
2194	2	bullring	Bullring (fr)	Bullring (fr)	\N	\N
832	1	burrito-restaurant	Burrito Restaurant	Burrito Restaurant	\N	\N
832	2	burrito-restaurant	Burrito Restaurant (fr)	Burrito Restaurant (fr)	\N	\N
2528	1	bus-stop	Bus Stop	Bus Stop	\N	\N
2528	2	bus-stop	Bus Stop (fr)	Bus Stop (fr)	\N	\N
1124	1	bus-ticket-agency	Bus Ticket Agency	Bus Ticket Agency	\N	\N
1124	2	bus-ticket-agency	Bus Ticket Agency (fr)	Bus Ticket Agency (fr)	\N	\N
1631	1	bus-tour-agency	Bus Tour Agency	Bus Tour Agency	\N	\N
1631	2	bus-tour-agency	Bus Tour Agency (fr)	Bus Tour Agency (fr)	\N	\N
130	1	business-center	Business Center	Business Center	\N	\N
130	2	business-center	Business Center (fr)	Business Center (fr)	\N	\N
1690	1	business-park	Business Park	Business Park	\N	\N
1690	2	business-park	Business Park (fr)	Business Park (fr)	\N	\N
136	1	business-to-business-service	Business To Business Service	Business To Business Service	\N	\N
136	2	business-to-business-service	Business To Business Service (fr)	Business To Business Service (fr)	\N	\N
440	1	butcher-shop	Butcher Shop	Butcher Shop	\N	\N
440	2	butcher-shop	Butcher Shop (fr)	Butcher Shop (fr)	\N	\N
1574	1	butcher-shop-deli	Butcher Shop Deli	Butcher Shop Deli	\N	\N
1574	2	butcher-shop-deli	Butcher Shop Deli (fr)	Butcher Shop Deli (fr)	\N	\N
642	1	cabaret-club	Cabaret Club	Cabaret Club	\N	\N
642	2	cabaret-club	Cabaret Club (fr)	Cabaret Club (fr)	\N	\N
388	1	cabin-rental-agency	Cabin Rental Agency	Cabin Rental Agency	\N	\N
388	2	cabin-rental-agency	Cabin Rental Agency (fr)	Cabin Rental Agency (fr)	\N	\N
3	1	cafe	Cafe	Cafe	\N	\N
3	2	cafe	Cafe (fr)	Cafe (fr)	\N	\N
186	1	cafeteria	Cafeteria	Cafeteria	\N	\N
186	2	cafeteria	Cafeteria (fr)	Cafeteria (fr)	\N	\N
14	1	cake-shop	Cake Shop	Cake Shop	\N	\N
14	2	cake-shop	Cake Shop (fr)	Cake Shop (fr)	\N	\N
1823	1	californian-restaurant	Californian Restaurant	Californian Restaurant	\N	\N
1823	2	californian-restaurant	Californian Restaurant (fr)	Californian Restaurant (fr)	\N	\N
3176	1	cambodian-restaurant	Cambodian Restaurant	Cambodian Restaurant	\N	\N
3176	2	cambodian-restaurant	Cambodian Restaurant (fr)	Cambodian Restaurant (fr)	\N	\N
94	1	campground	Campground	Campground	\N	\N
94	2	campground	Campground (fr)	Campground (fr)	\N	\N
1296	1	canadian-restaurant	Canadian Restaurant	Canadian Restaurant	\N	\N
1296	2	canadian-restaurant	Canadian Restaurant (fr)	Canadian Restaurant (fr)	\N	\N
372	1	candy-store	Candy Store	Candy Store	\N	\N
372	2	candy-store	Candy Store (fr)	Candy Store (fr)	\N	\N
108	1	cannabis-store	Cannabis Store	Cannabis Store	\N	\N
108	2	cannabis-store	Cannabis Store (fr)	Cannabis Store (fr)	\N	\N
95	1	canoe-kayak-rental-service	Canoe Kayak Rental Service	Canoe Kayak Rental Service	\N	\N
95	2	canoe-kayak-rental-service	Canoe Kayak Rental Service (fr)	Canoe Kayak Rental Service (fr)	\N	\N
2926	1	cantonese-restaurant	Cantonese Restaurant	Cantonese Restaurant	\N	\N
2926	2	cantonese-restaurant	Cantonese Restaurant (fr)	Cantonese Restaurant (fr)	\N	\N
1207	1	capsule-hotel	Capsule Hotel	Capsule Hotel	\N	\N
1207	2	capsule-hotel	Capsule Hotel (fr)	Capsule Hotel (fr)	\N	\N
3012	1	car-dealer	Car Dealer	Car Dealer	\N	\N
3012	2	car-dealer	Car Dealer (fr)	Car Dealer (fr)	\N	\N
224	1	car-racing-track	Car Racing Track	Car Racing Track	\N	\N
224	2	car-racing-track	Car Racing Track (fr)	Car Racing Track (fr)	\N	\N
1131	1	car-wash	Car Wash	Car Wash	\N	\N
1131	2	car-wash	Car Wash (fr)	Car Wash (fr)	\N	\N
2113	1	caribbean-restaurant	Caribbean Restaurant	Caribbean Restaurant	\N	\N
2113	2	caribbean-restaurant	Caribbean Restaurant (fr)	Caribbean Restaurant (fr)	\N	\N
1529	1	carvery	Carvery	Carvery	\N	\N
1529	2	carvery	Carvery (fr)	Carvery (fr)	\N	\N
660	1	casino	Casino	Casino	\N	\N
660	2	casino	Casino (fr)	Casino (fr)	\N	\N
1500	1	castilian-restaurant	Castilian Restaurant	Castilian Restaurant	\N	\N
1500	2	castilian-restaurant	Castilian Restaurant (fr)	Castilian Restaurant (fr)	\N	\N
77	1	castle	Castle	Castle	\N	\N
77	2	castle	Castle (fr)	Castle (fr)	\N	\N
437	1	catalonian-restaurant	Catalonian Restaurant	Catalonian Restaurant	\N	\N
437	2	catalonian-restaurant	Catalonian Restaurant (fr)	Catalonian Restaurant (fr)	\N	\N
43	1	caterer	Caterer	Caterer	\N	\N
43	2	caterer	Caterer (fr)	Caterer (fr)	\N	\N
164	1	catering-food-and-drink-supplier	Catering Food And Drink Supplier	Catering Food And Drink Supplier	\N	\N
164	2	catering-food-and-drink-supplier	Catering Food And Drink Supplier (fr)	Catering Food And Drink Supplier (fr)	\N	\N
197	1	cathedral	Cathedral	Cathedral	\N	\N
197	2	cathedral	Cathedral (fr)	Cathedral (fr)	\N	\N
198	1	catholic-cathedral	Catholic Cathedral	Catholic Cathedral	\N	\N
198	2	catholic-cathedral	Catholic Cathedral (fr)	Catholic Cathedral (fr)	\N	\N
196	1	catholic-church	Catholic Church	Catholic Church	\N	\N
196	2	catholic-church	Catholic Church (fr)	Catholic Church (fr)	\N	\N
430	1	cemetery	Cemetery	Cemetery	\N	\N
430	2	cemetery	Cemetery (fr)	Cemetery (fr)	\N	\N
493	1	ceramic-manufacturer	Ceramic Manufacturer	Ceramic Manufacturer	\N	\N
493	2	ceramic-manufacturer	Ceramic Manufacturer (fr)	Ceramic Manufacturer (fr)	\N	\N
2037	1	chapel	Chapel	Chapel	\N	\N
178	1	charcuterie	Charcuterie	Charcuterie	\N	\N
178	2	charcuterie	Charcuterie (fr)	Charcuterie (fr)	\N	\N
158	1	charity	Charity	Charity	\N	\N
158	2	charity	Charity (fr)	Charity (fr)	\N	\N
349	1	cheese-shop	Cheese Shop	Cheese Shop	\N	\N
349	2	cheese-shop	Cheese Shop (fr)	Cheese Shop (fr)	\N	\N
1294	1	cheesesteak-restaurant	Cheesesteak Restaurant	Cheesesteak Restaurant	\N	\N
1294	2	cheesesteak-restaurant	Cheesesteak Restaurant (fr)	Cheesesteak Restaurant (fr)	\N	\N
55	1	chicken-restaurant	Chicken Restaurant	Chicken Restaurant	\N	\N
55	2	chicken-restaurant	Chicken Restaurant (fr)	Chicken Restaurant (fr)	\N	\N
56	1	chicken-shop	Chicken Shop	Chicken Shop	\N	\N
56	2	chicken-shop	Chicken Shop (fr)	Chicken Shop (fr)	\N	\N
128	1	chicken-wings-restaurant	Chicken Wings Restaurant	Chicken Wings Restaurant	\N	\N
128	2	chicken-wings-restaurant	Chicken Wings Restaurant (fr)	Chicken Wings Restaurant (fr)	\N	\N
1200	1	child-care-agency	Child Care Agency	Child Care Agency	\N	\N
1200	2	child-care-agency	Child Care Agency (fr)	Child Care Agency (fr)	\N	\N
314	1	child-health-care-centre	Child Health Care Centre	Child Health Care Centre	\N	\N
314	2	child-health-care-centre	Child Health Care Centre (fr)	Child Health Care Centre (fr)	\N	\N
599	1	children-hall	Children Hall	Children Hall	\N	\N
599	2	children-hall	Children Hall (fr)	Children Hall (fr)	\N	\N
428	1	childrens-amusement-center	Childrens Amusement Center	Childrens Amusement Center	\N	\N
428	2	childrens-amusement-center	Childrens Amusement Center (fr)	Childrens Amusement Center (fr)	\N	\N
1791	1	childrens-book-store	Childrens Book Store	Childrens Book Store	\N	\N
1791	2	childrens-book-store	Childrens Book Store (fr)	Childrens Book Store (fr)	\N	\N
538	1	childrens-cafe	Childrens Cafe	Childrens Cafe	\N	\N
538	2	childrens-cafe	Childrens Cafe (fr)	Childrens Cafe (fr)	\N	\N
1983	1	childrens-farm	Childrens Farm	Childrens Farm	\N	\N
1983	2	childrens-farm	Childrens Farm (fr)	Childrens Farm (fr)	\N	\N
81	1	childrens-museum	Childrens Museum	Childrens Museum	\N	\N
81	2	childrens-museum	Childrens Museum (fr)	Childrens Museum (fr)	\N	\N
1759	1	childrens-party-buffet	Childrens Party Buffet	Childrens Party Buffet	\N	\N
1759	2	childrens-party-buffet	Childrens Party Buffet (fr)	Childrens Party Buffet (fr)	\N	\N
755	1	childrens-party-service	Childrens Party Service	Childrens Party Service	\N	\N
755	2	childrens-party-service	Childrens Party Service (fr)	Childrens Party Service (fr)	\N	\N
253	1	childrens-theater	Childrens Theater	Childrens Theater	\N	\N
253	2	childrens-theater	Childrens Theater (fr)	Childrens Theater (fr)	\N	\N
219	1	chilean-restaurant	Chilean Restaurant	Chilean Restaurant	\N	\N
219	2	chilean-restaurant	Chilean Restaurant (fr)	Chilean Restaurant (fr)	\N	\N
1338	1	chinaware-store	Chinaware Store	Chinaware Store	\N	\N
1338	2	chinaware-store	Chinaware Store (fr)	Chinaware Store (fr)	\N	\N
2366	1	chinese-bakery	Chinese Bakery	Chinese Bakery	\N	\N
2366	2	chinese-bakery	Chinese Bakery (fr)	Chinese Bakery (fr)	\N	\N
1691	1	chinese-noodle-restaurant	Chinese Noodle Restaurant	Chinese Noodle Restaurant	\N	\N
1691	2	chinese-noodle-restaurant	Chinese Noodle Restaurant (fr)	Chinese Noodle Restaurant (fr)	\N	\N
187	1	chinese-restaurant	Chinese Restaurant	Chinese Restaurant	\N	\N
187	2	chinese-restaurant	Chinese Restaurant (fr)	Chinese Restaurant (fr)	\N	\N
390	1	chinese-takeaway	Chinese Takeaway	Chinese Takeaway	\N	\N
390	2	chinese-takeaway	Chinese Takeaway (fr)	Chinese Takeaway (fr)	\N	\N
182	1	chocolate-artisan	Chocolate Artisan	Chocolate Artisan	\N	\N
182	2	chocolate-artisan	Chocolate Artisan (fr)	Chocolate Artisan (fr)	\N	\N
183	1	chocolate-cafe	Chocolate Cafe	Chocolate Cafe	\N	\N
183	2	chocolate-cafe	Chocolate Cafe (fr)	Chocolate Cafe (fr)	\N	\N
365	1	chocolate-factory	Chocolate Factory	Chocolate Factory	\N	\N
365	2	chocolate-factory	Chocolate Factory (fr)	Chocolate Factory (fr)	\N	\N
366	1	chocolate-shop	Chocolate Shop	Chocolate Shop	\N	\N
366	2	chocolate-shop	Chocolate Shop (fr)	Chocolate Shop (fr)	\N	\N
254	2	choir	Choir (fr)	Choir (fr)	\N	\N
1672	1	chophouse-restaurant	Chophouse Restaurant	Chophouse Restaurant	\N	\N
1672	2	chophouse-restaurant	Chophouse Restaurant (fr)	Chophouse Restaurant (fr)	\N	\N
341	1	christian-church	Christian Church	Christian Church	\N	\N
341	2	christian-church	Christian Church (fr)	Christian Church (fr)	\N	\N
796	1	christmas-market	Christmas Market	Christmas Market	\N	\N
796	2	christmas-market	Christmas Market (fr)	Christmas Market (fr)	\N	\N
79	1	church	Church	Church	\N	\N
79	2	church	Church (fr)	Church (fr)	\N	\N
2166	1	church-of-christ	Church Of Christ	Church Of Christ	\N	\N
2166	2	church-of-christ	Church Of Christ (fr)	Church Of Christ (fr)	\N	\N
1322	1	church-of-jesus-christ-of-latter-day-saints	Church Of Jesus Christ Of Latter Day Saints	Church Of Jesus Christ Of Latter Day Saints	\N	\N
1322	2	church-of-jesus-christ-of-latter-day-saints	Church Of Jesus Christ Of Latter Day Saints (fr)	Church Of Jesus Christ Of Latter Day Saints (fr)	\N	\N
328	1	church-supply-store	Church Supply Store	Church Supply Store	\N	\N
328	2	church-supply-store	Church Supply Store (fr)	Church Supply Store (fr)	\N	\N
879	1	churreria	Churreria	Churreria	\N	\N
879	2	churreria	Churreria (fr)	Churreria (fr)	\N	\N
808	1	cider-bar	Cider Bar	Cider Bar	\N	\N
808	2	cider-bar	Cider Bar (fr)	Cider Bar (fr)	\N	\N
305	1	cigar-shop	Cigar Shop	Cigar Shop	\N	\N
305	2	cigar-shop	Cigar Shop (fr)	Cigar Shop (fr)	\N	\N
386	1	circus	Circus	Circus	\N	\N
386	2	circus	Circus (fr)	Circus (fr)	\N	\N
2182	1	city-government-office	City Government Office	City Government Office	\N	\N
2182	2	city-government-office	City Government Office (fr)	City Government Office (fr)	\N	\N
398	1	city-hall	City Hall	City Hall	\N	\N
398	2	city-hall	City Hall (fr)	City Hall (fr)	\N	\N
399	1	city-or-town-hall	City Or Town Hall	City Or Town Hall	\N	\N
399	2	city-or-town-hall	City Or Town Hall (fr)	City Or Town Hall (fr)	\N	\N
113	1	city-park	City Park	City Park	\N	\N
113	2	city-park	City Park (fr)	City Park (fr)	\N	\N
819	1	civic-center	Civic Center	Civic Center	\N	\N
819	2	civic-center	Civic Center (fr)	Civic Center (fr)	\N	\N
227	1	clothing-store	Clothing Store	Clothing Store	\N	\N
227	2	clothing-store	Clothing Store (fr)	Clothing Store (fr)	\N	\N
150	1	club	Club	Club	\N	\N
150	2	club	Club (fr)	Club (fr)	\N	\N
2504	1	coaching-center	Coaching Center	Coaching Center	\N	\N
2504	2	coaching-center	Coaching Center (fr)	Coaching Center (fr)	\N	\N
4	1	cocktail-bar	Cocktail Bar	Cocktail Bar	\N	\N
4	2	cocktail-bar	Cocktail Bar (fr)	Cocktail Bar (fr)	\N	\N
54	1	coffee-roasters	Coffee Roasters	Coffee Roasters	\N	\N
54	2	coffee-roasters	Coffee Roasters (fr)	Coffee Roasters (fr)	\N	\N
23	1	coffee-shop	Coffee Shop	Coffee Shop	\N	\N
23	2	coffee-shop	Coffee Shop (fr)	Coffee Shop (fr)	\N	\N
170	1	coffee-stand	Coffee Stand	Coffee Stand	\N	\N
170	2	coffee-stand	Coffee Stand (fr)	Coffee Stand (fr)	\N	\N
35	1	coffee-store	Coffee Store	Coffee Store	\N	\N
35	2	coffee-store	Coffee Store (fr)	Coffee Store (fr)	\N	\N
184	1	coffee-vending-machine	Coffee Vending Machine	Coffee Vending Machine	\N	\N
184	2	coffee-vending-machine	Coffee Vending Machine (fr)	Coffee Vending Machine (fr)	\N	\N
385	1	coffee-wholesaler	Coffee Wholesaler	Coffee Wholesaler	\N	\N
385	2	coffee-wholesaler	Coffee Wholesaler (fr)	Coffee Wholesaler (fr)	\N	\N
47	1	cold-cut-store	Cold Cut Store	Cold Cut Store	\N	\N
47	2	cold-cut-store	Cold Cut Store (fr)	Cold Cut Store (fr)	\N	\N
636	1	colombian-restaurant	Colombian Restaurant	Colombian Restaurant	\N	\N
636	2	colombian-restaurant	Colombian Restaurant (fr)	Colombian Restaurant (fr)	\N	\N
708	1	comedy-club	Comedy Club	Comedy Club	\N	\N
708	2	comedy-club	Comedy Club (fr)	Comedy Club (fr)	\N	\N
3075	1	comic-book-store	Comic Book Store	Comic Book Store	\N	\N
3075	2	comic-book-store	Comic Book Store (fr)	Comic Book Store (fr)	\N	\N
847	1	community-center	Community Center	Community Center	\N	\N
847	2	community-center	Community Center (fr)	Community Center (fr)	\N	\N
1768	1	community-college	Community College	Community College	\N	\N
1768	2	community-college	Community College (fr)	Community College (fr)	\N	\N
344	1	community-garden	Community Garden	Community Garden	\N	\N
344	2	community-garden	Community Garden (fr)	Community Garden (fr)	\N	\N
152	1	concert-hall	Concert Hall	Concert Hall	\N	\N
152	2	concert-hall	Concert Hall (fr)	Concert Hall (fr)	\N	\N
162	1	confectionery	Confectionery	Confectionery	\N	\N
162	2	confectionery	Confectionery (fr)	Confectionery (fr)	\N	\N
131	1	conference-center	Conference Center	Conference Center	\N	\N
131	2	conference-center	Conference Center (fr)	Conference Center (fr)	\N	\N
2967	1	conservation-department	Conservation Department	Conservation Department	\N	\N
2967	2	conservation-department	Conservation Department (fr)	Conservation Department (fr)	\N	\N
2632	1	conservative-synagogue	Conservative Synagogue	Conservative Synagogue	\N	\N
2632	2	conservative-synagogue	Conservative Synagogue (fr)	Conservative Synagogue (fr)	\N	\N
1745	1	construction-equipment-supplier	Construction Equipment Supplier	Construction Equipment Supplier	\N	\N
1745	2	construction-equipment-supplier	Construction Equipment Supplier (fr)	Construction Equipment Supplier (fr)	\N	\N
229	1	consultant	Consultant	Consultant	\N	\N
229	2	consultant	Consultant (fr)	Consultant (fr)	\N	\N
65	1	continental-restaurant	Continental Restaurant	Continental Restaurant	\N	\N
65	2	continental-restaurant	Continental Restaurant (fr)	Continental Restaurant (fr)	\N	\N
141	1	convenience-store	Convenience Store	Convenience Store	\N	\N
141	2	convenience-store	Convenience Store (fr)	Convenience Store (fr)	\N	\N
374	2	convent	Convent (fr)	Convent (fr)	\N	\N
678	1	convention-center	Convention Center	Convention Center	\N	\N
678	2	convention-center	Convention Center (fr)	Convention Center (fr)	\N	\N
3001	1	conveyor-belt-sushi-restaurant	Conveyor Belt Sushi Restaurant	Conveyor Belt Sushi Restaurant	\N	\N
3001	2	conveyor-belt-sushi-restaurant	Conveyor Belt Sushi Restaurant (fr)	Conveyor Belt Sushi Restaurant (fr)	\N	\N
112	1	cookie-shop	Cookie Shop	Cookie Shop	\N	\N
112	2	cookie-shop	Cookie Shop (fr)	Cookie Shop (fr)	\N	\N
230	1	cooking-class	Cooking Class	Cooking Class	\N	\N
230	2	cooking-class	Cooking Class (fr)	Cooking Class (fr)	\N	\N
1013	1	cooking-school	Cooking School	Cooking School	\N	\N
1013	2	cooking-school	Cooking School (fr)	Cooking School (fr)	\N	\N
984	1	corporate-entertainment-service	Corporate Entertainment Service	Corporate Entertainment Service	\N	\N
984	2	corporate-entertainment-service	Corporate Entertainment Service (fr)	Corporate Entertainment Service (fr)	\N	\N
1666	1	corporate-office	Corporate Office	Corporate Office	\N	\N
1666	2	corporate-office	Corporate Office (fr)	Corporate Office (fr)	\N	\N
1067	1	cosmetic-products-manufacturer	Cosmetic Products Manufacturer	Cosmetic Products Manufacturer	\N	\N
1067	2	cosmetic-products-manufacturer	Cosmetic Products Manufacturer (fr)	Cosmetic Products Manufacturer (fr)	\N	\N
1068	1	cosmetics-and-perfumes-supplier	Cosmetics And Perfumes Supplier	Cosmetics And Perfumes Supplier	\N	\N
1068	2	cosmetics-and-perfumes-supplier	Cosmetics And Perfumes Supplier (fr)	Cosmetics And Perfumes Supplier (fr)	\N	\N
1069	1	cosmetics-industry	Cosmetics Industry	Cosmetics Industry	\N	\N
1069	2	cosmetics-industry	Cosmetics Industry (fr)	Cosmetics Industry (fr)	\N	\N
352	1	cosmetics-store	Cosmetics Store	Cosmetics Store	\N	\N
352	2	cosmetics-store	Cosmetics Store (fr)	Cosmetics Store (fr)	\N	\N
373	1	cosplay-cafe	Cosplay Cafe	Cosplay Cafe	\N	\N
373	2	cosplay-cafe	Cosplay Cafe (fr)	Cosplay Cafe (fr)	\N	\N
2105	1	costa-rican-restaurant	Costa Rican Restaurant	Costa Rican Restaurant	\N	\N
142	2	distillery	Distillery (fr)	Distillery (fr)	\N	\N
2105	2	costa-rican-restaurant	Costa Rican Restaurant (fr)	Costa Rican Restaurant (fr)	\N	\N
2878	1	costume-jewelry-shop	Costume Jewelry Shop	Costume Jewelry Shop	\N	\N
2878	2	costume-jewelry-shop	Costume Jewelry Shop (fr)	Costume Jewelry Shop (fr)	\N	\N
238	1	council	Council	Council	\N	\N
238	2	council	Council (fr)	Council (fr)	\N	\N
420	1	country-club	Country Club	Country Club	\N	\N
420	2	country-club	Country Club (fr)	Country Club (fr)	\N	\N
1055	1	country-food-restaurant	Country Food Restaurant	Country Food Restaurant	\N	\N
1055	2	country-food-restaurant	Country Food Restaurant (fr)	Country Food Restaurant (fr)	\N	\N
587	1	country-park	Country Park	Country Park	\N	\N
587	2	country-park	Country Park (fr)	Country Park (fr)	\N	\N
1190	1	county-government-office	County Government Office	County Government Office	\N	\N
1190	2	county-government-office	County Government Office (fr)	County Government Office (fr)	\N	\N
645	1	courier-service	Courier Service	Courier Service	\N	\N
645	2	courier-service	Courier Service (fr)	Courier Service (fr)	\N	\N
1580	1	couscous-restaurant	Couscous Restaurant	Couscous Restaurant	\N	\N
1580	2	couscous-restaurant	Couscous Restaurant (fr)	Couscous Restaurant (fr)	\N	\N
132	1	coworking-space	Coworking Space	Coworking Space	\N	\N
132	2	coworking-space	Coworking Space (fr)	Coworking Space (fr)	\N	\N
2114	1	creole-restaurant	Creole Restaurant	Creole Restaurant	\N	\N
2114	2	creole-restaurant	Creole Restaurant (fr)	Creole Restaurant (fr)	\N	\N
25	2	creperie	Creperie (fr)	Creperie (fr)	\N	\N
906	1	croatian-restaurant	Croatian Restaurant	Croatian Restaurant	\N	\N
906	2	croatian-restaurant	Croatian Restaurant (fr)	Croatian Restaurant (fr)	\N	\N
99	1	cruise-agency	Cruise Agency	Cruise Agency	\N	\N
99	2	cruise-agency	Cruise Agency (fr)	Cruise Agency (fr)	\N	\N
2190	1	cruise-line-company	Cruise Line Company	Cruise Line Company	\N	\N
2190	2	cruise-line-company	Cruise Line Company (fr)	Cruise Line Company (fr)	\N	\N
925	1	culinary-school	Culinary School	Culinary School	\N	\N
925	2	culinary-school	Culinary School (fr)	Culinary School (fr)	\N	\N
638	1	cultural-association	Cultural Association	Cultural Association	\N	\N
638	2	cultural-association	Cultural Association (fr)	Cultural Association (fr)	\N	\N
86	1	cultural-center	Cultural Center	Cultural Center	\N	\N
86	2	cultural-center	Cultural Center (fr)	Cultural Center (fr)	\N	\N
214	1	cultural-landmark	Cultural Landmark	Cultural Landmark	\N	\N
214	2	cultural-landmark	Cultural Landmark (fr)	Cultural Landmark (fr)	\N	\N
156	1	cupcake-shop	Cupcake Shop	Cupcake Shop	\N	\N
156	2	cupcake-shop	Cupcake Shop (fr)	Cupcake Shop (fr)	\N	\N
1339	1	cutlery-store	Cutlery Store	Cutlery Store	\N	\N
1339	2	cutlery-store	Cutlery Store (fr)	Cutlery Store (fr)	\N	\N
1607	1	cycling-park	Cycling Park	Cycling Park	\N	\N
1607	2	cycling-park	Cycling Park (fr)	Cycling Park (fr)	\N	\N
3030	1	czech-restaurant	Czech Restaurant	Czech Restaurant	\N	\N
3030	2	czech-restaurant	Czech Restaurant (fr)	Czech Restaurant (fr)	\N	\N
1760	1	dairy-store	Dairy Store	Dairy Store	\N	\N
1760	2	dairy-store	Dairy Store (fr)	Dairy Store (fr)	\N	\N
308	1	dance-club	Dance Club	Dance Club	\N	\N
308	2	dance-club	Dance Club (fr)	Dance Club (fr)	\N	\N
206	1	dance-company	Dance Company	Dance Company	\N	\N
206	2	dance-company	Dance Company (fr)	Dance Company (fr)	\N	\N
381	1	dance-hall	Dance Hall	Dance Hall	\N	\N
381	2	dance-hall	Dance Hall (fr)	Dance Hall (fr)	\N	\N
756	1	dance-pavillion	Dance Pavillion	Dance Pavillion	\N	\N
756	2	dance-pavillion	Dance Pavillion (fr)	Dance Pavillion (fr)	\N	\N
1569	1	dance-restaurant	Dance Restaurant	Dance Restaurant	\N	\N
1569	2	dance-restaurant	Dance Restaurant (fr)	Dance Restaurant (fr)	\N	\N
2508	1	dance-school	Dance School	Dance School	\N	\N
2508	2	dance-school	Dance School (fr)	Dance School (fr)	\N	\N
809	1	danish-restaurant	Danish Restaurant	Danish Restaurant	\N	\N
809	2	danish-restaurant	Danish Restaurant (fr)	Danish Restaurant (fr)	\N	\N
153	1	dart-bar	Dart Bar	Dart Bar	\N	\N
153	2	dart-bar	Dart Bar (fr)	Dart Bar (fr)	\N	\N
298	1	day-spa	Day Spa	Day Spa	\N	\N
298	2	day-spa	Day Spa (fr)	Day Spa (fr)	\N	\N
44	1	deli	Deli	Deli	\N	\N
44	2	deli	Deli (fr)	Deli (fr)	\N	\N
2380	1	delivery-chinese-restaurant	Delivery Chinese Restaurant	Delivery Chinese Restaurant	\N	\N
2380	2	delivery-chinese-restaurant	Delivery Chinese Restaurant (fr)	Delivery Chinese Restaurant (fr)	\N	\N
280	1	delivery-service	Delivery Service	Delivery Service	\N	\N
280	2	delivery-service	Delivery Service (fr)	Delivery Service (fr)	\N	\N
240	1	department-store	Department Store	Department Store	\N	\N
240	2	department-store	Department Store (fr)	Department Store (fr)	\N	\N
1787	1	design-agency	Design Agency	Design Agency	\N	\N
1787	2	design-agency	Design Agency (fr)	Design Agency (fr)	\N	\N
842	1	design-institute	Design Institute	Design Institute	\N	\N
842	2	design-institute	Design Institute (fr)	Design Institute (fr)	\N	\N
26	1	dessert-restaurant	Dessert Restaurant	Dessert Restaurant	\N	\N
26	2	dessert-restaurant	Dessert Restaurant (fr)	Dessert Restaurant (fr)	\N	\N
157	1	dessert-shop	Dessert Shop	Dessert Shop	\N	\N
157	2	dessert-shop	Dessert Shop (fr)	Dessert Shop (fr)	\N	\N
856	1	dim-sum-restaurant	Dim Sum Restaurant	Dim Sum Restaurant	\N	\N
856	2	dim-sum-restaurant	Dim Sum Restaurant (fr)	Dim Sum Restaurant (fr)	\N	\N
5	1	diner	Diner	Diner	\N	\N
5	2	diner	Diner (fr)	Diner (fr)	\N	\N
375	1	dinner-theater	Dinner Theater	Dinner Theater	\N	\N
375	2	dinner-theater	Dinner Theater (fr)	Dinner Theater (fr)	\N	\N
121	1	disco-club	Disco Club	Disco Club	\N	\N
121	2	disco-club	Disco Club (fr)	Disco Club (fr)	\N	\N
142	1	distillery	Distillery	Distillery	\N	\N
1329	1	diving-center	Diving Center	Diving Center	\N	\N
1329	2	diving-center	Diving Center (fr)	Diving Center (fr)	\N	\N
1257	1	dj-service	Dj Service	Dj Service	\N	\N
1257	2	dj-service	Dj Service (fr)	Dj Service (fr)	\N	\N
414	1	dog-cafe	Dog Cafe	Dog Cafe	\N	\N
414	2	dog-cafe	Dog Cafe (fr)	Dog Cafe (fr)	\N	\N
758	1	donut-shop	Donut Shop	Donut Shop	\N	\N
758	2	donut-shop	Donut Shop (fr)	Donut Shop (fr)	\N	\N
323	1	down-home-cooking-restaurant	Down Home Cooking Restaurant	Down Home Cooking Restaurant	\N	\N
323	2	down-home-cooking-restaurant	Down Home Cooking Restaurant (fr)	Down Home Cooking Restaurant (fr)	\N	\N
691	1	drama-theater	Drama Theater	Drama Theater	\N	\N
691	2	drama-theater	Drama Theater (fr)	Drama Theater (fr)	\N	\N
1039	1	drinking-water-fountain	Drinking Water Fountain	Drinking Water Fountain	\N	\N
1039	2	drinking-water-fountain	Drinking Water Fountain (fr)	Drinking Water Fountain (fr)	\N	\N
2495	1	drug-store	Drug Store	Drug Store	\N	\N
2495	2	drug-store	Drug Store (fr)	Drug Store (fr)	\N	\N
2478	1	dry-cleaner	Dry Cleaner	Dry Cleaner	\N	\N
2478	2	dry-cleaner	Dry Cleaner (fr)	Dry Cleaner (fr)	\N	\N
854	1	dumpling-restaurant	Dumpling Restaurant	Dumpling Restaurant	\N	\N
854	2	dumpling-restaurant	Dumpling Restaurant (fr)	Dumpling Restaurant (fr)	\N	\N
6	1	dutch-restaurant	Dutch Restaurant	Dutch Restaurant	\N	\N
6	2	dutch-restaurant	Dutch Restaurant (fr)	Dutch Restaurant (fr)	\N	\N
1780	1	e-commerce-service	E Commerce Service	E Commerce Service	\N	\N
1780	2	e-commerce-service	E Commerce Service (fr)	E Commerce Service (fr)	\N	\N
1272	1	east-african-restaurant	East African Restaurant	East African Restaurant	\N	\N
1272	2	east-african-restaurant	East African Restaurant (fr)	East African Restaurant (fr)	\N	\N
884	1	eastern-european-restaurant	Eastern European Restaurant	Eastern European Restaurant	\N	\N
884	2	eastern-european-restaurant	Eastern European Restaurant (fr)	Eastern European Restaurant (fr)	\N	\N
677	1	eastern-orthodox-church	Eastern Orthodox Church	Eastern Orthodox Church	\N	\N
677	2	eastern-orthodox-church	Eastern Orthodox Church (fr)	Eastern Orthodox Church (fr)	\N	\N
1109	1	eclectic-restaurant	Eclectic Restaurant	Eclectic Restaurant	\N	\N
1109	2	eclectic-restaurant	Eclectic Restaurant (fr)	Eclectic Restaurant (fr)	\N	\N
555	1	ecuadorian-restaurant	Ecuadorian Restaurant	Ecuadorian Restaurant	\N	\N
555	2	ecuadorian-restaurant	Ecuadorian Restaurant (fr)	Ecuadorian Restaurant (fr)	\N	\N
812	1	education-center	Education Center	Education Center	\N	\N
812	2	education-center	Education Center (fr)	Education Center (fr)	\N	\N
257	1	educational-institution	Educational Institution	Educational Institution	\N	\N
257	2	educational-institution	Educational Institution (fr)	Educational Institution (fr)	\N	\N
348	1	egyptian-restaurant	Egyptian Restaurant	Egyptian Restaurant	\N	\N
348	2	egyptian-restaurant	Egyptian Restaurant (fr)	Egyptian Restaurant (fr)	\N	\N
1261	1	electric-vehicle-charging-station	Electric Vehicle Charging Station	Electric Vehicle Charging Station	\N	\N
1261	2	electric-vehicle-charging-station	Electric Vehicle Charging Station (fr)	Electric Vehicle Charging Station (fr)	\N	\N
1343	1	electronics-store	Electronics Store	Electronics Store	\N	\N
1343	2	electronics-store	Electronics Store (fr)	Electronics Store (fr)	\N	\N
652	1	english-restaurant	English Restaurant	English Restaurant	\N	\N
652	2	english-restaurant	English Restaurant (fr)	English Restaurant (fr)	\N	\N
274	1	entertainer	Entertainer	Entertainer	\N	\N
274	2	entertainer	Entertainer (fr)	Entertainer (fr)	\N	\N
673	1	entertainment-agency	Entertainment Agency	Entertainment Agency	\N	\N
673	2	entertainment-agency	Entertainment Agency (fr)	Entertainment Agency (fr)	\N	\N
2034	1	episcopal-church	Episcopal Church	Episcopal Church	\N	\N
2034	2	episcopal-church	Episcopal Church (fr)	Episcopal Church (fr)	\N	\N
212	1	escape-room-center	Escape Room Center	Escape Room Center	\N	\N
212	2	escape-room-center	Escape Room Center (fr)	Escape Room Center (fr)	\N	\N
32	1	espresso-bar	Espresso Bar	Espresso Bar	\N	\N
32	2	espresso-bar	Espresso Bar (fr)	Espresso Bar (fr)	\N	\N
422	1	ethnic-restaurant	Ethnic Restaurant	Ethnic Restaurant	\N	\N
422	2	ethnic-restaurant	Ethnic Restaurant (fr)	Ethnic Restaurant (fr)	\N	\N
201	1	ethnographic-museum	Ethnographic Museum	Ethnographic Museum	\N	\N
201	2	ethnographic-museum	Ethnographic Museum (fr)	Ethnographic Museum (fr)	\N	\N
275	1	european-restaurant	European Restaurant	European Restaurant	\N	\N
275	2	european-restaurant	European Restaurant (fr)	European Restaurant (fr)	\N	\N
246	1	evangelical-church	Evangelical Church	Evangelical Church	\N	\N
246	2	evangelical-church	Evangelical Church (fr)	Evangelical Church (fr)	\N	\N
231	1	event-management-company	Event Management Company	Event Management Company	\N	\N
231	2	event-management-company	Event Management Company (fr)	Event Management Company (fr)	\N	\N
416	1	event-planner	Event Planner	Event Planner	\N	\N
416	2	event-planner	Event Planner (fr)	Event Planner (fr)	\N	\N
1742	1	event-ticket-seller	Event Ticket Seller	Event Ticket Seller	\N	\N
1742	2	event-ticket-seller	Event Ticket Seller (fr)	Event Ticket Seller (fr)	\N	\N
29	1	event-venue	Event Venue	Event Venue	\N	\N
29	2	event-venue	Event Venue (fr)	Event Venue (fr)	\N	\N
103	1	exhibit	Exhibit	Exhibit	\N	\N
103	2	exhibit	Exhibit (fr)	Exhibit (fr)	\N	\N
1021	1	exhibition-and-trade-centre	Exhibition And Trade Centre	Exhibition And Trade Centre	\N	\N
1021	2	exhibition-and-trade-centre	Exhibition And Trade Centre (fr)	Exhibition And Trade Centre (fr)	\N	\N
133	1	extended-stay-hotel	Extended Stay Hotel	Extended Stay Hotel	\N	\N
133	2	extended-stay-hotel	Extended Stay Hotel (fr)	Extended Stay Hotel (fr)	\N	\N
2265	1	fairground	Fairground	Fairground	\N	\N
2265	2	fairground	Fairground (fr)	Fairground (fr)	\N	\N
848	1	falafel-restaurant	Falafel Restaurant	Falafel Restaurant	\N	\N
848	2	falafel-restaurant	Falafel Restaurant (fr)	Falafel Restaurant (fr)	\N	\N
173	1	family-restaurant	Family Restaurant	Family Restaurant	\N	\N
173	2	family-restaurant	Family Restaurant (fr)	Family Restaurant (fr)	\N	\N
1326	1	farm	Farm	Farm	\N	\N
1326	2	farm	Farm (fr)	Farm (fr)	\N	\N
193	1	farm-shop	Farm Shop	Farm Shop	\N	\N
193	2	farm-shop	Farm Shop (fr)	Farm Shop (fr)	\N	\N
1508	1	farmers-market	Farmers Market	Farmers Market	\N	\N
1508	2	farmers-market	Farmers Market (fr)	Farmers Market (fr)	\N	\N
1764	1	farmstay	Farmstay	Farmstay	\N	\N
1764	2	farmstay	Farmstay (fr)	Farmstay (fr)	\N	\N
1475	1	fashion-accessories-store	Fashion Accessories Store	Fashion Accessories Store	\N	\N
1475	2	fashion-accessories-store	Fashion Accessories Store (fr)	Fashion Accessories Store (fr)	\N	\N
269	1	fashion-designer	Fashion Designer	Fashion Designer	\N	\N
269	2	fashion-designer	Fashion Designer (fr)	Fashion Designer (fr)	\N	\N
163	1	fast-food-restaurant	Fast Food Restaurant	Fast Food Restaurant	\N	\N
163	2	fast-food-restaurant	Fast Food Restaurant (fr)	Fast Food Restaurant (fr)	\N	\N
777	1	federal-government-office	Federal Government Office	Federal Government Office	\N	\N
777	2	federal-government-office	Federal Government Office (fr)	Federal Government Office (fr)	\N	\N
785	1	ferris-wheel	Ferris Wheel	Ferris Wheel	\N	\N
785	2	ferris-wheel	Ferris Wheel (fr)	Ferris Wheel (fr)	\N	\N
2723	1	ferry-service	Ferry Service	Ferry Service	\N	\N
2723	2	ferry-service	Ferry Service (fr)	Ferry Service (fr)	\N	\N
387	1	festival	Festival	Festival	\N	\N
387	2	festival	Festival (fr)	Festival (fr)	\N	\N
389	1	festival-hall	Festival Hall	Festival Hall	\N	\N
389	2	festival-hall	Festival Hall (fr)	Festival Hall (fr)	\N	\N
2996	1	filipino-restaurant	Filipino Restaurant	Filipino Restaurant	\N	\N
2996	2	filipino-restaurant	Filipino Restaurant (fr)	Filipino Restaurant (fr)	\N	\N
37	1	fine-dining-restaurant	Fine Dining Restaurant	Fine Dining Restaurant	\N	\N
37	2	fine-dining-restaurant	Fine Dining Restaurant (fr)	Fine Dining Restaurant (fr)	\N	\N
278	1	fish-and-chips-takeaway	Fish And Chips Takeaway	Fish And Chips Takeaway	\N	\N
278	2	fish-and-chips-takeaway	Fish And Chips Takeaway (fr)	Fish And Chips Takeaway (fr)	\N	\N
858	1	fish-processing	Fish Processing	Fish Processing	\N	\N
858	2	fish-processing	Fish Processing (fr)	Fish Processing (fr)	\N	\N
279	1	fish-store	Fish Store	Fish Store	\N	\N
279	2	fish-store	Fish Store (fr)	Fish Store (fr)	\N	\N
137	1	fitness-center	Fitness Center	Fitness Center	\N	\N
137	2	fitness-center	Fitness Center (fr)	Fitness Center (fr)	\N	\N
1279	1	flag-store	Flag Store	Flag Store	\N	\N
1279	2	flag-store	Flag Store (fr)	Flag Store (fr)	\N	\N
595	1	flamenco-school	Flamenco School	Flamenco School	\N	\N
595	2	flamenco-school	Flamenco School (fr)	Flamenco School (fr)	\N	\N
564	1	flamenco-theater	Flamenco Theater	Flamenco Theater	\N	\N
564	2	flamenco-theater	Flamenco Theater (fr)	Flamenco Theater (fr)	\N	\N
435	1	flea-market	Flea Market	Flea Market	\N	\N
435	2	flea-market	Flea Market (fr)	Flea Market (fr)	\N	\N
761	1	florist	Florist	Florist	\N	\N
761	2	florist	Florist (fr)	Florist (fr)	\N	\N
762	1	flower-delivery	Flower Delivery	Flower Delivery	\N	\N
762	2	flower-delivery	Flower Delivery (fr)	Flower Delivery (fr)	\N	\N
763	1	flower-designer	Flower Designer	Flower Designer	\N	\N
763	2	flower-designer	Flower Designer (fr)	Flower Designer (fr)	\N	\N
1663	1	food-and-beverage-consultant	Food And Beverage Consultant	Food And Beverage Consultant	\N	\N
1663	2	food-and-beverage-consultant	Food And Beverage Consultant (fr)	Food And Beverage Consultant (fr)	\N	\N
1170	1	food-bank	Food Bank	Food Bank	\N	\N
1170	2	food-bank	Food Bank (fr)	Food Bank (fr)	\N	\N
338	1	food-court	Food Court	Food Court	\N	\N
338	2	food-court	Food Court (fr)	Food Court (fr)	\N	\N
194	1	food-manufacturer	Food Manufacturer	Food Manufacturer	\N	\N
194	2	food-manufacturer	Food Manufacturer (fr)	Food Manufacturer (fr)	\N	\N
1283	1	food-processing-company	Food Processing Company	Food Processing Company	\N	\N
1283	2	food-processing-company	Food Processing Company (fr)	Food Processing Company (fr)	\N	\N
165	1	food-producer	Food Producer	Food Producer	\N	\N
165	2	food-producer	Food Producer (fr)	Food Producer (fr)	\N	\N
285	1	food-products-supplier	Food Products Supplier	Food Products Supplier	\N	\N
285	2	food-products-supplier	Food Products Supplier (fr)	Food Products Supplier (fr)	\N	\N
2707	1	football-club	Football Club	Football Club	\N	\N
2707	2	football-club	Football Club (fr)	Football Club (fr)	\N	\N
2161	1	forestry-service	Forestry Service	Forestry Service	\N	\N
2161	2	forestry-service	Forestry Service (fr)	Forestry Service (fr)	\N	\N
334	1	fortress	Fortress	Fortress	\N	\N
334	2	fortress	Fortress (fr)	Fortress (fr)	\N	\N
255	1	foundation	Foundation	Foundation	\N	\N
255	2	foundation	Foundation (fr)	Foundation (fr)	\N	\N
1132	1	free-parking-lot	Free Parking Lot	Free Parking Lot	\N	\N
1132	2	free-parking-lot	Free Parking Lot (fr)	Free Parking Lot (fr)	\N	\N
59	1	french-restaurant	French Restaurant	French Restaurant	\N	\N
59	2	french-restaurant	French Restaurant (fr)	French Restaurant (fr)	\N	\N
260	1	french-steakhouse-restaurant	French Steakhouse Restaurant	French Steakhouse Restaurant	\N	\N
260	2	french-steakhouse-restaurant	French Steakhouse Restaurant (fr)	French Steakhouse Restaurant (fr)	\N	\N
573	1	fresh-food-market	Fresh Food Market	Fresh Food Market	\N	\N
573	2	fresh-food-market	Fresh Food Market (fr)	Fresh Food Market (fr)	\N	\N
57	1	fried-chicken-takeaway	Fried Chicken Takeaway	Fried Chicken Takeaway	\N	\N
57	2	fried-chicken-takeaway	Fried Chicken Takeaway (fr)	Fried Chicken Takeaway (fr)	\N	\N
2174	1	frituur	Frituur	Frituur	\N	\N
2174	2	frituur	Frituur (fr)	Frituur (fr)	\N	\N
2095	1	sauna	Sauna	Sauna	\N	\N
1417	1	fruit-and-vegetable-processing	Fruit And Vegetable Processing	Fruit And Vegetable Processing	\N	\N
1417	2	fruit-and-vegetable-processing	Fruit And Vegetable Processing (fr)	Fruit And Vegetable Processing (fr)	\N	\N
1300	1	fruit-and-vegetable-store	Fruit And Vegetable Store	Fruit And Vegetable Store	\N	\N
1300	2	fruit-and-vegetable-store	Fruit And Vegetable Store (fr)	Fruit And Vegetable Store (fr)	\N	\N
271	1	fruit-parlor	Fruit Parlor	Fruit Parlor	\N	\N
271	2	fruit-parlor	Fruit Parlor (fr)	Fruit Parlor (fr)	\N	\N
185	1	function-room-facility	Function Room Facility	Function Room Facility	\N	\N
185	2	function-room-facility	Function Room Facility (fr)	Function Room Facility (fr)	\N	\N
3069	1	furniture-store	Furniture Store	Furniture Store	\N	\N
3069	2	furniture-store	Furniture Store (fr)	Furniture Store (fr)	\N	\N
277	1	fusion-restaurant	Fusion Restaurant	Fusion Restaurant	\N	\N
277	2	fusion-restaurant	Fusion Restaurant (fr)	Fusion Restaurant (fr)	\N	\N
439	1	galician-restaurant	Galician Restaurant	Galician Restaurant	\N	\N
439	2	galician-restaurant	Galician Restaurant (fr)	Galician Restaurant (fr)	\N	\N
363	1	gambling-house	Gambling House	Gambling House	\N	\N
363	2	gambling-house	Gambling House (fr)	Gambling House (fr)	\N	\N
1125	1	game-store	Game Store	Game Store	\N	\N
1125	2	game-store	Game Store (fr)	Game Store (fr)	\N	\N
93	1	garden	Garden	Garden	\N	\N
93	2	garden	Garden (fr)	Garden (fr)	\N	\N
628	1	garden-center	Garden Center	Garden Center	\N	\N
628	2	garden-center	Garden Center (fr)	Garden Center (fr)	\N	\N
222	1	gastropub	Gastropub	Gastropub	\N	\N
222	2	gastropub	Gastropub (fr)	Gastropub (fr)	\N	\N
491	1	gay-bar	Gay Bar	Gay Bar	\N	\N
491	2	gay-bar	Gay Bar (fr)	Gay Bar (fr)	\N	\N
917	1	gay-night-club	Gay Night Club	Gay Night Club	\N	\N
917	2	gay-night-club	Gay Night Club (fr)	Gay Night Club (fr)	\N	\N
2591	1	gay-sauna	Gay Sauna	Gay Sauna	\N	\N
2591	2	gay-sauna	Gay Sauna (fr)	Gay Sauna (fr)	\N	\N
410	1	general-store	General Store	General Store	\N	\N
410	2	general-store	General Store (fr)	General Store (fr)	\N	\N
2452	1	georgian-restaurant	Georgian Restaurant	Georgian Restaurant	\N	\N
2452	2	georgian-restaurant	Georgian Restaurant (fr)	Georgian Restaurant (fr)	\N	\N
263	1	german-restaurant	German Restaurant	German Restaurant	\N	\N
263	2	german-restaurant	German Restaurant (fr)	German Restaurant (fr)	\N	\N
202	1	gift-basket-store	Gift Basket Store	Gift Basket Store	\N	\N
202	2	gift-basket-store	Gift Basket Store (fr)	Gift Basket Store (fr)	\N	\N
251	1	gift-shop	Gift Shop	Gift Shop	\N	\N
251	2	gift-shop	Gift Shop (fr)	Gift Shop (fr)	\N	\N
355	1	girl-bar	Girl Bar	Girl Bar	\N	\N
355	2	girl-bar	Girl Bar (fr)	Girl Bar (fr)	\N	\N
2608	1	glass-blower	Glass Blower	Glass Blower	\N	\N
2608	2	glass-blower	Glass Blower (fr)	Glass Blower (fr)	\N	\N
15	1	gluten-free-restaurant	Gluten Free Restaurant	Gluten Free Restaurant	\N	\N
15	2	gluten-free-restaurant	Gluten Free Restaurant (fr)	Gluten Free Restaurant (fr)	\N	\N
1163	1	go-kart-track	Go Kart Track	Go Kart Track	\N	\N
1163	2	go-kart-track	Go Kart Track (fr)	Go Kart Track (fr)	\N	\N
1022	1	golf-club	Golf Club	Golf Club	\N	\N
1022	2	golf-club	Golf Club (fr)	Golf Club (fr)	\N	\N
1396	1	golf-course	Golf Course	Golf Course	\N	\N
1396	2	golf-course	Golf Course (fr)	Golf Course (fr)	\N	\N
1378	1	golf-course-builder	Golf Course Builder	Golf Course Builder	\N	\N
1378	2	golf-course-builder	Golf Course Builder (fr)	Golf Course Builder (fr)	\N	\N
1397	1	golf-instructor	Golf Instructor	Golf Instructor	\N	\N
1397	2	golf-instructor	Golf Instructor (fr)	Golf Instructor (fr)	\N	\N
1324	1	gospel-church	Gospel Church	Gospel Church	\N	\N
1324	2	gospel-church	Gospel Church (fr)	Gospel Church (fr)	\N	\N
179	1	gourmet-grocery-store	Gourmet Grocery Store	Gourmet Grocery Store	\N	\N
179	2	gourmet-grocery-store	Gourmet Grocery Store (fr)	Gourmet Grocery Store (fr)	\N	\N
239	1	government-office	Government Office	Government Office	\N	\N
239	2	government-office	Government Office (fr)	Government Office (fr)	\N	\N
431	1	greek-orthodox-church	Greek Orthodox Church	Greek Orthodox Church	\N	\N
431	2	greek-orthodox-church	Greek Orthodox Church (fr)	Greek Orthodox Church (fr)	\N	\N
60	1	greek-restaurant	Greek Restaurant	Greek Restaurant	\N	\N
60	2	greek-restaurant	Greek Restaurant (fr)	Greek Restaurant (fr)	\N	\N
63	1	grill	Grill	Grill	\N	\N
63	2	grill	Grill (fr)	Grill (fr)	\N	\N
1486	1	grocery-delivery-service	Grocery Delivery Service	Grocery Delivery Service	\N	\N
1486	2	grocery-delivery-service	Grocery Delivery Service (fr)	Grocery Delivery Service (fr)	\N	\N
415	1	grocery-store	Grocery Store	Grocery Store	\N	\N
415	2	grocery-store	Grocery Store (fr)	Grocery Store (fr)	\N	\N
71	1	group-accommodation	Group Accommodation	Group Accommodation	\N	\N
71	2	group-accommodation	Group Accommodation (fr)	Group Accommodation (fr)	\N	\N
321	1	guest-house	Guest House	Guest House	\N	\N
321	2	guest-house	Guest House (fr)	Guest House (fr)	\N	\N
1795	1	guitar-instructor	Guitar Instructor	Guitar Instructor	\N	\N
1795	2	guitar-instructor	Guitar Instructor (fr)	Guitar Instructor (fr)	\N	\N
2340	1	guitar-store	Guitar Store	Guitar Store	\N	\N
2340	2	guitar-store	Guitar Store (fr)	Guitar Store (fr)	\N	\N
138	1	gym	Gym	Gym	\N	\N
138	2	gym	Gym (fr)	Gym (fr)	\N	\N
2881	1	hair-salon	Hair Salon	Hair Salon	\N	\N
2881	2	hair-salon	Hair Salon (fr)	Hair Salon (fr)	\N	\N
359	1	hairdresser	Hairdresser	Hairdresser	\N	\N
359	2	hairdresser	Hairdresser (fr)	Hairdresser (fr)	\N	\N
303	1	halal-restaurant	Halal Restaurant	Halal Restaurant	\N	\N
303	2	halal-restaurant	Halal Restaurant (fr)	Halal Restaurant (fr)	\N	\N
1245	1	ham-shop	Ham Shop	Ham Shop	\N	\N
1245	2	ham-shop	Ham Shop (fr)	Ham Shop (fr)	\N	\N
2095	2	sauna	Sauna (fr)	Sauna (fr)	\N	\N
126	1	hamburger-restaurant	Hamburger Restaurant	Hamburger Restaurant	\N	\N
126	2	hamburger-restaurant	Hamburger Restaurant (fr)	Hamburger Restaurant (fr)	\N	\N
1598	1	hammam	Hammam	Hammam	\N	\N
1598	2	hammam	Hammam (fr)	Hammam (fr)	\N	\N
207	1	handicraft	Handicraft	Handicraft	\N	\N
207	2	handicraft	Handicraft (fr)	Handicraft (fr)	\N	\N
2579	1	handicraft-museum	Handicraft Museum	Handicraft Museum	\N	\N
2579	2	handicraft-museum	Handicraft Museum (fr)	Handicraft Museum (fr)	\N	\N
2051	1	haunted-house	Haunted House	Haunted House	\N	\N
2051	2	haunted-house	Haunted House (fr)	Haunted House (fr)	\N	\N
191	1	haute-french-restaurant	Haute French Restaurant	Haute French Restaurant	\N	\N
191	2	haute-french-restaurant	Haute French Restaurant (fr)	Haute French Restaurant (fr)	\N	\N
175	1	hawaiian-restaurant	Hawaiian Restaurant	Hawaiian Restaurant	\N	\N
175	2	hawaiian-restaurant	Hawaiian Restaurant (fr)	Hawaiian Restaurant (fr)	\N	\N
1073	1	health-and-beauty-shop	Health And Beauty Shop	Health And Beauty Shop	\N	\N
1073	2	health-and-beauty-shop	Health And Beauty Shop (fr)	Health And Beauty Shop (fr)	\N	\N
21	1	health-food-restaurant	Health Food Restaurant	Health Food Restaurant	\N	\N
21	2	health-food-restaurant	Health Food Restaurant (fr)	Health Food Restaurant (fr)	\N	\N
316	1	health-food-store	Health Food Store	Health Food Store	\N	\N
316	2	health-food-store	Health Food Store (fr)	Health Food Store (fr)	\N	\N
1118	1	health-spa	Health Spa	Health Spa	\N	\N
1118	2	health-spa	Health Spa (fr)	Health Spa (fr)	\N	\N
1074	1	herb-shop	Herb Shop	Herb Shop	\N	\N
1074	2	herb-shop	Herb Shop (fr)	Herb Shop (fr)	\N	\N
1623	1	herbal-medicine-store	Herbal Medicine Store	Herbal Medicine Store	\N	\N
1623	2	herbal-medicine-store	Herbal Medicine Store (fr)	Herbal Medicine Store (fr)	\N	\N
84	1	heritage-building	Heritage Building	Heritage Building	\N	\N
84	2	heritage-building	Heritage Building (fr)	Heritage Building (fr)	\N	\N
85	1	heritage-museum	Heritage Museum	Heritage Museum	\N	\N
85	2	heritage-museum	Heritage Museum (fr)	Heritage Museum (fr)	\N	\N
400	1	heritage-preservation	Heritage Preservation	Heritage Preservation	\N	\N
400	2	heritage-preservation	Heritage Preservation (fr)	Heritage Preservation (fr)	\N	\N
1309	1	high-ropes-course	High Ropes Course	High Ropes Course	\N	\N
1309	2	high-ropes-course	High Ropes Course (fr)	High Ropes Course (fr)	\N	\N
403	1	hiking-area	Hiking Area	Hiking Area	\N	\N
403	2	hiking-area	Hiking Area (fr)	Hiking Area (fr)	\N	\N
74	1	historical-landmark	Historical Landmark	Historical Landmark	\N	\N
74	2	historical-landmark	Historical Landmark (fr)	Historical Landmark (fr)	\N	\N
106	1	historical-place-museum	Historical Place Museum	Historical Place Museum	\N	\N
106	2	historical-place-museum	Historical Place Museum (fr)	Historical Place Museum (fr)	\N	\N
1027	1	historical-society	Historical Society	Historical Society	\N	\N
1027	2	historical-society	Historical Society (fr)	Historical Society (fr)	\N	\N
75	1	history-museum	History Museum	History Museum	\N	\N
75	2	history-museum	History Museum (fr)	History Museum (fr)	\N	\N
1427	1	hoagie-restaurant	Hoagie Restaurant	Hoagie Restaurant	\N	\N
1427	2	hoagie-restaurant	Hoagie Restaurant (fr)	Hoagie Restaurant (fr)	\N	\N
481	1	holiday-accommodation-service	Holiday Accommodation Service	Holiday Accommodation Service	\N	\N
481	2	holiday-accommodation-service	Holiday Accommodation Service (fr)	Holiday Accommodation Service (fr)	\N	\N
134	1	holiday-apartment	Holiday Apartment	Holiday Apartment	\N	\N
134	2	holiday-apartment	Holiday Apartment (fr)	Holiday Apartment (fr)	\N	\N
795	1	holiday-apartment-rental	Holiday Apartment Rental	Holiday Apartment Rental	\N	\N
795	2	holiday-apartment-rental	Holiday Apartment Rental (fr)	Holiday Apartment Rental (fr)	\N	\N
368	1	holiday-home	Holiday Home	Holiday Home	\N	\N
368	2	holiday-home	Holiday Home (fr)	Holiday Home (fr)	\N	\N
2887	1	holiday-park	Holiday Park	Holiday Park	\N	\N
2887	2	holiday-park	Holiday Park (fr)	Holiday Park (fr)	\N	\N
614	1	home-cinema-installation	Home Cinema Installation	Home Cinema Installation	\N	\N
614	2	home-cinema-installation	Home Cinema Installation (fr)	Home Cinema Installation (fr)	\N	\N
353	1	home-goods-store	Home Goods Store	Home Goods Store	\N	\N
353	2	home-goods-store	Home Goods Store (fr)	Home Goods Store (fr)	\N	\N
1325	1	homeless-shelter	Homeless Shelter	Homeless Shelter	\N	\N
1325	2	homeless-shelter	Homeless Shelter (fr)	Homeless Shelter (fr)	\N	\N
1766	1	homestay	Homestay	Homestay	\N	\N
1766	2	homestay	Homestay (fr)	Homestay (fr)	\N	\N
3003	1	hong-kong-style-fast-food-restaurant	Hong Kong Style Fast Food Restaurant	Hong Kong Style Fast Food Restaurant	\N	\N
3003	2	hong-kong-style-fast-food-restaurant	Hong Kong Style Fast Food Restaurant (fr)	Hong Kong Style Fast Food Restaurant (fr)	\N	\N
296	1	hookah-bar	Hookah Bar	Hookah Bar	\N	\N
296	2	hookah-bar	Hookah Bar (fr)	Hookah Bar (fr)	\N	\N
711	1	hookah-store	Hookah Store	Hookah Store	\N	\N
711	2	hookah-store	Hookah Store (fr)	Hookah Store (fr)	\N	\N
2631	1	horse-riding-school	Horse Riding School	Horse Riding School	\N	\N
2631	2	horse-riding-school	Horse Riding School (fr)	Horse Riding School (fr)	\N	\N
96	2	hostel	Hostel (fr)	Hostel (fr)	\N	\N
1739	1	hot-dog-restaurant	Hot Dog Restaurant	Hot Dog Restaurant	\N	\N
1739	2	hot-dog-restaurant	Hot Dog Restaurant (fr)	Hot Dog Restaurant (fr)	\N	\N
1252	1	hot-pot-restaurant	Hot Pot Restaurant	Hot Pot Restaurant	\N	\N
1252	2	hot-pot-restaurant	Hot Pot Restaurant (fr)	Hot Pot Restaurant (fr)	\N	\N
58	1	hotel	Hotel	Hotel	\N	\N
58	2	hotel	Hotel (fr)	Hotel (fr)	\N	\N
297	1	houseboat-rental-service	Houseboat Rental Service	Houseboat Rental Service	\N	\N
297	2	houseboat-rental-service	Houseboat Rental Service (fr)	Houseboat Rental Service (fr)	\N	\N
818	1	housing-development	Housing Development	Housing Development	\N	\N
818	2	housing-development	Housing Development (fr)	Housing Development (fr)	\N	\N
726	1	hungarian-restaurant	Hungarian Restaurant	Hungarian Restaurant	\N	\N
726	2	hungarian-restaurant	Hungarian Restaurant (fr)	Hungarian Restaurant (fr)	\N	\N
180	1	ice-cream-shop	Ice Cream Shop	Ice Cream Shop	\N	\N
180	2	ice-cream-shop	Ice Cream Shop (fr)	Ice Cream Shop (fr)	\N	\N
1640	1	ice-skating-club	Ice Skating Club	Ice Skating Club	\N	\N
1640	2	ice-skating-club	Ice Skating Club (fr)	Ice Skating Club (fr)	\N	\N
1308	1	ice-skating-rink	Ice Skating Rink	Ice Skating Rink	\N	\N
1308	2	ice-skating-rink	Ice Skating Rink (fr)	Ice Skating Rink (fr)	\N	\N
2655	1	imax-theater	Imax Theater	Imax Theater	\N	\N
2655	2	imax-theater	Imax Theater (fr)	Imax Theater (fr)	\N	\N
2671	1	import-export-company	Import Export Company	Import Export Company	\N	\N
2671	2	import-export-company	Import Export Company (fr)	Import Export Company (fr)	\N	\N
2413	1	indian-muslim-restaurant	Indian Muslim Restaurant	Indian Muslim Restaurant	\N	\N
2413	2	indian-muslim-restaurant	Indian Muslim Restaurant (fr)	Indian Muslim Restaurant (fr)	\N	\N
148	1	indian-restaurant	Indian Restaurant	Indian Restaurant	\N	\N
148	2	indian-restaurant	Indian Restaurant (fr)	Indian Restaurant (fr)	\N	\N
1106	1	indian-sizzler-restaurant	Indian Sizzler Restaurant	Indian Sizzler Restaurant	\N	\N
1106	2	indian-sizzler-restaurant	Indian Sizzler Restaurant (fr)	Indian Sizzler Restaurant (fr)	\N	\N
719	1	indian-takeaway	Indian Takeaway	Indian Takeaway	\N	\N
719	2	indian-takeaway	Indian Takeaway (fr)	Indian Takeaway (fr)	\N	\N
237	1	indonesian-restaurant	Indonesian Restaurant	Indonesian Restaurant	\N	\N
237	2	indonesian-restaurant	Indonesian Restaurant (fr)	Indonesian Restaurant (fr)	\N	\N
824	1	indoor-lodging	Indoor Lodging	Indoor Lodging	\N	\N
824	2	indoor-lodging	Indoor Lodging (fr)	Indoor Lodging (fr)	\N	\N
1139	1	indoor-playground	Indoor Playground	Indoor Playground	\N	\N
1139	2	indoor-playground	Indoor Playground (fr)	Indoor Playground (fr)	\N	\N
404	1	indoor-snowcenter	Indoor Snowcenter	Indoor Snowcenter	\N	\N
404	2	indoor-snowcenter	Indoor Snowcenter (fr)	Indoor Snowcenter (fr)	\N	\N
1331	1	indoor-swimming-pool	Indoor Swimming Pool	Indoor Swimming Pool	\N	\N
1331	2	indoor-swimming-pool	Indoor Swimming Pool (fr)	Indoor Swimming Pool (fr)	\N	\N
1704	1	information-bureau	Information Bureau	Information Bureau	\N	\N
1704	2	information-bureau	Information Bureau (fr)	Information Bureau (fr)	\N	\N
322	1	inn	Inn	Inn	\N	\N
322	2	inn	Inn (fr)	Inn (fr)	\N	\N
629	1	interior-decorator	Interior Decorator	Interior Decorator	\N	\N
629	2	interior-decorator	Interior Decorator (fr)	Interior Decorator (fr)	\N	\N
765	1	interior-designer	Interior Designer	Interior Designer	\N	\N
765	2	interior-designer	Interior Designer (fr)	Interior Designer (fr)	\N	\N
630	1	interior-plant-service	Interior Plant Service	Interior Plant Service	\N	\N
630	2	interior-plant-service	Interior Plant Service (fr)	Interior Plant Service (fr)	\N	\N
749	1	internet-cafe	Internet Cafe	Internet Cafe	\N	\N
749	2	internet-cafe	Internet Cafe (fr)	Internet Cafe (fr)	\N	\N
1049	1	internet-shop	Internet Shop	Internet Shop	\N	\N
1049	2	internet-shop	Internet Shop (fr)	Internet Shop (fr)	\N	\N
124	1	irish-pub	Irish Pub	Irish Pub	\N	\N
124	2	irish-pub	Irish Pub (fr)	Irish Pub (fr)	\N	\N
167	1	irish-restaurant	Irish Restaurant	Irish Restaurant	\N	\N
167	2	irish-restaurant	Irish Restaurant (fr)	Irish Restaurant (fr)	\N	\N
66	1	israeli-restaurant	Israeli Restaurant	Israeli Restaurant	\N	\N
66	2	israeli-restaurant	Israeli Restaurant (fr)	Israeli Restaurant (fr)	\N	\N
188	1	italian-grocery-store	Italian Grocery Store	Italian Grocery Store	\N	\N
188	2	italian-grocery-store	Italian Grocery Store (fr)	Italian Grocery Store (fr)	\N	\N
11	1	italian-restaurant	Italian Restaurant	Italian Restaurant	\N	\N
11	2	italian-restaurant	Italian Restaurant (fr)	Italian Restaurant (fr)	\N	\N
117	1	izakaya-restaurant	Izakaya Restaurant	Izakaya Restaurant	\N	\N
117	2	izakaya-restaurant	Izakaya Restaurant (fr)	Izakaya Restaurant (fr)	\N	\N
1548	1	japanese-cheap-sweets-shop	Japanese Cheap Sweets Shop	Japanese Cheap Sweets Shop	\N	\N
1548	2	japanese-cheap-sweets-shop	Japanese Cheap Sweets Shop (fr)	Japanese Cheap Sweets Shop (fr)	\N	\N
1549	1	japanese-confectionery-shop	Japanese Confectionery Shop	Japanese Confectionery Shop	\N	\N
1549	2	japanese-confectionery-shop	Japanese Confectionery Shop (fr)	Japanese Confectionery Shop (fr)	\N	\N
1281	1	japanese-curry-restaurant	Japanese Curry Restaurant	Japanese Curry Restaurant	\N	\N
1281	2	japanese-curry-restaurant	Japanese Curry Restaurant (fr)	Japanese Curry Restaurant (fr)	\N	\N
2998	1	japanese-delicatessen	Japanese Delicatessen	Japanese Delicatessen	\N	\N
2998	2	japanese-delicatessen	Japanese Delicatessen (fr)	Japanese Delicatessen (fr)	\N	\N
3320	1	japanese-regional-restaurant	Japanese Regional Restaurant	Japanese Regional Restaurant	\N	\N
3320	2	japanese-regional-restaurant	Japanese Regional Restaurant (fr)	Japanese Regional Restaurant (fr)	\N	\N
69	1	japanese-restaurant	Japanese Restaurant	Japanese Restaurant	\N	\N
69	2	japanese-restaurant	Japanese Restaurant (fr)	Japanese Restaurant (fr)	\N	\N
731	1	japanese-steakhouse	Japanese Steakhouse	Japanese Steakhouse	\N	\N
731	2	japanese-steakhouse	Japanese Steakhouse (fr)	Japanese Steakhouse (fr)	\N	\N
1550	1	japanese-sweets-restaurant	Japanese Sweets Restaurant	Japanese Sweets Restaurant	\N	\N
1550	2	japanese-sweets-restaurant	Japanese Sweets Restaurant (fr)	Japanese Sweets Restaurant (fr)	\N	\N
2908	1	javanese-restaurant	Javanese Restaurant	Javanese Restaurant	\N	\N
2908	2	javanese-restaurant	Javanese Restaurant (fr)	Javanese Restaurant (fr)	\N	\N
306	1	jazz-club	Jazz Club	Jazz Club	\N	\N
306	2	jazz-club	Jazz Club (fr)	Jazz Club (fr)	\N	\N
411	1	jewelry-store	Jewelry Store	Jewelry Store	\N	\N
411	2	jewelry-store	Jewelry Store (fr)	Jewelry Store (fr)	\N	\N
736	1	jewish-restaurant	Jewish Restaurant	Jewish Restaurant	\N	\N
736	2	jewish-restaurant	Jewish Restaurant (fr)	Jewish Restaurant (fr)	\N	\N
52	1	juice-shop	Juice Shop	Juice Shop	\N	\N
52	2	juice-shop	Juice Shop (fr)	Juice Shop (fr)	\N	\N
3300	1	kaiseki-restaurant	Kaiseki Restaurant	Kaiseki Restaurant	\N	\N
3300	2	kaiseki-restaurant	Kaiseki Restaurant (fr)	Kaiseki Restaurant (fr)	\N	\N
1570	1	karaoke	Karaoke	Karaoke	\N	\N
1570	2	karaoke	Karaoke (fr)	Karaoke (fr)	\N	\N
291	1	karaoke-bar	Karaoke Bar	Karaoke Bar	\N	\N
291	2	karaoke-bar	Karaoke Bar (fr)	Karaoke Bar (fr)	\N	\N
350	1	kebab-shop	Kebab Shop	Kebab Shop	\N	\N
350	2	kebab-shop	Kebab Shop (fr)	Kebab Shop (fr)	\N	\N
192	1	kiosk	Kiosk	Kiosk	\N	\N
192	2	kiosk	Kiosk (fr)	Kiosk (fr)	\N	\N
3345	1	kofta-restaurant	Kofta Restaurant	Kofta Restaurant	\N	\N
3345	2	kofta-restaurant	Kofta Restaurant (fr)	Kofta Restaurant (fr)	\N	\N
289	1	korean-barbecue-restaurant	Korean Barbecue Restaurant	Korean Barbecue Restaurant	\N	\N
289	2	korean-barbecue-restaurant	Korean Barbecue Restaurant (fr)	Korean Barbecue Restaurant (fr)	\N	\N
2523	1	korean-beef-restaurant	Korean Beef Restaurant	Korean Beef Restaurant	\N	\N
2523	2	korean-beef-restaurant	Korean Beef Restaurant (fr)	Korean Beef Restaurant (fr)	\N	\N
290	1	korean-restaurant	Korean Restaurant	Korean Restaurant	\N	\N
290	2	korean-restaurant	Korean Restaurant (fr)	Korean Restaurant (fr)	\N	\N
769	1	kosher-restaurant	Kosher Restaurant	Kosher Restaurant	\N	\N
769	2	kosher-restaurant	Kosher Restaurant (fr)	Kosher Restaurant (fr)	\N	\N
3301	1	kushiage-and-kushikatsu-restaurant	Kushiage And Kushikatsu Restaurant	Kushiage And Kushikatsu Restaurant	\N	\N
3301	2	kushiage-and-kushikatsu-restaurant	Kushiage And Kushikatsu Restaurant (fr)	Kushiage And Kushikatsu Restaurant (fr)	\N	\N
3004	1	kyoto-style-japanese-restaurant	Kyoto Style Japanese Restaurant	Kyoto Style Japanese Restaurant	\N	\N
3004	2	kyoto-style-japanese-restaurant	Kyoto Style Japanese Restaurant (fr)	Kyoto Style Japanese Restaurant (fr)	\N	\N
2616	1	laboratory	Laboratory	Laboratory	\N	\N
2616	2	laboratory	Laboratory (fr)	Laboratory (fr)	\N	\N
1808	1	laser-tag-center	Laser Tag Center	Laser Tag Center	\N	\N
1808	2	laser-tag-center	Laser Tag Center (fr)	Laser Tag Center (fr)	\N	\N
220	1	latin-american-restaurant	Latin American Restaurant	Latin American Restaurant	\N	\N
220	2	latin-american-restaurant	Latin American Restaurant (fr)	Latin American Restaurant (fr)	\N	\N
722	1	laundromat	Laundromat	Laundromat	\N	\N
722	2	laundromat	Laundromat (fr)	Laundromat (fr)	\N	\N
723	1	laundry	Laundry	Laundry	\N	\N
723	2	laundry	Laundry (fr)	Laundry (fr)	\N	\N
724	1	laundry-service	Laundry Service	Laundry Service	\N	\N
724	2	laundry-service	Laundry Service (fr)	Laundry Service (fr)	\N	\N
258	1	learning-center	Learning Center	Learning Center	\N	\N
258	2	learning-center	Learning Center (fr)	Learning Center (fr)	\N	\N
171	1	lebanese-restaurant	Lebanese Restaurant	Lebanese Restaurant	\N	\N
171	2	lebanese-restaurant	Lebanese Restaurant (fr)	Lebanese Restaurant (fr)	\N	\N
2899	1	leisure-centre	Leisure Centre	Leisure Centre	\N	\N
2899	2	leisure-centre	Leisure Centre (fr)	Leisure Centre (fr)	\N	\N
354	1	library	Library	Library	\N	\N
354	2	library	Library (fr)	Library (fr)	\N	\N
1335	1	lido	Lido	Lido	\N	\N
1335	2	lido	Lido (fr)	Lido (fr)	\N	\N
2079	1	limousine-service	Limousine Service	Limousine Service	\N	\N
2079	2	limousine-service	Limousine Service (fr)	Limousine Service (fr)	\N	\N
143	1	liquor-store	Liquor Store	Liquor Store	\N	\N
143	2	liquor-store	Liquor Store (fr)	Liquor Store (fr)	\N	\N
1094	1	lithuanian-restaurant	Lithuanian Restaurant	Lithuanian Restaurant	\N	\N
1094	2	lithuanian-restaurant	Lithuanian Restaurant (fr)	Lithuanian Restaurant (fr)	\N	\N
129	1	live-music-bar	Live Music Bar	Live Music Bar	\N	\N
129	2	live-music-bar	Live Music Bar (fr)	Live Music Bar (fr)	\N	\N
122	1	live-music-venue	Live Music Venue	Live Music Venue	\N	\N
122	2	live-music-venue	Live Music Venue (fr)	Live Music Venue (fr)	\N	\N
2193	1	local-government-office	Local Government Office	Local Government Office	\N	\N
2193	2	local-government-office	Local Government Office (fr)	Local Government Office (fr)	\N	\N
76	1	local-history-museum	Local History Museum	Local History Museum	\N	\N
76	2	local-history-museum	Local History Museum (fr)	Local History Museum (fr)	\N	\N
747	1	lodge	Lodge	Lodge	\N	\N
747	2	lodge	Lodge (fr)	Lodge (fr)	\N	\N
483	1	lodging	Lodging	Lodging	\N	\N
483	2	lodging	Lodging (fr)	Lodging (fr)	\N	\N
1698	1	lombardian-restaurant	Lombardian Restaurant	Lombardian Restaurant	\N	\N
1698	2	lombardian-restaurant	Lombardian Restaurant (fr)	Lombardian Restaurant (fr)	\N	\N
114	1	lounge	Lounge	Lounge	\N	\N
114	2	lounge	Lounge (fr)	Lounge (fr)	\N	\N
2001	1	luggage-storage-facility	Luggage Storage Facility	Luggage Storage Facility	\N	\N
2001	2	luggage-storage-facility	Luggage Storage Facility (fr)	Luggage Storage Facility (fr)	\N	\N
7	1	lunch-restaurant	Lunch Restaurant	Lunch Restaurant	\N	\N
7	2	lunch-restaurant	Lunch Restaurant (fr)	Lunch Restaurant (fr)	\N	\N
840	1	lutheran-church	Lutheran Church	Lutheran Church	\N	\N
840	2	lutheran-church	Lutheran Church (fr)	Lutheran Church (fr)	\N	\N
1504	1	madrilian-restaurant	Madrilian Restaurant	Madrilian Restaurant	\N	\N
1504	2	madrilian-restaurant	Madrilian Restaurant (fr)	Madrilian Restaurant (fr)	\N	\N
1235	1	magazine-store	Magazine Store	Magazine Store	\N	\N
1235	2	magazine-store	Magazine Store (fr)	Magazine Store (fr)	\N	\N
1858	1	make-up-artist	Make Up Artist	Make Up Artist	\N	\N
1858	2	make-up-artist	Make Up Artist (fr)	Make Up Artist (fr)	\N	\N
1992	1	makerspace	Makerspace	Makerspace	\N	\N
1992	2	makerspace	Makerspace (fr)	Makerspace (fr)	\N	\N
1267	1	malaysian-restaurant	Malaysian Restaurant	Malaysian Restaurant	\N	\N
1267	2	malaysian-restaurant	Malaysian Restaurant (fr)	Malaysian Restaurant (fr)	\N	\N
1410	1	mandarin-restaurant	Mandarin Restaurant	Mandarin Restaurant	\N	\N
1410	2	mandarin-restaurant	Mandarin Restaurant (fr)	Mandarin Restaurant (fr)	\N	\N
3337	1	manor-house	Manor House	Manor House	\N	\N
3337	2	manor-house	Manor House (fr)	Manor House (fr)	\N	\N
2589	1	manufacturer	Manufacturer	Manufacturer	\N	\N
2589	2	manufacturer	Manufacturer (fr)	Manufacturer (fr)	\N	\N
1210	1	marche-restaurant	Marche Restaurant	Marche Restaurant	\N	\N
1210	2	marche-restaurant	Marche Restaurant (fr)	Marche Restaurant (fr)	\N	\N
2854	1	marina	Marina	Marina	\N	\N
2854	2	marina	Marina (fr)	Marina (fr)	\N	\N
105	1	maritime-museum	Maritime Museum	Maritime Museum	\N	\N
105	2	maritime-museum	Maritime Museum (fr)	Maritime Museum (fr)	\N	\N
110	1	market	Market	Market	\N	\N
110	2	market	Market (fr)	Market (fr)	\N	\N
1041	1	massage-spa	Massage Spa	Massage Spa	\N	\N
1041	2	massage-spa	Massage Spa (fr)	Massage Spa (fr)	\N	\N
49	1	meal-delivery	Meal Delivery	Meal Delivery	\N	\N
49	2	meal-delivery	Meal Delivery (fr)	Meal Delivery (fr)	\N	\N
438	1	meat-dish-restaurant	Meat Dish Restaurant	Meat Dish Restaurant	\N	\N
438	2	meat-dish-restaurant	Meat Dish Restaurant (fr)	Meat Dish Restaurant (fr)	\N	\N
2310	1	meat-products	Meat Products	Meat Products	\N	\N
2310	2	meat-products	Meat Products (fr)	Meat Products (fr)	\N	\N
1133	1	mechanic	Mechanic	Mechanic	\N	\N
1133	2	mechanic	Mechanic (fr)	Mechanic (fr)	\N	\N
313	1	meditation-center	Meditation Center	Meditation Center	\N	\N
313	2	meditation-center	Meditation Center (fr)	Meditation Center (fr)	\N	\N
30	1	mediterranean-restaurant	Mediterranean Restaurant	Mediterranean Restaurant	\N	\N
30	2	mediterranean-restaurant	Mediterranean Restaurant (fr)	Mediterranean Restaurant (fr)	\N	\N
172	1	meeting-planning-service	Meeting Planning Service	Meeting Planning Service	\N	\N
172	2	meeting-planning-service	Meeting Planning Service (fr)	Meeting Planning Service (fr)	\N	\N
256	1	memorial-park	Memorial Park	Memorial Park	\N	\N
256	2	memorial-park	Memorial Park (fr)	Memorial Park (fr)	\N	\N
1315	1	mens-clothing-store	Mens Clothing Store	Mens Clothing Store	\N	\N
1315	2	mens-clothing-store	Mens Clothing Store (fr)	Mens Clothing Store (fr)	\N	\N
286	1	mexican-restaurant	Mexican Restaurant	Mexican Restaurant	\N	\N
286	2	mexican-restaurant	Mexican Restaurant (fr)	Mexican Restaurant (fr)	\N	\N
503	1	mexican-torta-restaurant	Mexican Torta Restaurant	Mexican Torta Restaurant	\N	\N
503	2	mexican-torta-restaurant	Mexican Torta Restaurant (fr)	Mexican Torta Restaurant (fr)	\N	\N
67	1	middle-eastern-restaurant	Middle Eastern Restaurant	Middle Eastern Restaurant	\N	\N
67	2	middle-eastern-restaurant	Middle Eastern Restaurant (fr)	Middle Eastern Restaurant (fr)	\N	\N
839	1	military-base	Military Base	Military Base	\N	\N
839	2	military-base	Military Base (fr)	Military Base (fr)	\N	\N
2493	1	military-cemetery	Military Cemetery	Military Cemetery	\N	\N
2493	2	military-cemetery	Military Cemetery (fr)	Military Cemetery (fr)	\N	\N
820	1	miniature-golf-course	Miniature Golf Course	Miniature Golf Course	\N	\N
820	2	miniature-golf-course	Miniature Golf Course (fr)	Miniature Golf Course (fr)	\N	\N
1126	1	miniatures-store	Miniatures Store	Miniatures Store	\N	\N
1126	2	miniatures-store	Miniatures Store (fr)	Miniatures Store (fr)	\N	\N
946	1	mobile-caterer	Mobile Caterer	Mobile Caterer	\N	\N
946	2	mobile-caterer	Mobile Caterer (fr)	Mobile Caterer (fr)	\N	\N
2072	1	mobility-equipment-supplier	Mobility Equipment Supplier	Mobility Equipment Supplier	\N	\N
2072	2	mobility-equipment-supplier	Mobility Equipment Supplier (fr)	Mobility Equipment Supplier (fr)	\N	\N
1127	1	model-shop	Model Shop	Model Shop	\N	\N
1127	2	model-shop	Model Shop (fr)	Model Shop (fr)	\N	\N
87	1	modern-art-museum	Modern Art Museum	Modern Art Museum	\N	\N
87	2	modern-art-museum	Modern Art Museum (fr)	Modern Art Museum (fr)	\N	\N
1266	1	modern-british-restaurant	Modern British Restaurant	Modern British Restaurant	\N	\N
1266	2	modern-british-restaurant	Modern British Restaurant (fr)	Modern British Restaurant (fr)	\N	\N
261	1	modern-european-restaurant	Modern European Restaurant	Modern European Restaurant	\N	\N
261	2	modern-european-restaurant	Modern European Restaurant (fr)	Modern European Restaurant (fr)	\N	\N
145	1	modern-french-restaurant	Modern French Restaurant	Modern French Restaurant	\N	\N
145	2	modern-french-restaurant	Modern French Restaurant (fr)	Modern French Restaurant (fr)	\N	\N
292	1	modern-indian-restaurant	Modern Indian Restaurant	Modern Indian Restaurant	\N	\N
292	2	modern-indian-restaurant	Modern Indian Restaurant (fr)	Modern Indian Restaurant (fr)	\N	\N
1246	1	modern-izakaya-restaurants	Modern Izakaya Restaurants	Modern Izakaya Restaurants	\N	\N
1246	2	modern-izakaya-restaurants	Modern Izakaya Restaurants (fr)	Modern Izakaya Restaurants (fr)	\N	\N
1036	1	monastery	Monastery	Monastery	\N	\N
1036	2	monastery	Monastery (fr)	Monastery (fr)	\N	\N
649	1	moroccan-restaurant	Moroccan Restaurant	Moroccan Restaurant	\N	\N
649	2	moroccan-restaurant	Moroccan Restaurant (fr)	Moroccan Restaurant (fr)	\N	\N
782	1	mosque	Mosque	Mosque	\N	\N
782	2	mosque	Mosque (fr)	Mosque (fr)	\N	\N
3013	1	motel	Motel	Motel	\N	\N
3013	2	motel	Motel (fr)	Motel (fr)	\N	\N
1288	1	motorcycle-shop	Motorcycle Shop	Motorcycle Shop	\N	\N
1288	2	motorcycle-shop	Motorcycle Shop (fr)	Motorcycle Shop (fr)	\N	\N
1289	1	motoring-club	Motoring Club	Motoring Club	\N	\N
1289	2	motoring-club	Motoring Club (fr)	Motoring Club (fr)	\N	\N
519	1	movie-rental-store	Movie Rental Store	Movie Rental Store	\N	\N
519	2	movie-rental-store	Movie Rental Store (fr)	Movie Rental Store (fr)	\N	\N
2134	1	movie-studio	Movie Studio	Movie Studio	\N	\N
2134	2	movie-studio	Movie Studio (fr)	Movie Studio (fr)	\N	\N
83	1	movie-theater	Movie Theater	Movie Theater	\N	\N
83	2	movie-theater	Movie Theater (fr)	Movie Theater (fr)	\N	\N
2183	1	municipal-department-of-tourism	Municipal Department Of Tourism	Municipal Department Of Tourism	\N	\N
2183	2	municipal-department-of-tourism	Municipal Department Of Tourism (fr)	Municipal Department Of Tourism (fr)	\N	\N
24	1	museum	Museum	Museum	\N	\N
24	2	museum	Museum (fr)	Museum (fr)	\N	\N
2533	1	museum-of-zoology	Museum Of Zoology	Museum Of Zoology	\N	\N
2533	2	museum-of-zoology	Museum Of Zoology (fr)	Museum Of Zoology (fr)	\N	\N
778	1	music-conservatory	Music Conservatory	Music Conservatory	\N	\N
778	2	music-conservatory	Music Conservatory (fr)	Music Conservatory (fr)	\N	\N
1664	1	music-management-and-promotion	Music Management And Promotion	Music Management And Promotion	\N	\N
1664	2	music-management-and-promotion	Music Management And Promotion (fr)	Music Management And Promotion (fr)	\N	\N
208	1	music-producer	Music Producer	Music Producer	\N	\N
208	2	music-producer	Music Producer (fr)	Music Producer (fr)	\N	\N
1748	1	music-school	Music School	Music School	\N	\N
1748	2	music-school	Music School (fr)	Music School (fr)	\N	\N
346	1	music-store	Music Store	Music Store	\N	\N
346	2	music-store	Music Store (fr)	Music Store (fr)	\N	\N
235	1	musical-club	Musical Club	Musical Club	\N	\N
235	2	musical-club	Musical Club (fr)	Musical Club (fr)	\N	\N
1344	1	musical-instrument-rental-service	Musical Instrument Rental Service	Musical Instrument Rental Service	\N	\N
2443	2	oriental-goods-store	Oriental Goods Store (fr)	Oriental Goods Store (fr)	\N	\N
1344	2	musical-instrument-rental-service	Musical Instrument Rental Service (fr)	Musical Instrument Rental Service (fr)	\N	\N
1345	1	musical-instrument-repair-shop	Musical Instrument Repair Shop	Musical Instrument Repair Shop	\N	\N
1345	2	musical-instrument-repair-shop	Musical Instrument Repair Shop (fr)	Musical Instrument Repair Shop (fr)	\N	\N
1346	1	musical-instrument-store	Musical Instrument Store	Musical Instrument Store	\N	\N
1346	2	musical-instrument-store	Musical Instrument Store (fr)	Musical Instrument Store (fr)	\N	\N
2544	1	musician	Musician	Musician	\N	\N
2544	2	musician	Musician (fr)	Musician (fr)	\N	\N
1530	1	mutton-barbecue-restaurant	Mutton Barbecue Restaurant	Mutton Barbecue Restaurant	\N	\N
1530	2	mutton-barbecue-restaurant	Mutton Barbecue Restaurant (fr)	Mutton Barbecue Restaurant (fr)	\N	\N
689	1	nail-salon	Nail Salon	Nail Salon	\N	\N
689	2	nail-salon	Nail Salon (fr)	Nail Salon (fr)	\N	\N
401	1	national-forest	National Forest	National Forest	\N	\N
401	2	national-forest	National Forest (fr)	National Forest (fr)	\N	\N
2556	1	national-library	National Library	National Library	\N	\N
2556	2	national-library	National Library (fr)	National Library (fr)	\N	\N
335	1	national-museum	National Museum	National Museum	\N	\N
335	2	national-museum	National Museum (fr)	National Museum (fr)	\N	\N
436	1	national-park	National Park	National Park	\N	\N
436	2	national-park	National Park (fr)	National Park (fr)	\N	\N
1114	1	natural-goods-store	Natural Goods Store	Natural Goods Store	\N	\N
1114	2	natural-goods-store	Natural Goods Store (fr)	Natural Goods Store (fr)	\N	\N
248	1	natural-history-museum	Natural History Museum	Natural History Museum	\N	\N
248	2	natural-history-museum	Natural History Museum (fr)	Natural History Museum (fr)	\N	\N
211	1	nature-preserve	Nature Preserve	Nature Preserve	\N	\N
211	2	nature-preserve	Nature Preserve (fr)	Nature Preserve (fr)	\N	\N
302	1	neapolitan-restaurant	Neapolitan Restaurant	Neapolitan Restaurant	\N	\N
302	2	neapolitan-restaurant	Neapolitan Restaurant (fr)	Neapolitan Restaurant (fr)	\N	\N
1182	1	nepalese-restaurant	Nepalese Restaurant	Nepalese Restaurant	\N	\N
1182	2	nepalese-restaurant	Nepalese Restaurant (fr)	Nepalese Restaurant (fr)	\N	\N
834	1	new-american-restaurant	New American Restaurant	New American Restaurant	\N	\N
834	2	new-american-restaurant	New American Restaurant (fr)	New American Restaurant (fr)	\N	\N
34	1	new-zealand-restaurant	New Zealand Restaurant	New Zealand Restaurant	\N	\N
34	2	new-zealand-restaurant	New Zealand Restaurant (fr)	New Zealand Restaurant (fr)	\N	\N
2868	1	newsstand	Newsstand	Newsstand	\N	\N
2868	2	newsstand	Newsstand (fr)	Newsstand (fr)	\N	\N
123	1	night-club	Night Club	Night Club	\N	\N
123	2	night-club	Night Club (fr)	Night Club (fr)	\N	\N
2286	1	non-governmental-organization	Non Governmental Organization	Non Governmental Organization	\N	\N
2286	2	non-governmental-organization	Non Governmental Organization (fr)	Non Governmental Organization (fr)	\N	\N
72	1	non-profit-organization	Non Profit Organization	Non Profit Organization	\N	\N
72	2	non-profit-organization	Non Profit Organization (fr)	Non Profit Organization (fr)	\N	\N
1692	1	noodle-shop	Noodle Shop	Noodle Shop	\N	\N
1692	2	noodle-shop	Noodle Shop (fr)	Noodle Shop (fr)	\N	\N
852	1	north-african-restaurant	North African Restaurant	North African Restaurant	\N	\N
852	2	north-african-restaurant	North African Restaurant (fr)	North African Restaurant (fr)	\N	\N
553	1	northern-italian-restaurant	Northern Italian Restaurant	Northern Italian Restaurant	\N	\N
553	2	northern-italian-restaurant	Northern Italian Restaurant (fr)	Northern Italian Restaurant (fr)	\N	\N
421	1	novelty-store	Novelty Store	Novelty Store	\N	\N
421	2	novelty-store	Novelty Store (fr)	Novelty Store (fr)	\N	\N
2434	1	nudist-club	Nudist Club	Nudist Club	\N	\N
2434	2	nudist-club	Nudist Club (fr)	Nudist Club (fr)	\N	\N
88	1	observation-deck	Observation Deck	Observation Deck	\N	\N
88	2	observation-deck	Observation Deck (fr)	Observation Deck (fr)	\N	\N
434	1	observatory	Observatory	Observatory	\N	\N
434	2	observatory	Observatory (fr)	Observatory (fr)	\N	\N
312	1	offal-barbecue-restaurant	Offal Barbecue Restaurant	Offal Barbecue Restaurant	\N	\N
312	2	offal-barbecue-restaurant	Offal Barbecue Restaurant (fr)	Offal Barbecue Restaurant (fr)	\N	\N
146	1	office-space-rental-agency	Office Space Rental Agency	Office Space Rental Agency	\N	\N
146	2	office-space-rental-agency	Office Space Rental Agency (fr)	Office Space Rental Agency (fr)	\N	\N
406	1	office-supply-wholesaler	Office Supply Wholesaler	Office Supply Wholesaler	\N	\N
406	2	office-supply-wholesaler	Office Supply Wholesaler (fr)	Office Supply Wholesaler (fr)	\N	\N
2995	1	okonomiyaki-restaurant	Okonomiyaki Restaurant	Okonomiyaki Restaurant	\N	\N
2995	2	okonomiyaki-restaurant	Okonomiyaki Restaurant (fr)	Okonomiyaki Restaurant (fr)	\N	\N
393	1	open-air-museum	Open Air Museum	Open Air Museum	\N	\N
393	2	open-air-museum	Open Air Museum (fr)	Open Air Museum (fr)	\N	\N
1215	1	opera-company	Opera Company	Opera Company	\N	\N
1215	2	opera-company	Opera Company (fr)	Opera Company (fr)	\N	\N
209	1	opera-house	Opera House	Opera House	\N	\N
209	2	opera-house	Opera House (fr)	Opera House (fr)	\N	\N
210	1	orchestra	Orchestra	Orchestra	\N	\N
210	2	orchestra	Orchestra (fr)	Orchestra (fr)	\N	\N
317	1	organic-farm	Organic Farm	Organic Farm	\N	\N
317	2	organic-farm	Organic Farm (fr)	Organic Farm (fr)	\N	\N
407	1	organic-food-store	Organic Food Store	Organic Food Store	\N	\N
407	2	organic-food-store	Organic Food Store (fr)	Organic Food Store (fr)	\N	\N
27	1	organic-restaurant	Organic Restaurant	Organic Restaurant	\N	\N
27	2	organic-restaurant	Organic Restaurant (fr)	Organic Restaurant (fr)	\N	\N
318	1	organic-shop	Organic Shop	Organic Shop	\N	\N
318	2	organic-shop	Organic Shop (fr)	Organic Shop (fr)	\N	\N
2443	1	oriental-goods-store	Oriental Goods Store	Oriental Goods Store	\N	\N
432	1	orthodox-church	Orthodox Church	Orthodox Church	\N	\N
432	2	orthodox-church	Orthodox Church (fr)	Orthodox Church (fr)	\N	\N
325	1	orthodox-synagogue	Orthodox Synagogue	Orthodox Synagogue	\N	\N
325	2	orthodox-synagogue	Orthodox Synagogue (fr)	Orthodox Synagogue (fr)	\N	\N
986	1	outdoor-activity-organiser	Outdoor Activity Organiser	Outdoor Activity Organiser	\N	\N
986	2	outdoor-activity-organiser	Outdoor Activity Organiser (fr)	Outdoor Activity Organiser (fr)	\N	\N
2177	1	outdoor-sports-store	Outdoor Sports Store	Outdoor Sports Store	\N	\N
2177	2	outdoor-sports-store	Outdoor Sports Store (fr)	Outdoor Sports Store (fr)	\N	\N
1336	1	outdoor-swimming-pool	Outdoor Swimming Pool	Outdoor Swimming Pool	\N	\N
1336	2	outdoor-swimming-pool	Outdoor Swimming Pool (fr)	Outdoor Swimming Pool (fr)	\N	\N
1046	1	outlet-store	Outlet Store	Outlet Store	\N	\N
1046	2	outlet-store	Outlet Store (fr)	Outlet Store (fr)	\N	\N
149	1	oxygen-cocktail-spot	Oxygen Cocktail Spot	Oxygen Cocktail Spot	\N	\N
149	2	oxygen-cocktail-spot	Oxygen Cocktail Spot (fr)	Oxygen Cocktail Spot (fr)	\N	\N
364	1	oyster-bar-restaurant	Oyster Bar Restaurant	Oyster Bar Restaurant	\N	\N
364	2	oyster-bar-restaurant	Oyster Bar Restaurant (fr)	Oyster Bar Restaurant (fr)	\N	\N
788	1	pachinko-parlor	Pachinko Parlor	Pachinko Parlor	\N	\N
788	2	pachinko-parlor	Pachinko Parlor (fr)	Pachinko Parlor (fr)	\N	\N
760	1	package-locker	Package Locker	Package Locker	\N	\N
760	2	package-locker	Package Locker (fr)	Package Locker (fr)	\N	\N
1151	1	paintball-center	Paintball Center	Paintball Center	\N	\N
1151	2	paintball-center	Paintball Center (fr)	Paintball Center (fr)	\N	\N
336	2	painting	Painting (fr)	Painting (fr)	\N	\N
720	1	pakistani-restaurant	Pakistani Restaurant	Pakistani Restaurant	\N	\N
720	2	pakistani-restaurant	Pakistani Restaurant (fr)	Pakistani Restaurant (fr)	\N	\N
282	1	palatine-restaurant	Palatine Restaurant	Palatine Restaurant	\N	\N
282	2	palatine-restaurant	Palatine Restaurant (fr)	Palatine Restaurant (fr)	\N	\N
721	1	pan-asian-restaurant	Pan Asian Restaurant	Pan Asian Restaurant	\N	\N
721	2	pan-asian-restaurant	Pan Asian Restaurant (fr)	Pan Asian Restaurant (fr)	\N	\N
1620	1	pan-latin-restaurant	Pan Latin Restaurant	Pan Latin Restaurant	\N	\N
1620	2	pan-latin-restaurant	Pan Latin Restaurant (fr)	Pan Latin Restaurant (fr)	\N	\N
53	1	pancake-restaurant	Pancake Restaurant	Pancake Restaurant	\N	\N
53	2	pancake-restaurant	Pancake Restaurant (fr)	Pancake Restaurant (fr)	\N	\N
3022	1	paraguayan-restaurant	Paraguayan Restaurant	Paraguayan Restaurant	\N	\N
3022	2	paraguayan-restaurant	Paraguayan Restaurant (fr)	Paraguayan Restaurant (fr)	\N	\N
1456	1	parish	Parish	Parish	\N	\N
1456	2	parish	Parish (fr)	Parish (fr)	\N	\N
80	2	park	Park (fr)	Park (fr)	\N	\N
825	1	parking-garage	Parking Garage	Parking Garage	\N	\N
825	2	parking-garage	Parking Garage (fr)	Parking Garage (fr)	\N	\N
826	1	parking-lot	Parking Lot	Parking Lot	\N	\N
826	2	parking-lot	Parking Lot (fr)	Parking Lot (fr)	\N	\N
1089	1	parking-lot-for-bicycles	Parking Lot For Bicycles	Parking Lot For Bicycles	\N	\N
1089	2	parking-lot-for-bicycles	Parking Lot For Bicycles (fr)	Parking Lot For Bicycles (fr)	\N	\N
841	1	party-equipment-rental-service	Party Equipment Rental Service	Party Equipment Rental Service	\N	\N
841	2	party-equipment-rental-service	Party Equipment Rental Service (fr)	Party Equipment Rental Service (fr)	\N	\N
232	1	party-planner	Party Planner	Party Planner	\N	\N
232	2	party-planner	Party Planner (fr)	Party Planner (fr)	\N	\N
370	1	pasta-shop	Pasta Shop	Pasta Shop	\N	\N
370	2	pasta-shop	Pasta Shop (fr)	Pasta Shop (fr)	\N	\N
166	1	pastry-shop	Pastry Shop	Pastry Shop	\N	\N
166	2	pastry-shop	Pastry Shop (fr)	Pastry Shop (fr)	\N	\N
168	1	patisserie	Patisserie	Patisserie	\N	\N
168	2	patisserie	Patisserie (fr)	Patisserie (fr)	\N	\N
646	1	performing-arts-group	Performing Arts Group	Performing Arts Group	\N	\N
646	2	performing-arts-group	Performing Arts Group (fr)	Performing Arts Group (fr)	\N	\N
203	1	performing-arts-theater	Performing Arts Theater	Performing Arts Theater	\N	\N
203	2	performing-arts-theater	Performing Arts Theater (fr)	Performing Arts Theater (fr)	\N	\N
1076	1	perfume-store	Perfume Store	Perfume Store	\N	\N
1076	2	perfume-store	Perfume Store (fr)	Perfume Store (fr)	\N	\N
272	1	persian-restaurant	Persian Restaurant	Persian Restaurant	\N	\N
272	2	persian-restaurant	Persian Restaurant (fr)	Persian Restaurant (fr)	\N	\N
233	1	personal-trainer	Personal Trainer	Personal Trainer	\N	\N
233	2	personal-trainer	Personal Trainer (fr)	Personal Trainer (fr)	\N	\N
1280	1	peruvian-restaurant	Peruvian Restaurant	Peruvian Restaurant	\N	\N
1280	2	peruvian-restaurant	Peruvian Restaurant (fr)	Peruvian Restaurant (fr)	\N	\N
827	1	pet-friendly-accommodation	Pet Friendly Accommodation	Pet Friendly Accommodation	\N	\N
827	2	pet-friendly-accommodation	Pet Friendly Accommodation (fr)	Pet Friendly Accommodation (fr)	\N	\N
1651	1	pharmacy	Pharmacy	Pharmacy	\N	\N
1651	2	pharmacy	Pharmacy (fr)	Pharmacy (fr)	\N	\N
1143	1	philharmonic-hall	Philharmonic Hall	Philharmonic Hall	\N	\N
1143	2	philharmonic-hall	Philharmonic Hall (fr)	Philharmonic Hall (fr)	\N	\N
3002	1	pho-restaurant	Pho Restaurant	Pho Restaurant	\N	\N
3002	2	pho-restaurant	Pho Restaurant (fr)	Pho Restaurant (fr)	\N	\N
2837	1	photo-booth	Photo Booth	Photo Booth	\N	\N
2837	2	photo-booth	Photo Booth (fr)	Photo Booth (fr)	\N	\N
347	1	photo-shop	Photo Shop	Photo Shop	\N	\N
347	2	photo-shop	Photo Shop (fr)	Photo Shop (fr)	\N	\N
1295	1	photography-studio	Photography Studio	Photography Studio	\N	\N
1295	2	photography-studio	Photography Studio (fr)	Photography Studio (fr)	\N	\N
705	1	physical-fitness-program	Physical Fitness Program	Physical Fitness Program	\N	\N
705	2	physical-fitness-program	Physical Fitness Program (fr)	Physical Fitness Program (fr)	\N	\N
382	1	physical-therapist	Physical Therapist	Physical Therapist	\N	\N
382	2	physical-therapist	Physical Therapist (fr)	Physical Therapist (fr)	\N	\N
472	1	piano-bar	Piano Bar	Piano Bar	\N	\N
472	2	piano-bar	Piano Bar (fr)	Piano Bar (fr)	\N	\N
837	1	picnic-ground	Picnic Ground	Picnic Ground	\N	\N
837	2	picnic-ground	Picnic Ground (fr)	Picnic Ground (fr)	\N	\N
696	1	pie-shop	Pie Shop	Pie Shop	\N	\N
696	2	pie-shop	Pie Shop (fr)	Pie Shop (fr)	\N	\N
2741	1	piedmontese-restaurant	Piedmontese Restaurant	Piedmontese Restaurant	\N	\N
2741	2	piedmontese-restaurant	Piedmontese Restaurant (fr)	Piedmontese Restaurant (fr)	\N	\N
383	1	pilates-studio	Pilates Studio	Pilates Studio	\N	\N
383	2	pilates-studio	Pilates Studio (fr)	Pilates Studio (fr)	\N	\N
783	1	pilgrimage-place	Pilgrimage Place	Pilgrimage Place	\N	\N
783	2	pilgrimage-place	Pilgrimage Place (fr)	Pilgrimage Place (fr)	\N	\N
189	1	pizza-delivery	Pizza Delivery	Pizza Delivery	\N	\N
189	2	pizza-delivery	Pizza Delivery (fr)	Pizza Delivery (fr)	\N	\N
217	1	pizza-restaurant	Pizza Restaurant	Pizza Restaurant	\N	\N
217	2	pizza-restaurant	Pizza Restaurant (fr)	Pizza Restaurant (fr)	\N	\N
190	1	pizza-takeaway	Pizza Takeaway	Pizza Takeaway	\N	\N
190	2	pizza-takeaway	Pizza Takeaway (fr)	Pizza Takeaway (fr)	\N	\N
663	1	place-of-worship	Place Of Worship	Place Of Worship	\N	\N
663	2	place-of-worship	Place Of Worship (fr)	Place Of Worship (fr)	\N	\N
1769	1	planetarium	Planetarium	Planetarium	\N	\N
1769	2	planetarium	Planetarium (fr)	Planetarium (fr)	\N	\N
1239	1	plant-nursery	Plant Nursery	Plant Nursery	\N	\N
1239	2	plant-nursery	Plant Nursery (fr)	Plant Nursery (fr)	\N	\N
377	1	playground	Playground	Playground	\N	\N
377	2	playground	Playground (fr)	Playground (fr)	\N	\N
176	1	poke-bar	Poke Bar	Poke Bar	\N	\N
176	2	poke-bar	Poke Bar (fr)	Poke Bar (fr)	\N	\N
754	1	polish-restaurant	Polish Restaurant	Polish Restaurant	\N	\N
754	2	polish-restaurant	Polish Restaurant (fr)	Polish Restaurant (fr)	\N	\N
2302	1	political-party-office	Political Party Office	Political Party Office	\N	\N
2302	2	political-party-office	Political Party Office (fr)	Political Party Office (fr)	\N	\N
745	1	pool-billard-club	Pool Billard Club	Pool Billard Club	\N	\N
745	2	pool-billard-club	Pool Billard Club (fr)	Pool Billard Club (fr)	\N	\N
154	1	pool-hall	Pool Hall	Pool Hall	\N	\N
154	2	pool-hall	Pool Hall (fr)	Pool Hall (fr)	\N	\N
3109	1	portrait-studio	Portrait Studio	Portrait Studio	\N	\N
3109	2	portrait-studio	Portrait Studio (fr)	Portrait Studio (fr)	\N	\N
319	1	portuguese-restaurant	Portuguese Restaurant	Portuguese Restaurant	\N	\N
319	2	portuguese-restaurant	Portuguese Restaurant (fr)	Portuguese Restaurant (fr)	\N	\N
495	1	pottery-store	Pottery Store	Pottery Store	\N	\N
495	2	pottery-store	Pottery Store (fr)	Pottery Store (fr)	\N	\N
2657	1	power-station	Power Station	Power Station	\N	\N
2657	2	power-station	Power Station (fr)	Power Station (fr)	\N	\N
2953	1	presbyterian-church	Presbyterian Church	Presbyterian Church	\N	\N
2953	2	presbyterian-church	Presbyterian Church (fr)	Presbyterian Church (fr)	\N	\N
3110	1	press-advisory	Press Advisory	Press Advisory	\N	\N
3110	2	press-advisory	Press Advisory (fr)	Press Advisory (fr)	\N	\N
320	1	pretzel-store	Pretzel Store	Pretzel Store	\N	\N
320	2	pretzel-store	Pretzel Store (fr)	Pretzel Store (fr)	\N	\N
770	1	produce-market	Produce Market	Produce Market	\N	\N
770	2	produce-market	Produce Market (fr)	Produce Market (fr)	\N	\N
2545	1	professional-organizer	Professional Organizer	Professional Organizer	\N	\N
2545	2	professional-organizer	Professional Organizer (fr)	Professional Organizer (fr)	\N	\N
236	1	promenade	Promenade	Promenade	\N	\N
236	2	promenade	Promenade (fr)	Promenade (fr)	\N	\N
247	1	protestant-church	Protestant Church	Protestant Church	\N	\N
247	2	protestant-church	Protestant Church (fr)	Protestant Church (fr)	\N	\N
1573	1	provence-restaurant	Provence Restaurant	Provence Restaurant	\N	\N
1573	2	provence-restaurant	Provence Restaurant (fr)	Provence Restaurant (fr)	\N	\N
28	2	pub	Pub (fr)	Pub (fr)	\N	\N
378	1	public-bath	Public Bath	Public Bath	\N	\N
378	2	public-bath	Public Bath (fr)	Public Bath (fr)	\N	\N
2293	1	public-library	Public Library	Public Library	\N	\N
2293	2	public-library	Public Library (fr)	Public Library (fr)	\N	\N
1724	1	public-medical-center	Public Medical Center	Public Medical Center	\N	\N
1724	2	public-medical-center	Public Medical Center (fr)	Public Medical Center (fr)	\N	\N
2069	1	public-parking-space	Public Parking Space	Public Parking Space	\N	\N
2069	2	public-parking-space	Public Parking Space (fr)	Public Parking Space (fr)	\N	\N
1332	1	public-swimming-pool	Public Swimming Pool	Public Swimming Pool	\N	\N
1332	2	public-swimming-pool	Public Swimming Pool (fr)	Public Swimming Pool (fr)	\N	\N
1800	1	puppet-theater	Puppet Theater	Puppet Theater	\N	\N
1800	2	puppet-theater	Puppet Theater (fr)	Puppet Theater (fr)	\N	\N
177	1	quebecois-restaurant	Quebecois Restaurant	Quebecois Restaurant	\N	\N
177	2	quebecois-restaurant	Quebecois Restaurant (fr)	Quebecois Restaurant (fr)	\N	\N
1560	1	raclette-restaurant	Raclette Restaurant	Raclette Restaurant	\N	\N
1560	2	raclette-restaurant	Raclette Restaurant (fr)	Raclette Restaurant (fr)	\N	\N
3111	1	radio-broadcaster	Radio Broadcaster	Radio Broadcaster	\N	\N
3111	2	radio-broadcaster	Radio Broadcaster (fr)	Radio Broadcaster (fr)	\N	\N
327	1	rail-museum	Rail Museum	Rail Museum	\N	\N
327	2	rail-museum	Rail Museum (fr)	Rail Museum (fr)	\N	\N
607	1	ramen-restaurant	Ramen Restaurant	Ramen Restaurant	\N	\N
607	2	ramen-restaurant	Ramen Restaurant (fr)	Ramen Restaurant (fr)	\N	\N
2124	1	raw-food-restaurant	Raw Food Restaurant	Raw Food Restaurant	\N	\N
2124	2	raw-food-restaurant	Raw Food Restaurant (fr)	Raw Food Restaurant (fr)	\N	\N
215	1	real-estate-agency	Real Estate Agency	Real Estate Agency	\N	\N
215	2	real-estate-agency	Real Estate Agency (fr)	Real Estate Agency (fr)	\N	\N
2734	1	record-company	Record Company	Record Company	\N	\N
2734	2	record-company	Record Company (fr)	Record Company (fr)	\N	\N
1264	1	record-store	Record Store	Record Store	\N	\N
1264	2	record-store	Record Store (fr)	Record Store (fr)	\N	\N
300	1	recording-studio	Recording Studio	Recording Studio	\N	\N
300	2	recording-studio	Recording Studio (fr)	Recording Studio (fr)	\N	\N
2287	1	records-storage-facility	Records Storage Facility	Records Storage Facility	\N	\N
2287	2	records-storage-facility	Records Storage Facility (fr)	Records Storage Facility (fr)	\N	\N
221	1	recreation-center	Recreation Center	Recreation Center	\N	\N
221	2	recreation-center	Recreation Center (fr)	Recreation Center (fr)	\N	\N
772	1	reformed-church	Reformed Church	Reformed Church	\N	\N
772	2	reformed-church	Reformed Church (fr)	Reformed Church (fr)	\N	\N
2075	1	religious-book-store	Religious Book Store	Religious Book Store	\N	\N
2075	2	religious-book-store	Religious Book Store (fr)	Religious Book Store (fr)	\N	\N
329	1	religious-destination	Religious Destination	Religious Destination	\N	\N
329	2	religious-destination	Religious Destination (fr)	Religious Destination (fr)	\N	\N
2076	1	religious-goods-store	Religious Goods Store	Religious Goods Store	\N	\N
2076	2	religious-goods-store	Religious Goods Store (fr)	Religious Goods Store (fr)	\N	\N
330	1	religious-institution	Religious Institution	Religious Institution	\N	\N
330	2	religious-institution	Religious Institution (fr)	Religious Institution (fr)	\N	\N
773	1	religious-organization	Religious Organization	Religious Organization	\N	\N
773	2	religious-organization	Religious Organization (fr)	Religious Organization (fr)	\N	\N
249	1	research-institute	Research Institute	Research Institute	\N	\N
249	2	research-institute	Research Institute (fr)	Research Institute (fr)	\N	\N
8	1	restaurant	Restaurant	Restaurant	\N	\N
8	2	restaurant	Restaurant (fr)	Restaurant (fr)	\N	\N
441	1	restaurant-bar	Restaurant Bar	Restaurant Bar	\N	\N
441	2	restaurant-bar	Restaurant Bar (fr)	Restaurant Bar (fr)	\N	\N
276	1	restaurant-supply-store	Restaurant Supply Store	Restaurant Supply Store	\N	\N
276	2	restaurant-supply-store	Restaurant Supply Store (fr)	Restaurant Supply Store (fr)	\N	\N
287	1	rice-restaurant	Rice Restaurant	Rice Restaurant	\N	\N
287	2	rice-restaurant	Rice Restaurant (fr)	Rice Restaurant (fr)	\N	\N
987	1	road-cycling	Road Cycling	Road Cycling	\N	\N
987	2	road-cycling	Road Cycling (fr)	Road Cycling (fr)	\N	\N
2178	1	rock-climbing	Rock Climbing	Rock Climbing	\N	\N
2178	2	rock-climbing	Rock Climbing (fr)	Rock Climbing (fr)	\N	\N
1004	1	rock-climbing-gym	Rock Climbing Gym	Rock Climbing Gym	\N	\N
1004	2	rock-climbing-gym	Rock Climbing Gym (fr)	Rock Climbing Gym (fr)	\N	\N
1353	1	rock-music-club	Rock Music Club	Rock Music Club	\N	\N
1353	2	rock-music-club	Rock Music Club (fr)	Rock Music Club (fr)	\N	\N
2569	1	roller-coaster	Roller Coaster	Roller Coaster	\N	\N
2569	2	roller-coaster	Roller Coaster (fr)	Roller Coaster (fr)	\N	\N
2120	1	roman-restaurant	Roman Restaurant	Roman Restaurant	\N	\N
2120	2	roman-restaurant	Roman Restaurant (fr)	Roman Restaurant (fr)	\N	\N
716	1	romanian-restaurant	Romanian Restaurant	Romanian Restaurant	\N	\N
716	2	romanian-restaurant	Romanian Restaurant (fr)	Romanian Restaurant (fr)	\N	\N
1079	1	russian-orthodox-church	Russian Orthodox Church	Russian Orthodox Church	\N	\N
1079	2	russian-orthodox-church	Russian Orthodox Church (fr)	Russian Orthodox Church (fr)	\N	\N
265	1	russian-restaurant	Russian Restaurant	Russian Restaurant	\N	\N
265	2	russian-restaurant	Russian Restaurant (fr)	Russian Restaurant (fr)	\N	\N
97	1	rv-park	Rv Park	Rv Park	\N	\N
97	2	rv-park	Rv Park (fr)	Rv Park (fr)	\N	\N
1450	1	sailing-event-area	Sailing Event Area	Sailing Event Area	\N	\N
1450	2	sailing-event-area	Sailing Event Area (fr)	Sailing Event Area (fr)	\N	\N
64	1	salad-shop	Salad Shop	Salad Shop	\N	\N
64	2	salad-shop	Salad Shop (fr)	Salad Shop (fr)	\N	\N
2509	1	salsa-bar	Salsa Bar	Salsa Bar	\N	\N
2509	2	salsa-bar	Salsa Bar (fr)	Salsa Bar (fr)	\N	\N
2510	1	salsa-classes	Salsa Classes	Salsa Classes	\N	\N
2510	2	salsa-classes	Salsa Classes (fr)	Salsa Classes (fr)	\N	\N
16	1	sandwich-shop	Sandwich Shop	Sandwich Shop	\N	\N
16	2	sandwich-shop	Sandwich Shop (fr)	Sandwich Shop (fr)	\N	\N
1700	1	sardinian-restaurant	Sardinian Restaurant	Sardinian Restaurant	\N	\N
1700	2	sardinian-restaurant	Sardinian Restaurant (fr)	Sardinian Restaurant (fr)	\N	\N
613	1	scandinavian-restaurant	Scandinavian Restaurant	Scandinavian Restaurant	\N	\N
613	2	scandinavian-restaurant	Scandinavian Restaurant (fr)	Scandinavian Restaurant (fr)	\N	\N
39	1	scenic-spot	Scenic Spot	Scenic Spot	\N	\N
39	2	scenic-spot	Scenic Spot (fr)	Scenic Spot (fr)	\N	\N
332	1	school	School	School	\N	\N
332	2	school	School (fr)	School (fr)	\N	\N
1158	1	school-center	School Center	School Center	\N	\N
1158	2	school-center	School Center (fr)	School Center (fr)	\N	\N
82	1	science-museum	Science Museum	Science Museum	\N	\N
82	2	science-museum	Science Museum (fr)	Science Museum (fr)	\N	\N
2910	1	scottish-restaurant	Scottish Restaurant	Scottish Restaurant	\N	\N
2910	2	scottish-restaurant	Scottish Restaurant (fr)	Scottish Restaurant (fr)	\N	\N
337	1	sculpture	Sculpture	Sculpture	\N	\N
337	2	sculpture	Sculpture (fr)	Sculpture (fr)	\N	\N
394	1	sculpture-museum	Sculpture Museum	Sculpture Museum	\N	\N
394	2	sculpture-museum	Sculpture Museum (fr)	Sculpture Museum (fr)	\N	\N
610	1	seafood-market	Seafood Market	Seafood Market	\N	\N
610	2	seafood-market	Seafood Market (fr)	Seafood Market (fr)	\N	\N
120	1	seafood-restaurant	Seafood Restaurant	Seafood Restaurant	\N	\N
120	2	seafood-restaurant	Seafood Restaurant (fr)	Seafood Restaurant (fr)	\N	\N
1186	1	seafood-wholesaler	Seafood Wholesaler	Seafood Wholesaler	\N	\N
1186	2	seafood-wholesaler	Seafood Wholesaler (fr)	Seafood Wholesaler (fr)	\N	\N
2200	1	seasonal-goods-store	Seasonal Goods Store	Seasonal Goods Store	\N	\N
2200	2	seasonal-goods-store	Seasonal Goods Store (fr)	Seasonal Goods Store (fr)	\N	\N
2971	1	self-catering-accommodation	Self Catering Accommodation	Self Catering Accommodation	\N	\N
2971	2	self-catering-accommodation	Self Catering Accommodation (fr)	Self Catering Accommodation (fr)	\N	\N
829	1	self-service-restaurant	Self Service Restaurant	Self Service Restaurant	\N	\N
829	2	self-service-restaurant	Self Service Restaurant (fr)	Self Service Restaurant (fr)	\N	\N
204	1	seminary	Seminary	Seminary	\N	\N
204	2	seminary	Seminary (fr)	Seminary (fr)	\N	\N
2726	1	senior-citizen-center	Senior Citizen Center	Senior Citizen Center	\N	\N
2726	2	senior-citizen-center	Senior Citizen Center (fr)	Senior Citizen Center (fr)	\N	\N
283	1	service-establishment	Service Establishment	Service Establishment	\N	\N
283	2	service-establishment	Service Establishment (fr)	Service Establishment (fr)	\N	\N
369	1	serviced-accommodation	Serviced Accommodation	Serviced Accommodation	\N	\N
369	2	serviced-accommodation	Serviced Accommodation (fr)	Serviced Accommodation (fr)	\N	\N
331	1	seventh-day-adventist-church	Seventh Day Adventist Church	Seventh Day Adventist Church	\N	\N
331	2	seventh-day-adventist-church	Seventh Day Adventist Church (fr)	Seventh Day Adventist Church (fr)	\N	\N
3009	1	shawarma-restaurant	Shawarma Restaurant	Shawarma Restaurant	\N	\N
3009	2	shawarma-restaurant	Shawarma Restaurant (fr)	Shawarma Restaurant (fr)	\N	\N
1153	1	ship-building	Ship Building	Ship Building	\N	\N
1153	2	ship-building	Ship Building (fr)	Ship Building (fr)	\N	\N
1493	1	shipping-service	Shipping Service	Shipping Service	\N	\N
1493	2	shipping-service	Shipping Service (fr)	Shipping Service (fr)	\N	\N
1142	1	shipyard	Shipyard	Shipyard	\N	\N
1142	2	shipyard	Shipyard (fr)	Shipyard (fr)	\N	\N
2482	1	shoe-repair-shop	Shoe Repair Shop	Shoe Repair Shop	\N	\N
2482	2	shoe-repair-shop	Shoe Repair Shop (fr)	Shoe Repair Shop (fr)	\N	\N
1090	1	shoe-store	Shoe Store	Shoe Store	\N	\N
1090	2	shoe-store	Shoe Store (fr)	Shoe Store (fr)	\N	\N
3051	1	shooting-event-area	Shooting Event Area	Shooting Event Area	\N	\N
3051	2	shooting-event-area	Shooting Event Area (fr)	Shooting Event Area (fr)	\N	\N
3052	1	shooting-range	Shooting Range	Shooting Range	\N	\N
3052	2	shooting-range	Shooting Range (fr)	Shooting Range (fr)	\N	\N
78	1	shopping-mall	Shopping Mall	Shopping Mall	\N	\N
78	2	shopping-mall	Shopping Mall (fr)	Shopping Mall (fr)	\N	\N
426	1	shrine	Shrine	Shrine	\N	\N
426	2	shrine	Shrine (fr)	Shrine (fr)	\N	\N
1779	1	sicilian-restaurant	Sicilian Restaurant	Sicilian Restaurant	\N	\N
1779	2	sicilian-restaurant	Sicilian Restaurant (fr)	Sicilian Restaurant (fr)	\N	\N
395	1	sightseeing-tour-agency	Sightseeing Tour Agency	Sightseeing Tour Agency	\N	\N
395	2	sightseeing-tour-agency	Sightseeing Tour Agency (fr)	Sightseeing Tour Agency (fr)	\N	\N
1275	1	singaporean-restaurant	Singaporean Restaurant	Singaporean Restaurant	\N	\N
1275	2	singaporean-restaurant	Singaporean Restaurant (fr)	Singaporean Restaurant (fr)	\N	\N
798	1	singles-organization	Singles Organization	Singles Organization	\N	\N
798	2	singles-organization	Singles Organization (fr)	Singles Organization (fr)	\N	\N
2250	1	ski-rental-service	Ski Rental Service	Ski Rental Service	\N	\N
2250	2	ski-rental-service	Ski Rental Service (fr)	Ski Rental Service (fr)	\N	\N
405	1	ski-resort	Ski Resort	Ski Resort	\N	\N
405	2	ski-resort	Ski Resort (fr)	Ski Resort (fr)	\N	\N
2252	1	ski-school	Ski School	Ski School	\N	\N
2252	2	ski-school	Ski School (fr)	Ski School (fr)	\N	\N
2253	1	ski-shop	Ski Shop	Ski Shop	\N	\N
2253	2	ski-shop	Ski Shop (fr)	Ski Shop (fr)	\N	\N
118	1	small-plates-restaurant	Small Plates Restaurant	Small Plates Restaurant	\N	\N
118	2	small-plates-restaurant	Small Plates Restaurant (fr)	Small Plates Restaurant (fr)	\N	\N
1665	1	smart-shop	Smart Shop	Smart Shop	\N	\N
1665	2	smart-shop	Smart Shop (fr)	Smart Shop (fr)	\N	\N
1184	1	snack-bar	Snack Bar	Snack Bar	\N	\N
1184	2	snack-bar	Snack Bar (fr)	Snack Bar (fr)	\N	\N
2254	1	snowboard-rental-service	Snowboard Rental Service	Snowboard Rental Service	\N	\N
2254	2	snowboard-rental-service	Snowboard Rental Service (fr)	Snowboard Rental Service (fr)	\N	\N
2255	1	snowboard-shop	Snowboard Shop	Snowboard Shop	\N	\N
2255	2	snowboard-shop	Snowboard Shop (fr)	Snowboard Shop (fr)	\N	\N
2709	1	soccer-club	Soccer Club	Soccer Club	\N	\N
2709	2	soccer-club	Soccer Club (fr)	Soccer Club (fr)	\N	\N
1585	1	soccer-field	Soccer Field	Soccer Field	\N	\N
1585	2	soccer-field	Soccer Field (fr)	Soccer Field (fr)	\N	\N
310	1	social-club	Social Club	Social Club	\N	\N
310	2	social-club	Social Club (fr)	Social Club (fr)	\N	\N
1096	1	soft-drinks-shop	Soft Drinks Shop	Soft Drinks Shop	\N	\N
1096	2	soft-drinks-shop	Soft Drinks Shop (fr)	Soft Drinks Shop (fr)	\N	\N
288	1	soul-food-restaurant	Soul Food Restaurant	Soul Food Restaurant	\N	\N
288	2	soul-food-restaurant	Soul Food Restaurant (fr)	Soul Food Restaurant (fr)	\N	\N
750	1	soup-kitchen	Soup Kitchen	Soup Kitchen	\N	\N
750	2	soup-kitchen	Soup Kitchen (fr)	Soup Kitchen (fr)	\N	\N
748	1	soup-restaurant	Soup Restaurant	Soup Restaurant	\N	\N
748	2	soup-restaurant	Soup Restaurant (fr)	Soup Restaurant (fr)	\N	\N
1276	1	south-american-restaurant	South American Restaurant	South American Restaurant	\N	\N
1276	2	south-american-restaurant	South American Restaurant (fr)	South American Restaurant (fr)	\N	\N
1273	1	south-asian-restaurant	South Asian Restaurant	South Asian Restaurant	\N	\N
1273	2	south-asian-restaurant	South Asian Restaurant (fr)	South Asian Restaurant (fr)	\N	\N
1269	1	southeast-asian-restaurant	Southeast Asian Restaurant	Southeast Asian Restaurant	\N	\N
1269	2	southeast-asian-restaurant	Southeast Asian Restaurant (fr)	Southeast Asian Restaurant (fr)	\N	\N
218	1	southern-italian-restaurant	Southern Italian Restaurant	Southern Italian Restaurant	\N	\N
218	2	southern-italian-restaurant	Southern Italian Restaurant (fr)	Southern Italian Restaurant (fr)	\N	\N
821	1	southern-restaurant-us	Southern Restaurant Us	Southern Restaurant Us	\N	\N
821	2	southern-restaurant-us	Southern Restaurant Us (fr)	Southern Restaurant Us (fr)	\N	\N
1100	1	souvenir-manufacturer	Souvenir Manufacturer	Souvenir Manufacturer	\N	\N
1100	2	souvenir-manufacturer	Souvenir Manufacturer (fr)	Souvenir Manufacturer (fr)	\N	\N
342	1	souvenir-store	Souvenir Store	Souvenir Store	\N	\N
342	2	souvenir-store	Souvenir Store (fr)	Souvenir Store (fr)	\N	\N
147	1	spa	Spa	Spa	\N	\N
147	2	spa	Spa (fr)	Spa (fr)	\N	\N
786	1	spa-and-health-club	Spa And Health Club	Spa And Health Club	\N	\N
786	2	spa-and-health-club	Spa And Health Club (fr)	Spa And Health Club (fr)	\N	\N
1730	1	spa-garden	Spa Garden	Spa Garden	\N	\N
1730	2	spa-garden	Spa Garden (fr)	Spa Garden (fr)	\N	\N
61	1	spanish-restaurant	Spanish Restaurant	Spanish Restaurant	\N	\N
61	2	spanish-restaurant	Spanish Restaurant (fr)	Spanish Restaurant (fr)	\N	\N
1568	1	spice-store	Spice Store	Spice Store	\N	\N
1568	2	spice-store	Spice Store (fr)	Spice Store (fr)	\N	\N
1783	1	sport-tour-agency	Sport Tour Agency	Sport Tour Agency	\N	\N
1783	2	sport-tour-agency	Sport Tour Agency (fr)	Sport Tour Agency (fr)	\N	\N
155	1	sports-bar	Sports Bar	Sports Bar	\N	\N
155	2	sports-bar	Sports Bar (fr)	Sports Bar (fr)	\N	\N
243	1	sports-club	Sports Club	Sports Club	\N	\N
243	2	sports-club	Sports Club (fr)	Sports Club (fr)	\N	\N
244	1	sports-complex	Sports Complex	Sports Complex	\N	\N
244	2	sports-complex	Sports Complex (fr)	Sports Complex (fr)	\N	\N
2179	1	sports-school	Sports School	Sports School	\N	\N
2179	2	sports-school	Sports School (fr)	Sports School (fr)	\N	\N
1737	1	squash-club	Squash Club	Squash Club	\N	\N
1737	2	squash-club	Squash Club (fr)	Squash Club (fr)	\N	\N
1738	1	squash-court	Squash Court	Squash Court	\N	\N
1738	2	squash-court	Squash Court (fr)	Squash Court (fr)	\N	\N
1701	1	sri-lankan-restaurant	Sri Lankan Restaurant	Sri Lankan Restaurant	\N	\N
1701	2	sri-lankan-restaurant	Sri Lankan Restaurant (fr)	Sri Lankan Restaurant (fr)	\N	\N
245	1	stadium	Stadium	Stadium	\N	\N
245	2	stadium	Stadium (fr)	Stadium (fr)	\N	\N
250	1	stage	Stage	Stage	\N	\N
250	2	stage	Stage (fr)	Stage (fr)	\N	\N
1347	1	stage-lighting-equipment-supplier	Stage Lighting Equipment Supplier	Stage Lighting Equipment Supplier	\N	\N
1347	2	stage-lighting-equipment-supplier	Stage Lighting Equipment Supplier (fr)	Stage Lighting Equipment Supplier (fr)	\N	\N
424	1	stand-bar	Stand Bar	Stand Bar	\N	\N
424	2	stand-bar	Stand Bar (fr)	Stand Bar (fr)	\N	\N
340	1	state-archive	State Archive	State Archive	\N	\N
340	2	state-archive	State Archive (fr)	State Archive (fr)	\N	\N
2189	1	state-government-office	State Government Office	State Government Office	\N	\N
2189	2	state-government-office	State Government Office (fr)	State Government Office (fr)	\N	\N
418	1	state-liquor-store	State Liquor Store	State Liquor Store	\N	\N
418	2	state-liquor-store	State Liquor Store (fr)	State Liquor Store (fr)	\N	\N
241	1	state-park	State Park	State Park	\N	\N
241	2	state-park	State Park (fr)	State Park (fr)	\N	\N
1792	1	stationery-store	Stationery Store	Stationery Store	\N	\N
1792	2	stationery-store	Stationery Store (fr)	Stationery Store (fr)	\N	\N
284	1	steak-house	Steak House	Steak House	\N	\N
284	2	steak-house	Steak House (fr)	Steak House (fr)	\N	\N
333	1	stock-exchange-building	Stock Exchange Building	Stock Exchange Building	\N	\N
333	2	stock-exchange-building	Stock Exchange Building (fr)	Stock Exchange Building (fr)	\N	\N
91	1	store	Store	Store	\N	\N
91	2	store	Store (fr)	Store (fr)	\N	\N
2347	1	student-union	Student Union	Student Union	\N	\N
2347	2	student-union	Student Union (fr)	Student Union (fr)	\N	\N
1159	1	studying-center	Studying Center	Studying Center	\N	\N
1159	2	studying-center	Studying Center (fr)	Studying Center (fr)	\N	\N
2506	1	summer-camp	Summer Camp	Summer Camp	\N	\N
2506	2	summer-camp	Summer Camp (fr)	Summer Camp (fr)	\N	\N
2256	1	summer-toboggan-run	Summer Toboggan Run	Summer Toboggan Run	\N	\N
2256	2	summer-toboggan-run	Summer Toboggan Run (fr)	Summer Toboggan Run (fr)	\N	\N
181	1	sundae-restaurant	Sundae Restaurant	Sundae Restaurant	\N	\N
181	2	sundae-restaurant	Sundae Restaurant (fr)	Sundae Restaurant (fr)	\N	\N
1040	1	super-public-bath	Super Public Bath	Super Public Bath	\N	\N
1040	2	super-public-bath	Super Public Bath (fr)	Super Public Bath (fr)	\N	\N
408	1	supermarket	Supermarket	Supermarket	\N	\N
408	2	supermarket	Supermarket (fr)	Supermarket (fr)	\N	\N
801	1	surf-school	Surf School	Surf School	\N	\N
801	2	surf-school	Surf School (fr)	Surf School (fr)	\N	\N
802	1	surf-shop	Surf Shop	Surf Shop	\N	\N
802	2	surf-shop	Surf Shop (fr)	Surf Shop (fr)	\N	\N
70	1	sushi-restaurant	Sushi Restaurant	Sushi Restaurant	\N	\N
70	2	sushi-restaurant	Sushi Restaurant (fr)	Sushi Restaurant (fr)	\N	\N
850	1	sushi-takeaway	Sushi Takeaway	Sushi Takeaway	\N	\N
850	2	sushi-takeaway	Sushi Takeaway (fr)	Sushi Takeaway (fr)	\N	\N
169	1	swedish-restaurant	Swedish Restaurant	Swedish Restaurant	\N	\N
169	2	swedish-restaurant	Swedish Restaurant (fr)	Swedish Restaurant (fr)	\N	\N
937	1	sweets-and-dessert-buffet	Sweets And Dessert Buffet	Sweets And Dessert Buffet	\N	\N
937	2	sweets-and-dessert-buffet	Sweets And Dessert Buffet (fr)	Sweets And Dessert Buffet (fr)	\N	\N
1337	1	swimming-facility	Swimming Facility	Swimming Facility	\N	\N
1337	2	swimming-facility	Swimming Facility (fr)	Swimming Facility (fr)	\N	\N
1333	1	swimming-instructor	Swimming Instructor	Swimming Instructor	\N	\N
1333	2	swimming-instructor	Swimming Instructor (fr)	Swimming Instructor (fr)	\N	\N
2418	1	swimming-lake	Swimming Lake	Swimming Lake	\N	\N
2418	2	swimming-lake	Swimming Lake (fr)	Swimming Lake (fr)	\N	\N
356	1	swimming-pool	Swimming Pool	Swimming Pool	\N	\N
356	2	swimming-pool	Swimming Pool (fr)	Swimming Pool (fr)	\N	\N
668	1	synagogue	Synagogue	Synagogue	\N	\N
668	2	synagogue	Synagogue (fr)	Synagogue (fr)	\N	\N
849	1	syrian-restaurant	Syrian Restaurant	Syrian Restaurant	\N	\N
849	2	syrian-restaurant	Syrian Restaurant (fr)	Syrian Restaurant (fr)	\N	\N
505	1	taco-restaurant	Taco Restaurant	Taco Restaurant	\N	\N
505	2	taco-restaurant	Taco Restaurant (fr)	Taco Restaurant (fr)	\N	\N
45	1	taiwanese-restaurant	Taiwanese Restaurant	Taiwanese Restaurant	\N	\N
45	2	taiwanese-restaurant	Taiwanese Restaurant (fr)	Taiwanese Restaurant (fr)	\N	\N
31	1	takeout-restaurant	Takeout Restaurant	Takeout Restaurant	\N	\N
31	2	takeout-restaurant	Takeout Restaurant (fr)	Takeout Restaurant (fr)	\N	\N
3312	1	takoyaki-restaurant	Takoyaki Restaurant	Takoyaki Restaurant	\N	\N
3312	2	takoyaki-restaurant	Takoyaki Restaurant (fr)	Takoyaki Restaurant (fr)	\N	\N
38	1	tapas-bar	Tapas Bar	Tapas Bar	\N	\N
38	2	tapas-bar	Tapas Bar (fr)	Tapas Bar (fr)	\N	\N
12	1	tapas-restaurant	Tapas Restaurant	Tapas Restaurant	\N	\N
12	2	tapas-restaurant	Tapas Restaurant (fr)	Tapas Restaurant (fr)	\N	\N
412	1	tattoo-and-piercing-shop	Tattoo And Piercing Shop	Tattoo And Piercing Shop	\N	\N
412	2	tattoo-and-piercing-shop	Tattoo And Piercing Shop (fr)	Tattoo And Piercing Shop (fr)	\N	\N
1290	1	tattoo-shop	Tattoo Shop	Tattoo Shop	\N	\N
1290	2	tattoo-shop	Tattoo Shop (fr)	Tattoo Shop (fr)	\N	\N
17	1	tea-house	Tea House	Tea House	\N	\N
17	2	tea-house	Tea House (fr)	Tea House (fr)	\N	\N
273	1	tea-store	Tea Store	Tea Store	\N	\N
273	2	tea-store	Tea Store (fr)	Tea Store (fr)	\N	\N
102	1	technology-museum	Technology Museum	Technology Museum	\N	\N
102	2	technology-museum	Technology Museum (fr)	Technology Museum (fr)	\N	\N
2464	1	tegal-restaurant	Tegal Restaurant	Tegal Restaurant	\N	\N
2464	2	tegal-restaurant	Tegal Restaurant (fr)	Tegal Restaurant (fr)	\N	\N
2295	1	television-station	Television Station	Television Station	\N	\N
2295	2	television-station	Television Station (fr)	Television Station (fr)	\N	\N
3319	1	temaki-restaurant	Temaki Restaurant	Temaki Restaurant	\N	\N
3319	2	temaki-restaurant	Temaki Restaurant (fr)	Temaki Restaurant (fr)	\N	\N
2993	1	tempura-restaurant	Tempura Restaurant	Tempura Restaurant	\N	\N
2993	2	tempura-restaurant	Tempura Restaurant (fr)	Tempura Restaurant (fr)	\N	\N
3060	1	tennis-court	Tennis Court	Tennis Court	\N	\N
3060	2	tennis-court	Tennis Court (fr)	Tennis Court (fr)	\N	\N
3308	1	teppanyaki-restaurant	Teppanyaki Restaurant	Teppanyaki Restaurant	\N	\N
3308	2	teppanyaki-restaurant	Teppanyaki Restaurant (fr)	Teppanyaki Restaurant (fr)	\N	\N
833	1	tex-mex-restaurant	Tex Mex Restaurant	Tex Mex Restaurant	\N	\N
833	2	tex-mex-restaurant	Tex Mex Restaurant (fr)	Tex Mex Restaurant (fr)	\N	\N
392	1	thai-restaurant	Thai Restaurant	Thai Restaurant	\N	\N
392	2	thai-restaurant	Thai Restaurant (fr)	Thai Restaurant (fr)	\N	\N
692	1	theater-company	Theater Company	Theater Company	\N	\N
692	2	theater-company	Theater Company (fr)	Theater Company (fr)	\N	\N
419	1	theater-production	Theater Production	Theater Production	\N	\N
419	2	theater-production	Theater Production (fr)	Theater Production (fr)	\N	\N
429	1	theme-park	Theme Park	Theme Park	\N	\N
429	2	theme-park	Theme Park (fr)	Theme Park (fr)	\N	\N
3083	1	tibetan-restaurant	Tibetan Restaurant	Tibetan Restaurant	\N	\N
3083	2	tibetan-restaurant	Tibetan Restaurant (fr)	Tibetan Restaurant (fr)	\N	\N
526	1	tiki-bar	Tiki Bar	Tiki Bar	\N	\N
526	2	tiki-bar	Tiki Bar (fr)	Tiki Bar (fr)	\N	\N
712	1	tobacco-shop	Tobacco Shop	Tobacco Shop	\N	\N
712	2	tobacco-shop	Tobacco Shop (fr)	Tobacco Shop (fr)	\N	\N
89	1	tour-agency	Tour Agency	Tour Agency	\N	\N
89	2	tour-agency	Tour Agency (fr)	Tour Agency (fr)	\N	\N
396	1	tour-operator	Tour Operator	Tour Operator	\N	\N
396	2	tour-operator	Tour Operator (fr)	Tour Operator (fr)	\N	\N
40	1	tourist-attraction	Tourist Attraction	Tourist Attraction	\N	\N
40	2	tourist-attraction	Tourist Attraction (fr)	Tourist Attraction (fr)	\N	\N
1219	1	tourist-information-center	Tourist Information Center	Tourist Information Center	\N	\N
1219	2	tourist-information-center	Tourist Information Center (fr)	Tourist Information Center (fr)	\N	\N
1209	1	toy-library	Toy Library	Toy Library	\N	\N
1209	2	toy-library	Toy Library (fr)	Toy Library (fr)	\N	\N
1146	1	toy-museum	Toy Museum	Toy Museum	\N	\N
1146	2	toy-museum	Toy Museum (fr)	Toy Museum (fr)	\N	\N
1083	1	toy-store	Toy Store	Toy Store	\N	\N
1083	2	toy-store	Toy Store (fr)	Toy Store (fr)	\N	\N
2469	1	traditional-american-restaurant	Traditional American Restaurant	Traditional American Restaurant	\N	\N
2469	2	traditional-american-restaurant	Traditional American Restaurant (fr)	Traditional American Restaurant (fr)	\N	\N
423	1	traditional-restaurant	Traditional Restaurant	Traditional Restaurant	\N	\N
423	2	traditional-restaurant	Traditional Restaurant (fr)	Traditional Restaurant (fr)	\N	\N
903	1	traditional-teahouse	Traditional Teahouse	Traditional Teahouse	\N	\N
903	2	traditional-teahouse	Traditional Teahouse (fr)	Traditional Teahouse (fr)	\N	\N
3015	1	train-station	Train Station	Train Station	\N	\N
3015	2	train-station	Train Station (fr)	Train Station (fr)	\N	\N
259	1	training-centre	Training Centre	Training Centre	\N	\N
259	2	training-centre	Training Centre (fr)	Training Centre (fr)	\N	\N
1705	1	transportation-service	Transportation Service	Transportation Service	\N	\N
1705	2	transportation-service	Transportation Service (fr)	Transportation Service (fr)	\N	\N
397	1	travel-agency	Travel Agency	Travel Agency	\N	\N
397	2	travel-agency	Travel Agency (fr)	Travel Agency (fr)	\N	\N
710	1	travel-lounge	Travel Lounge	Travel Lounge	\N	\N
710	2	travel-lounge	Travel Lounge (fr)	Travel Lounge (fr)	\N	\N
853	1	tunisian-restaurant	Tunisian Restaurant	Tunisian Restaurant	\N	\N
853	2	tunisian-restaurant	Tunisian Restaurant (fr)	Tunisian Restaurant (fr)	\N	\N
836	1	turkish-restaurant	Turkish Restaurant	Turkish Restaurant	\N	\N
836	2	turkish-restaurant	Turkish Restaurant (fr)	Turkish Restaurant (fr)	\N	\N
554	1	tuscan-restaurant	Tuscan Restaurant	Tuscan Restaurant	\N	\N
554	2	tuscan-restaurant	Tuscan Restaurant (fr)	Tuscan Restaurant (fr)	\N	\N
2997	1	udon-noodle-restaurant	Udon Noodle Restaurant	Udon Noodle Restaurant	\N	\N
2997	2	udon-noodle-restaurant	Udon Noodle Restaurant (fr)	Udon Noodle Restaurant (fr)	\N	\N
857	1	ukrainian-restaurant	Ukrainian Restaurant	Ukrainian Restaurant	\N	\N
857	2	ukrainian-restaurant	Ukrainian Restaurant (fr)	Ukrainian Restaurant (fr)	\N	\N
779	1	university	University	University	\N	\N
779	2	university	University (fr)	University (fr)	\N	\N
2392	1	uruguayan-restaurant	Uruguayan Restaurant	Uruguayan Restaurant	\N	\N
2392	2	uruguayan-restaurant	Uruguayan Restaurant (fr)	Uruguayan Restaurant (fr)	\N	\N
1784	1	used-bicycle-shop	Used Bicycle Shop	Used Bicycle Shop	\N	\N
1784	2	used-bicycle-shop	Used Bicycle Shop (fr)	Used Bicycle Shop (fr)	\N	\N
1511	1	used-book-store	Used Book Store	Used Book Store	\N	\N
1511	2	used-book-store	Used Book Store (fr)	Used Book Store (fr)	\N	\N
1676	1	uzbeki-restaurant	Uzbeki Restaurant	Uzbeki Restaurant	\N	\N
1676	2	uzbeki-restaurant	Uzbeki Restaurant (fr)	Uzbeki Restaurant (fr)	\N	\N
2665	1	valencian-restaurant	Valencian Restaurant	Valencian Restaurant	\N	\N
2665	2	valencian-restaurant	Valencian Restaurant (fr)	Valencian Restaurant (fr)	\N	\N
713	1	vaporiser-shop	Vaporiser Shop	Vaporiser Shop	\N	\N
713	2	vaporiser-shop	Vaporiser Shop (fr)	Vaporiser Shop (fr)	\N	\N
714	1	vaporizer-store	Vaporizer Store	Vaporizer Store	\N	\N
714	2	vaporizer-store	Vaporizer Store (fr)	Vaporizer Store (fr)	\N	\N
18	1	vegan-restaurant	Vegan Restaurant	Vegan Restaurant	\N	\N
18	2	vegan-restaurant	Vegan Restaurant (fr)	Vegan Restaurant (fr)	\N	\N
9	1	vegetarian-cafe-and-deli	Vegetarian Cafe And Deli	Vegetarian Cafe And Deli	\N	\N
9	2	vegetarian-cafe-and-deli	Vegetarian Cafe And Deli (fr)	Vegetarian Cafe And Deli (fr)	\N	\N
19	1	vegetarian-restaurant	Vegetarian Restaurant	Vegetarian Restaurant	\N	\N
19	2	vegetarian-restaurant	Vegetarian Restaurant (fr)	Vegetarian Restaurant (fr)	\N	\N
2585	1	venetian-restaurant	Venetian Restaurant	Venetian Restaurant	\N	\N
2585	2	venetian-restaurant	Venetian Restaurant (fr)	Venetian Restaurant (fr)	\N	\N
521	1	venezuelan-restaurant	Venezuelan Restaurant	Venezuelan Restaurant	\N	\N
521	2	venezuelan-restaurant	Venezuelan Restaurant (fr)	Venezuelan Restaurant (fr)	\N	\N
311	1	video-arcade	Video Arcade	Video Arcade	\N	\N
311	2	video-arcade	Video Arcade (fr)	Video Arcade (fr)	\N	\N
2058	1	video-game-rental-store	Video Game Rental Store	Video Game Rental Store	\N	\N
2058	2	video-game-rental-store	Video Game Rental Store (fr)	Video Game Rental Store (fr)	\N	\N
2622	1	video-game-store	Video Game Store	Video Game Store	\N	\N
2622	2	video-game-store	Video Game Store (fr)	Video Game Store (fr)	\N	\N
216	1	video-karaoke	Video Karaoke	Video Karaoke	\N	\N
216	2	video-karaoke	Video Karaoke (fr)	Video Karaoke (fr)	\N	\N
1618	1	video-store	Video Store	Video Store	\N	\N
1618	2	video-store	Video Store (fr)	Video Store (fr)	\N	\N
301	1	vietnamese-restaurant	Vietnamese Restaurant	Vietnamese Restaurant	\N	\N
301	2	vietnamese-restaurant	Vietnamese Restaurant (fr)	Vietnamese Restaurant (fr)	\N	\N
725	2	villa	Villa (fr)	Villa (fr)	\N	\N
930	1	vineyard	Vineyard	Vineyard	\N	\N
930	2	vineyard	Vineyard (fr)	Vineyard (fr)	\N	\N
982	1	visitor-center	Visitor Center	Visitor Center	\N	\N
982	2	visitor-center	Visitor Center (fr)	Visitor Center (fr)	\N	\N
1804	1	volunteer-organization	Volunteer Organization	Volunteer Organization	\N	\N
1804	2	volunteer-organization	Volunteer Organization (fr)	Volunteer Organization (fr)	\N	\N
1351	1	walk-in-clinic	Walk In Clinic	Walk In Clinic	\N	\N
1351	2	walk-in-clinic	Walk In Clinic (fr)	Walk In Clinic (fr)	\N	\N
433	1	war-museum	War Museum	War Museum	\N	\N
433	2	war-museum	War Museum (fr)	War Museum (fr)	\N	\N
1221	1	water-park	Water Park	Water Park	\N	\N
1221	2	water-park	Water Park (fr)	Water Park (fr)	\N	\N
2419	1	water-ski-shop	Water Ski Shop	Water Ski Shop	\N	\N
2419	2	water-ski-shop	Water Ski Shop (fr)	Water Ski Shop (fr)	\N	\N
2420	1	water-skiing-instructor	Water Skiing Instructor	Water Skiing Instructor	\N	\N
2420	2	water-skiing-instructor	Water Skiing Instructor (fr)	Water Skiing Instructor (fr)	\N	\N
2421	1	water-skiing-service	Water Skiing Service	Water Skiing Service	\N	\N
2421	2	water-skiing-service	Water Skiing Service (fr)	Water Skiing Service (fr)	\N	\N
803	1	water-sports-equipment-rental-service	Water Sports Equipment Rental Service	Water Sports Equipment Rental Service	\N	\N
803	2	water-sports-equipment-rental-service	Water Sports Equipment Rental Service (fr)	Water Sports Equipment Rental Service (fr)	\N	\N
1771	1	water-works	Water Works	Water Works	\N	\N
1771	2	water-works	Water Works (fr)	Water Works (fr)	\N	\N
107	1	wax-museum	Wax Museum	Wax Museum	\N	\N
107	2	wax-museum	Wax Museum (fr)	Wax Museum (fr)	\N	\N
315	1	wedding-bakery	Wedding Bakery	Wedding Bakery	\N	\N
315	2	wedding-bakery	Wedding Bakery (fr)	Wedding Bakery (fr)	\N	\N
757	1	wedding-buffet	Wedding Buffet	Wedding Buffet	\N	\N
757	2	wedding-buffet	Wedding Buffet (fr)	Wedding Buffet (fr)	\N	\N
3033	1	wedding-chapel	Wedding Chapel	Wedding Chapel	\N	\N
3033	2	wedding-chapel	Wedding Chapel (fr)	Wedding Chapel (fr)	\N	\N
1726	1	wedding-photographer	Wedding Photographer	Wedding Photographer	\N	\N
1726	2	wedding-photographer	Wedding Photographer (fr)	Wedding Photographer (fr)	\N	\N
417	1	wedding-planner	Wedding Planner	Wedding Planner	\N	\N
417	2	wedding-planner	Wedding Planner (fr)	Wedding Planner (fr)	\N	\N
234	1	wedding-service	Wedding Service	Wedding Service	\N	\N
234	2	wedding-service	Wedding Service (fr)	Wedding Service (fr)	\N	\N
144	1	wedding-venue	Wedding Venue	Wedding Venue	\N	\N
144	2	wedding-venue	Wedding Venue (fr)	Wedding Venue (fr)	\N	\N
706	1	weightlifting-area	Weightlifting Area	Weightlifting Area	\N	\N
706	2	weightlifting-area	Weightlifting Area (fr)	Weightlifting Area (fr)	\N	\N
379	1	wellness-center	Wellness Center	Wellness Center	\N	\N
379	2	wellness-center	Wellness Center (fr)	Wellness Center (fr)	\N	\N
226	1	wellness-hotel	Wellness Hotel	Wellness Hotel	\N	\N
226	2	wellness-hotel	Wellness Hotel (fr)	Wellness Hotel (fr)	\N	\N
3017	1	west-african-restaurant	West African Restaurant	West African Restaurant	\N	\N
3017	2	west-african-restaurant	West African Restaurant (fr)	West African Restaurant (fr)	\N	\N
281	1	western-restaurant	Western Restaurant	Western Restaurant	\N	\N
281	2	western-restaurant	Western Restaurant (fr)	Western Restaurant (fr)	\N	\N
2728	1	whale-watching-tour-agency	Whale Watching Tour Agency	Whale Watching Tour Agency	\N	\N
2728	2	whale-watching-tour-agency	Whale Watching Tour Agency (fr)	Whale Watching Tour Agency (fr)	\N	\N
413	1	wholesale-jeweler	Wholesale Jeweler	Wholesale Jeweler	\N	\N
413	2	wholesale-jeweler	Wholesale Jeweler (fr)	Wholesale Jeweler (fr)	\N	\N
632	1	wholesale-plant-nursery	Wholesale Plant Nursery	Wholesale Plant Nursery	\N	\N
632	2	wholesale-plant-nursery	Wholesale Plant Nursery (fr)	Wholesale Plant Nursery (fr)	\N	\N
1592	1	wildlife-and-safari-park	Wildlife And Safari Park	Wildlife And Safari Park	\N	\N
1592	2	wildlife-and-safari-park	Wildlife And Safari Park (fr)	Wildlife And Safari Park (fr)	\N	\N
681	1	wildlife-park	Wildlife Park	Wildlife Park	\N	\N
681	2	wildlife-park	Wildlife Park (fr)	Wildlife Park (fr)	\N	\N
1226	1	wildlife-refuge	Wildlife Refuge	Wildlife Refuge	\N	\N
1226	2	wildlife-refuge	Wildlife Refuge (fr)	Wildlife Refuge (fr)	\N	\N
2892	1	wildlife-rescue-service	Wildlife Rescue Service	Wildlife Rescue Service	\N	\N
2892	2	wildlife-rescue-service	Wildlife Rescue Service (fr)	Wildlife Rescue Service (fr)	\N	\N
20	1	wine-bar	Wine Bar	Wine Bar	\N	\N
20	2	wine-bar	Wine Bar (fr)	Wine Bar (fr)	\N	\N
195	1	wine-cellar	Wine Cellar	Wine Cellar	\N	\N
195	2	wine-cellar	Wine Cellar (fr)	Wine Cellar (fr)	\N	\N
425	1	wine-club	Wine Club	Wine Club	\N	\N
425	2	wine-club	Wine Club (fr)	Wine Club (fr)	\N	\N
807	1	wine-storage-facility	Wine Storage Facility	Wine Storage Facility	\N	\N
807	2	wine-storage-facility	Wine Storage Facility (fr)	Wine Storage Facility (fr)	\N	\N
159	1	wine-store	Wine Store	Wine Store	\N	\N
159	2	wine-store	Wine Store (fr)	Wine Store (fr)	\N	\N
1286	1	wine-wholesaler-and-importer	Wine Wholesaler And Importer	Wine Wholesaler And Importer	\N	\N
1286	2	wine-wholesaler-and-importer	Wine Wholesaler And Importer (fr)	Wine Wholesaler And Importer (fr)	\N	\N
376	1	winery	Winery	Winery	\N	\N
376	2	winery	Winery (fr)	Winery (fr)	\N	\N
1693	1	wok-restaurant	Wok Restaurant	Wok Restaurant	\N	\N
1693	2	wok-restaurant	Wok Restaurant (fr)	Wok Restaurant (fr)	\N	\N
1316	1	womens-clothing-store	Womens Clothing Store	Womens Clothing Store	\N	\N
1316	2	womens-clothing-store	Womens Clothing Store (fr)	Womens Clothing Store (fr)	\N	\N
119	1	yakitori-restaurant	Yakitori Restaurant	Yakitori Restaurant	\N	\N
119	2	yakitori-restaurant	Yakitori Restaurant (fr)	Yakitori Restaurant (fr)	\N	\N
3175	1	yemenite-restaurant	Yemenite Restaurant	Yemenite Restaurant	\N	\N
3175	2	yemenite-restaurant	Yemenite Restaurant (fr)	Yemenite Restaurant (fr)	\N	\N
1654	1	yoga-instructor	Yoga Instructor	Yoga Instructor	\N	\N
1654	2	yoga-instructor	Yoga Instructor (fr)	Yoga Instructor (fr)	\N	\N
151	1	yoga-studio	Yoga Studio	Yoga Studio	\N	\N
151	2	yoga-studio	Yoga Studio (fr)	Yoga Studio (fr)	\N	\N
3070	1	youth-center	Youth Center	Youth Center	\N	\N
3070	2	youth-center	Youth Center (fr)	Youth Center (fr)	\N	\N
351	1	youth-hostel	Youth Hostel	Youth Hostel	\N	\N
351	2	youth-hostel	Youth Hostel (fr)	Youth Hostel (fr)	\N	\N
101	1	zoo	Zoo	Zoo	\N	\N
101	2	zoo	Zoo (fr)	Zoo (fr)	\N	\N
\.


--
-- Data for Name: tx_category_city_lang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_category_city_lang (category_id, city_id, language_id, name, description, meta_description, title) FROM stdin;
\.


--
-- Data for Name: tx_city; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_city (city_id, language_id, slug, name, description, meta_description) FROM stdin;
1	1	amsterdam	Amsterdam	Amsterdam, capital of the Netherlands, seduces with its picturesque canals, narrow houses, world-famous museums and laid-back atmosphere, making it a must-see destination in Europe.	Amsterdam, capital of the Netherlands, seduces with its picturesque canals, narrow houses, world-famous museums and laid-back atmosphere, making it a must-see destination in Europe.
1	2	amsterdam	Amsterdam	Amsterdam, capitale des Pays-Bas, s├⌐duit par ses canaux pittoresques, ses maisons ├⌐troites, ses mus├⌐es mondialement connus et son atmosph├¿re d├⌐contract├⌐e, en faisant une destination incontournable en Europe.	Amsterdam, capitale des Pays-Bas, s├⌐duit par ses canaux pittoresques, ses maisons ├⌐troites, ses mus├⌐es mondialement connus et son atmosph├¿re d├⌐contract├⌐e, en faisant une destination incontournable en Europe.
2	1	antwerp	Antwerp	Antwerp, a cosmopolitan Belgian city, enchants with its Flemish architecture, sparkling diamonds, bustling port, vibrant art scene and avant-garde fashion.	Antwerp, a cosmopolitan Belgian city, enchants with its Flemish architecture, sparkling diamonds, bustling port, vibrant art scene and avant-garde fashion.
2	2	anvers	Anvers	Anvers, ville belge cosmopolite, enchante par son architecture flamande, ses diamants ├⌐tincelants, son port anim├⌐, sa sc├¿ne artistique dynamique et sa mode avant-gardiste.	Anvers, ville belge cosmopolite, enchante par son architecture flamande, ses diamants ├⌐tincelants, son port anim├⌐, sa sc├¿ne artistique dynamique et sa mode avant-gardiste.
3	1	athens	Athens	Athens, ancient and modern Greek capital, is renowned for its legendary archaeological sites such as the Acropolis and the Parthenon, as well as for its rich cultural and artistic history.	Athens, ancient and modern Greek capital, is renowned for its legendary archaeological sites such as the Acropolis and the Parthenon, as well as for its rich cultural and artistic history.
3	2	athenes	Ath├¿nes	Ath├¿nes, capitale grecque ancienne et moderne, est r├⌐put├⌐e pour ses sites arch├⌐ologiques l├⌐gendaires tels que l\\'Acropole et le Parth├⌐non, ainsi que pour sa riche histoire culturelle et artistique.	Ath├¿nes, capitale grecque ancienne et moderne, est r├⌐put├⌐e pour ses sites arch├⌐ologiques l├⌐gendaires tels que l\\'Acropole et le Parth├⌐non, ainsi que pour sa riche histoire culturelle et artistique.
4	1	barcelona	Barcelona	Barcelona, a vibrant Spanish city, captivates with its modernist architecture, famous Sagrada Fam├¡lia basilica, sunny beaches and vibrant art scene.	Barcelona, a vibrant Spanish city, captivates with its modernist architecture, famous Sagrada Fam├¡lia basilica, sunny beaches and vibrant art scene.
4	2	barcelone	Barcelone	Barcelone, ville espagnole vibrante, captive par son architecture moderniste, sa c├⌐l├¿bre basilique de la Sagrada Fam├¡lia, ses plages ensoleill├⌐es et sa sc├¿ne artistique dynamique.	Barcelone, ville espagnole vibrante, captive par son architecture moderniste, sa c├⌐l├¿bre basilique de la Sagrada Fam├¡lia, ses plages ensoleill├⌐es et sa sc├¿ne artistique dynamique.
5	1	berlin	Berlin	Berlin, the German capital, fascinates with its tumultuous history, its vibrant art scene, its emblematic sites such as the Berlin Wall and Brandenburg, and its cosmopolitan atmosphere.	Berlin, the German capital, fascinates with its tumultuous history, its vibrant art scene, its emblematic sites such as the Berlin Wall and Brandenburg, and its cosmopolitan atmosphere.
5	2	berlin	Berlin	Berlin, capitale allemande, fascine par son histoire tumultueuse, sa sc├¿ne artistique vibrante, ses sites embl├⌐matiques tels que le Mur de Berlin et le Brandebourg, et son ambiance cosmopolite.	Berlin, capitale allemande, fascine par son histoire tumultueuse, sa sc├¿ne artistique vibrante, ses sites embl├⌐matiques tels que le Mur de Berlin et le Brandebourg, et son ambiance cosmopolite.
6	1	bordeaux	Bordeaux	Bordeaux, a French city in the heart of the vineyards, is famous for its prestigious wines, its elegant architecture, its refined gastronomy and its charming atmosphere, making it an essential destination for wine lovers.	Bordeaux, a French city in the heart of the vineyards, is famous for its prestigious wines, its elegant architecture, its refined gastronomy and its charming atmosphere, making it an essential destination for wine lovers.
6	2	bordeaux	Bordeaux	Bordeaux, ville fran├ºaise au c┼ôur des vignobles, est c├⌐l├¿bre pour ses vins prestigieux, son architecture ├⌐l├⌐gante, sa gastronomie raffin├⌐e et son ambiance charmante, en faisant une destination incontournable pour les amateurs de vin.	Bordeaux, ville fran├ºaise au c┼ôur des vignobles, est c├⌐l├¿bre pour ses vins prestigieux, son architecture ├⌐l├⌐gante, sa gastronomie raffin├⌐e et son ambiance charmante, en faisant une destination incontournable pour les amateurs de vin.
7	1	brussels	Brussels	Brussels, the Belgian capital, seduces with its harmonious blend of culture, history and gastronomy. Known for its famous chocolates, craft beers and remarkable architecture, it offers an unforgettable European experience.	Brussels, the Belgian capital, seduces with its harmonious blend of culture, history and gastronomy. Known for its famous chocolates, craft beers and remarkable architecture, it offers an unforgettable European experience.
7	2	bruxelles	Bruxelles	Bruxelles, capitale belge, s├⌐duit par son m├⌐lange harmonieux de culture, d\\'histoire et de gastronomie. Connue pour ses c├⌐l├¿bres chocolats, ses bi├¿res artisanales et son architecture remarquable, elle offre une exp├⌐rience europ├⌐enne inoubliable.	Bruxelles, capitale belge, s├⌐duit par son m├⌐lange harmonieux de culture, d\\'histoire et de gastronomie. Connue pour ses c├⌐l├¿bres chocolats, ses bi├¿res artisanales et son architecture remarquable, elle offre une exp├⌐rience europ├⌐enne inoubliable.
8	1	bucharest	Bucharest	Bucharest, the fascinating Romanian capital, captivates with its eclectic architecture, impressive boulevards, rich cultural heritage and effervescent energy.	Bucharest, the fascinating Romanian capital, captivates with its eclectic architecture, impressive boulevards, rich cultural heritage and effervescent energy.
8	2	bucarest	Bucarest	Bucarest, capitale roumaine fascinante, captive par son architecture ├⌐clectique, ses boulevards impressionnants, son riche h├⌐ritage culturel et son ├⌐nergie effervescente.	Bucarest, capitale roumaine fascinante, captive par son architecture ├⌐clectique, ses boulevards impressionnants, son riche h├⌐ritage culturel et son ├⌐nergie effervescente.
9	1	budapest	Budapest	Budapest, the bewitching capital of Hungary, enchants with its famous thermal baths, grand architecture, iconic bridges and romantic atmosphere by the Danube.	Budapest, the bewitching capital of Hungary, enchants with its famous thermal baths, grand architecture, iconic bridges and romantic atmosphere by the Danube.
9	2	budapest	Budapest	Budapest, capitale hongroise envo├╗tante, enchante par ses bains thermaux c├⌐l├¿bres, son architecture grandiose, ses ponts embl├⌐matiques et son atmosph├¿re romantique au bord du Danube.	Budapest, capitale hongroise envo├╗tante, enchante par ses bains thermaux c├⌐l├¿bres, son architecture grandiose, ses ponts embl├⌐matiques et son atmosph├¿re romantique au bord du Danube.
10	1	cluj-napoca	Cluj-Napoca	Cluj-Napoca, a lively Romanian city, seduces with its student atmosphere, its artistic festivals, its preserved historic center and its bubbling cultural scene.	Cluj-Napoca, a lively Romanian city, seduces with its student atmosphere, its artistic festivals, its preserved historic center and its bubbling cultural scene.
10	2	cluj-napoca	Cluj-Napoca	Cluj-Napoca, ville roumaine anim├⌐e, s├⌐duit par son atmosph├¿re ├⌐tudiante, ses festivals artistiques, son centre historique pr├⌐serv├⌐ et sa sc├¿ne culturelle bouillonnante.	Cluj-Napoca, ville roumaine anim├⌐e, s├⌐duit par son atmosph├¿re ├⌐tudiante, ses festivals artistiques, son centre historique pr├⌐serv├⌐ et sa sc├¿ne culturelle bouillonnante.
11	1	copenhagen	Copenhagen	Copenhagen, a charming Danish capital, captivates with its Scandinavian design, lively cycle paths, famous Little Mermaid, picturesque canals and hygge lifestyle.	Copenhagen, a charming Danish capital, captivates with its Scandinavian design, lively cycle paths, famous Little Mermaid, picturesque canals and hygge lifestyle.
11	2	copenhague	Copenhague	Copenhague, capitale danoise charmante, captive par son design scandinave, ses pistes cyclables anim├⌐es, sa c├⌐l├¿bre Petite Sir├¿ne, ses canaux pittoresques et son art de vivre hygge.	Copenhague, capitale danoise charmante, captive par son design scandinave, ses pistes cyclables anim├⌐es, sa c├⌐l├¿bre Petite Sir├¿ne, ses canaux pittoresques et son art de vivre hygge.
12	1	krakow	Krakow	Krakow, a historic Polish city, enchants with its medieval charm, beautiful city center, famous Market Square, castles and rich cultural heritage.	Krakow, a historic Polish city, enchants with its medieval charm, beautiful city center, famous Market Square, castles and rich cultural heritage.
12	2	cracovie	Cracovie	Cracovie, ville polonaise historique, enchante par son charme m├⌐di├⌐val, son magnifique centre-ville, sa c├⌐l├¿bre place du march├⌐, ses ch├óteaux et son riche patrimoine culturel.	Cracovie, ville polonaise historique, enchante par son charme m├⌐di├⌐val, son magnifique centre-ville, sa c├⌐l├¿bre place du march├⌐, ses ch├óteaux et son riche patrimoine culturel.
13	1	dublin	Dublin	Dublin, Ireland\\'s bustling capital, enchants with its literary heritage, friendly pubs, captivating museums, Georgian architecture and warm hospitality, offering a unique cultural experience.	Dublin, Ireland\\'s bustling capital, enchants with its literary heritage, friendly pubs, captivating museums, Georgian architecture and warm hospitality, offering a unique cultural experience.
13	2	dublin	Dublin	Dublin, capitale irlandaise anim├⌐e, enchante par son h├⌐ritage litt├⌐raire, ses pubs conviviaux, ses mus├⌐es captivants, son architecture g├⌐orgienne et son accueil chaleureux, offrant une exp├⌐rience culturelle unique.	Dublin, capitale irlandaise anim├⌐e, enchante par son h├⌐ritage litt├⌐raire, ses pubs conviviaux, ses mus├⌐es captivants, son architecture g├⌐orgienne et son accueil chaleureux, offrant une exp├⌐rience culturelle unique.
14	1	dubrovnik	Dubrovnik	Dubrovnik, a bewitching Croatian city, seduces with its medieval ramparts, its cobbled streets, its Baroque architecture, its magnificent beaches and its enchanting Mediterranean atmosphere.	Dubrovnik, a bewitching Croatian city, seduces with its medieval ramparts, its cobbled streets, its Baroque architecture, its magnificent beaches and its enchanting Mediterranean atmosphere.
14	2	dubrovnik	Dubrovnik	Dubrovnik, ville croate envo├╗tante, s├⌐duit par ses remparts m├⌐di├⌐vaux, ses ruelles pav├⌐es, son architecture baroque, ses magnifiques plages et son ambiance m├⌐diterran├⌐enne enchanteresse.	Dubrovnik, ville croate envo├╗tante, s├⌐duit par ses remparts m├⌐di├⌐vaux, ses ruelles pav├⌐es, son architecture baroque, ses magnifiques plages et son ambiance m├⌐diterran├⌐enne enchanteresse.
15	1	florence	Florence	Florence, Italy\\'s birthplace of the Renaissance, enchants with its artistic masterpieces, elegant architecture, iconic cathedral and romantic atmosphere steeped in history and culture.	Florence, Italy\\'s birthplace of the Renaissance, enchants with its artistic masterpieces, elegant architecture, iconic cathedral and romantic atmosphere steeped in history and culture.
15	2	florence	Florence	Florence, ville italienne berceau de la Renaissance, enchante par ses chefs-d\\'┼ôuvre artistiques, son architecture ├⌐l├⌐gante, sa cath├⌐drale embl├⌐matique et son atmosph├¿re romantique impr├⌐gn├⌐e d\\'histoire et de culture.	Florence, ville italienne berceau de la Renaissance, enchante par ses chefs-d\\'┼ôuvre artistiques, son architecture ├⌐l├⌐gante, sa cath├⌐drale embl├⌐matique et son atmosph├¿re romantique impr├⌐gn├⌐e d\\'histoire et de culture.
16	1	gdansk	Gdansk	Gda┼äsk, a historic Polish city, enchants with its Hanseatic architecture, cobbled streets, bustling waterfront, rich maritime past and vibrant maritime culture.	Gda┼äsk, a historic Polish city, enchants with its Hanseatic architecture, cobbled streets, bustling waterfront, rich maritime past and vibrant maritime culture.
16	2	gdansk	Gda┼äsk	Gda┼äsk, ville polonaise historique, enchante par son architecture hans├⌐atique, ses rues pav├⌐es, son front de mer anim├⌐, son riche pass├⌐ maritime et sa culture maritime vibrante.	Gda┼äsk, ville polonaise historique, enchante par son architecture hans├⌐atique, ses rues pav├⌐es, son front de mer anim├⌐, son riche pass├⌐ maritime et sa culture maritime vibrante.
17	1	hamburg	Hamburg	Hamburg, a German port city, fascinates with its maritime atmosphere, picturesque canals, historic architecture, generous green spaces and vibrant music scene.	Hamburg, a German port city, fascinates with its maritime atmosphere, picturesque canals, historic architecture, generous green spaces and vibrant music scene.
17	2	hambourg	Hambourg	Hambourg, ville portuaire allemande, fascine par son atmosph├¿re maritime, ses canaux pittoresques, son architecture historique, ses espaces verts g├⌐n├⌐reux et sa sc├¿ne musicale dynamique.	Hambourg, ville portuaire allemande, fascine par son atmosph├¿re maritime, ses canaux pittoresques, son architecture historique, ses espaces verts g├⌐n├⌐reux et sa sc├¿ne musicale dynamique.
18	1	lille	Lille	Lille, a dynamic French city, charms with its Flemish architecture, its cobbled streets, its lively cultural scene, its delicious culinary specialties and its warm welcome.	Lille, a dynamic French city, charms with its Flemish architecture, its cobbled streets, its lively cultural scene, its delicious culinary specialties and its warm welcome.
18	2	lille	Lille	Lille, ville fran├ºaise dynamique, charme par son architecture flamande, ses ruelles pav├⌐es, sa sc├¿ne culturelle anim├⌐e, ses d├⌐licieuses sp├⌐cialit├⌐s culinaires et son accueil chaleureux.	Lille, ville fran├ºaise dynamique, charme par son architecture flamande, ses ruelles pav├⌐es, sa sc├¿ne culturelle anim├⌐e, ses d├⌐licieuses sp├⌐cialit├⌐s culinaires et son accueil chaleureux.
19	1	lisbon	Lisbon	Lisbon, the captivating Portuguese capital, seduces with its colorful hills, its cobbled streets, its bohemian atmosphere, its delicious pasteis de nata and its breathtaking views of the Tagus.	Lisbon, the captivating Portuguese capital, seduces with its colorful hills, its cobbled streets, its bohemian atmosphere, its delicious pasteis de nata and its breathtaking views of the Tagus.
19	2	lisbonne	Lisbonne	Lisbonne, capitale portugaise envo├╗tante, s├⌐duit par ses collines color├⌐es, ses rues pav├⌐es, son ambiance boh├¿me, ses d├⌐licieux pasteis de nata et ses vues imprenables sur le Tage.	Lisbonne, capitale portugaise envo├╗tante, s├⌐duit par ses collines color├⌐es, ses rues pav├⌐es, son ambiance boh├¿me, ses d├⌐licieux pasteis de nata et ses vues imprenables sur le Tage.
20	1	london	London	London, the fascinating British capital, seduces with its eclectic mix of culture, history and modernity, its emblematic monuments, its renowned theaters and its unrivaled cosmopolitan atmosphere.	London, the fascinating British capital, seduces with its eclectic mix of culture, history and modernity, its emblematic monuments, its renowned theaters and its unrivaled cosmopolitan atmosphere.
20	2	londres	Londres	Londres, capitale britannique fascinante, s├⌐duit par son m├⌐lange ├⌐clectique de culture, d\\'histoire et de modernit├⌐, ses embl├⌐matiques monuments, ses th├⌐├ótres renomm├⌐s et son ambiance cosmopolite in├⌐gal├⌐e.	Londres, capitale britannique fascinante, s├⌐duit par son m├⌐lange ├⌐clectique de culture, d\\'histoire et de modernit├⌐, ses embl├⌐matiques monuments, ses th├⌐├ótres renomm├⌐s et son ambiance cosmopolite in├⌐gal├⌐e.
21	1	lyon	Lyon	Lyon, a historic French city, fascinates with its harmonious blend of history and modernity, its renowned cuisine, its picturesque neighborhoods and its architectural beauty, notably the Basilique de Fourvi├¿re.	Lyon, a historic French city, fascinates with its harmonious blend of history and modernity, its renowned cuisine, its picturesque neighborhoods and its architectural beauty, notably the Basilique de Fourvi├¿re.
21	2	lyon	Lyon	Lyon, ville fran├ºaise historique, fascine par son m├⌐lange harmonieux d\\'histoire et de modernit├⌐, sa cuisine renomm├⌐e, ses quartiers pittoresques et sa beaut├⌐ architecturale, notamment la Basilique de Fourvi├¿re.	Lyon, ville fran├ºaise historique, fascine par son m├⌐lange harmonieux d\\'histoire et de modernit├⌐, sa cuisine renomm├⌐e, ses quartiers pittoresques et sa beaut├⌐ architecturale, notamment la Basilique de Fourvi├¿re.
22	1	madrid	Madrid	Madrid, the bustling capital of Spain, is renowned for its art, nightlife, world-class museums and impressive architecture, including the Royal Palace and Plaza Mayor.	Madrid, the bustling capital of Spain, is renowned for its art, nightlife, world-class museums and impressive architecture, including the Royal Palace and Plaza Mayor.
22	2	madrid	Madrid	Madrid, capitale anim├⌐e de l\\'Espagne, est r├⌐put├⌐e pour son art, sa vie nocturne, ses mus├⌐es de renomm├⌐e mondiale et son architecture impressionnante, dont le Palais Royal et la Plaza Mayor.	Madrid, capitale anim├⌐e de l\\'Espagne, est r├⌐put├⌐e pour son art, sa vie nocturne, ses mus├⌐es de renomm├⌐e mondiale et son architecture impressionnante, dont le Palais Royal et la Plaza Mayor.
23	1	marseille	Marseille	Marseille, a Mediterranean port city, seduces with its vibrant mix of cultures, sunny beaches, tasty cuisine, picturesque neighborhoods and rich historical heritage.	Marseille, a Mediterranean port city, seduces with its vibrant mix of cultures, sunny beaches, tasty cuisine, picturesque neighborhoods and rich historical heritage.
23	2	marseille	Marseille	Marseille, ville portuaire m├⌐diterran├⌐enne, s├⌐duit par son m├⌐lange vibrant de cultures, ses plages ensoleill├⌐es, sa cuisine savoureuse, ses quartiers pittoresques et son riche patrimoine historique.	Marseille, ville portuaire m├⌐diterran├⌐enne, s├⌐duit par son m├⌐lange vibrant de cultures, ses plages ensoleill├⌐es, sa cuisine savoureuse, ses quartiers pittoresques et son riche patrimoine historique.
24	1	milan	Milan	Milan, an elegant and cosmopolitan Italian city, is famous for its fashion, impressive architecture, renowned art museums and vibrant art scene, making it an unmissable cultural hub.	Milan, an elegant and cosmopolitan Italian city, is famous for its fashion, impressive architecture, renowned art museums and vibrant art scene, making it an unmissable cultural hub.
24	2	milan	Milan	Milan, ville italienne ├⌐l├⌐gante et cosmopolite, est c├⌐l├¿bre pour sa mode, son architecture impressionnante, ses mus├⌐es d\\'art renomm├⌐s et sa sc├¿ne artistique vibrante, en faisant un centre culturel incontournable.	Milan, ville italienne ├⌐l├⌐gante et cosmopolite, est c├⌐l├¿bre pour sa mode, son architecture impressionnante, ses mus├⌐es d\\'art renomm├⌐s et sa sc├¿ne artistique vibrante, en faisant un centre culturel incontournable.
25	1	munich	Munich	Munich, a vibrant German city, is known for its Oktoberfest, Bavarian architecture, leafy parks, fascinating history and thriving arts scene.	Munich, a vibrant German city, is known for its Oktoberfest, Bavarian architecture, leafy parks, fascinating history and thriving arts scene.
25	2	munich	Munich	Munich, ville allemande dynamique, est connue pour sa f├¬te de la bi├¿re, son architecture bavaroise, ses parcs verdoyants, son histoire fascinante et sa sc├¿ne artistique florissante.	Munich, ville allemande dynamique, est connue pour sa f├¬te de la bi├¿re, son architecture bavaroise, ses parcs verdoyants, son histoire fascinante et sa sc├¿ne artistique florissante.
26	1	nantes	Nantes	Nantes, a creative French city, enchants with its historical heritage, its charming medieval streets, its bohemian way of life, its banks of the Loire and its vibrant cultural atmosphere.	Nantes, a creative French city, enchants with its historical heritage, its charming medieval streets, its bohemian way of life, its banks of the Loire and its vibrant cultural atmosphere.
26	2	nantes	Nantes	Nantes, ville fran├ºaise cr├⌐ative, enchante par son h├⌐ritage historique, ses charmantes ruelles m├⌐di├⌐vales, son art de vivre boh├¿me, ses bords de Loire et son atmosph├¿re culturelle vibrante.	Nantes, ville fran├ºaise cr├⌐ative, enchante par son h├⌐ritage historique, ses charmantes ruelles m├⌐di├⌐vales, son art de vivre boh├¿me, ses bords de Loire et son atmosph├¿re culturelle vibrante.
27	1	naples	Naples	Naples, an authentic Italian city, charms with its historical heritage, its lively streets, its delicious pizza, its lively folklore and its proximity to the archaeological sites of Pompeii and Herculaneum.	Naples, an authentic Italian city, charms with its historical heritage, its lively streets, its delicious pizza, its lively folklore and its proximity to the archaeological sites of Pompeii and Herculaneum.
27	2	naples	Naples	Naples, ville italienne authentique, charme par son patrimoine historique, ses ruelles anim├⌐es, sa pizza d├⌐licieuse, son folklore vivant et sa proximit├⌐ avec les sites arch├⌐ologiques de Pomp├⌐i et d\\'Herculanum.	Naples, ville italienne authentique, charme par son patrimoine historique, ses ruelles anim├⌐es, sa pizza d├⌐licieuse, son folklore vivant et sa proximit├⌐ avec les sites arch├⌐ologiques de Pomp├⌐i et d\\'Herculanum.
28	1	nice	Nice	Nice, a sunny French city, enchants with its Promenade des Anglais, its sandy beaches, its Mediterranean atmosphere, its colorful old town and its relaxed way of life.	Nice, a sunny French city, enchants with its Promenade des Anglais, its sandy beaches, its Mediterranean atmosphere, its colorful old town and its relaxed way of life.
28	2	nice	Nice	Nice, ville fran├ºaise ensoleill├⌐e, enchante par sa promenade des Anglais, ses plages de sable, son ambiance m├⌐diterran├⌐enne, sa vieille ville color├⌐e et son art de vivre d├⌐tendu.	Nice, ville fran├ºaise ensoleill├⌐e, enchante par sa promenade des Anglais, ses plages de sable, son ambiance m├⌐diterran├⌐enne, sa vieille ville color├⌐e et son art de vivre d├⌐tendu.
29	1	paris	Paris	Paris, the capital of France, is renowned for its timeless beauty, iconic landmarks such as the Eiffel Tower, elegant boulevards and renowned art, food and fashion.	Paris, the capital of France, is renowned for its timeless beauty, iconic landmarks such as the Eiffel Tower, elegant boulevards and renowned art, food and fashion.
29	2	paris	Paris	Paris, capitale fran├ºaise, est r├⌐put├⌐e pour sa beaut├⌐ intemporelle, ses monuments embl├⌐matiques tels que la Tour Eiffel, ses boulevards ├⌐l├⌐gants et son art, sa gastronomie et sa mode renomm├⌐s.	Paris, capitale fran├ºaise, est r├⌐put├⌐e pour sa beaut├⌐ intemporelle, ses monuments embl├⌐matiques tels que la Tour Eiffel, ses boulevards ├⌐l├⌐gants et son art, sa gastronomie et sa mode renomm├⌐s.
30	1	porto	Porto	Porto, Portuguese city along the Douro, famous for its colorful houses, its wine cellars, its emblematic bridge and its picturesque charm.	Porto, Portuguese city along the Douro, famous for its colorful houses, its wine cellars, its emblematic bridge and its picturesque charm.
30	2	porto	Porto	Porto, ville portugaise le long du Douro, c├⌐l├¿bre pour ses maisons color├⌐es, ses caves ├á vin, son pont embl├⌐matique et son charme pittoresque.	Porto, ville portugaise le long du Douro, c├⌐l├¿bre pour ses maisons color├⌐es, ses caves ├á vin, son pont embl├⌐matique et son charme pittoresque.
31	1	rennes	Rennes	Rennes, a dynamic French city, seduces with its mix of tradition and modernity, its charming historic center, its thriving arts scene and its vibrant student atmosphere.	Rennes, a dynamic French city, seduces with its mix of tradition and modernity, its charming historic center, its thriving arts scene and its vibrant student atmosphere.
31	2	rennes	Rennes	Rennes, ville fran├ºaise dynamique, s├⌐duit par son m├⌐lange de tradition et de modernit├⌐, son charmant centre historique, sa sc├¿ne artistique florissante et son ambiance ├⌐tudiante vibrante.	Rennes, ville fran├ºaise dynamique, s├⌐duit par son m├⌐lange de tradition et de modernit├⌐, son charmant centre historique, sa sc├¿ne artistique florissante et son ambiance ├⌐tudiante vibrante.
32	1	rome	Rome	Rome, the legendary Italian capital, captivates with its ancient heritage and iconic sites such as the Colosseum, Roman Forum and Vatican City, offering an unparalleled cultural experience.	Rome, the legendary Italian capital, captivates with its ancient heritage and iconic sites such as the Colosseum, Roman Forum and Vatican City, offering an unparalleled cultural experience.
32	2	rome	Rome	Rome, capitale italienne l├⌐gendaire, envo├╗te par son h├⌐ritage antique et ses sites embl├⌐matiques tels que le Colis├⌐e, le Forum romain et la Cit├⌐ du Vatican, offrant une exp├⌐rience culturelle in├⌐gal├⌐e.	Rome, capitale italienne l├⌐gendaire, envo├╗te par son h├⌐ritage antique et ses sites embl├⌐matiques tels que le Colis├⌐e, le Forum romain et la Cit├⌐ du Vatican, offrant une exp├⌐rience culturelle in├⌐gal├⌐e.
33	1	rotterdam	Rotterdam	Rotterdam, a bold Dutch city, stands out for its modern architecture, iconic skyscrapers, bustling harbor and creative spirit, making it a true architectural and cultural gem.	Rotterdam, a bold Dutch city, stands out for its modern architecture, iconic skyscrapers, bustling harbor and creative spirit, making it a true architectural and cultural gem.
33	2	rotterdam	Rotterdam	Rotterdam, ville n├⌐erlandaise audacieuse, se distingue par son architecture moderne, ses gratte-ciels embl├⌐matiques, son port anim├⌐ et son esprit cr├⌐atif, en faisant un v├⌐ritable joyau architectural et culturel.	Rotterdam, ville n├⌐erlandaise audacieuse, se distingue par son architecture moderne, ses gratte-ciels embl├⌐matiques, son port anim├⌐ et son esprit cr├⌐atif, en faisant un v├⌐ritable joyau architectural et culturel.
34	1	seville	Seville	Seville, a spellbinding Spanish city, seduces with its Moorish architecture, lively atmosphere, lush gardens, delicious tapas and flamenco passion, offering an authentic cultural experience.	Seville, a spellbinding Spanish city, seduces with its Moorish architecture, lively atmosphere, lush gardens, delicious tapas and flamenco passion, offering an authentic cultural experience.
34	2	seville	S├⌐ville	S├⌐ville, ville espagnole envo├╗tante, s├⌐duit par son architecture mauresque, son ambiance anim├⌐e, ses jardins luxuriants, ses d├⌐licieuses tapas et sa passion flamenco, offrant une exp├⌐rience culturelle authentique.	S├⌐ville, ville espagnole envo├╗tante, s├⌐duit par son architecture mauresque, son ambiance anim├⌐e, ses jardins luxuriants, ses d├⌐licieuses tapas et sa passion flamenco, offrant une exp├⌐rience culturelle authentique.
35	1	stockholm	Stockholm	Stockholm, the glittering capital of Sweden, seduces with its Nordic beauty, picturesque islands, stylish design, fascinating museums and warm urban vibe.	Stockholm, the glittering capital of Sweden, seduces with its Nordic beauty, picturesque islands, stylish design, fascinating museums and warm urban vibe.
35	2	stockholm	Stockholm	Stockholm, capitale su├⌐doise scintillante, s├⌐duit par sa beaut├⌐ nordique, ses ├«les pittoresques, son design ├⌐l├⌐gant, ses mus├⌐es fascinants et son ambiance urbaine chaleureuse.	Stockholm, capitale su├⌐doise scintillante, s├⌐duit par sa beaut├⌐ nordique, ses ├«les pittoresques, son design ├⌐l├⌐gant, ses mus├⌐es fascinants et son ambiance urbaine chaleureuse.
36	1	strasbourg	Strasbourg	Strasbourg, a picturesque French city, seduces with its half-timbered architecture, its famous cathedral, its enchanting canals, its Alsatian gastronomy and its unique European charm.	Strasbourg, a picturesque French city, seduces with its half-timbered architecture, its famous cathedral, its enchanting canals, its Alsatian gastronomy and its unique European charm.
36	2	strasbourg	Strasbourg	Strasbourg, ville fran├ºaise pittoresque, s├⌐duit par son architecture ├á colombages, sa c├⌐l├¿bre cath├⌐drale, ses canaux enchanteurs, sa gastronomie alsacienne et son charme europ├⌐en unique.	Strasbourg, ville fran├ºaise pittoresque, s├⌐duit par son architecture ├á colombages, sa c├⌐l├¿bre cath├⌐drale, ses canaux enchanteurs, sa gastronomie alsacienne et son charme europ├⌐en unique.
37	1	tallinn	Tallinn	Tallinn, the captivating Estonian capital, seduces with its medieval charm, its cobbled streets, its well-preserved ramparts, its Gothic churches and its digital modernity.	Tallinn, the captivating Estonian capital, seduces with its medieval charm, its cobbled streets, its well-preserved ramparts, its Gothic churches and its digital modernity.
37	2	tallinn	Tallinn	Tallinn, capitale estonienne captivante, s├⌐duit par son charme m├⌐di├⌐val, ses ruelles pav├⌐es, ses remparts bien pr├⌐serv├⌐s, ses ├⌐glises gothiques et sa modernit├⌐ num├⌐rique.	Tallinn, capitale estonienne captivante, s├⌐duit par son charme m├⌐di├⌐val, ses ruelles pav├⌐es, ses remparts bien pr├⌐serv├⌐s, ses ├⌐glises gothiques et sa modernit├⌐ num├⌐rique.
38	1	timisoara	Timisoara	Timi╚Öoara, a dynamic Romanian city, enchants with its baroque architecture, picturesque squares, revolutionary history and thriving art scene.	Timi╚Öoara, a dynamic Romanian city, enchants with its baroque architecture, picturesque squares, revolutionary history and thriving art scene.
38	2	timisoara	Timi╚Öoara	Timi╚Öoara, ville roumaine dynamique, enchante par son architecture baroque, ses places pittoresques, son histoire r├⌐volutionnaire et sa sc├¿ne artistique florissante.	Timi╚Öoara, ville roumaine dynamique, enchante par son architecture baroque, ses places pittoresques, son histoire r├⌐volutionnaire et sa sc├¿ne artistique florissante.
39	1	toulouse	Toulouse	Toulouse, a cheerful French city, seduces with its characteristic pink brick, its historical heritage, its tasty cuisine, its generous green spaces and its festive atmosphere.	Toulouse, a cheerful French city, seduces with its characteristic pink brick, its historical heritage, its tasty cuisine, its generous green spaces and its festive atmosphere.
39	2	toulouse	Toulouse	Toulouse, ville fran├ºaise enjou├⌐e, s├⌐duit par sa brique rose caract├⌐ristique, son patrimoine historique, sa cuisine savoureuse, ses espaces verts g├⌐n├⌐reux et son ambiance festive.	Toulouse, ville fran├ºaise enjou├⌐e, s├⌐duit par sa brique rose caract├⌐ristique, son patrimoine historique, sa cuisine savoureuse, ses espaces verts g├⌐n├⌐reux et son ambiance festive.
40	1	valencia	Valencia	Valencia, a sunny Spanish city, enchants with its futuristic architecture, its famous City of Arts and Sciences, its tasty paella and its lively Mediterranean atmosphere.	Valencia, a sunny Spanish city, enchants with its futuristic architecture, its famous City of Arts and Sciences, its tasty paella and its lively Mediterranean atmosphere.
40	2	valencia	Valencia	Valencia, ville espagnole ensoleill├⌐e, enchante par son architecture futuriste, sa c├⌐l├¿bre Cit├⌐ des Arts et des Sciences, sa paella savoureuse et son ambiance m├⌐diterran├⌐enne anim├⌐e.	Valencia, ville espagnole ensoleill├⌐e, enchante par son architecture futuriste, sa c├⌐l├¿bre Cit├⌐ des Arts et des Sciences, sa paella savoureuse et son ambiance m├⌐diterran├⌐enne anim├⌐e.
41	1	vannes	Vannes	Vannes, a charming Breton town, seduces with its medieval ramparts, its picturesque port, its cobbled streets, its historical heritage and its authentic maritime atmosphere.	Vannes, a charming Breton town, seduces with its medieval ramparts, its picturesque port, its cobbled streets, its historical heritage and its authentic maritime atmosphere.
41	2	vannes	Vannes	Vannes, ville bretonne charmante, s├⌐duit par ses remparts m├⌐di├⌐vaux, son port pittoresque, ses ruelles pav├⌐es, son patrimoine historique et son ambiance maritime authentique.	Vannes, ville bretonne charmante, s├⌐duit par ses remparts m├⌐di├⌐vaux, son port pittoresque, ses ruelles pav├⌐es, son patrimoine historique et son ambiance maritime authentique.
42	1	warsaw	Warsaw	Warsaw, the dynamic Polish capital, seduces with its unique blend of history and modernity, its reconstructed architecture, its green parks and its resilient spirit.	Warsaw, the dynamic Polish capital, seduces with its unique blend of history and modernity, its reconstructed architecture, its green parks and its resilient spirit.
42	2	varsovie	Varsovie	Varsovie, capitale polonaise dynamique, s├⌐duit par son m├⌐lange unique d\\'histoire et de modernit├⌐, son architecture reconstruite, ses parcs verdoyants et son esprit r├⌐silient.	Varsovie, capitale polonaise dynamique, s├⌐duit par son m├⌐lange unique d\\'histoire et de modernit├⌐, son architecture reconstruite, ses parcs verdoyants et son esprit r├⌐silient.
43	1	venice	Venice	Venice is an iconic city in Italy, famous for its winding canals and magnificent palaces built over water, offering a romantic and unique atmosphere in the world.	Venice is an iconic city in Italy, famous for its winding canals and magnificent palaces built over water, offering a romantic and unique atmosphere in the world.
43	2	venise	Venise	Venise est une ville embl├⌐matique en Italie, c├⌐l├¿bre pour ses canaux sinueux et ses magnifiques palais construits sur l\\'eau, offrant une atmosph├¿re romantique et unique au monde.	Venise est une ville embl├⌐matique en Italie, c├⌐l├¿bre pour ses canaux sinueux et ses magnifiques palais construits sur l\\'eau, offrant une atmosph├¿re romantique et unique au monde.
44	1	vienna	Vienna	Vienna, the elegant Austrian capital, seduces with its imperial architecture, its prestigious opera houses, its traditional caf├⌐s, its cultural richness and its refined atmosphere.	Vienna, the elegant Austrian capital, seduces with its imperial architecture, its prestigious opera houses, its traditional caf├⌐s, its cultural richness and its refined atmosphere.
44	2	vienne	Vienne	Vienne, capitale autrichienne ├⌐l├⌐gante, s├⌐duit par son architecture imp├⌐riale, ses op├⌐ras prestigieux, ses caf├⌐s traditionnels, sa richesse culturelle et son atmosph├¿re raffin├⌐e.	Vienne, capitale autrichienne ├⌐l├⌐gante, s├⌐duit par son architecture imp├⌐riale, ses op├⌐ras prestigieux, ses caf├⌐s traditionnels, sa richesse culturelle et son atmosph├¿re raffin├⌐e.
45	1	la-roche-bernard	La Roche-Bernard	La Roche-Bernard is classified among the most beautiful villages in Morbihan under the city of character label. Nestled not far from the Vilaine estuary, La Roche-Bernard was built on a rocky outcrop. Famous for its port and its 3 bridges walk, enjoy the charm of this small village.	La Roche-Bernard is classified among the most beautiful villages in Morbihan under the city of character label. Nestled not far from the Vilaine estuary, La Roche-Bernard was built on a rocky outcrop. Famous for its port and its 3 bridges walk, enjoy the charm of this small village.
45	2	la-roche-bernard	La Roche-Bernard	La Roche-Bernard est class├⌐ parmi les plus beaux villages du Morbihan sous le label cit├⌐ de caract├¿re. Nich├⌐ non loin de l\\'estuaire de la Vilaine, la Roche-Bernard a ├⌐t├⌐ construit sur un ├⌐peron rocheux. C├⌐l├¿bre pour son port et sa balade des 3 ponts, goutez au charme de ce petit village.	La Roche-Bernard est class├⌐ parmi les plus beaux villages du Morbihan sous le label cit├⌐ de caract├¿re. Nich├⌐ non loin de l\\'estuaire de la Vilaine, la Roche-Bernard a ├⌐t├⌐ construit sur un ├⌐peron rocheux. C├⌐l├¿bre pour son port et sa balade des 3 ponts, goutez au charme de ce petit village.
46	1	la-rochelle	La Rochelle	La Rochelle, a captivating coastal town, seduces with its lively old port, its medieval towers, its picturesque alleys, its maritime culture and its relaxed atmosphere.	La Rochelle, a captivating coastal town, seduces with its lively old port, its medieval towers, its picturesque alleys, its maritime culture and its relaxed atmosphere.
46	2	la-rochelle	La Rochelle	La Rochelle, ville c├┤ti├¿re captivante, s├⌐duit par son vieux port anim├⌐, ses tours m├⌐di├⌐vales, ses ruelles pittoresques, sa culture maritime et son ambiance d├⌐contract├⌐e.	La Rochelle, ville c├┤ti├¿re captivante, s├⌐duit par son vieux port anim├⌐, ses tours m├⌐di├⌐vales, ses ruelles pittoresques, sa culture maritime et son ambiance d├⌐contract├⌐e.
47	1	edinburgh	Edinburgh	Edinburgh, Scotland\\'s capital, blends history with modernity. Its famous castle atop an ancient volcanic rock offers stunning views. Explore the historic Royal Mile, Holyroodhouse Palace, and Georgian architecture. A delightful mix of culture, history, and nature.	Edinburgh, Scotland\\'s capital, blends history with modernity. Its famous castle atop an ancient volcanic rock offers stunning views. Explore the historic Royal Mile, Holyroodhouse Palace, and Georgian architecture. A delightful mix of culture, history, and nature.
47	2	edimbourg	├ëdimbourg	├ëdimbourg, capitale de l\\'├ëcosse, allie histoire et modernit├⌐. Son c├⌐l├¿bre ch├óteau surplombe la ville depuis un rocher volcanique, offrant des vues magnifiques. D├⌐couvrez le Royal Mile historique, le palais de Holyroodhouse, et l\\'architecture g├⌐orgienne. Un m├⌐lange charmant de culture, histoire, et nature.	├ëdimbourg, capitale de l\\'├ëcosse, allie histoire et modernit├⌐. Son c├⌐l├¿bre ch├óteau surplombe la ville depuis un rocher volcanique, offrant des vues magnifiques. D├⌐couvrez le Royal Mile historique, le palais de Holyroodhouse, et l\\'architecture g├⌐orgienne. Un m├⌐lange charmant de culture, histoire, et nature.
48	1	prague	Prague	Prague, the capital of the Czech Republic, enchants visitors with its well-preserved medieval architecture, cobblestone streets, and historic bridges. Dominated by the Prague Castle, a national symbol, the city is renowned for its unique astronomical clock. Prague\\'s romantic and cultural ambiance makes it a top destination in Europe.	Prague, the capital of the Czech Republic, enchants visitors with its well-preserved medieval architecture, cobblestone streets, and historic bridges. Dominated by the Prague Castle, a national symbol, the city is renowned for its unique astronomical clock. Prague\\'s romantic and cultural ambiance makes it a top destination in Europe.
48	2	prague	Prague	Prague, la capitale de la R├⌐publique tch├¿que, charme ses visiteurs avec son architecture m├⌐di├⌐vale pr├⌐serv├⌐e, ses ruelles pav├⌐es et ses ponts historiques. La ville est domin├⌐e par le ch├óteau de Prague, un embl├¿me national, et est c├⌐l├¿bre pour son horloge astronomique unique. L\\'atmosph├¿re romantique et culturelle de Prague en fait une destination europ├⌐enne de premier plan.	Prague, la capitale de la R├⌐publique tch├¿que, charme ses visiteurs avec son architecture m├⌐di├⌐vale pr├⌐serv├⌐e, ses ruelles pav├⌐es et ses ponts historiques. La ville est domin├⌐e par le ch├óteau de Prague, un embl├¿me national, et est c├⌐l├¿bre pour son horloge astronomique unique. L\\'atmosph├¿re romantique et culturelle de Prague en fait une destination europ├⌐enne de premier plan.
49	1	aachen	Aachen	Aachen, the historic capital of Charlemagne, captivates with its iconic cathedral, thermal springs, and university atmosphere, making it a charming destination in Europe.	Aachen, the historic capital of Charlemagne, captivates with its iconic cathedral, thermal springs, and university atmosphere, making it a charming destination in Europe.
49	2	aix-la-chapelle	Aix-la-Chapelle	Aix-la-Chapelle, capitale historique de Charlemagne, s├⌐duit par sa cath├⌐drale embl├⌐matique, ses sources thermales, et son atmosph├¿re universitaire, en faisant une destination charmante en Europe.	Aix-la-Chapelle, capitale historique de Charlemagne, s├⌐duit par sa cath├⌐drale embl├⌐matique, ses sources thermales, et son atmosph├¿re universitaire, en faisant une destination charmante en Europe.
50	1	cologne	Cologne	Cologne, with its magnificent cathedral, a UNESCO World Heritage Site, vibrant art galleries, and lively breweries, epitomizes the blend of historical depth and contemporary vibrancy, making it a standout cultural hub in Europe.	Cologne, with its magnificent cathedral, a UNESCO World Heritage Site, vibrant art galleries, and lively breweries, epitomizes the blend of historical depth and contemporary vibrancy, making it a standout cultural hub in Europe.
50	2	cologne	Cologne	Cologne, avec sa magnifique cath├⌐drale, class├⌐e au patrimoine mondial de l\\'UNESCO, ses galeries d\\'art vivantes et ses brasseries anim├⌐es, incarne le m├⌐lange de profondeur historique et de dynamisme contemporain, ce qui en fait un p├┤le culturel remarquable en Europe.	Cologne, avec sa magnifique cath├⌐drale, class├⌐e au patrimoine mondial de l\\'UNESCO, ses galeries d\\'art vivantes et ses brasseries anim├⌐es, incarne le m├⌐lange de profondeur historique et de dynamisme contemporain, ce qui en fait un p├┤le culturel remarquable en Europe.
51	1	istanbul	Istanbul	Istanbul, the iconic metropolis of Turkey, enchants with its unique blend of cultures, majestic mosques, bustling bazaars, and millennia-old history. Straddling both Europe and Asia, this vibrant and diverse city offers an unforgettable experience at the crossroads of continents.	Istanbul, the iconic metropolis of Turkey, enchants with its unique blend of cultures, majestic mosques, bustling bazaars, and millennia-old history. Straddling both Europe and Asia, this vibrant and diverse city offers an unforgettable experience at the crossroads of continents.
51	2	istanbul	Istanbul	Istanbul, m├⌐tropole embl├⌐matique de la Turquie, s├⌐duit par son m├⌐lange unique de cultures, ses mosqu├⌐es majestueuses, ses bazars anim├⌐s et son histoire mill├⌐naire. ├Ç cheval entre l\\'Europe et l\\'Asie, cette ville vibrante et diversifi├⌐e offre une exp├⌐rience inoubliable au carrefour des continents.	Istanbul, m├⌐tropole embl├⌐matique de la Turquie, s├⌐duit par son m├⌐lange unique de cultures, ses mosqu├⌐es majestueuses, ses bazars anim├⌐s et son histoire mill├⌐naire. ├Ç cheval entre l\\'Europe et l\\'Asie, cette ville vibrante et diversifi├⌐e offre une exp├⌐rience inoubliable au carrefour des continents.
\.


--
-- Data for Name: tx_country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_country (country_id, language_id, slug, name, description, meta_description, title) FROM stdin;
1	1	netherlands	Netherlands	The Netherlands, famous for its canals, tulips, windmills, and art, offers a unique mix of historic charm and modern innovation.	Discover the Netherlands: canals, tulips, windmills, and world-class museums.	Netherlands
1	2	pays-bas	Pays-Bas	Les Pays-Bas, c├⌐l├¿bres pour leurs canaux, tulipes, moulins et mus├⌐es, offrent un m├⌐lange unique de charme historique et d\\'innovation moderne.	D├⌐couvrez les Pays-Bas┬á: canaux, tulipes, moulins ├á vent et mus├⌐es mondialement connus.	Pays-Bas
2	1	belgium	Belgium	Belgium, the heart of Europe, is known for its medieval cities, delicious chocolates, and vibrant cultural scene.	Explore Belgium: medieval cities, chocolates, and vibrant culture.	Belgium
2	2	belgique	Belgique	La Belgique, c┼ôur de l\\'Europe, est r├⌐put├⌐e pour ses villes m├⌐di├⌐vales, ses d├⌐licieux chocolats et sa sc├¿ne culturelle dynamique.	Explorez la Belgique : villes m├⌐di├⌐vales, chocolats et culture vibrante.	Belgique
3	1	greece	Greece	Greece, the cradle of Western civilization, enchants with its ancient ruins, stunning islands, and rich traditions.	Discover Greece: ancient ruins, stunning islands, and rich traditions.	Greece
3	2	grce	Gr├¿ce	La Gr├¿ce, berceau de la civilisation occidentale, s├⌐duit avec ses ruines antiques, ses ├«les magnifiques et ses riches traditions.	D├⌐couvrez la Gr├¿ce : ruines antiques, ├«les magnifiques et traditions riches.	Gr├¿ce
4	1	spain	Spain	Spain captivates with its sunny beaches, vibrant festivals, historical landmarks, and world-renowned cuisine.	Discover Spain: sunny beaches, festivals, and historic landmarks.	Spain
4	2	espagne	Espagne	L\\'Espagne charme avec ses plages ensoleill├⌐es, ses festivals vibrants, ses monuments historiques et sa cuisine mondialement reconnue.	D├⌐couvrez l\\'Espagne : plages ensoleill├⌐es, festivals et monuments historiques.	Espagne
5	1	germany	Germany	Germany, a blend of medieval towns and modern cities, boasts rich history, art, and world-class engineering.	Discover Germany: medieval towns, art, and engineering.	Germany
5	2	allemagne	Allemagne	L\\'Allemagne, un m├⌐lange de villes m├⌐di├⌐vales et modernes, se distingue par son histoire riche, son art et son ing├⌐nierie de classe mondiale.	D├⌐couvrez l\\'Allemagne┬á: villes m├⌐di├⌐vales, art et ing├⌐nierie.	Allemagne
6	1	france	France	France, home to Paris, the Eiffel Tower, and fine wine, offers timeless elegance, culture, and art.	Discover France: Paris, fine wine, and timeless culture.	France
6	2	france	France	La France, avec Paris, la tour Eiffel et ses grands vins, offre une ├⌐l├⌐gance intemporelle, une culture riche et de l\\'art.	D├⌐couvrez la France : Paris, grands vins et culture intemporelle.	France
7	1	romania	Romania	Romania amazes with its castles, Carpathian mountains, and medieval towns full of legends and charm.	Discover Romania: castles, Carpathian mountains, and legends.	Romania
7	2	roumanie	Roumanie	La Roumanie ├⌐merveille avec ses ch├óteaux, ses Carpates et ses villes m├⌐di├⌐vales pleines de l├⌐gendes et de charme.	D├⌐couvrez la Roumanie┬á: ch├óteaux, Carpates et l├⌐gendes.	Roumanie
8	1	hungary	Hungary	Hungary impresses with Budapest\\'s thermal baths, the Danube River, and rich cultural heritage.	Explore Hungary: Budapest, the Danube, and cultural treasures.	Hungary
8	2	hongrie	Hongrie	La Hongrie impressionne avec les bains thermaux de Budapest, le Danube et son riche patrimoine culturel.	Explorez la Hongrie : Budapest, le Danube et les tr├⌐sors culturels.	Hongrie
9	1	denmark	Denmark	Denmark, home to Copenhagen and the Little Mermaid, charms with design, innovation, and hygge culture.	Discover Denmark: Copenhagen, design, and hygge culture.	Denmark
9	2	danmark	Danmark	Le Danemark, avec Copenhague et la Petite Sir├¿ne, s├⌐duit par son design, son innovation et sa culture du hygge.	D├⌐couvrez le Danemark┬á: Copenhague, design et hygge.	Danmark
10	1	poland	Poland	Poland, from Krakow\\'s old town to Warsaw\\'s resilience, is a land of vibrant history and warm hospitality.	Explore Poland: Krakow, Warsaw, and vibrant history.	Poland
10	2	pologne	Pologne	La Pologne, de la vieille ville de Cracovie ├á la r├⌐silience de Varsovie, est un pays d\\'histoire vivante et d\\'hospitalit├⌐.	Explorez la Pologne┬á: Cracovie, Varsovie et histoire vibrante.	Pologne
11	1	ireland	Ireland	Ireland enchants with its lush landscapes, legendary folklore, historic castles, and warm hospitality.	Discover Ireland: lush landscapes, castles, and folklore.	Ireland
11	2	irlande	Irlande	L\\'Irlande s├⌐duit par ses paysages verdoyants, son folklore l├⌐gendaire, ses ch├óteaux historiques et son hospitalit├⌐ chaleureuse.	D├⌐couvrez l\\'Irlande : paysages verdoyants, ch├óteaux et folklore.	Irlande
12	1	croatia	Croatia	Croatia dazzles with its Adriatic coastline, historic Dubrovnik, and stunning national parks like Plitvice Lakes.	Explore Croatia: Adriatic coast and stunning nature.	Croatia
12	2	croatie	Croatie	La Croatie ├⌐blouit avec sa c├┤te adriatique, la ville historique de Dubrovnik et ses parcs nationaux spectaculaires comme Plitvice.	Explorez la Croatie : c├┤te adriatique et nature spectaculaire.	Croatie
13	1	italy	Italy	Italy captivates with its Renaissance art, historic landmarks, stunning landscapes, and world-renowned cuisine.	Discover Italy: art, history, and fine cuisine.	Italy
13	2	italie	Italie	L\\'Italie charme avec son art de la Renaissance, ses monuments historiques, ses paysages magnifiques et sa cuisine r├⌐put├⌐e.	D├⌐couvrez l\\'Italie : art, histoire et cuisine raffin├⌐e.	Italie
14	1	portugal	Portugal	Portugal impresses with its sunny beaches, historic cities like Lisbon, and rich maritime heritage.	Discover Portugal: beaches, Lisbon, and maritime history.	Portugal
14	2	portugal	Portugal	Le Portugal s├⌐duit avec ses plages ensoleill├⌐es, ses villes historiques comme Lisbonne et son riche h├⌐ritage maritime.	D├⌐couvrez le Portugal : plages, Lisbonne et h├⌐ritage maritime.	Portugal
15	1	united-kingdom	United-Kingdom	The UK blends iconic landmarks, cultural heritage, and scenic countryside for a truly diverse experience.	Explore the UK: landmarks, heritage, and countryside.	United-Kingdom
15	2	royaume-uni	Royaume-Uni	Le Royaume-Uni m├¬le monuments embl├⌐matiques, patrimoine culturel et campagnes pittoresques pour une exp├⌐rience diversifi├⌐e.	Explorez le Royaume-Uni┬á: monuments, patrimoine et campagne.	Royaume-Uni
16	1	sweden	Sweden	Sweden, a land of innovation and natural beauty, offers stunning archipelagos, northern lights, and a rich cultural heritage.	Discover Sweden: nature, innovation, and culture.	Sweden
16	2	sude	Su├¿de	La Su├¿de, terre d\\'innovation et de beaut├⌐ naturelle, offre des archipels spectaculaires, des aurores bor├⌐ales et un riche patrimoine culturel.	D├⌐couvrez la Su├¿de┬á: nature, innovation et culture.	Su├¿de
17	1	estonia	Estonia	Estonia combines medieval charm in Tallinn with pristine forests, making it a hidden gem in Europe.	Explore Estonia: Tallinn and untouched nature.	Estonia
17	2	estonie	Estonie	L\\'Estonie allie le charme m├⌐di├⌐val de Tallinn ├á des for├¬ts pr├⌐serv├⌐es, en faisant un joyau cach├⌐ en Europe.	Explorez l\\'Estonie : Tallinn et nature pr├⌐serv├⌐e.	Estonie
18	1	austria	Austria	Austria boasts Alpine landscapes, historic Vienna, and rich musical heritage with composers like Mozart.	Discover Austria: Alps, Vienna, and musical legacy.	Austria
18	2	autriche	Autriche	L\\'Autriche, avec ses paysages alpins, Vienne historique et son riche h├⌐ritage musical, fascine les visiteurs.	D├⌐couvrez l\\'Autriche┬á: Alpes, Vienne et h├⌐ritage musical.	Autriche
19	1	czech-republic	Czech Republic	The Czech Republic enchants with Prague\\'s Gothic charm, fairy-tale castles, and lush Bohemian forests.	Discover the Czech Republic: Prague and castles.	Czech Republic
19	2	rpublique-tchque	R├⌐publique tch├¿que	La R├⌐publique tch├¿que s├⌐duit par le charme gothique de Prague, ses ch├óteaux de conte de f├⌐es et ses for├¬ts boh├⌐miennes verdoyantes.	D├⌐couvrez la R├⌐publique tch├¿que┬á: Prague et ch├óteaux.	R├⌐publique tch├¿que
20	1	turkey	Turkey	Turkey bridges Europe and Asia with Istanbul\\'s history, Cappadocia\\'s landscapes, and rich traditions.	Explore Turkey: Istanbul, Cappadocia, and traditions.	Turkey
20	2	turquie	Turquie	La Turquie, pont entre l\\'Europe et l\\'Asie, fascine avec l\\'histoire d\\'Istanbul, les paysages de Cappadoce et ses traditions riches.	D├⌐couvrez la Turquie┬á: Istanbul, Cappadoce et traditions.	Turquie
\.


--
-- Data for Name: tx_place; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_place (place_id, language_id, slug, name, title, description, meta_description) FROM stdin;
\.


--
-- Data for Name: tx_place_img; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_place_img (place_img_id, language_id, alt) FROM stdin;
\.


--
-- Data for Name: tx_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_post (post_id, language_id, slug, name, title, description, meta_description, visible, created_at, updated_at, planned) FROM stdin;
\.


--
-- Data for Name: tx_post_bloc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_post_bloc (post_bloc_id, language_id, content, title) FROM stdin;
\.


--
-- Data for Name: tx_post_img; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_post_img (post_img_id, language_id, alt) FROM stdin;
\.


--
-- Data for Name: tx_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tx_posts (post_id, language_id, name, description, "metaDescription", title, visible, slug, created_at, updated_at, planned) FROM stdin;
\.


--
-- Data for Name: user_places_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_places_likes (user_id, place_id, liked, changed_at) FROM stdin;
\.


--
-- Data for Name: user_places_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_places_preferences (user_id, place_id, wants_to_visit, visited, not_interested, changed_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, pw, fb_id, google_id, apple_id, profile_img, confirmed_account, created_at, updated_at, admin, author, favorite_language) FROM stdin;
33	testuser_3h41mbvs@example.com	Test User	password123	\N	\N	\N	\N	\N	2024-11-25 15:52:24.664109	2024-11-25 15:52:24.664109	f	f	\N
\.


--
-- Name: attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_id_seq', 156, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3422, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cities_id_seq', 51, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 20, true);


--
-- Name: crowd_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crowd_levels_id_seq', 1, false);


--
-- Name: hotels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hotels_id_seq', 13, true);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.languages_id_seq', 12, true);


--
-- Name: opening_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.opening_hours_id_seq', 1, false);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.partners_id_seq', 1, false);


--
-- Name: people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.people_id_seq', 1, false);


--
-- Name: place_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_attributes_id_seq', 37015, true);


--
-- Name: place_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_categories_id_seq', 39, true);


--
-- Name: place_imgs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_imgs_id_seq', 14700, true);


--
-- Name: places_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.places_id_seq', 1, false);


--
-- Name: post_blocs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_blocs_id_seq', 1, false);


--
-- Name: post_imgs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_imgs_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: restaurant_bars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_bars_id_seq', 11, true);


--
-- Name: tourist_attractions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tourist_attractions_id_seq', 2266, true);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trips_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: opening_hours PK_09415e2b345103b1f5971464f85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT "PK_09415e2b345103b1f5971464f85" PRIMARY KEY (id);


--
-- Name: places PK_1afab86e226b4c3bc9a74465c12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: tourist_attractions PK_275737dcfb3a5729844a4dce618; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tourist_attractions
    ADD CONSTRAINT "PK_275737dcfb3a5729844a4dce618" PRIMARY KEY (id);


--
-- Name: posts PK_2829ac61eff60fcec60d7274b9e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY (id);


--
-- Name: tx_attribute PK_2939cbf3eb4e15cff8430da5765; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_attribute
    ADD CONSTRAINT "PK_2939cbf3eb4e15cff8430da5765" PRIMARY KEY (attribute_id, language_id);


--
-- Name: hotels PK_2bb06797684115a1ba7c705fc7b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY (id);


--
-- Name: post_blocs PK_2cc1cb3382b4bf82f132fab5cc5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "PK_2cc1cb3382b4bf82f132fab5cc5" PRIMARY KEY (id);


--
-- Name: attributes PK_32216e2e61830211d3a5d7fa72c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY (id);


--
-- Name: tx_categories PK_44dc35b3608abc5b67db62ad78a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_categories
    ADD CONSTRAINT "PK_44dc35b3608abc5b67db62ad78a" PRIMARY KEY (category_id, language_id);


--
-- Name: cities PK_4762ffb6e5d198cfec5606bc11e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY (id);


--
-- Name: crowd_levels PK_543b50793eaf6eaf12a2136702f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowd_levels
    ADD CONSTRAINT "PK_543b50793eaf6eaf12a2136702f" PRIMARY KEY (id);


--
-- Name: tx_country PK_5c465ed12879d5eb5d7d37427f9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_country
    ADD CONSTRAINT "PK_5c465ed12879d5eb5d7d37427f9" PRIMARY KEY (country_id, language_id);


--
-- Name: user_places_preferences PK_6585cf4922ffa16545ca95ac315; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_preferences
    ADD CONSTRAINT "PK_6585cf4922ffa16545ca95ac315" PRIMARY KEY (user_id, place_id);


--
-- Name: place_imgs PK_680c9660f80dfff4581992685a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_imgs
    ADD CONSTRAINT "PK_680c9660f80dfff4581992685a4" PRIMARY KEY (id);


--
-- Name: tx_city PK_6cf95e8d4bfe32c54916b2baf5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_city
    ADD CONSTRAINT "PK_6cf95e8d4bfe32c54916b2baf5b" PRIMARY KEY (city_id, language_id);


--
-- Name: tx_category_city_lang PK_6f8c7b3240aa0d898fb99c75c64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT "PK_6f8c7b3240aa0d898fb99c75c64" PRIMARY KEY (category_id, city_id, language_id);


--
-- Name: place_categories PK_76714272b17a12c756e383dc89c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories
    ADD CONSTRAINT "PK_76714272b17a12c756e383dc89c" PRIMARY KEY (id);


--
-- Name: trip_composition PK_897dbbf63be68c4346f6e36a314; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_composition
    ADD CONSTRAINT "PK_897dbbf63be68c4346f6e36a314" PRIMARY KEY (trip_id, day, "position", place_id);


--
-- Name: places_added_by_user PK_8d16fd5891227b7f588f26aa107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places_added_by_user
    ADD CONSTRAINT "PK_8d16fd5891227b7f588f26aa107" PRIMARY KEY (user_id, place_id);


--
-- Name: partners PK_998645b20820e4ab99aeae03b41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY (id);


--
-- Name: trip_attributes PK_9accce43af6453045da9ebd3756; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_attributes
    ADD CONSTRAINT "PK_9accce43af6453045da9ebd3756" PRIMARY KEY (trip_id, attribute_id);


--
-- Name: post_categorizations PK_9d5b34ae760f49ef1ea184d8029; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categorizations
    ADD CONSTRAINT "PK_9d5b34ae760f49ef1ea184d8029" PRIMARY KEY (post_id, category_id);


--
-- Name: user_places_likes PK_a3464a33a911e8a05bb7d9c0803; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_likes
    ADD CONSTRAINT "PK_a3464a33a911e8a05bb7d9c0803" PRIMARY KEY (user_id, place_id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: people PK_aa866e71353ee94c6cc51059c5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT "PK_aa866e71353ee94c6cc51059c5b" PRIMARY KEY (id);


--
-- Name: countries PK_b2d7006793e8697ab3ae2deff18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY (id);


--
-- Name: languages PK_b517f827ca496b29f4d549c631d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY (id);


--
-- Name: restaurant_bars PK_baf1fb6a73f0f9703606ee556f9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_bars
    ADD CONSTRAINT "PK_baf1fb6a73f0f9703606ee556f9" PRIMARY KEY (id);


--
-- Name: trip_category_filter PK_d0fbf3f3a4c80ebed44820556bf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_category_filter
    ADD CONSTRAINT "PK_d0fbf3f3a4c80ebed44820556bf" PRIMARY KEY (trip_id, category_id);


--
-- Name: tx_post_bloc PK_d2e170c8e793df6960840375c7c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_bloc
    ADD CONSTRAINT "PK_d2e170c8e793df6960840375c7c" PRIMARY KEY (post_bloc_id, language_id);


--
-- Name: post_imgs PK_d4f3d07e926d237acceb985e3bb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_imgs
    ADD CONSTRAINT "PK_d4f3d07e926d237acceb985e3bb" PRIMARY KEY (id);


--
-- Name: tx_posts PK_e1ecb07ca55d4fcd63bbde60ade; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_posts
    ADD CONSTRAINT "PK_e1ecb07ca55d4fcd63bbde60ade" PRIMARY KEY (post_id, language_id);


--
-- Name: tx_post_img PK_f204df894fcccaa097cd0d9f9d6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_img
    ADD CONSTRAINT "PK_f204df894fcccaa097cd0d9f9d6" PRIMARY KEY (post_img_id, language_id);


--
-- Name: place_attributes PK_f4b45ed84f646956d36b63ea4bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes
    ADD CONSTRAINT "PK_f4b45ed84f646956d36b63ea4bd" PRIMARY KEY (id);


--
-- Name: trips PK_f71c231dee9c05a9522f9e840f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY (id);


--
-- Name: tx_place PK_fd334841665d729ac71a687e6f8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place
    ADD CONSTRAINT "PK_fd334841665d729ac71a687e6f8" PRIMARY KEY (place_id, language_id);


--
-- Name: tourist_attractions REL_0560d44f487473deb35b417bb0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tourist_attractions
    ADD CONSTRAINT "REL_0560d44f487473deb35b417bb0" UNIQUE (place_id);


--
-- Name: hotels REL_83577f76dd4ce869241ae46002; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT "REL_83577f76dd4ce869241ae46002" UNIQUE (place_id);


--
-- Name: restaurant_bars REL_f4121b2d5a4dbb094c16966d9a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_bars
    ADD CONSTRAINT "REL_f4121b2d5a4dbb094c16966d9a" UNIQUE (place_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: places places_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_google_id_key UNIQUE (google_id);


--
-- Name: places places_google_place_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_google_place_id_key UNIQUE (google_place_id);


--
-- Name: restaurants_bars restaurants_bars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants_bars
    ADD CONSTRAINT restaurants_bars_pkey PRIMARY KEY (place_id);


--
-- Name: tx_category tx_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category
    ADD CONSTRAINT tx_category_pkey PRIMARY KEY (category_id, language_id);


--
-- Name: tx_place_img tx_place_img_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place_img
    ADD CONSTRAINT tx_place_img_pkey PRIMARY KEY (place_img_id, language_id);


--
-- Name: tx_post tx_post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post
    ADD CONSTRAINT tx_post_pkey PRIMARY KEY (post_id, language_id);


--
-- Name: crowd_levels FK_015550d9fd8aabf5c1377c50d4f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowd_levels
    ADD CONSTRAINT "FK_015550d9fd8aabf5c1377c50d4f" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: tx_post_bloc FK_01fc44af304b3cab24b67a7a1ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_bloc
    ADD CONSTRAINT "FK_01fc44af304b3cab24b67a7a1ee" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tourist_attractions FK_0560d44f487473deb35b417bb08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tourist_attractions
    ADD CONSTRAINT "FK_0560d44f487473deb35b417bb08" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: tx_city FK_0a7c978a0bfab1c9192b53e043a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_city
    ADD CONSTRAINT "FK_0a7c978a0bfab1c9192b53e043a" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: trip_composition FK_0deb183c6bd8437d0c7fb01fe36; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_composition
    ADD CONSTRAINT "FK_0deb183c6bd8437d0c7fb01fe36" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: tx_attribute FK_0e1028705496c772e925bb662c2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_attribute
    ADD CONSTRAINT "FK_0e1028705496c772e925bb662c2" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id);


--
-- Name: trip_composition FK_0f0ee0271f55dee0a1ae1938c86; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_composition
    ADD CONSTRAINT "FK_0f0ee0271f55dee0a1ae1938c86" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trip_category_filter FK_1408069f4801cca0c59131d1a0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_category_filter
    ADD CONSTRAINT "FK_1408069f4801cca0c59131d1a0e" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: place_categories FK_150b6f19956e7074e3596e26ba1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories
    ADD CONSTRAINT "FK_150b6f19956e7074e3596e26ba1" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: places FK_17369bcc0a398534981282e5bf6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT "FK_17369bcc0a398534981282e5bf6" FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: user_places_likes FK_17f001c44e72f9efde85df4f7f1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_likes
    ADD CONSTRAINT "FK_17f001c44e72f9efde85df4f7f1" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tx_attribute FK_229f9b92e2c642e282a4d3347eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_attribute
    ADD CONSTRAINT "FK_229f9b92e2c642e282a4d3347eb" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: post_blocs FK_22b27e510316d87fb6638434e6c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_22b27e510316d87fb6638434e6c" FOREIGN KEY (place_img_id) REFERENCES public.place_imgs(id);


--
-- Name: post_blocs FK_2b7cc394a71662781bc377e6596; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_2b7cc394a71662781bc377e6596" FOREIGN KEY (post_img_id) REFERENCES public.post_imgs(id);


--
-- Name: tx_post_img FK_2c791760faa8493963805f6217f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_img
    ADD CONSTRAINT "FK_2c791760faa8493963805f6217f" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: trip_category_filter FK_2dfddc163b44c29ba6f42e3a747; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_category_filter
    ADD CONSTRAINT "FK_2dfddc163b44c29ba6f42e3a747" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trips FK_34a315dda51042108ff9fa2ee45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT "FK_34a315dda51042108ff9fa2ee45" FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: opening_hours FK_3536e213e740f6ab23a14cca683; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT "FK_3536e213e740f6ab23a14cca683" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: tx_city FK_3630074efe60de6871389fe3fcf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_city
    ADD CONSTRAINT "FK_3630074efe60de6871389fe3fcf" FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: tx_category_city_lang FK_3b10704366f5197716cf32fad7a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT "FK_3b10704366f5197716cf32fad7a" FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: trip_attributes FK_47250d9f557191dc08deb3dacdd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_attributes
    ADD CONSTRAINT "FK_47250d9f557191dc08deb3dacdd" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: cities FK_4aa0d9a52c36ff93415934e2d2b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b" FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: tx_country FK_4bd6f28fbdb8fc00a4a754c4050; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_country
    ADD CONSTRAINT "FK_4bd6f28fbdb8fc00a4a754c4050" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_place FK_516591335417f78d6cdfb7c5529; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place
    ADD CONSTRAINT "FK_516591335417f78d6cdfb7c5529" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: place_attributes FK_5a0dc75a3872cb0370ab5e4abfb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes
    ADD CONSTRAINT "FK_5a0dc75a3872cb0370ab5e4abfb" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: tx_posts FK_6255d788dc5d0d7671933bcda14; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_posts
    ADD CONSTRAINT "FK_6255d788dc5d0d7671933bcda14" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: trip_attributes FK_63fb775250aa97f89f8bbc8ccfc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_attributes
    ADD CONSTRAINT "FK_63fb775250aa97f89f8bbc8ccfc" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id);


--
-- Name: places_added_by_user FK_6e55802b23ee5bea7556173e78f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places_added_by_user
    ADD CONSTRAINT "FK_6e55802b23ee5bea7556173e78f" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: place_attributes FK_6f3b2fefb3e0650ef4139647a8a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes
    ADD CONSTRAINT "FK_6f3b2fefb3e0650ef4139647a8a" FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON DELETE CASCADE;


--
-- Name: post_categorizations FK_7bbccbdb45152656e26ecb98747; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categorizations
    ADD CONSTRAINT "FK_7bbccbdb45152656e26ecb98747" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: place_categories FK_7ec1da4a29d92f85602d0088b0c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories
    ADD CONSTRAINT "FK_7ec1da4a29d92f85602d0088b0c" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: people FK_7f7d05ab1f208effeadb7ee387e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT "FK_7f7d05ab1f208effeadb7ee387e" FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: user_places_likes FK_8081bd2417d5290ca7769a18074; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_likes
    ADD CONSTRAINT "FK_8081bd2417d5290ca7769a18074" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: hotels FK_83577f76dd4ce869241ae460028; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT "FK_83577f76dd4ce869241ae460028" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: post_blocs FK_8e8e2bb2c870a735809d0fcb6cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_8e8e2bb2c870a735809d0fcb6cb" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: user_places_preferences FK_96c43e3285bcf494296a7eab0f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_preferences
    ADD CONSTRAINT "FK_96c43e3285bcf494296a7eab0f8" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tx_categories FK_9b2afbbcff66db5726ee6754dae; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_categories
    ADD CONSTRAINT "FK_9b2afbbcff66db5726ee6754dae" FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: partners FK_9c090cdd81b1e06cc29af33672d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT "FK_9c090cdd81b1e06cc29af33672d" FOREIGN KEY (favorite_language) REFERENCES public.languages(id);


--
-- Name: post_categorizations FK_a6caa64c4ad0a2a9aaba962dfc1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categorizations
    ADD CONSTRAINT "FK_a6caa64c4ad0a2a9aaba962dfc1" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: tx_place FK_a7abd715c8e1a2b5032d99a0d7c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place
    ADD CONSTRAINT "FK_a7abd715c8e1a2b5032d99a0d7c" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_categories FK_baab2c83f1a767713a30f9870b7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_categories
    ADD CONSTRAINT "FK_baab2c83f1a767713a30f9870b7" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: trips FK_c32589af53db811884889e03663; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT "FK_c32589af53db811884889e03663" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: posts FK_c4f9a7bd77b489e711277ee5986; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tx_posts FK_c871d08bffc2ce32ebe4110fcea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_posts
    ADD CONSTRAINT "FK_c871d08bffc2ce32ebe4110fcea" FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: tx_post_img FK_d2c050e4b93dda085bf4c52fdc9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_img
    ADD CONSTRAINT "FK_d2c050e4b93dda085bf4c52fdc9" FOREIGN KEY (post_img_id) REFERENCES public.post_imgs(id);


--
-- Name: tx_category_city_lang FK_d4e440d601f134b92ac1eae6bcd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT "FK_d4e440d601f134b92ac1eae6bcd" FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: post_blocs FK_db35f2a297254a50d436e76246a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_db35f2a297254a50d436e76246a" FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: tx_country FK_dc88332346439778ce14468066a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_country
    ADD CONSTRAINT "FK_dc88332346439778ce14468066a" FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: post_blocs FK_dd33565e5cfa2e85c3e2040a88c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_dd33565e5cfa2e85c3e2040a88c" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: user_places_preferences FK_e5103507aff87ff1a54eefcec77; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_preferences
    ADD CONSTRAINT "FK_e5103507aff87ff1a54eefcec77" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: place_imgs FK_e6ad27514988b16c56ddf1dfc5d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_imgs
    ADD CONSTRAINT "FK_e6ad27514988b16c56ddf1dfc5d" FOREIGN KEY (place_id) REFERENCES public.places(id) ON DELETE CASCADE;


--
-- Name: restaurant_bars FK_f4121b2d5a4dbb094c16966d9af; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_bars
    ADD CONSTRAINT "FK_f4121b2d5a4dbb094c16966d9af" FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: places_added_by_user FK_f45de53ce12538d35b13423f50d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places_added_by_user
    ADD CONSTRAINT "FK_f45de53ce12538d35b13423f50d" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tx_category_city_lang FK_f4655421e4d48fbfae041800ba4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT "FK_f4655421e4d48fbfae041800ba4" FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_post_bloc FK_f47062b7606639fa5e1ba465db5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_bloc
    ADD CONSTRAINT "FK_f47062b7606639fa5e1ba465db5" FOREIGN KEY (post_bloc_id) REFERENCES public.post_blocs(id);


--
-- Name: post_blocs FK_ff6db2698ac8901e91cdc7632f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT "FK_ff6db2698ac8901e91cdc7632f8" FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: cities cities_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: cities cities_parent_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_parent_city_id_fkey FOREIGN KEY (parent_city_id) REFERENCES public.cities(id);


--
-- Name: crowd_levels crowd_levels_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crowd_levels
    ADD CONSTRAINT crowd_levels_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: hotels hotels_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: opening_hours opening_hours_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: partners partners_favorite_language_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_favorite_language_fkey FOREIGN KEY (favorite_language) REFERENCES public.languages(id);


--
-- Name: people people_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: place_attributes place_attributes_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes
    ADD CONSTRAINT place_attributes_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attributes(id);


--
-- Name: place_attributes place_attributes_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_attributes
    ADD CONSTRAINT place_attributes_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: place_categories place_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories
    ADD CONSTRAINT place_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: place_categories place_categories_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_categories
    ADD CONSTRAINT place_categories_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: place_imgs place_imgs_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_imgs
    ADD CONSTRAINT place_imgs_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: places_added_by_user places_added_by_user_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places_added_by_user
    ADD CONSTRAINT places_added_by_user_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: places_added_by_user places_added_by_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places_added_by_user
    ADD CONSTRAINT places_added_by_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: places places_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: post_blocs post_blocs_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: post_blocs post_blocs_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: post_blocs post_blocs_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: post_blocs post_blocs_place_img_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_place_img_id_fkey FOREIGN KEY (place_img_id) REFERENCES public.place_imgs(id);


--
-- Name: post_blocs post_blocs_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: post_blocs post_blocs_post_img_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_blocs
    ADD CONSTRAINT post_blocs_post_img_id_fkey FOREIGN KEY (post_img_id) REFERENCES public.post_imgs(id);


--
-- Name: post_categorizations post_categorizations_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categorizations
    ADD CONSTRAINT post_categorizations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: post_categorizations post_categorizations_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categorizations
    ADD CONSTRAINT post_categorizations_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tourist_attractions tourist_attractions_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tourist_attractions
    ADD CONSTRAINT tourist_attractions_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: trip_attributes trip_attributes_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_attributes
    ADD CONSTRAINT trip_attributes_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attributes(id);


--
-- Name: trip_attributes trip_attributes_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_attributes
    ADD CONSTRAINT trip_attributes_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_category_filter trip_category_filter_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_category_filter
    ADD CONSTRAINT trip_category_filter_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: trip_category_filter trip_category_filter_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_category_filter
    ADD CONSTRAINT trip_category_filter_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_composition trip_composition_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_composition
    ADD CONSTRAINT trip_composition_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: trip_composition trip_composition_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_composition
    ADD CONSTRAINT trip_composition_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trips trips_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: trips trips_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id);


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tx_attribute tx_attribute_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_attribute
    ADD CONSTRAINT tx_attribute_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attributes(id);


--
-- Name: tx_attribute tx_attribute_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_attribute
    ADD CONSTRAINT tx_attribute_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_category_city_lang tx_category_city_lang_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT tx_category_city_lang_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: tx_category_city_lang tx_category_city_lang_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT tx_category_city_lang_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: tx_category_city_lang tx_category_city_lang_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category_city_lang
    ADD CONSTRAINT tx_category_city_lang_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_category tx_category_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_category
    ADD CONSTRAINT tx_category_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_city tx_city_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_city
    ADD CONSTRAINT tx_city_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: tx_city tx_city_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_city
    ADD CONSTRAINT tx_city_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_country tx_country_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_country
    ADD CONSTRAINT tx_country_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: tx_country tx_country_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_country
    ADD CONSTRAINT tx_country_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_place_img tx_place_img_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place_img
    ADD CONSTRAINT tx_place_img_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_place_img tx_place_img_place_img_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place_img
    ADD CONSTRAINT tx_place_img_place_img_id_fkey FOREIGN KEY (place_img_id) REFERENCES public.place_imgs(id);


--
-- Name: tx_place tx_place_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place
    ADD CONSTRAINT tx_place_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_place tx_place_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_place
    ADD CONSTRAINT tx_place_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: tx_post_bloc tx_post_bloc_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_bloc
    ADD CONSTRAINT tx_post_bloc_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_post_bloc tx_post_bloc_post_bloc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_bloc
    ADD CONSTRAINT tx_post_bloc_post_bloc_id_fkey FOREIGN KEY (post_bloc_id) REFERENCES public.post_blocs(id);


--
-- Name: tx_post_img tx_post_img_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_img
    ADD CONSTRAINT tx_post_img_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_post_img tx_post_img_post_img_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post_img
    ADD CONSTRAINT tx_post_img_post_img_id_fkey FOREIGN KEY (post_img_id) REFERENCES public.post_imgs(id);


--
-- Name: tx_post tx_post_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post
    ADD CONSTRAINT tx_post_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: tx_post tx_post_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tx_post
    ADD CONSTRAINT tx_post_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: user_places_likes user_places_likes_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_likes
    ADD CONSTRAINT user_places_likes_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.users(id);


--
-- Name: user_places_likes user_places_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_likes
    ADD CONSTRAINT user_places_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_places_preferences user_places_preferences_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_preferences
    ADD CONSTRAINT user_places_preferences_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(id);


--
-- Name: user_places_preferences user_places_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_places_preferences
    ADD CONSTRAINT user_places_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_favorite_language_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_favorite_language_fkey FOREIGN KEY (favorite_language) REFERENCES public.languages(id);


--
-- PostgreSQL database dump complete
--

