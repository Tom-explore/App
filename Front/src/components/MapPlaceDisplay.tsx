// src/components/MapPlacesDisplay.tsx

import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import Map from "./Map";
import PlaceCarousel from "./PlaceCarousel";
import { Place } from "../types/PlacesInterfaces";
import { Category, Attribute } from "../types/CategoriesAttributesInterfaces";
import "../styles/components/MapPlaceDisplay.css";
import PlacesMarkers from "./PlaceMarker";
import { useCity } from "../context/cityContext";

// --- AJOUTS ---
import FilterPlaces from "./FilterPlaces";
import useFilterPlaces from "../util/useFilterPlaces";
import { useLanguage } from "../context/languageContext";

interface MapPlacesDisplayProps {
  places: Place[];
  categories: Category[];
  attributes: Attribute[];
}

const MapPlacesDisplay: React.FC<MapPlacesDisplayProps> = ({
  places,
  categories,
  attributes,
}) => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(3.5);
  const [activePlace, setActivePlace] = useState<Place | null>(null); // lieu cliqué
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const city = useCity();
  const initialZoom = isMobile ? 3.5 : 5;
  const position: [number, number] = isMobile
    ? [38.134, 11.5799]
    : [48.134, 11.5799];

  // ----------------------------------------------------------------
  // 1) Hook de filtrage : on part de la liste "places" passée en props
  // ----------------------------------------------------------------
  const { language } = useLanguage(); // si vous avez besoin de l'ID de langue
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);

  const {
    selectedCategories,
    selectedAttributes,
    handleCategoryChange,
    handleAttributeChange,
    getTranslation,
    isUserInteraction,
  } = useFilterPlaces({
    categories,
    attributes,
    allPlaces: places,
    onFilterChange: setFilteredPlaces,
    languageID: language.id, // ou language.id si dispo
  });

  // ----------------------------------------------------------------
  // 2) Limites éventuelles de la map en fonction de la ville
  // ----------------------------------------------------------------
  const getBoundaries = ():
    | [[number, number], [number, number]]
    | undefined => {
    if (city?.city) {
      const buffer = 0.5;
      const [lat, lng] = [city.city.lat, city.city.lng];
      return [
        [lat - buffer, lng - buffer],
        [lat + buffer, lng + buffer],
      ];
    }
    return undefined;
  };
  const boundaries = getBoundaries();

  // ----------------------------------------------------------------
  // 3) useEffect : recadrer/zoom la carte au premier chargement
  //    ou quand les places changent, tant qu'aucune place n'est active
  // ----------------------------------------------------------------
  useEffect(() => {
    // Si on a déjà un lieu actif, on n'essaie plus de recentrer/zoomer la map
    if (activePlace) {
      return;
    }

    if (places.length === 0) {
      setCenter(null);
      setZoom(initialZoom);
      return;
    }

    if (places.length === 1) {
      const { lat, lng } = city?.city || {};
      if (lat !== undefined && lng !== undefined) {
        const adjustedLat = isMobile ? lat - 0.1 : lat;
        setCenter([adjustedLat, lng]);
        setZoom(9);
      } else {
        console.warn("City coordinates are missing.");
      }
    } else {
      // On calcule un centrage moyen sur toutes les places
      const latitudes = places
        .map((p) => p.lat)
        .filter((lat) => lat !== undefined) as number[];
      const longitudes = places
        .map((p) => p.lng)
        .filter((lng) => lng !== undefined) as number[];

      if (latitudes.length > 0 && longitudes.length > 0) {
        const avgLat =
          latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
        const avgLng =
          longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

        setCenter(isMobile ? [avgLat - 10, avgLng] : [avgLat, avgLng]);
        setZoom(isMobile ? 3 : 6);
      } else {
        console.warn("No valid coordinates found in places.");
      }
    }
  }, [places, activePlace, isMobile, initialZoom, city]);

  // ----------------------------------------------------------------
  // 4) Si pas de center défini => rien à afficher (ou un loader)
  // ----------------------------------------------------------------
  if (!center) {
    return null;
  }

  // ----------------------------------------------------------------
  // 5) Rendu principal
  // ----------------------------------------------------------------
  return (
    <div className="map-container">
      {/* 5a. Panneau de filtres (à positionner comme vous le voulez) */}

      {/* 5b. La map */}
      <Map
        initialZoom={initialZoom}
        initialPosition={position}
        center={center}
        zoom={zoom}
        minZoom={isMobile ? 3 : 12}
        boundaries={boundaries}
        isMobile={isMobile}
        isFeed={true}
      >
        {/* On passe 'filteredPlaces' au lieu de 'places' */}
        <PlacesMarkers
          places={filteredPlaces}
          zoomLevel={zoom}
          onClickPlace={setActivePlace}
          categories={categories}
          attributes={attributes}
        />
      </Map>

      {/* 5c. Le carousel (lui aussi avec la liste filtrée) */}
      <div className="carousel-wrapper">
        <PlaceCarousel
          allPlaces={filteredPlaces}
          isPreview={false}
          isMobile={isMobile}
          categories={categories}
          attributes={attributes}
          activePlace={activePlace}
        />
      </div>
    </div>
  );
};

export default MapPlacesDisplay;
