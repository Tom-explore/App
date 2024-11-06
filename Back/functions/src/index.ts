import express from 'express';
import * as functions from 'firebase-functions';
import { initializeDataSource } from './config/AppDataSource';
import userRoutes from './routes/UserRoutes';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

// Initialisation de la base de données avant le démarrage de l'application
initializeDataSource().then(() => {
  console.log('Base de données initialisée. API prête à recevoir des requêtes.');
}).catch((error) => {
  console.error('Échec de l\'initialisation de la base de données :', error);
});

// Export Firebase Function
export const api = functions.https.onRequest(
  {
    region: 'europe-west3',
    vpcConnector: 'tomexplore-connector',
    vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  },
  app
);
