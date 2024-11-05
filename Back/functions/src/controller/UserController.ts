import { Request, Response } from 'express';
import User from '../model/User';

const userController = {
  // Créer un utilisateur
  async createUser(req: Request, res: Response) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
    }
  },

  // Récupérer un utilisateur par ID
  async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findByPk(parseInt(req.params.id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l’utilisateur' });
    }
  },

  // Récupérer tous les utilisateurs
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  // Mettre à jour un utilisateur par ID
  async updateUser(req: Request, res: Response) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: parseInt(req.params.id) },
      });
      if (updated) {
        const updatedUser = await User.findByPk(parseInt(req.params.id));
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l’utilisateur' });
    }
  },

  // Supprimer un utilisateur par ID
  async deleteUser(req: Request, res: Response) {
    try {
      const deleted = await User.destroy({
        where: { id: parseInt(req.params.id) },
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l’utilisateur' });
    }
  },

  // Appeler la méthode personnalisée 'sayHello' d'un utilisateur
  async sayHello(req: Request, res: Response) {
    try {
      const user = await User.findByPk(parseInt(req.params.id));
      if (user) {
        res.status(200).send(user.sayHello());
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l’exécution de la méthode personnalisée' });
    }
  },
};

export default userController;
