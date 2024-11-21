import { Request, Response } from 'express';
import { User } from '../../model/users/User';

class UserController {
  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const existingUser = await User.findByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const user = await User.createUser(data);
      return res.status(201).json({ message: 'User successfully created', user });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating user', error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await User.findById(Number(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  }

  static async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid email provided' });
      }
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching user by email', error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUser = await User.updateUser(Number(id), data);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User successfully updated', updatedUser });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating user', error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await User.deleteUser(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting user', error: error.message });
    }
  }
}

export default UserController;
