import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { firestore } from '../config/firebaseconfig'; // Assurez-vous que le chemin est correct
import { doc, getDoc } from 'firebase/firestore';

const Tab3: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Tentative de récupération des données depuis Firestore...');

        // Référence au document Firestore
        const docRef = doc(firestore, 'tomexplore', 'ANl0D1aPYGBQkkvBisG2');
        console.log('Référence du document obtenue :', docRef);

        // Lecture du document
        const docSnapshot = await getDoc(docRef);
        console.log('Snapshot du document récupéré :', docSnapshot);

        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          console.log('Données du document Firestore :', docData);
          setData(docData?.message || 'Aucune donnée trouvée.');
        } else {
          console.warn('Document non trouvé dans Firestore.');
          setData('Document non trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du document Firestore :', error);
        setData('Erreur lors de la lecture des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {loading ? (
          <>
            <IonSpinner name="crescent" />
            <p>Chargement des données Firestore...</p>
          </>
        ) : (
          <div>
            <h2>Données Firestore :</h2>
            <p>{data}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
