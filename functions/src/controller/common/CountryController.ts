import { Request, Response } from 'express';
import { Country } from '../../model/common/Country';

class CountryController {
  static async createCountry(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const country = await Country.createCountry(data);
      return res.status(201).json({ message: 'Country created successfully', country });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating country', error: error.message });
    }
  }

  static async getCountryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const country = await Country.findById(Number(id));
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(200).json(country);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching country', error: error.message });
    }
  }

  static async getAllCountries(req: Request, res: Response): Promise<Response> {
    try {
      const countries = await Country.findAll();
      return res.status(200).json(countries);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching countries', error: error.message });
    }
  }

  static async updateCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const country = await Country.updateCountry(Number(id), data);
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(200).json({ message: 'Country updated successfully', country });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating country', error: error.message });
    }
  }

  static async deleteCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Country.deleteCountry(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting country', error: error.message });
    }
  }
}

export default CountryController;
