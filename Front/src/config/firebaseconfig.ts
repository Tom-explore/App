import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED,
  connectFirestoreEmulator
} from 'firebase/firestore';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
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
    tabManager: persistentSingleTabManager(undefined),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
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

// // Fonction pour détecter si l'on est sur mobile
// function isMobileDevice() {
//   var result = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//   alert(result);
//   return result;
// }

// // Si on est en développement, connecter les émulateurs
// if (process.env.REACT_APP_IS_DEV === 'true') {
//   let emulatorHost = 'localhost';
//   let emulatorPort = 8080;

//   if (isMobileDevice()) {
//     // Utiliser window.location.hostname pour extraire l'hôte
//     const currentHostname = window.location.hostname;
//     emulatorHost = currentHostname;
//   }

//   alert(`Connexion à l'émulateur Firestore à ${emulatorHost}:${emulatorPort}`);
//   connectFirestoreEmulator(firestore, emulatorHost, emulatorPort);
// }

export default app;
export { firestore, auth };
