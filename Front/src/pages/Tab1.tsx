// src/pages/Tab1.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonSpinner } from '@ionic/react';
import './Tab1.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useUser } from '../context/userContext'; // Import du hook useUser
import apiClient from '../config/apiClient';
const Tab1: React.FC = () => {
  const { user, setUser } = useUser(); // Accès au contexte utilisateur
  const [restaurantsBarsData, setRestaurantsBarsData] = useState<any[]>([]); // State pour Firestore data
  const [isLoading, setIsLoading] = useState(false); // State pour le chargement de la connexion
  const [isFetchingData, setIsFetchingData] = useState(false); // State pour le chargement des données Firestore

  const handleLogin = useCallback(async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    setIsLoading(true); // Début du chargement

    try {
      await signInWithPopup(auth, provider);
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
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    }
  }, []);

  const getUser = useCallback(async () => {
    console.log('User : ', user);

  }, []);
  useEffect(() => {
    if (user) {
      console.log('Utilisateur connecté:', user);
    } else {
      console.log('Aucun utilisateur connecté.');
    }
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: 'pink' }}>
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
            height: '100%',
          }}
        >
          {user ? (
            <>
              <p>Bienvenue, {user.name}!</p>
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

          <IonButton
            expand="block"
            onClick={getUser}
            color="tertiary"
            disabled={!user || isFetchingData}
          >
            Afficher user
          </IonButton>
          <IonButton
            expand="block"
            onClick={async () => {
              try {
                const response = await apiClient.post('/firestore/hello');
                console.log('Réponse Firestore:', response.data);
              } catch (error) {
                console.error('Erreur Firestore:', error);
              }
            }}
            color="secondary"
          >
            Appeler /firestore/hello
          </IonButton>

          {restaurantsBarsData.length > 0 && (
            <div>
              <h3>Données des Restaurants & Bars:</h3>
              <ul style={{ textAlign: 'left', padding: '0 1rem' }}>
                {restaurantsBarsData.map((restaurant, index) => (
                  <li key={restaurant.id || index} style={{ marginBottom: '1rem' }}>
                    <strong>Nom:</strong> {restaurant.name || 'N/A'}
                    <br />
                    <strong>Adresse:</strong> {restaurant.translation?.address || 'Non disponible'}
                    <br />
                    <strong>Catégories:</strong>{' '}
                    {restaurant.categories
                      ? restaurant.categories.map((cat: any) => cat.slug).join(', ')
                      : 'Aucune'}
                    <br />
                    <strong>Note Google:</strong> {restaurant.reviews_google_rating || 'Non évalué'} / 5
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
