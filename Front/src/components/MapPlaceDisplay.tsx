// src/components/MapPlacesDisplay.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Map from './Map';
import PlaceCarousel from './PlaceCarousel';
import { Place } from '../types/PlacesInterfaces';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
import '../styles/components/MapPlaceDisplay.css';
import PlacesMarkers from './PlaceMarker'; // Assurez-vous du bon import
import { useCity } from '../context/cityContext';

// --- IMPORTS ADDITIONNELS ---
import FilterPlaces from './FilterPlaces';
import useFilterPlaces from '../util/useFilterPlaces';
import { useLanguage } from '../context/languageContext';

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
    const [activePlace, setActivePlace] = useState<Place | null>(null); // État de l'endroit actif
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const city = useCity();
    const initialZoom = isMobile ? 3.5 : 5;
    const position: [number, number] = isMobile
        ? [38.134, 11.5799]
        : [48.134, 11.5799];

    // Hook de filtrage : commence par la liste "places" passée en props
    const { language } = useLanguage(); // Si vous avez besoin de l'ID de la langue
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
        languageID: language.id, // ou language.id si disponible
    });

    // Mémorisation des catégories et attributs pour éviter les re-renders inutiles
    const memoizedCategories = useMemo(() => categories, [categories]);
    const memoizedAttributes = useMemo(() => attributes, [attributes]);

    // Limites possibles de la carte en fonction de la ville
    const getBoundaries = (): [[number, number], [number, number]] | undefined => {
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

    // useEffect : recentrer/zoomer la carte au premier chargement ou lorsque les places changent,
    // tant qu'aucun endroit n'est actif
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
                console.warn('Les coordonnées de la ville sont manquantes.');
            }
        } else {
            // Calculer un centre moyen pour toutes les places
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
                console.warn('Aucune coordonnée valide trouvée dans les places.');
            }
        }
    }, [places, isMobile, initialZoom, city]); // Retiré 'activePlace' des dépendances

    // Mémoriser les places filtrées et triées
    const sortedPlaces = useMemo(() => {
        return filteredPlaces
            .filter((p) => (p.reviews_google_count || 0) >= 100)
            .sort((a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0));
    }, [filteredPlaces]);

    // Si aucun centre défini => rien à afficher (ou un loader)
    if (!center) {
        return null; // Envisagez d'ajouter un loader pour une meilleure UX
    }

    // JSX Render
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="map-container">
                    {/* Panneau des filtres */}
                    <div className="filters-panel">
                        <FilterPlaces
                            categories={memoizedCategories}
                            attributes={memoizedAttributes}
                            selectedCategories={selectedCategories}
                            selectedAttributes={selectedAttributes}
                            handleCategoryChange={handleCategoryChange}
                            handleAttributeChange={handleAttributeChange}
                            getTranslation={getTranslation}
                            onUserInteractionChange={() => { /* si nécessaire */ }}
                        />
                    </div>

                    {/* Carte */}
                    <Map
                        initialZoom={initialZoom}
                        initialPosition={position}
                        center={center}
                        zoom={zoom}
                        minZoom={isMobile ? 3 : 12}
                        boundaries={boundaries}
                        isMobile={isMobile}
                        isFeed={true}
                        onZoomChange={setZoom} // Passez setZoom pour gérer les changements de zoom
                    >
                        {/* Passez activePlace à PlacesMarkers */}
                        <PlacesMarkers
                            places={sortedPlaces}
                            onClickPlace={setActivePlace}
                            activePlace={activePlace} // Passez activePlace
                        />
                    </Map>

                    {/* Carousel */}
                    <div className="carousel-wrapper">
                        <PlaceCarousel
                            allPlaces={filteredPlaces}
                            isPreview={false}
                            isMobile={isMobile}
                            categories={memoizedCategories}
                            attributes={memoizedAttributes}
                            activePlace={activePlace}
                            setActivePlace={setActivePlace} // Passez setActivePlace
                        />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default React.memo(MapPlacesDisplay);
