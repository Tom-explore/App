import {
  IonContent,
  IonPage,
} from '@ionic/react';
import Map from '../components/Map';

const MapDisplay: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Map />
      </IonContent>
    </IonPage>
  );
};

export default MapDisplay;
