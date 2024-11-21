import { Request, Response } from 'express';
import { Trip } from '../../model/trips/Trip';

class TripController {
  static async createTrip(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const trip = await Trip.createTrip(data);
      return res.status(201).json({ message: 'Trip created successfully', trip });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating trip', error: error.message });
    }
  }

  static async getTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const trip = await Trip.findById(Number(id));
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.status(200).json(trip);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip', error: error.message });
    }
  }

  static async getTripsByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const trips = await Trip.findByUser(Number(userId));
      return res.status(200).json(trips);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trips', error: error.message });
    }
  }

  static async updateTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const trip = await Trip.updateTrip(Number(id), data);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.status(200).json({ message: 'Trip updated successfully', trip });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating trip', error: error.message });
    }
  }

  static async deleteTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Trip.deleteTrip(Number(id));
      if (!success) return res.status(404).json({ message: 'Trip not found' });
      return res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting trip', error: error.message });
    }
  }
}

export default TripController;
