import React from 'react';
import {
  IonContent,
  IonPage,

} from '@ionic/react';
import LanguageSelector from '../components/LanguageSelector';


const Tab3: React.FC = () => {


  return (
    <IonPage>
      <IonContent className="ion-padding">
        <LanguageSelector></LanguageSelector>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
