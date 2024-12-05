import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Tab1.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import app from '../config/firebaseconfig';
import apiClient from '../config/apiClient';
import { User } from '../types/UsersInterfaces';

const Tab1: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Utilisation du type User pour l'état

  const handleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // Création d'un objet utilisateur conforme à l'interface User
      const userData: User = {
        id: 0, // ID sera généré par le backend
        email: loggedInUser.email || '',
        name: loggedInUser.displayName || 'Unknown User',
        pw: '', // Pas de mot de passe pour OAuth
        google_id: loggedInUser.uid,
        profile_img: loggedInUser.photoURL || '',
        confirmed_account: true,
        created_at: new Date(),
        updated_at: new Date(),
        admin: false,
        author: false,
      };

      // Envoi des données utilisateur avec axios
      await apiClient.post('/user', userData);

      console.log('User logged in and saved:', userData);
      setUser(userData); // Mise à jour de l'état avec les données utilisateur
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(app);

    try {
      await signOut(auth);
      console.log('User logged out');
      setUser(null); // Réinitialisation de l'état utilisateur
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
