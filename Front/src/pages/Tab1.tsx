// src/pages/Tab1.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import './Tab1.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useUser } from '../context/userContext'; // Import du hook useUser
import citiesData from '../data/cities.json';
import { firestore } from '../config/firebaseconfig';
import { doc, collection, getDocs } from 'firebase/firestore';

const Tab1: React.FC = () => {
  const { user, setUser } = useUser(); // Accès au contexte utilisateur
  const [isLoading, setIsLoading] = useState(false); // State pour le chargement de la connexion
  const [isFetchingData, setIsFetchingData] = useState(false); // State pour le chargement des données Firestore

  const [languageIdInput, setLanguageIdInput] = useState<number>(1); // Default language ID
  const [selectedSlug, setSelectedSlug] = useState<string>(''); // Default to empty

  const handleLogin = useCallback(async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    setIsLoading(true); // Début du chargement

    try {
      const result = await signInWithPopup(auth, provider);
      // Vous pouvez obtenir des informations utilisateur supplémentaires ici si nécessaire
      // Exemple: setUser(result.user);
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion avec Google. Veuillez réessayer.');
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  }, []);

  const handleLogout = useCallback(async () => {
    const auth = getAuth();

    try {
      await auth.signOut();
      console.log('Utilisateur déconnecté');
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      console.log('Utilisateur connecté:', user);
    } else {
      console.log('Aucun utilisateur connecté.');
    }
  }, [user]);

  const fetchFirestoreData = useCallback(async () => {
    if (!selectedSlug) {
      alert('Veuillez sélectionner une ville.');
      return;
    }

    setIsFetchingData(true);

    try {
      const cityDocId = `${selectedSlug}-${languageIdInput}`;
      const cityDocRef = doc(firestore, 'City', cityDocId);

      // Fetch Restaurants & Bars
      const restaurantsBarsRef = collection(cityDocRef, 'restaurantsBars');
      const restaurantsBarsSnapshot = await getDocs(restaurantsBarsRef);
      const restaurantsBars: any[] = [];
      restaurantsBarsSnapshot.forEach((doc) => {
        restaurantsBars.push({ id: doc.id, ...doc.data() });
      });
      console.log('Restaurants & Bars:', restaurantsBars);

      // Fetch Tourist Attractions
      const touristAttractionsRef = collection(cityDocRef, 'touristAttractions');
      const touristAttractionsSnapshot = await getDocs(touristAttractionsRef);
      const touristAttractions: any[] = [];
      touristAttractionsSnapshot.forEach((doc) => {
        touristAttractions.push({ id: doc.id, ...doc.data() });
      });
      console.log('Attractions Touristiques:', touristAttractions);
    } catch (error) {
      console.error('Erreur lors de la récupération des données Firestore:', error);
      alert('Erreur lors de la récupération des données. Veuillez réessayer.');
    } finally {
      setIsFetchingData(false);
    }
  }, [selectedSlug, languageIdInput]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'pink',
            }}
          >
            OAuth2 Login
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
          }}
        >
          {user ? (
            <>
              <p>Bienvenue, {user.name || 'Utilisateur'}!</p>
              <IonButton expand="block" onClick={handleLogout} color="danger">
                Déconnexion
              </IonButton>
            </>
          ) : (
            <IonButton expand="block" onClick={handleLogin} color="primary">
              Connexion avec Google
            </IonButton>
          )}

          {/* Afficher un indicateur de chargement lors de la connexion */}
          {isLoading && <IonSpinner name="crescent" />}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await fetchFirestoreData();
            }}
            style={{
              width: '100%',
              maxWidth: '400px',
              marginTop: '2rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <IonItem>
              <IonLabel position="stacked">Language ID</IonLabel>
              <IonInput
                type="number"
                value={languageIdInput}
                onIonChange={(e) => setLanguageIdInput(Number(e.detail.value))}
                required
                min={1}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ville</IonLabel>
              <IonSelect
                value={selectedSlug}
                placeholder="Sélectionnez une ville"
                onIonChange={(e) => setSelectedSlug(e.detail.value)}
              >
                {citiesData.map((city: any) => (
                  <IonSelectOption key={city.slug} value={city.slug}>
                    {city.slug}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonButton
              type="submit"
              expand="block"
              disabled={!selectedSlug || isFetchingData}
              style={{ marginTop: '1rem' }}
            >
              {isFetchingData ? <IonSpinner name="crescent" /> : 'Récupérer les Données'}
            </IonButton>
          </form>

          {/* Removed the display of fetched data */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
