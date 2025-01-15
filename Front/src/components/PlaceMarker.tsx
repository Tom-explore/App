// src/components/PlaceMarker.tsx

import React, { useEffect, useRef, useMemo } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import '../styles/components/PlaceMarker.css';
import { getEmoji } from '../util/IconFinder';
import { throttle } from 'lodash';
import { usePlacesMarkers } from '../util/usePlaceMarkers';

interface PlacesMarkersProps {
    places: Place[];
    onClickPlace: (place: Place) => void;
    activePlace?: Place | null;
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
        const map = useMap();
        const [currentZoom, setCurrentZoom] = React.useState<number>(map.getZoom());

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

        const {
            sortedPlaces,
            getScaleLevel,
            calculateSize,
            createClusterIcon,
        } = usePlacesMarkers(places);
        // Au début du composant PlacesMarkers
        console.log("[PlaceMarkers] Received places:", places);



        // Utilisation d'un prédicat de type dans le filtre
        const markersData = useMemo(() => {
            return sortedPlaces
                .filter((place): place is Place & { lat: number; lng: number } =>
                    place.lat !== undefined && place.lng !== undefined
                )
                .map(place => {
                    const scaleLevel = getScaleLevel(place.reviews_google_count || 0);
                    const [iconWidth, iconHeight] = calculateSize(scaleLevel);
                    const zIndex = scaleLevel * 10;

                    const imageUrl =
                        place.images && place.images.length > 0 && place.images[0].slug
                            ? `https://api.allorigins.win/raw?url=https://lh3.googleusercontent.com/p/${place.images[0].slug}`
                            : '/assets/img/compass.png';

                    const emoji = place.placeType === PlaceType.RESTAURANT_BAR
                        ? getEmoji(place.categories, place.attributes)
                        : null;

                    // Créer l'icône sans utiliser de hook
                    const icon = L.divIcon({
                        html: place.placeType === PlaceType.RESTAURANT_BAR ? `
                            <div class="custom-marker-icon" style="
                                width: ${iconWidth}px;
                                height: ${iconHeight}px;
                                font-size: 1.5rem;
                                z-index: ${zIndex};
                                display: flex;
                                align-items: center;
                                justify-content: center;
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
                        ` : `
                            <div class="custom-marker-icon" style="
                                width: ${iconWidth}px;
                                height: ${iconHeight}px;
                                font-size: 1.5rem;
                                z-index: ${zIndex};
                                display: flex;
                                align-items: center;
                                justify-content: center;
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

                    return {
                        place,
                        position: [place.lat, place.lng] as [number, number], // Assertion de type
                        icon,
                        zIndex,
                    };
                });
        }, [sortedPlaces, getScaleLevel, calculateSize]);

        return (
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterIcon}
            >
                {markersData.map(({ place, position, icon, zIndex }) => (
                    <MarkerWithPlaceComponent
                        key={place.id}
                        position={position}
                        icon={icon}
                        place={place}
                        onClickPlace={onClickPlace}
                        activePlace={activePlace}
                        zIndexOffset={zIndex}
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
                ))}
            </MarkerClusterGroup>
        );
    }
);
const MarkerWithPlaceComponent: React.FC<MarkerWithPlaceComponentProps> = React.memo(
    ({ place, onClickPlace, activePlace, ...props }) => {
        const markerRef = useRef<L.Marker>(null);
        const map = useMap();

        useEffect(() => {
            if (markerRef.current) {
                (markerRef.current as any).place = place;
            }
        }, [place]);

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
