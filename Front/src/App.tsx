import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

// Import Firebase setup
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;
console.log('api url ' + apiUrl)
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Effectuer un appel à l'API
    fetch(`${apiUrl}/users/1/sayHello`)
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => console.error('Erreur lors de la récupération des données :', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Message de l'API : {message || 'Chargement...'}</p>
      </header>
    </div>
  );
}

export default App;
