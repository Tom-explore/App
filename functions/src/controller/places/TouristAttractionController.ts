import { Request, Response } from 'express';
import { TouristAttraction } from '../../model/places/TouristAttraction';

class TouristAttractionController {
  static async createTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const attraction = await TouristAttraction.createTouristAttraction(data);
      return res.status(201).json({ message: 'Tourist attraction created successfully', attraction });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating tourist attraction', error: error.message });
    }
  }

  static async getTouristAttractionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const attraction = await TouristAttraction.findById(Number(id));
      if (!attraction) return res.status(404).json({ message: 'Tourist attraction not found' });
      return res.status(200).json(attraction);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching tourist attraction', error: error.message });
    }
  }

  static async getAllTouristAttractions(req: Request, res: Response): Promise<Response> {
    try {
      const attractions = await TouristAttraction.findAll();
      return res.status(200).json(attractions);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching tourist attractions', error: error.message });
    }
  }

  static async updateTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const attraction = await TouristAttraction.updateTouristAttraction(Number(id), data);
      if (!attraction) return res.status(404).json({ message: 'Tourist attraction not found' });
      return res.status(200).json({ message: 'Tourist attraction updated successfully', attraction });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating tourist attraction', error: error.message });
    }
  }

  static async deleteTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await TouristAttraction.deleteTouristAttraction(Number(id));
      if (!success) return res.status(404).json({ message: 'Tourist attraction not found' });
      return res.status(200).json({ message: 'Tourist attraction deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting tourist attraction', error: error.message });
    }
  }
}

export default TouristAttractionController;
