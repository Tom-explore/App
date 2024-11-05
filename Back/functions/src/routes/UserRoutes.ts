import { Router } from 'express';
import userController from '../controller/UserController'; // Assurez-vous d'avoir créé ce fichier

const router = Router();

// Définir les routes et les méthodes du contrôleur
router.post('/', userController.createUser); // Route pour créer un utilisateur
router.get('/:id', userController.getUserById); // Route pour récupérer un utilisateur par ID
router.get('/', userController.getAllUsers); // Route pour récupérer tous les utilisateurs
router.put('/:id', userController.updateUser); // Route pour mettre à jour un utilisateur
router.delete('/:id', userController.deleteUser); // Route pour supprimer un utilisateur

export default router;
