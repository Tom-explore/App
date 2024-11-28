import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import citiesData from '../data/cities.json';
import { useIonViewDidEnter } from '@ionic/react';
import SearchBar from './SearchBar';
import { CityMap } from '../types/CommonInterfaces';
const Map: React.FC = () => {
  const [cities, setCities] = useState<CityMap[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [zoomLevel, setZoomLevel] = useState<number>(isMobile ? 3.5 : 5);
  const position: [number, number] = (isMobile ? [45.466, 9.18752] : [48.134, 11.5799]);
  const mapRef = useRef<any>(null);
  const [zoomCounter, setZoomCounter] = useState(0);
  const [lastQuery, setLastQuery] = useState("");

  const calculateMarkerSize = (zoom: number): [number, number] => {
    const baseSize = 50;
    const scaleFactor = 10;
    const size = baseSize + (zoom - 6) * scaleFactor;
    return [Math.max(size, 20), Math.max(size * 1.2, 24)];
  };
  const MapZoomHandler = () => {
    const map = useMapEvents({
      zoomstart: () => {
        if (isMobile) {
          document.querySelector('.leaflet-container')?.classList.add('disable-animations');
        }
      },
      zoomend: () => {
        if (isMobile) {
          document.querySelector('.leaflet-container')?.classList.remove('disable-animations');
        }
        if (mapRef.current) {
          setZoomLevel(map.getZoom());
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
    if (!searchActive && mapRef.current) {
      mapRef.current.setView(position, 5, { animate: true });
    }
  }, [searchActive]);

  const handleSearch = (query: string) => {
    if (!mapRef.current) return;
    if (query !== lastQuery) {
      setZoomCounter(0);
      setLastQuery(query);
    }
    if (!query.trim()) {
      setSearchActive(false);
      return;
    }
    setSearchActive(true);
    const match = cities.find((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    if (match && zoomCounter === 0) {
      const map = mapRef.current;
      if (isMobile) {
        const offset = [0, -100];
        const point = map.project([match.lat, match.lng], map.getZoom()).subtract(offset);
        const newLatLng = map.unproject(point, map.getZoom());
        map.setView(newLatLng, 10, { animate: true });
      } else {
        map.setView([match.lat, match.lng], 10, { animate: true });
      }
      setZoomCounter(1);
    }
  };

  return (
    <div className="map-container">
      <SearchBar onSearch={handleSearch} />
      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={!isMobile}
        zoomAnimation={!isMobile}
        zoomControl={false}
        preferCanvas={isMobile}
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
        {cities.map((city) => {
          const [iconWidth, iconHeight] = calculateMarkerSize(zoomLevel);

          const customIcon = L.icon({
            iconUrl: city.markerIcon,
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [iconWidth / 2, iconHeight],
            popupAnchor: [0, -iconHeight],
            className: 'custom-marker-icon',
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
