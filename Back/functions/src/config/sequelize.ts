import { Sequelize } from 'sequelize';

// Configuration de Sequelize
const sequelize = new Sequelize('postgres', 'postgres', 'test', {
  host: '10.7.0.3', // L'IP privée de votre instance Cloud SQL
  dialect: 'postgres',
  port: 5432, // Port par défaut pour PostgreSQL
  logging: false, // Désactive les logs SQL dans la console
  pool: {
    max: 50, // Capacité de connexions concurrentes selon le serveur de base de données
    min: 10, // Connexions minimales pour assurer une disponibilité de base
    acquire: 60000, // Temps pour obtenir une connexion en ms (plus long pour les charges élevées)
    idle: 15000, // Temps après lequel une connexion inactive est libérée (en ms)
  }  
});

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réusssie.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
  }
};

testConnection(); // Appel de la fonction de test de connexion

export default sequelize;
