// config/firebaseconfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjI5mRHiKUy-xIfSZi7n5ImyNSh8cCOJg",
  authDomain: "tomexplore-c1c71.firebaseapp.com",
  projectId: "tomexplore-c1c71",
  storageBucket: "tomexplore-c1c71.firebasestorage.app",
  messagingSenderId: "397764947910",
  appId: "1:397764947910:web:1cb479410da189ec724cc7",
  measurementId: "G-RG3NSZYDMX",
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase initialisé avec succès.");

// Configuration Firestore
const firestore = getFirestore(app);
console.log("Firestore configuré.");

// Configuration Auth
const auth = getAuth(app);
console.log("Firebase Auth configuré.");

// Configurer la persistance à 'local'
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistance Firebase Auth configurée sur local.');
  })
  .catch((error) => {
    console.error('Erreur lors de la configuration de la persistance Firebase Auth:', error);
  });

// Si on est en développement, connecter les émulateurs
if (process.env.REACT_APP_IS_DEV === 'true') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export default app;
export { firestore, auth };
