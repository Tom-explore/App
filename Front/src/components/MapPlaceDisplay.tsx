import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IonContent, IonPage } from "@ionic/react";
import Map from "./Map";
import PlaceCarousel from "./PlaceCarousel";
import { Place } from "../types/PlacesInterfaces";
import { Category, Attribute } from "../types/CategoriesAttributesInterfaces";
import "../styles/components/MapPlaceDisplay.css";
import PlacesMarkers from "./PlaceMarker";
import { useCity } from "../context/cityContext";
import { useLanguage } from "../context/languageContext";

interface Coordinates {
    lat: number;
    lng: number;
}

interface MapPlacesDisplayProps {
    places: Place[];
    categories: Category[];
    attributes: Attribute[];
    selectedCategories: number[];
    selectedAttributes: number[];
    handleCategoryChange: (id: number) => void;
    handleAttributeChange: (id: number) => void;
    getTranslation: (slug: string, type: "attributes" | "categories") => string;
}

const MapPlacesDisplay: React.FC<MapPlacesDisplayProps> = ({
    places,
    categories,
    attributes,
    selectedCategories,
    selectedAttributes,
    handleCategoryChange,
    handleAttributeChange,
    getTranslation,
}) => {
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [zoom, setZoom] = useState<number>(3.5);
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const city = useCity();
    const initialZoom = isMobile ? 3.5 : 5;
    const position: [number, number] = isMobile
        ? [38.134, 11.5799]
        : [48.134, 11.5799];

    const memoizedCategories = useMemo(() => categories, [categories]);
    const memoizedAttributes = useMemo(() => attributes, [attributes]);

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
    const boundaries = useMemo(getBoundaries, [city]);

    // Effect for initial map setup
    useEffect(() => {
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
                console.warn("Les coordonnées de la ville sont manquantes.");
            }
        } else {
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
                console.warn("Aucune coordonnée valide trouvée dans les places.");
            }
        }
    }, [places, isMobile, initialZoom, city]);

    // New effect to handle activePlace changes
    useEffect(() => {
        if (activePlace && activePlace.lat && activePlace.lng) {
            const adjustedLat = isMobile ? activePlace.lat - 0.1 : activePlace.lat;
            setCenter([adjustedLat, activePlace.lng]);
            setZoom(12); // You can adjust this zoom level as needed
        }
    }, [activePlace, isMobile]);

    const sortedPlaces = useMemo(() => {
        return places
            .filter((p) => (p.reviews_google_count || 0) >= 100)
            .sort(
                (a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0)
            );
    }, [places]);

    if (!center) {
        return null;
    }

    return (
        <div className="map-container">
            <Map
                initialZoom={initialZoom}
                initialPosition={position}
                center={center}
                zoom={zoom}
                minZoom={isMobile ? 3 : 12}
                boundaries={boundaries}
                isMobile={isMobile}
                isFeed={true}
                onZoomChange={setZoom}
            >
                <PlacesMarkers
                    places={sortedPlaces}
                    onClickPlace={setActivePlace}
                    activePlace={activePlace}
                    selectedCategories={selectedCategories}
                    selectedAttributes={selectedAttributes}
                    getTranslation={getTranslation}
                />
            </Map>

            <div className="carousel-wrapper">
                <PlaceCarousel
                    allPlaces={sortedPlaces}
                    isPreview={false}
                    isMobile={isMobile}
                    categories={memoizedCategories}
                    attributes={memoizedAttributes}
                    selectedCategories={selectedCategories}
                    selectedAttributes={selectedAttributes}
                    activePlace={activePlace}
                    setActivePlace={setActivePlace}
                    getTranslation={getTranslation}
                />
            </div>
        </div>
    );
};

export default React.memo(MapPlacesDisplay);
