import { Request, Response } from 'express';
import { PlaceCategory } from '../../model/categories/PlaceCategory';

class PlaceCategoryController {
  static async createPlaceCategory(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const placeCategory = await PlaceCategory.createPlaceCategory(data);
      return res.status(201).json({ message: 'Place category created successfully', placeCategory });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place category', error: error.message });
    }
  }

  static async getPlaceCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const placeCategory = await PlaceCategory.findById(Number(id));
      if (!placeCategory) {
        return res.status(404).json({ message: 'Place category not found' });
      }
      return res.status(200).json(placeCategory);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place category', error: error.message });
    }
  }

  static async getPlaceCategoriesByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const placeCategories = await PlaceCategory.findByPlace(Number(placeId));
      return res.status(200).json(placeCategories);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place categories by place', error: error.message });
    }
  }

  static async getPlaceCategoriesByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;
      const placeCategories = await PlaceCategory.findByCategory(Number(categoryId));
      return res.status(200).json(placeCategories);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place categories by category', error: error.message });
    }
  }

  static async updatePlaceCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const placeCategory = await PlaceCategory.updatePlaceCategory(Number(id), data);
      if (!placeCategory) {
        return res.status(404).json({ message: 'Place category not found' });
      }
      return res.status(200).json({ message: 'Place category updated successfully', placeCategory });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place category', error: error.message });
    }
  }

  static async deletePlaceCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await PlaceCategory.deletePlaceCategory(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Place category not found' });
      }
      return res.status(200).json({ message: 'Place category deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place category', error: error.message });
    }
  }
}

export default PlaceCategoryController;
