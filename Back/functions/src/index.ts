import * as functions from 'firebase-functions';
import express from 'express';
import AppDataSource from './config/AppDataSource'; 
import userRoutes from './routes/UserRoutes'; 

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log('Connexion à la base de données réussie et synchronisation du schéma effectuée.');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion ou de la synchronisation avec la base de données :', error);
  });

export const api = functions.https.onRequest(
  {
    region: 'europe-west3',
    vpcConnector: 'tomexplore-connector',
    vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  },
  app
);
