import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/components/Map.css';
import { useIonViewDidEnter } from '@ionic/react';
import L, { LatLngBounds } from 'leaflet';
import { CityMap } from '../types/CommonInterfaces';
import UserMarker from './UserMarker'; // Import the UserMarker component

interface MapProps {
  citiesData?: CityMap[];
  initialZoom?: number;
  initialPosition?: [number, number];
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  boundaries?: [[number, number], [number, number]];
  isMobile?: boolean;
  children?: React.ReactNode;
  isFeed: boolean;
  onZoomChange?: (zoom: number) => void; // Ajout du prop
}

const Map = React.forwardRef<any, MapProps>(
  (
    {
      initialZoom = 5,
      initialPosition = [48.134, 11.5799],
      center,
      zoom,
      minZoom = 5,
      boundaries,
      isMobile,
      children,
      isFeed,
      onZoomChange, // Déstructure le nouveau prop
    },
    ref
  ) => {
    const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
    const mapRef = useRef<any>(null);

    // État pour gérer les messages de zoom
    const [isMinZoomReached, setIsMinZoomReached] = useState<boolean>(false);

    // Gestionnaire de zoom avec callback vers le parent
    const MapZoomHandler = () => {
      useMapEvents({
        zoom: () => {
          if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom();
            setZoomLevel(currentZoom);
            if (onZoomChange) {
              onZoomChange(currentZoom); // Notifie le parent du changement de zoom
              console.log(`Zoom actuel : ${currentZoom}`); // Log pour débogage
            }
          }
        },
        zoomstart: () => {
          if (isMobile) {
            document
              .querySelector('.leaflet-container')
              ?.classList.add('disable-animations');
          }
        },
        zoomend: () => {
          if (isMobile) {
            document
              .querySelector('.leaflet-container')
              ?.classList.remove('disable-animations');
          }

          if (mapRef.current && boundaries) {
            const currentZoom = mapRef.current.getZoom();
            if (currentZoom < minZoom) {
              setIsMinZoomReached(true);
              mapRef.current.setZoom(minZoom);
              if (onZoomChange) {
                onZoomChange(minZoom); // Notifie le parent du zoom forcé
                console.log(`Zoom forcé au minimum : ${minZoom}`); // Log pour débogage
              }
            } else {
              setIsMinZoomReached(false);
            }
          }
        },
        dragend: () => {
          if (mapRef.current && boundaries) {
            const bounds = L.latLngBounds(boundaries);
            if (!bounds.contains(mapRef.current.getCenter())) {
              mapRef.current.panInsideBounds(bounds, { animate: true });
            }
          }
        },
      });

      return null;
    };

    // Expose la référence de la carte via ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));

    // Nécessaire pour un rendu correct dans Ionic
    useIonViewDidEnter(() => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    });

    // Recentrer et zoomer la carte au chargement initial ou lorsque les places changent
    useEffect(() => {
      if (mapRef.current && !isFeed) {
        if (center) {
          mapRef.current.setView(center, zoom || initialZoom, { animate: true });
        } else {
          mapRef.current.setView(initialPosition, initialZoom, { animate: true });
        }
      }
    }, [center, zoom, initialZoom, initialPosition, isFeed]);

    // Définir les limites si fournies
    const maxBounds: LatLngBounds | undefined = boundaries
      ? L.latLngBounds(boundaries)
      : undefined;

    return (
      <div className="map-container">
        <MapContainer
          center={center || initialPosition}
          zoom={zoom || zoomLevel}
          scrollWheelZoom
          zoomControl={false}
          ref={mapRef}
          className="leaflet-container"
          minZoom={minZoom}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}${L.Browser.retina ? '@2x.png' : '.png'
              }`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            maxZoom={19}
            minZoom={minZoom}
            noWrap={true}
          />
          <MapZoomHandler />
          {children}
          <UserMarker />
          {isMinZoomReached && (
            <div className="zoom-message">
              <p>Niveau de zoom minimum atteint.</p>
            </div>
          )}
        </MapContainer>
      </div>
    );
  }
);

export default Map;
