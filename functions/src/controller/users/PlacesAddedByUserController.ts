import { Request, Response } from 'express';
import { PlacesAddedByUser } from '../../model/users/PlacesAddedByUser';

class PlacesAddedByUserController {
  static async createPlaceAdded(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const placeAdded = await PlacesAddedByUser.createPlaceAdded(data);
      return res.status(201).json({ message: 'Place added by user successfully created', placeAdded });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place added by user', error: error.message });
    }
  }

  static async getPlaceAddedById(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, placeId } = req.params;
      const placeAdded = await PlacesAddedByUser.findPlaceAddedById(Number(userId), Number(placeId));
      if (!placeAdded) return res.status(404).json({ message: 'Place added by user not found' });
      return res.status(200).json(placeAdded);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place added by user', error: error.message });
    }
  }

  static async getPlacesAddedByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const placesAdded = await PlacesAddedByUser.findPlacesAddedByUser(Number(userId));
      return res.status(200).json(placesAdded);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching places added by user', error: error.message });
    }
  }

  static async updatePlaceAdded(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, placeId } = req.params;
      const data = req.body;
      const updatedPlaceAdded = await PlacesAddedByUser.updatePlaceAdded(Number(userId), Number(placeId), data);
      if (!updatedPlaceAdded) return res.status(404).json({ message: 'Place added by user not found' });
      return res.status(200).json({ message: 'Place added by user successfully updated', updatedPlaceAdded });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place added by user', error: error.message });
    }
  }

  static async deletePlaceAdded(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, placeId } = req.params;
      const success = await PlacesAddedByUser.deletePlaceAdded(Number(userId), Number(placeId));
      if (!success) return res.status(404).json({ message: 'Place added by user not found' });
      return res.status(200).json({ message: 'Place added by user successfully deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place added by user', error: error.message });
    }
  }
}

export default PlacesAddedByUserController;
