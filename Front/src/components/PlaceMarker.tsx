// src/components/PlacesMarkers.tsx
import React, {
    useEffect,
    useRef,
    useCallback,
    useMemo
} from 'react';
import { Marker, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Place } from '../types/PlacesInterfaces';
import { Category, Attribute } from '../types/CategoriesAttributesInterfaces';
import '../styles/components/PlaceMarker.css';

interface PlacesMarkersProps {
    places: Place[];
    zoomLevel: number;
    onClickPlace: (place: Place) => void;
    categories: Category[];   // maintenant requis
    attributes: Attribute[];  // maintenant requis
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
    onClickPlace: (place: Place) => void;
    children?: React.ReactNode;
}

const PlacesMarkers: React.FC<PlacesMarkersProps> = React.memo(
    ({ places, zoomLevel, onClickPlace, categories, attributes }) => {

        /**
         * 1) Filtrer par catégories et attributs 
         */
        const filteredByCategoryAndAttribute = useMemo(() => {
            // Si aucun filtre n’est actif, on renvoie tout
            if (categories.length === 0 && attributes.length === 0) {
                return places;
            }

            return places.filter((place) => {
                const matchesCategory =
                    categories.length === 0 ||
                    place.categories.some((cat) =>
                        categories.some((selectedCat) => selectedCat.id === cat.id)
                    );

                const matchesAttribute =
                    attributes.length === 0 ||
                    place.attributes.some((attr) =>
                        attributes.some((selectedAttr) => selectedAttr.id === attr.id)
                    );

                return matchesCategory && matchesAttribute;
            });
        }, [places, categories, attributes]);

        /**
         * 2) Exclure les lieux <100 reviews + trier par nb de reviews (logique PlaceCarousel)
         */
        const sortedPlaces = useMemo(() => {
            const above100 = filteredByCategoryAndAttribute.filter(
                (p) => (p.reviews_google_count || 0) >= 100
            );
            above100.sort(
                (a, b) => (b.reviews_google_count || 0) - (a.reviews_google_count || 0)
            );
            return above100;
        }, [filteredByCategoryAndAttribute]);

        /**
         * 3) Calcul de la taille de l'icône en fonction du zoom
         */
        const calculateMarkerSize = useCallback((zoom: number): [number, number] => {
            const baseSize = 30;
            const scaleFactor = 2;
            const size = baseSize + (zoom - 6) * scaleFactor;
            return [Math.max(size, 20), Math.max(size, 20)];
        }, []);

        /**
         * 4) Création de l’icône cluster
         */
        const createClusterIcon = useCallback((cluster: any) => {
            const markers = cluster.getAllChildMarkers() as MarkerWithPlace[];

            if (markers.length === 0) {
                return L.divIcon({
                    html: `<div class="custom-cluster-icon">0</div>`,
                    className: 'custom-cluster',
                    iconSize: L.point(60, 60, true),
                    iconAnchor: [30, 30], // Centrer l’icône
                });
            }

            const bestPlace = markers
                .map(marker => marker.place)
                .filter(p =>
                    p.reviews_google_count !== undefined && p.reviews_google_count !== null
                )
                .sort(
                    (a, b) =>
                        (b.reviews_google_count || 0) - (a.reviews_google_count || 0)
                )[0];

            // Logging pour debug
            console.log('Cluster position:', cluster.getLatLng());
            if (bestPlace) {
                console.log('Best place position:', bestPlace.lat, bestPlace.lng);
            }

            const imageUrl =
                bestPlace && bestPlace.images && bestPlace.images.length > 0 && bestPlace.images[0].slug
                    ? `https://lh3.googleusercontent.com/p/${bestPlace.images[0].slug}`
                    : '/assets/img/compass.png';

            const count = cluster.getChildCount();
            const baseClusterSize = 60;
            const maxClusterSize = 120;
            const size = Math.min(
                baseClusterSize + Math.log(count) * 20,
                maxClusterSize
            );
            const zIndex = (bestPlace?.reviews_google_count || 0) + count;

            return L.divIcon({
                html: `
          <div
            class="custom-cluster-icon"
            style="width: ${size}px; height: ${size}px; z-index: ${zIndex};"
          >
            <img
              src="${imageUrl}"
              alt="${bestPlace?.name_original || bestPlace?.slug}"
            />
            <span>${count}</span>
          </div>
        `,
                className: 'custom-cluster',
                iconSize: L.point(size, size, true),
                iconAnchor: [size / 2, size / 2], // Centrer l’icône
            });
        }, []);

        /**
         * 5) Rendu final des markers (filtered + sorted)
         */
        return (
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterIcon}
            >
                {sortedPlaces.map((place) => {
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
                        iconAnchor: [iconWidth / 2, iconHeight / 2], // Centrer l'ancre
                        popupAnchor: [0, -iconHeight / 2], // Ajuster le popup
                        className: 'custom-marker-icon',
                    });

                    return (
                        <MarkerWithPlaceComponent
                            key={place.id}
                            position={[place.lat, place.lng]}
                            icon={icon}
                            place={place}
                            onClickPlace={onClickPlace}
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
                                        {place.name_original || place.slug}
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

// Composant pour attacher la donnée `place` au marker
const MarkerWithPlaceComponent: React.FC<MarkerWithPlaceComponentProps> = React.memo(
    ({ place, onClickPlace, ...props }) => {
        const markerRef = useRef<L.Marker>(null);

        // Attacher la place au marker pour y accéder dans iconCreateFunction
        useEffect(() => {
            if (markerRef.current) {
                (markerRef.current as MarkerWithPlace).place = place;
            }
        }, [place]);

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
