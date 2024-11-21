import { Request, Response } from 'express';
import { TripComposition } from '../../model/trips/TripComposition';

class TripCompositionController {
  static async createComposition(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const composition = await TripComposition.createComposition(data);
      return res.status(201).json({ message: 'Trip composition created successfully', composition });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating trip composition', error: error.message });
    }
  }

  static async getComposition(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, day, position } = req.params;
      const composition = await TripComposition.findCompositionById(Number(tripId), Number(day), Number(position));
      if (!composition) return res.status(404).json({ message: 'Trip composition not found' });
      return res.status(200).json(composition);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip composition', error: error.message });
    }
  }

  static async getCompositionsByTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId } = req.params;
      const compositions = await TripComposition.findCompositionsByTrip(Number(tripId));
      return res.status(200).json(compositions);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip compositions', error: error.message });
    }
  }

  static async updateComposition(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, day, position } = req.params;
      const data = req.body;
      const updatedComposition = await TripComposition.updateComposition(
        Number(tripId),
        Number(day),
        Number(position),
        data
      );
      if (!updatedComposition) return res.status(404).json({ message: 'Trip composition not found' });
      return res.status(200).json({ message: 'Trip composition updated successfully', updatedComposition });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating trip composition', error: error.message });
    }
  }

  static async deleteComposition(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, day, position } = req.params;
      const success = await TripComposition.deleteComposition(Number(tripId), Number(day), Number(position));
      if (!success) return res.status(404).json({ message: 'Trip composition not found' });
      return res.status(200).json({ message: 'Trip composition deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting trip composition', error: error.message });
    }
  }
}

export default TripCompositionController;
