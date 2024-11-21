import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import './Tab2.css';

// Correction des icônes Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Tab2: React.FC = () => {
  const position: [number, number] = [48.8584, 2.2945]; // Coordonnées de la Tour Eiffel

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
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                Tour Eiffel. <br /> Un lieu iconique.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
