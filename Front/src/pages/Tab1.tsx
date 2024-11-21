import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: 'pink' }}>
            TEST
          </IonTitle>
        </IonToolbar>
      </IonHeader>

    </IonPage>
  );
};

export default Tab1;
