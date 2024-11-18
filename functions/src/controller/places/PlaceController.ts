import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';

class PlaceController {
  static async createPlace(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const place = await Place.createPlace(data);
      return res.status(201).json({ message: 'Place created successfully', place });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place', error: error.message });
    }
  }

  static async getPlaceById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const place = await Place.findById(Number(id));
      if (!place) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json(place);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place', error: error.message });
    }
  }

  static async getAllPlaces(req: Request, res: Response): Promise<Response> {
    try {
      const places = await Place.findAll();
      return res.status(200).json(places);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching places', error: error.message });
    }
  }

  static async updatePlace(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const place = await Place.updatePlace(Number(id), data);
      if (!place) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json({ message: 'Place updated successfully', place });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place', error: error.message });
    }
  }

  static async deletePlace(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Place.deletePlace(Number(id));
      if (!success) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place', error: error.message });
    }
  }
}

export default PlaceController;
