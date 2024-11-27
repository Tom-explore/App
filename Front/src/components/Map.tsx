import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import citiesData from '../data/cities.json';
import { useIonViewDidEnter } from '@ionic/react';

interface City {
  id: number;
  name: string;
  description: string;
  markerIcon: string;
  img: string;
  lat: number;
  lng: number;
}

const Map: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(5);

  const position: [number, number] = [48.134, 11.5799];
  const mapRef = useRef<any>(null);

  const calculateMarkerSize = (zoom: number): [number, number] => {
    const baseSize = 50;
    const scaleFactor = 10;
    const size = baseSize + (zoom - 6) * scaleFactor;
    return [Math.max(size, 20), Math.max(size * 1.2, 24)];
  };

  const MapZoomHandler = () => {
    useMapEvents({
      zoomend: () => {
        if (mapRef.current) {
          setZoomLevel(mapRef.current.getZoom());
        }
      },
    });
    return null;
  };
  useIonViewDidEnter(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  });
  useEffect(() => {
    const citiesWithLanguage2 = citiesData.map((city: any) => {
      const translation = city.translations.find((t: any) => t.language === 2);
      return {
        id: city.id,
        name: translation?.name || 'Unknown',
        description: translation?.description || 'No description available',
        markerIcon: `../assets/img/${city.country.code}/${city.slug}/marker/${city.slug}-marker.png`,
        img: `../assets/img/${city.country.code}/${city.slug}/main/${city.slug}-200.jpg`,
        lat: city.lat,
        lng: city.lng,
      };
    });
    setCities(citiesWithLanguage2);
  }, []);

  useEffect(() => {
    const updateMarkerSizes = () => {
      cities.forEach((city) => {
        const markerElement = document.querySelector(
          `.leaflet-marker-icon[src="${city.markerIcon}"]`
        ) as HTMLElement;

        if (markerElement) {
          const [width, height] = calculateMarkerSize(zoomLevel);
          markerElement.style.width = `${width}px`;
          markerElement.style.height = `${height}px`;
        }
      });
    };

    updateMarkerSizes();
  }, [zoomLevel, cities]);

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom
        ref={mapRef}
        className="leaflet-container"
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}${
            L.Browser.retina ? '@2x.png' : '.png'
          }`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
          maxZoom={19}
        />
        <MapZoomHandler />
        {cities.map((city) => {
          const [iconWidth, iconHeight] = calculateMarkerSize(zoomLevel);

          const customIcon = L.icon({
            iconUrl: city.markerIcon,
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [iconWidth / 2, iconHeight],
            popupAnchor: [0, -iconHeight],
          });

          return (
            <Marker key={city.id} position={[city.lat, city.lng]} icon={customIcon}>
              <Popup>
                <div className="popup-content">
                  <img src={city.img} alt={city.name} className="popup-image" />
                  <strong className="popup-title">{city.name}</strong>
                  <p className="popup-description">{city.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
