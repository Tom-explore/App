// src/components/PlacesMarkers.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Place } from '../types/PlacesInterfaces';
import '../styles/components/PlaceMarker.css';

interface PlacesMarkersProps {
    places: Place[];
    zoomLevel: number;
}

// Définir une interface pour Marker avec Place
interface MarkerWithPlace extends L.Marker {
    place: Place;
}

// Définir une interface pour le composant MarkerWithPlaceComponent
interface MarkerWithPlaceComponentProps {
    place: Place;
    position: [number, number];
    icon: Icon;
    children?: React.ReactNode;
}

const PlacesMarkers: React.FC<PlacesMarkersProps> = React.memo(({ places, zoomLevel }) => {
    const calculateMarkerSize = useCallback((zoom: number): [number, number] => {
        const baseSize = 30; // Taille de base pour les marqueurs individuels
        const scaleFactor = 2;
        const size = baseSize + (zoom - 6) * scaleFactor;
        return [Math.max(size, 20), Math.max(size, 20)];
    }, []);

    // Fonction pour créer l'icône du cluster avec taille proportionnelle et z-index
    const createClusterIcon = useCallback((cluster: any) => {
        const markers = cluster.getAllChildMarkers() as MarkerWithPlace[];

        if (markers.length === 0) {
            // Fallback si aucun marker n'est trouvé
            return L.divIcon({
                html: `<div class="custom-cluster-icon">0</div>`,
                className: 'custom-cluster',
                iconSize: L.point(60, 60, true), // Taille minimale des clusters
            });
        }

        // Trouver la place avec le plus grand nombre de critiques
        const bestPlace = markers
            .map(marker => marker.place)
            .filter(place => place.reviews_google_count !== undefined && place.reviews_google_count !== null)
            .sort((a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0))[0];

        // Déterminer l'URL de l'image
        const imageUrl = bestPlace && bestPlace.images && bestPlace.images.length > 0 && bestPlace.images[0].slug
            ? `https://lh3.googleusercontent.com/p/${bestPlace.images[0].slug}`
            : '/assets/img/compass.png';

        // Calculer la taille de l'icône en fonction du nombre de markers
        const count = cluster.getChildCount();
        const baseClusterSize = 60; // Taille minimale des clusters
        const maxClusterSize = 120; // Taille maximale des clusters
        const size = Math.min(baseClusterSize + Math.log(count) * 20, maxClusterSize); // Formule logarithmique

        // Calculer un z-index basé sur reviews_google_count
        const zIndex = (bestPlace.reviews_google_count || 0) + count; // Plus de critiques signifie un z-index plus élevé

        return L.divIcon({
            html: `
                <div class="custom-cluster-icon" style="width: ${size}px; height: ${size}px; z-index: ${zIndex};">
                    <img src="${imageUrl}" alt="${bestPlace.name_original || bestPlace.slug}" />
                    <span>${count}</span>
                </div>
            `,
            className: 'custom-cluster',
            iconSize: L.point(size, size, true),
        });
    }, []);

    return (
        <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
        >
            {places.map((place) => {
                if (!place.lat || !place.lng) {
                    console.error('Invalid coordinates for place:', place);
                    return null;
                }

                const [iconWidth, iconHeight] = calculateMarkerSize(zoomLevel);

                const imageUrl =
                    place.images && place.images.length > 0 && place.images[0].slug
                        ? `https://lh3.googleusercontent.com/p/${place.images[0].slug}`
                        : '/assets/img/compass.png';

                const icon = L.icon({
                    iconUrl: imageUrl,
                    iconSize: [iconWidth, iconHeight],
                    iconAnchor: [iconWidth / 2, iconHeight],
                    popupAnchor: [0, -iconHeight],
                    className: 'custom-marker-icon',
                });

                return (
                    <MarkerWithPlaceComponent
                        key={place.id}
                        position={[place.lat, place.lng]}
                        icon={icon}
                        place={place}
                    >
                        <Popup>
                            <div className="popup-content">
                                {place.images && place.images.length > 0 && place.images[0].source && (
                                    <img
                                        src={place.images[0].source}
                                        alt={place.description}
                                        className="popup-image"
                                        loading="lazy" /* Lazy loading */
                                    />
                                )}
                                <h3 className="popup-title">{place.name_original || place.slug}</h3>
                                <p className="popup-description">{place.description}</p>
                                <p>
                                    <strong>Address:</strong> {place.address}
                                </p>
                                {/* Vos autres champs : link_website, link_maps, etc. */}
                                {place.link_website && (
                                    <a href={place.link_website} target="_blank" rel="noopener noreferrer" className="visit-button">
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </Popup>
                    </MarkerWithPlaceComponent>
                );
            })}
        </MarkerClusterGroup>
    );
});

// Composant pour attacher les données de la place au marker
const MarkerWithPlaceComponent: React.FC<MarkerWithPlaceComponentProps> = React.memo(({ place, ...props }) => {
    const markerRef = useRef<L.Marker>(null);

    // Attacher la place au marker pour y accéder dans iconCreateFunction
    useEffect(() => {
        if (markerRef.current) {
            (markerRef.current as MarkerWithPlace).place = place;
        }
    }, [place]);

    return <Marker ref={markerRef} {...props}>{props.children}</Marker>;
});

export default PlacesMarkers;
