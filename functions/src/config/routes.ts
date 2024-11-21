import { Express } from 'express';
import path from 'path';
import fs from 'fs';

const configureRoutes = (app: Express): void => {
  const routesPath = path.join(__dirname, '../routes');

  const addRoutes = (dir: string, basePath: string = '') => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);

      if (fs.lstatSync(fullPath).isDirectory()) {
        addRoutes(fullPath, basePath); 
      } else if (file.endsWith('Routes.js') || file.endsWith('Routes.ts')) {
        try {
          const route = require(fullPath).default;
          const routeBasePath = `/${file.replace(/Routes\.(ts|js)$/, '').toLowerCase()}`; 
          app.use(routeBasePath, route);
        } catch (error) {
          console.error(`Failed to load route from file: ${file}`, error);
        }
      }
    });
  };

  try {
    addRoutes(routesPath);
  } catch (error) {
    console.error('Error in configureRoutes:', error);
  }
};

export default configureRoutes;
