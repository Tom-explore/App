import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { useIonViewDidEnter } from '@ionic/react';
import L from 'leaflet';
import { CityMap } from '../types/CommonInterfaces';

interface MapProps {
  citiesData?: CityMap[];
  initialZoom?: number;
  initialPosition?: [number, number];
  center?: [number, number];
  zoom?: number;
  isMobile?: boolean;
  children?: React.ReactNode;
}
const Map = React.forwardRef<any, MapProps>(
  (
    {
      initialZoom = 5,
      initialPosition = [48.134, 11.5799],
      center,
      zoom,
      isMobile,
      children,
    },
    ref
  ) => {
    const [zoomLevel, setZoomLevel] = useState<number>(initialZoom);
    const mapRef = useRef<any>(null);
    //gestionnaire de zoom - désactive animations mobile
    const MapZoomHandler = () => {
      const map = useMapEvents({
        zoom: () => {
          setZoomLevel(map.getZoom());
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
        },
      });

      return null;
    };
    //getmap ref
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));
    //nécessaire pr affichage du dom
    useIonViewDidEnter(() => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    });
    //recherche ville et zoom dessus
    useEffect(() => {
      if (mapRef.current) {
        if (center) {
          mapRef.current.setView(center, zoom || initialZoom, { animate: true });
        } else {
          mapRef.current.setView(initialPosition, initialZoom, { animate: true });
        }
      }
    }, [center, zoom, initialZoom, initialPosition]);

    return (
      <div className="map-container">
        <MapContainer
          center={initialPosition}
          zoom={zoomLevel}
          scrollWheelZoom
          zoomControl={false}
          ref={mapRef}
          className="leaflet-container"
        >
          <TileLayer
            url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}${L.Browser.retina ? '@2x.png' : '.png'
              }`}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            maxZoom={19}
          />
          <MapZoomHandler />
          {children &&
            React.cloneElement(children as React.ReactElement, { zoomLevel })}
        </MapContainer>
      </div>
    );
  }
);


export default Map;
