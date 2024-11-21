import { Request, Response } from 'express';
import { City } from '../../model/common/City';

class CityController {
  static async createCity(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const city = await City.createCity(data);
      return res.status(201).json({ message: 'City created successfully', city });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating city', error: error.message });
    }
  }

  static async getCityById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const city = await City.findById(Number(id));
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      return res.status(200).json(city);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching city', error: error.message });
    }
  }

  static async getAllCities(req: Request, res: Response): Promise<Response> {
    try {
      const cities = await City.findAll();
      return res.status(200).json(cities);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching cities', error: error.message });
    }
  }

  static async updateCity(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const city = await City.updateCity(Number(id), data);
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      return res.status(200).json({ message: 'City updated successfully', city });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating city', error: error.message });
    }
  }

  static async deleteCity(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await City.deleteCity(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'City not found' });
      }
      return res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting city', error: error.message });
    }
  }
}

export default CityController;
