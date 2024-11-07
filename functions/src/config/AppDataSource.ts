import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isDev = process.env.IS_DEV === 'true';

const entitiesPath = [path.join(__dirname, '../../lib/model/*.js')]; 


console.log('is dev ?', isDev);
console.log('Entities Path:', entitiesPath);

const host = isDev ? process.env.DB_HOST_DEV : process.env.DB_HOST_PROD;

const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: true,
  logging: false, 
  entities: entitiesPath,
  subscribers: [],
  poolSize: parseInt(process.env.DB_POOL_MAX as string, 10),
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
  }
};

export default AppDataSource;
