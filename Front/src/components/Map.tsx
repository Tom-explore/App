// src/components/Map.tsx
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/components/Map.css';
import { useIonViewDidEnter } from '@ionic/react';
import L, { LatLngBounds } from 'leaflet';
import { CityMap } from '../types/CommonInterfaces';

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
      isFeed
    },
    ref
  ) => {
    const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
    const mapRef = useRef<any>(null);

    // États pour gérer l'affichage des messages de zoom
    const [isMinZoomReached, setIsMinZoomReached] = useState<boolean>(false);

    // Gestionnaire de zoom - désactive animations mobile
    const MapZoomHandler = () => {
      useMapEvents({
        zoom: () => {
          if (mapRef.current) {
            setZoomLevel(mapRef.current.getZoom());
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

    // Expose la référence de la carte via le ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));

    // Nécessaire pour l'affichage correct du DOM dans Ionic
    useIonViewDidEnter(() => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    });

    // Recherche ville et zoom dessus
    useEffect(() => {
      if (mapRef.current && !isFeed) {
        if (center) {
          mapRef.current.setView(center, zoom || initialZoom, { animate: true });
        } else {
          mapRef.current.setView(initialPosition, initialZoom, { animate: true });
        }
      }
    }, [center, zoom, initialZoom, initialPosition]);

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
          minZoom={minZoom} // Définition du minZoom
          maxBounds={maxBounds} // Définition des limites
          maxBoundsViscosity={1.0} // Empêche de sortir des limites
        >
          <TileLayer
            url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}${L.Browser.retina ? '@2x.png' : '.png'}`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            maxZoom={19}
            minZoom={minZoom}
            noWrap={true} // Empêche le wrapping des tuiles
          />
          <MapZoomHandler />
          {children}
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
