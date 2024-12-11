// src/config/AppDataSource.ts
import { DataSource } from 'typeorm';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isDev = process.env.IS_DEV === 'true';
const entitiesPath = [path.join(__dirname, '../../lib/model/**/*.js')];

console.log('is dev ?', isDev);
console.log('Entities Path:', entitiesPath);

const host = isDev ? process.env.DB_HOST_DEV : process.env.DB_HOST_PROD;

// Configuration du pool avec pg-pool
const pgPool = new Pool({
  user: process.env.DB_USER,
  host,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string, 10),
  max: parseInt(process.env.DB_POOL_MAX as string, 10) || 5, // Réduction pour serverless
  idleTimeoutMillis: 30000,
});

// Créer une instance unique (singleton) de DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: true, // Désactiver en production
  logging: false,
  entities: entitiesPath,
  subscribers: [],
  extra: {
    pool: pgPool, // Utilisation du pool pg-pool
  },
});

export const initializeDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Connexion à la base de données réussie et synchronisation du schéma effectuée.');
      console.log('Hôte de la BD ::', host);
    }
  } catch (error) {
    console.error('Erreur lors de la connexion ou de la synchronisation avec la base de données :', error);
    process.exit(1); // Arrêter l'application si l'initialisation échoue
  }
};

export const closeDataSource = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Connexion à la base de données fermée.');
  }

  // Fermer le pool PostgreSQL
  await pgPool.end();
  console.log('Pool de connexions PostgreSQL fermé.');
};

export default AppDataSource;
