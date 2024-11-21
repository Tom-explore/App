import { Request, Response } from 'express';
import { RestaurantBar } from '../../model/places/RestaurantBar';

class RestaurantBarController {
  static async createRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const restaurantBar = await RestaurantBar.createRestaurantBar(data);
      return res.status(201).json({ message: 'Restaurant/Bar created successfully', restaurantBar });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating restaurant/bar', error: error.message });
    }
  }

  static async getRestaurantBarById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const restaurantBar = await RestaurantBar.findById(Number(id));
      if (!restaurantBar) return res.status(404).json({ message: 'Restaurant/Bar not found' });
      return res.status(200).json(restaurantBar);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching restaurant/bar', error: error.message });
    }
  }

  static async getAllRestaurantBars(req: Request, res: Response): Promise<Response> {
    try {
      const restaurantBars = await RestaurantBar.findAll();
      return res.status(200).json(restaurantBars);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching restaurants/bars', error: error.message });
    }
  }

  static async updateRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const restaurantBar = await RestaurantBar.updateRestaurantBar(Number(id), data);
      if (!restaurantBar) return res.status(404).json({ message: 'Restaurant/Bar not found' });
      return res.status(200).json({ message: 'Restaurant/Bar updated successfully', restaurantBar });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating restaurant/bar', error: error.message });
    }
  }

  static async deleteRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await RestaurantBar.deleteRestaurantBar(Number(id));
      if (!success) return res.status(404).json({ message: 'Restaurant/Bar not found' });
      return res.status(200).json({ message: 'Restaurant/Bar deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting restaurant/bar', error: error.message });
    }
  }
}

export default RestaurantBarController;
