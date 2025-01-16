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
    selectedCategories: number[];
    selectedAttributes: number[];
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;
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
    ({ places, onClickPlace, activePlace, selectedCategories, selectedAttributes, getTranslation }) => {
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

        // Séparer les places actives des autres
        const clusteredPlaces = useMemo(() => {
            return sortedPlaces.filter(place => !(activePlace && place.id === activePlace.id));
        }, [sortedPlaces, activePlace]);

        const activePlaceMarker = useMemo(() => {
            if (!activePlace || activePlace.lat === undefined || activePlace.lng === undefined) return null;

            const scaleLevel = getScaleLevel(activePlace.reviews_google_count || 0);
            const [iconWidth, iconHeight] = calculateSize(scaleLevel, activePlace.placeType);
            const zIndex = scaleLevel * 10;

            const isRestaurantBar = activePlace.placeType === PlaceType.RESTAURANT_BAR;
            const imageUrl = !isRestaurantBar && activePlace.images && activePlace.images.length > 0 && activePlace.images[0].slug
                ? `https://api.allorigins.win/raw?url=https://lh3.googleusercontent.com/p/${activePlace.images[0].slug}`
                : '/assets/img/compass.png';

            const emoji = isRestaurantBar ? getEmoji(activePlace.categories, activePlace.attributes) : null;

            const selectedHashtags = [
                ...activePlace.categories.filter(cat => selectedCategories.includes(cat.id)).map(cat => ({
                    ...cat,
                    translatedName: getTranslation(cat.slug, 'categories'),
                })),
                ...activePlace.attributes.filter(attr => selectedAttributes.includes(attr.id)).map(attr => ({
                    ...attr,
                    translatedName: getTranslation(attr.slug, 'attributes'),
                })),
            ];

            const markerContent = isRestaurantBar
                ? `<div class="custom-marker-icon emoji-marker" style="
                    width: ${iconWidth}px;
                    height: ${iconHeight}px;
                    z-index: ${zIndex};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    font-size: ${iconWidth * 0.8}px;
                  ">
                    ${emoji}
                  </div>`
                : `<div class="custom-marker-icon" style="
                    width: ${iconWidth}px;
                    height: ${iconHeight}px;
                    z-index: ${zIndex};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                  ">
                    <img
                        src="${imageUrl}"
                        alt="${activePlace.translation?.name || activePlace.name_original}"
                        style="
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            object-fit: cover;
                            border: 2px solid white;
                        "
                    />
                  </div>`;

            const icon = L.divIcon({
                html: `
                    ${markerContent}
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
                        ${activePlace.translation?.name || ''}
                        <div style="
                            margin-top: 5px;
                            font-size: 0.8rem;
                            color: #555;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 5px;
                        ">
                            ${selectedHashtags.map(tag => `
                                <span style="
                                    background-color: #ff9800;
                                    color: white;
                                    padding: 2px 5px;
                                    border-radius: 5px;
                                    font-size: 0.75rem;
                                    margin: 1px;
                                ">
                                    #${tag.translatedName || tag.slug}
                                </span>
                            `).join('')}
                        </div>
                    </span>
                `,
                className: `custom-marker-icon ${isRestaurantBar ? 'emoji-marker' : ''}`,
                iconSize: L.point(iconWidth, iconHeight, true),
                iconAnchor: [iconWidth / 2, iconHeight / 2],
                popupAnchor: [0, -iconHeight / 2],
            });

            return {
                place: activePlace,
                position: [activePlace.lat, activePlace.lng] as [number, number],
                icon,
                zIndex,
            };
        }, [activePlace, getScaleLevel, calculateSize, selectedCategories, selectedAttributes, getTranslation]);

        // Préparer les données des marqueurs cluster
        const markersData = useMemo(() => {
            return clusteredPlaces
                .filter((place): place is Place & { lat: number; lng: number } =>
                    place.lat !== undefined && place.lng !== undefined
                )
                .map(place => {
                    const scaleLevel = getScaleLevel(place.reviews_google_count || 0);
                    const [iconWidth, iconHeight] = calculateSize(scaleLevel, place.placeType);
                    const zIndex = scaleLevel * 10;

                    const isRestaurantBar = place.placeType === PlaceType.RESTAURANT_BAR;
                    const imageUrl = !isRestaurantBar && place.images && place.images.length > 0 && place.images[0].slug
                        ? `https://api.allorigins.win/raw?url=https://lh3.googleusercontent.com/p/${place.images[0].slug}`
                        : '/assets/img/compass.png';

                    const emoji = isRestaurantBar ? getEmoji(place.categories, place.attributes) : null;

                    const selectedHashtags = [
                        ...place.categories.filter(cat => selectedCategories.includes(cat.id)).map(cat => ({
                            ...cat,
                            translatedName: getTranslation(cat.slug, 'categories'),
                        })),
                        ...place.attributes.filter(attr => selectedAttributes.includes(attr.id)).map(attr => ({
                            ...attr,
                            translatedName: getTranslation(attr.slug, 'attributes'),
                        })),
                    ];

                    const markerContent = isRestaurantBar
                        ? `<div class="custom-marker-icon emoji-marker" style="
                            width: ${iconWidth}px;
                            height: ${iconHeight}px;
                            z-index: ${zIndex};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            font-size: ${iconWidth * 0.8}px;
                          ">
                            ${emoji}
                          </div>`
                        : `<div class="custom-marker-icon" style="
                            width: ${iconWidth}px;
                            height: ${iconHeight}px;
                            z-index: ${zIndex};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                          ">
                            <img
                                src="${imageUrl}"
                                alt="${place.translation?.name || place.name_original}"
                                style="
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    border: 2px solid white;
                                "
                            />
                          </div>`;

                    const icon = L.divIcon({
                        html: `
                            ${markerContent}
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
                                <div style="
                                    margin-top: 5px;
                                    font-size: 0.8rem;
                                    color: #555;
                                    display: flex;
                                    flex-wrap: wrap;
                                    justify-content: center;
                                    gap: 5px;
                                ">
                                    ${selectedHashtags.map(tag => `
                                        <span style="
                                            background-color: #ff9800;
                                            color: white;
                                            padding: 2px 5px;
                                            border-radius: 5px;
                                            font-size: 0.75rem;
                                            margin: 1px;
                                        ">
                                            #${tag.translatedName || tag.slug}
                                        </span>
                                    `).join('')}
                                </div>
                            </span>
                        `,
                        className: `custom-marker-icon ${isRestaurantBar ? 'emoji-marker' : ''}`,
                        iconSize: L.point(iconWidth, iconHeight, true),
                        iconAnchor: [iconWidth / 2, iconHeight / 2],
                        popupAnchor: [0, -iconHeight / 2],
                    });

                    return {
                        place,
                        position: [place.lat, place.lng] as [number, number],
                        icon,
                        zIndex,
                    };
                });
        }, [clusteredPlaces, getScaleLevel, calculateSize, selectedCategories, selectedAttributes, getTranslation]);

        return (
            <>
                {/* Groupe de clusters sans la place active */}
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

                {/* Marqueur pour la place active, en dehors du groupe de clusters */}
                {activePlaceMarker && (
                    <MarkerWithPlaceComponent
                        key={activePlaceMarker.place.id}
                        position={activePlaceMarker.position}
                        icon={activePlaceMarker.icon}
                        place={activePlaceMarker.place}
                        onClickPlace={onClickPlace}
                        activePlace={activePlace}
                        zIndexOffset={activePlaceMarker.zIndex}
                    >
                        <Popup>
                            <div className="popup-content">
                                {activePlaceMarker.place.images &&
                                    activePlaceMarker.place.images.length > 0 &&
                                    activePlaceMarker.place.images[0].source && (
                                        <img
                                            src={activePlaceMarker.place.images[0].source}
                                            alt={activePlaceMarker.place.description}
                                            className="popup-image"
                                            loading="lazy"
                                        />
                                    )}
                                <h3 className="popup-title">
                                    {activePlaceMarker.place.translation?.name || activePlaceMarker.place.name_original}
                                </h3>
                                <p className="popup-description">{activePlaceMarker.place.description}</p>
                                <p>
                                    <strong>Address:</strong> {activePlaceMarker.place.address}
                                </p>
                                {activePlaceMarker.place.link_website && (
                                    <a
                                        href={activePlaceMarker.place.link_website}
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
                )}
            </>
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

                const markerLatLng = markerRef.current.getLatLng();
                const mapBounds = map.getBounds();
                if (!mapBounds.contains(markerLatLng)) {
                    map.setView(markerLatLng, map.getZoom(), { animate: true });
                }
                setTimeout(() => {
                    markerRef.current?.openPopup();
                }, 300);
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
