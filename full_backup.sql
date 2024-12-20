--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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

--
-- PostgreSQL database dump complete
--

