import express from 'express';
import * as functions from 'firebase-functions';
import cors from 'cors'; 
import { initializeDataSource } from './config/AppDataSource';
import userRoutes from './routes/UserRoutes';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://tomexplore-c1c71.web.app',
  'https://tomexplore-c1c71.firebaseapp.com'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/users', userRoutes);

initializeDataSource().then(() => {
  console.log('Base de données initialisée. API prête à recevoir des requêtes.');
}).catch((error) => {
  console.error('Échec de l\'initialisation de la base de données :', error);
});

export const api = functions.https.onRequest(
  {
    region: 'europe-west3',
    vpcConnector: 'tomexplore-connector',
    vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  },
  app
);
