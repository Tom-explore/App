// config/firebaseconfig.js ou firebaseconfig.ts
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  // persistentMultipleTabManager, // Utilisez ceci si vous avez besoin de support multi-onglets
  CACHE_SIZE_UNLIMITED,
  connectFirestoreEmulator // Import statique pour l'émulateur Firestore
} from 'firebase/firestore';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator // Import statique pour l'émulateur Auth
} from 'firebase/auth';

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

// Configuration Firestore avec persistance des données en cache
const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(undefined), // Passez `undefined` si aucun paramètre spécifique n'est requis
    cacheSizeBytes: CACHE_SIZE_UNLIMITED, // Optionnel: Définit la taille du cache à illimité
    // Si vous avez besoin de support multi-onglets, utilisez `persistentMultipleTabManager` :
    // tabManager: persistentMultipleTabManager(undefined),
  }),
});
console.log("Firestore configuré avec persistance des données en cache.");

// Configuration Auth
const auth = getAuth(app);
console.log("Firebase Auth configuré.");

// Configurer la persistance à 'local' pour Auth
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistance Firebase Auth configurée sur local.');
  })
  .catch((error) => {
    console.error('Erreur lors de la configuration de la persistance Firebase Auth:', error);
  });

// Si on est en développement, connecter les émulateurs
if (process.env.REACT_APP_IS_DEV === 'true') {
  // Connecter l'émulateur Firestore
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export default app;
export { firestore, auth };
