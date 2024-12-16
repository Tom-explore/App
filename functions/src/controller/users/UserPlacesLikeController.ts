import { Request, Response } from 'express';
import { UserPlacesLike } from '../../model/users/UserPlacesLikes';

class UserPlacesLikeController {
  static async createLike(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id, liked } = req.body;

      if (user_id == null || place_id == null || liked == null) {
        return res.status(400).json({ message: 'user_id, place_id, and liked are required' });
      }

      const existingLike = await UserPlacesLike.findLikeById(user_id, place_id);
      if (existingLike) {
        return res.status(400).json({ message: 'Like already exists for this user and place' });
      }

      const like = await UserPlacesLike.createLike({ user_id, place_id, liked });
      return res.status(201).json({ message: 'Like successfully created', like });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error creating like', error: error.message });
    }
  }

  static async getLike(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;

      if (!user_id || !place_id) {
        return res.status(400).json({ message: 'user_id and place_id are required' });
      }

      const like = await UserPlacesLike.findLikeById(Number(user_id), Number(place_id));
      if (!like) {
        return res.status(404).json({ message: 'Like not found' });
      }

      return res.status(200).json(like);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching like', error: error.message });
    }
  }

  static async getLikesByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }

      const likes = await UserPlacesLike.findLikesByUser(Number(user_id));
      return res.status(200).json(likes);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error fetching likes by user', error: error.message });
    }
  }

  static async updateLike(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;
      const { liked } = req.body;

      if (liked == null) {
        return res.status(400).json({ message: 'liked is required in the request body' });
      }

      const updatedLike = await UserPlacesLike.updateLike(Number(user_id), Number(place_id), { liked });
      if (!updatedLike) {
        return res.status(404).json({ message: 'Like not found' });
      }

      return res.status(200).json({ message: 'Like successfully updated', updatedLike });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error updating like', error: error.message });
    }
  }

  static async deleteLike(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;

      if (!user_id || !place_id) {
        return res.status(400).json({ message: 'user_id and place_id are required' });
      }

      const success = await UserPlacesLike.deleteLike(Number(user_id), Number(place_id));
      if (!success) {
        return res.status(404).json({ message: 'Like not found' });
      }

      return res.status(200).json({ message: 'Like successfully deleted' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error deleting like', error: error.message });
    }
  }
}

export default UserPlacesLikeController;
