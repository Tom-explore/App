import express from 'express';
import * as functions from 'firebase-functions';
import cors from 'cors'; 
import path from 'path';
import { initializeDataSource } from './config/AppDataSource';
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const app = express();
app.use(express.json());

const isDev = process.env.IS_DEV === 'true';
if (!isDev) {
  const allowedOrigins = [
    'https://tomexplore-c1c71.web.app',
    'https://tomexplore-c1c71.firebaseapp.com'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}



const frontendPath = path.join(__dirname, '../../Front/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

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
