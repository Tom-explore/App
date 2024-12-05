import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import citiesData from '../data/cities.json';
import { CityMap } from '../types/CommonInterfaces';
import CityMarkers from '../components/CityMarkers';

const MapCityDisplay: React.FC = () => {
  const [cities, setCities] = useState<CityMap[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityMap[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Recherche
  const [center, setCenter] = useState<[number, number] | null>(null); // Centre de la carte
  const [zoom, setZoom] = useState<number>(3.5); // Niveau de zoom
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const initialZoom = isMobile ? 3.5 : 5;
  const position: [number, number] = isMobile ? [38.134, 11.5799] : [48.134, 11.5799];

  const lastQueryRef = useRef<string>(''); // Dernière requête

  useEffect(() => {
    // Charger les villes avec la langue appropriée
    const citiesWithLanguage2 = citiesData.map((city: any) => {
      const translation = city.translations.find((t: any) => t.language === 2);
      return {
        id: city.id,
        slug: city.slug,
        name: translation?.name || 'Unknown',
        description: translation?.description || 'No description available',
        markerIcon: `../assets/img/${city.country.code}/${city.slug}/marker/${city.slug}-marker.png`,
        img: `../assets/img/${city.country.code}/${city.slug}/main/${city.slug}-200.jpg`,
        lat: city.lat,
        lng: city.lng,
      };
    });
    setCities(citiesWithLanguage2);
    setFilteredCities(citiesWithLanguage2);
  }, []);

  // Effet déclenché lorsque `searchQuery` change
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCities(cities);
      setCenter(null);
      setZoom(initialZoom);
      return;
    }

    // Filtrer les villes correspondant à la recherche
    const matchedCities = cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCities(matchedCities);

    if (matchedCities.length > 0) {
      if (matchedCities.length === 1) {
        const { lat, lng } = matchedCities[0];
        const adjustedLat = isMobile ? lat - 0.1 : lat;
        setCenter([adjustedLat, lng]);
        setZoom(9);
      } else {
        const latitudes = matchedCities.map((city) => city.lat);
        const longitudes = matchedCities.map((city) => city.lng);
        const avgLat =
          latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
        const avgLng =
          longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

        setCenter(isMobile ? [avgLat - 10, avgLng] : [avgLat, avgLng]);
        setZoom(isMobile ? 3 : 6);
      }
    } else {
      setCenter(null);
      setZoom(initialZoom);
    }
  }, [searchQuery, cities, isMobile]);

  // Gestion de la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Réinitialiser la requête si elle change
    if (query !== lastQueryRef.current) {
      lastQueryRef.current = query;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <SearchBar onSearch={handleSearch} />
        <Map
          citiesData={filteredCities}
          initialZoom={initialZoom}
          initialPosition={position}
          center={center || undefined}
          zoom={zoom}
          isMobile={isMobile}
        >
          <CityMarkers cities={filteredCities} zoomLevel={zoom} />
        </Map>
      </IonContent>
    </IonPage>
  );
};

export default MapCityDisplay;
