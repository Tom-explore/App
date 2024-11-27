import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Tab2.css';
import citiesData from '../data/cities.json';

const Tab2: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
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

  useEffect(() => {
    const fetchCities = () => {
      const citiesWithLanguage2 = citiesData.map((city: any) => {
        const translation = city.translations.find(
          (t: any) => t.language === 2
        );
        return {
          ...city,
          name: translation?.name || 'Unknown',
          description: translation?.description || 'No description available',
          markerIcon: `../assets/img/${city.country.code}/${city.slug}/marker/${city.slug}-marker.png`,
          img : `../assets/img/${city.country.code}/${city.slug}/main/${city.slug}-200.jpg`,
        };
      });
      setCities(citiesWithLanguage2);
    };

    fetchCities();
  }, []);

  useIonViewDidEnter(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100); 
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Carte Leaflet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="map-container">
          <MapContainer
            center={position}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
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
                <Marker
                  key={city.id}
                  position={[city.lat, city.lng]}
                  icon={customIcon}
                >
<Popup>
  <div style={{
    textAlign: 'center',
    maxWidth: '200px',
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  }}>
    <img 
      src={city.img} 
      alt={city.name} 
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        marginBottom: '10px'
      }} 
    />
    <strong style={{
      fontSize: '16px',
      color: '#333',
      marginBottom: '8px',
      display: 'block'
    }}>
      {city.name}
    </strong>
    <p style={{
      fontSize: '14px',
      color: '#666',
      margin: '0',
      lineHeight: '1.4'
    }}>
      {city.description}
    </p>
  </div>
</Popup>

                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
