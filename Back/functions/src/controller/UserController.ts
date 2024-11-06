import { Request, Response } from 'express';
import { User } from '../model/User';

export const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, photo } = req.body;
      const newUser = User.create({ username, email, password });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Erreur lors de la création de l’utilisateur:', error);
      res.status(500).json({ error: `Erreur lors de la création de l’utilisateur, ${error.message}` });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: parseInt(req.params.id) });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l’utilisateur:', error);
      res.status(500).json({ error: `Erreur lors de la récup de l’utilisateur, ${error.message}` });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ error: `Erreur lors de la récup des utilisateurs, ${error.message}` });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: parseInt(req.params.id) });
      if (user) {
        User.merge(user, req.body);
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’utilisateur:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l’utilisateur' });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await User.delete({ id: parseInt(req.params.id) });
      if (result.affected) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l’utilisateur:', error);
      res.status(500).json({ error: `Erreur lors de la suppression de l’utilisateur, ${error.message}` });
    }
  },

  async sayHello(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: parseInt(req.params.id) });
      if (user) {
        res.status(200).send(user.sayHello());
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('Erreur lors de l’exécution de la méthode personnalisée:', error);
      res.status(500).json({ error: 'Erreur lors de l’exécution de la méthode personnalisée' });      
      res.status(500).json({ error: `${error.message}` });

    }
  },
};

export default userController;
