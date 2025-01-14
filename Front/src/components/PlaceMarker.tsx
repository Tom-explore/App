// src/components/PlacesMarkers.tsx

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L, { Icon, DivIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import '../styles/components/PlaceMarker.css';
import { getEmoji } from '../util/IconFinder'; // Import getEmoji instead of IconFinder
import { throttle } from 'lodash';
import { scale } from 'ionicons/icons';

interface PlacesMarkersProps {
    places: Place[];
    onClickPlace: (place: Place) => void;
    activePlace?: Place | null;
}

interface MarkerWithPlace extends L.Marker {
    place: Place;
}

interface MarkerWithPlaceComponentProps {
    place: Place;
    position: [number, number];
    icon: L.Icon<any> | DivIcon;
    onClickPlace: (place: Place) => void;
    activePlace?: Place | null;
    children?: React.ReactNode;
    zIndexOffset?: number;

}

const PlacesMarkers: React.FC<PlacesMarkersProps> = React.memo(
    ({ places, onClickPlace, activePlace }) => {
        const map = useMap(); // Access the map instance

        // State to hold the current zoom level
        const [currentZoom, setCurrentZoom] = useState<number>(map.getZoom());

        useEffect(() => {
            const throttledHandleZoom = throttle(() => {
                setCurrentZoom(map.getZoom());
            }, 30);

            map.on('zoom', throttledHandleZoom);
            return () => {
                map.off('zoom', throttledHandleZoom);
                throttledHandleZoom.cancel();
            };
        }, [map]);

        /**
         * 1) Sort the places by their placeType
         */
        const sortedPlaces = React.useMemo(() => {
            const placeTypeOrder: PlaceType[] = [
                PlaceType.TOURIST_ATTRACTION,
                PlaceType.HOTEL,
                PlaceType.RESTAURANT_BAR,
            ];
            return [...places].sort((a, b) => {
                return (
                    placeTypeOrder.indexOf(a.placeType) - placeTypeOrder.indexOf(b.placeType)
                );
            });
        }, [places]);

        /**
         * Calculer la moyenne des comptes de reviews Google
         */
        const averageReviewCount = React.useMemo(() => {
            if (places.length === 0) return 0;
            const total = places.reduce((sum, place) => sum + (place.reviews_google_count || 0), 0);
            return total / places.length;
        }, [places]);

        /**
         * Fonction pour obtenir le niveau de scale basé sur le compte de reviews
         */
        const getScaleLevel = useCallback(
            (reviewCount: number): number => {
                if (averageReviewCount === 0) return 1;
                const ratio = reviewCount / averageReviewCount;
                const scale = Math.log10(ratio); // +1 pour éviter log(0)
                const normalizedScale = Math.min(Math.max(scale * 2, 1), 10);
                return normalizedScale;
            },
            [averageReviewCount]
        );

        /**
         * 2) Calculate icon size based on currentZoom et l'échelle
         */
        const calculateMarkerSize = useCallback(
            (zoom: number, reviewCount: number): [number, number] => {
                const scaleLevel = getScaleLevel(reviewCount);
                const baseSize = 40;
                const scaleFactor = 30;
                const sizeFromZoom = baseSize + (zoom - 6) * scaleFactor;
                let finalSize = sizeFromZoom * scaleLevel / 5; // Ajuster la taille en fonction du scaleLevel

                // Assurer que la taille finale est dans des limites raisonnables
                finalSize = Math.max(15, Math.min(finalSize, 200));

                return [finalSize, Math.max(finalSize, 24)];
            },
            [getScaleLevel]
        );

        // 1) On ajoute la fonction calculateClusterSize
        const calculateClusterSize = useCallback(
            (zoom: number, reviewCount: number): number => {
                // On peut reprendre exactement la même logique de calcul
                const scaleLevel = getScaleLevel(reviewCount);
                const baseSize = 40;
                const scaleFactor = 55;
                const sizeFromZoom = baseSize + (zoom - 6) * scaleFactor;
                let finalSize = (sizeFromZoom * scaleLevel) / 5; // Ajuster la taille en fonction du scaleLevel

                // Assurer que la taille finale est dans des limites raisonnables
                finalSize = Math.max(15, Math.min(finalSize, 200));

                return finalSize;
            },
            [getScaleLevel]
        );

        // 2) On modifie createClusterIcon pour utiliser calculateClusterSize
        const createClusterIcon = useCallback(
            (cluster: any) => {
                const markers = cluster.getAllChildMarkers() as MarkerWithPlace[];

                if (markers.length === 0) {
                    const clusterIconHTML = `<div class="custom-cluster-icon">0</div>`;
                    return L.divIcon({
                        html: clusterIconHTML,
                        className: 'custom-cluster',
                        iconSize: L.point(60, 60, true),
                        iconAnchor: [30, 30],
                    });
                }

                const bestPlace = markers
                    .map((marker) => marker.place)
                    .filter(
                        (p) => p.reviews_google_count !== undefined && p.reviews_google_count !== null
                    )
                    .sort(
                        (a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0)
                    )[0];

                if (!bestPlace) {
                    const clusterIconHTML = `<div class="custom-cluster-icon">0</div>`;
                    return L.divIcon({
                        html: clusterIconHTML,
                        className: 'custom-cluster',
                        iconSize: L.point(60, 60, true),
                        iconAnchor: [30, 30],
                    });
                }

                // Récupérer la valeur de zoom courant (depuis l'état currentZoom)
                // qui est mis à jour dans le useEffect sur map.on('zoom', ...)
                const zoom = currentZoom; // par exemple

                const count = cluster.getChildCount();
                const scaleLevel = getScaleLevel(bestPlace.reviews_google_count || 0);
                // Par exemple on mappe [1..10] vers [100..1000] ou simplement [1..10].
                const zIndex = Math.round(scaleLevel * 100);
                // On récupère la taille via calculateClusterSize
                const finalSize = calculateClusterSize(zoom, bestPlace.reviews_google_count || 0);

                // Ensuite on construit le HTML du cluster
                let clusterContent: string;
                if (bestPlace.placeType === PlaceType.RESTAURANT_BAR) {
                    const emoji = getEmoji(bestPlace.categories, bestPlace.attributes);
                    clusterContent = `
                <div
                    class="custom-cluster-icon"
                    style="
                        width: ${finalSize}px;
                        height: ${finalSize}px;
                        z-index: ${zIndex};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        font-size: 1.5rem;
                    "
                >
                    <span class="icon-finder">${emoji}</span>
                    <span
                        style="
                            position: absolute;
                            bottom: 5px;
                            right: 5px;
                            background: rgba(255,255,255,0.8);
                            border-radius: 50%;
                            padding: 2px 5px;
                            font-size: 0.8rem;
                        "
                    >
                        ${count}
                    </span>
                </div>
            `;
                } else {
                    const imageUrl =
                        bestPlace.images && bestPlace.images.length > 0 && bestPlace.images[0].slug
                            ? `https://lh3.googleusercontent.com/p/${bestPlace.images[0].slug}`
                            : '/assets/img/compass.png';
                    clusterContent = `
                <div
                    class="custom-cluster-icon"
                    style="
                        width: ${finalSize}px;
                        height: ${finalSize}px;
                        z-index: ${zIndex};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    "
                >
                    <img
                        src="${imageUrl}"
                        alt="${bestPlace?.name_original || bestPlace?.slug}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 50%;
                        "
                    />
                    <span
                        style="
                            position: absolute;
                            bottom: 5px;
                            right: 5px;
                            background: rgba(255,255,255,0.8);
                            border-radius: 50%;
                            padding: 2px 5px;
                            font-size: 0.8rem;
                        "
                    >
                        ${count}
                    </span>
                </div>
            `;
                }

                return L.divIcon({
                    html: clusterContent,
                    className: 'custom-cluster',
                    iconSize: L.point(finalSize, finalSize, true),
                    iconAnchor: [finalSize / 2, finalSize / 2],
                });
            },
            [
                currentZoom, // Assurez-vous d'inclure dans vos dépendances
                calculateClusterSize,
                getScaleLevel,
                getEmoji,
            ]
        );

        /**
         * 4) Final render of markers (sortedPlaces)
         */
        return (
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
                {sortedPlaces.map((place) => {

                    if (!place.lat || !place.lng) {
                        console.error('Invalid coordinates for place:', place);
                        return null;
                    }
                    const scaleLevel = getScaleLevel(place.reviews_google_count || 0);
                    // Par exemple on mappe [1..10] vers [100..1000] ou simplement [1..10].
                    const zIndex = Math.round(scaleLevel * 100);
                    const [iconWidth, iconHeight] = calculateMarkerSize(
                        currentZoom,
                        place.reviews_google_count || 0
                    );

                    const imageUrl =
                        place.images && place.images.length > 0 && place.images[0].slug
                            ? `https://lh3.googleusercontent.com/p/${place.images[0].slug}`
                            : '/assets/img/compass.png';

                    const emoji = place.placeType === PlaceType.RESTAURANT_BAR
                        ? getEmoji(place.categories, place.attributes)
                        : null;

                    const icon = React.useMemo(() => {

                        if (place.placeType === PlaceType.RESTAURANT_BAR) {

                            return L.divIcon({
                                html: `
                              <div class="custom-marker-icon" style="
                                            width: ${iconWidth}px;
                                            height: ${iconHeight}px;
                                            font-size: 1.5rem;
                                                  z-index: ${zIndex};
                                        ">
                                            <span class="icon-finder">${emoji}</span>
                                        </div>
                                        <span style="
                                            margin-top: 5px;
                                            font-size: 0.8rem;
                                            color: #333;
                                            background: rgba(255, 255, 255, 0.8);
                                            border-radius: 5px;
                                            padding: 2px 6px;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                            display: block;
                                            text-align: center;
                                        ">
                                            ${place.translation?.name || ''}
                                        </span>
                                    `,
                                className: 'custom-marker-icon',
                                iconSize: L.point(iconWidth, iconHeight, true),
                                iconAnchor: [iconWidth / 2, iconHeight / 2],
                                popupAnchor: [0, -iconHeight / 2],
                            });
                        } else {
                            // On utilise ici également un L.divIcon pour appliquer le style et ajouter le nom
                            return L.divIcon({
                                html: `
                                        <div class="custom-marker-icon" style="
                                            width: ${iconWidth}px;
                                            height: ${iconHeight}px;
                                            font-size: 1.5rem;
                                                  z-index: ${zIndex};
                                        ">
                                            <img 
                                                src="${imageUrl}" 
                                                alt="marker-icon" 
                                                style="
                                                    width: 100%;
                                                    height: 100%;
                                                    border-radius: 50%;
                                                    object-fit: cover;
                                                "
                                            />
                                        </div>
                                        <span style="
                                            margin-top: 5px;
                                            font-size: 1.2rem;
                                            color: #333;
                                            background: rgba(255, 255, 255, 0.8);
                                            border-radius: 5px;
                                            padding: 2px 6px;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                            display: block;
                                            text-align: center;
                                        ">
                                            ${place.translation?.name || ''}
                                        </span>
                                    `,
                                className: 'custom-marker-icon',
                                iconSize: L.point(iconWidth, iconHeight, true),
                                iconAnchor: [iconWidth / 2, iconHeight / 2],
                                popupAnchor: [0, -iconHeight / 2],
                            });
                        }
                    }, [
                        imageUrl,
                        iconWidth,
                        iconHeight,
                        place.placeType,
                        emoji,
                        currentZoom,
                        map,
                    ]);

                    return (
                        <MarkerWithPlaceComponent
                            key={place.id}
                            position={[place.lat, place.lng]}
                            icon={icon as L.Icon<any>}
                            place={place}
                            onClickPlace={onClickPlace}
                            activePlace={activePlace}
                            zIndexOffset={zIndex} // <--- on transmet ici

                        >
                            <Popup>
                                <div className="popup-content">
                                    {place.images &&
                                        place.images.length > 0 &&
                                        place.images[0].source && (
                                            <img
                                                src={place.images[0].source}
                                                alt={place.description}
                                                className="popup-image"
                                                loading="lazy"
                                            />
                                        )}
                                    <h3 className="popup-title">
                                        {place.translation?.name || place.name_original}
                                    </h3>
                                    <p className="popup-description">{place.description}</p>
                                    <p>
                                        <strong>Address:</strong> {place.address}
                                    </p>
                                    {place.link_website && (
                                        <a
                                            href={place.link_website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="visit-button"
                                        >
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
    }
);

// Component to attach place data to the marker and handle popup
const MarkerWithPlaceComponent: React.FC<MarkerWithPlaceComponentProps> = React.memo(
    ({ place, onClickPlace, activePlace, ...props }) => {
        const markerRef = useRef<L.Marker>(null);
        const map = useMap(); // Access the map instance

        // Attach the place to the marker for access in iconCreateFunction
        useEffect(() => {
            if (markerRef.current) {
                (markerRef.current as MarkerWithPlace).place = place;
            }
        }, [place]);

        // Open popup if this marker is the activePlace
        useEffect(() => {
            if (markerRef.current && activePlace && activePlace.id === place.id) {
                markerRef.current.openPopup();

            }
        }, [activePlace, place.id, map]);

        return (
            <Marker
                ref={markerRef}
                {...props}
                eventHandlers={{
                    click: () => {
                        onClickPlace(place);
                    },
                }}
            >
                {props.children}
            </Marker>
        );
    }
);

export default PlacesMarkers;
