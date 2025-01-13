import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Map from './Map';
import CityMarkers from './CityMarkers';

interface MapCityDisplayProps {
  cities: any[]; // Liste des villes filtrées
}

const MapCityDisplay: React.FC<MapCityDisplayProps> = ({ cities }) => {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(3.5);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const initialZoom = isMobile ? 3.5 : 5;
  const position: [number, number] = isMobile ? [38.134, 11.5799] : [48.134, 11.5799];

  useEffect(() => {
    if (cities.length === 0) {
      setCenter(null);
      setZoom(initialZoom);
      return;
    }

    if (cities.length === 1) {
      const { lat, lng } = cities[0];
      const adjustedLat = isMobile ? lat - 0.1 : lat;
      setCenter([adjustedLat, lng]);
      setZoom(9);
    } else {
      const latitudes = cities.map((city) => city.lat);
      const longitudes = cities.map((city) => city.lng);
      const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
      const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

      setCenter(isMobile ? [avgLat - 10, avgLng] : [avgLat, avgLng]);
      setZoom(isMobile ? 3 : 6);
    }
  }, [cities, isMobile, initialZoom]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Map
          citiesData={cities}
          initialZoom={initialZoom}
          initialPosition={position}
          center={center || undefined}
          zoom={zoom}
          isMobile={isMobile}
          isFeed={false}
        >
          <CityMarkers cities={cities} zoomLevel={zoom} />
        </Map>
      </IonContent>
    </IonPage>
  );
};

export default MapCityDisplay;
