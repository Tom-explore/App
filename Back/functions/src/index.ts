import * as functions from 'firebase-functions';
import express from 'express';
import sequelize from './config/sequelize'; // Importation de l'instance Sequelize configurée
import userRoutes from './routes/UserRoutes'; // Importation des routes User

// Initialiser l'application Express
const app = express();
app.use(express.json());

// Ajouter les routes User à l'application
app.use('/users', userRoutes);

// Synchroniser les modèles avec la base de données et tester la connexion
sequelize.sync() // Utilise { alter: true } pour synchroniser sans perdre de données
  .then(async () => {
    console.log('Les modèles ont été synchronisés avec la base de données.');

    // Tester la connexion à la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation ou de la connexion à la base de données :', error);
  });

// Exporter l'application Express en tant que fonction Firebase
export const api = functions.https.onRequest(
  {
    region: 'europe-west3',
    vpcConnector: 'tomexplore-connector',
    vpcConnectorEgressSettings: 'PRIVATE_RANGES_ONLY',
  },
  app
);
