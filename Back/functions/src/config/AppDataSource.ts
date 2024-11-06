import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../model/*.ts'],
  subscribers: [],
  poolSize: parseInt(process.env.DB_POOL_MAX as string, 10),
});

const testConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
  }
};

testConnection(); 

export default AppDataSource;
