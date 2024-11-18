import { Request, Response } from 'express';
import { TripCategoryFilter } from '../../model/trips/TripCategoryFilter';

class TripCategoryFilterController {
  static async createTripCategoryFilter(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const tripCategoryFilter = await TripCategoryFilter.createTripCategoryFilter(data);
      return res.status(201).json({ message: 'Trip category filter created successfully', tripCategoryFilter });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating trip category filter', error: error.message });
    }
  }

  static async getTripCategoryFilter(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, categoryId } = req.params;
      const tripCategoryFilter = await TripCategoryFilter.findByTripAndCategory(Number(tripId), Number(categoryId));
      if (!tripCategoryFilter) return res.status(404).json({ message: 'Trip category filter not found' });
      return res.status(200).json(tripCategoryFilter);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip category filter', error: error.message });
    }
  }

  static async getAllTripCategoryFilters(req: Request, res: Response): Promise<Response> {
    try {
      const tripCategoryFilters = await TripCategoryFilter.findAll();
      return res.status(200).json(tripCategoryFilters);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip category filters', error: error.message });
    }
  }

  static async deleteTripCategoryFilter(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, categoryId } = req.params;
      const success = await TripCategoryFilter.deleteTripCategoryFilter(Number(tripId), Number(categoryId));
      if (!success) return res.status(404).json({ message: 'Trip category filter not found' });
      return res.status(200).json({ message: 'Trip category filter deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting trip category filter', error: error.message });
    }
  }
}

export default TripCategoryFilterController;
