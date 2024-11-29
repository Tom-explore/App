import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import citiesData from '../data/cities.json';
import { CityMap } from '../types/CommonInterfaces';
import CityMarkers from '../components/CityMarkers';

const MapCityDisplay: React.FC = () => {
  const [cities, setCities] = useState<CityMap[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [center, setCenter] = useState<[number, number] | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [zoom, setZoom] = useState<number>(isMobile ? 3.5 : 5);
  const position: [number, number] = isMobile ? [38.134, 11.5799] : [48.134, 11.5799];
  const [zoomCounter, setZoomCounter] = useState(0);
  const [lastQuery, setLastQuery] = useState('');
  const mapRef = useRef<any>(null);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query !== lastQuery) {
      setZoomCounter(0);
      setLastQuery(query);
    }

    if (!query.trim()) {
      setCenter(null);
      setZoom(isMobile ? 3.5 : 5);
      return;
    }

    // Prioritize cities starting with the query
    const prioritizedMatch = cities.find((city) =>
      city.name.toLowerCase().startsWith(query.toLowerCase())
    );

    // If no prioritized match, fallback to partial match
    const fallbackMatch = cities.find((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    const match = prioritizedMatch || fallbackMatch;

    if (match && zoomCounter === 0) {
      const { lat, lng } = match;

      if (isMobile) {
        const adjustedLat = lat - 0.1;
        setCenter([adjustedLat, lng]);
      } else {
        setCenter([lat, lng]);
      }

      setZoom(10);
      setZoomCounter(1);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <SearchBar onSearch={handleSearch} />
        <Map
          ref={mapRef}
          citiesData={cities}
          initialZoom={zoom}
          initialPosition={position}
          center={center || undefined}
          isMobile={isMobile}
        >
          <CityMarkers cities={cities} zoomLevel={zoom} />
        </Map>
      </IonContent>
    </IonPage>
  );
};

export default MapCityDisplay;
