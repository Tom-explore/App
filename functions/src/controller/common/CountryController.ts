import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Country } from '../../model/common/Country';
import { Repository } from 'typeorm';

class CountryController {
  private countryRepository: Repository<Country>;

  constructor() {
    this.countryRepository = AppDataSource.getRepository(Country);
  }

  static async createCountry(req: Request, res: Response): Promise<Response> {
    const controller = new CountryController();
    try {
      const { code, slug, currency } = req.body;
      if (!code || !slug) {
        return res.status(400).json({ message: 'code and slug are required' });
      }
      const country = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const newCountry = transactionalEntityManager.create(Country, {
          code,
          slug,
          currency,
        });
        return await transactionalEntityManager.save(newCountry);
      });
      return res.status(201).json({ message: 'Country created successfully', country });
    } catch (error: any) {
      console.error('Error creating country:', error.message);
      return res.status(500).json({ message: 'Error creating country', error: error.message });
    }
  }

  static async getCountryById(req: Request, res: Response): Promise<Response> {
    const controller = new CountryController();
    try {
      const { id } = req.params;
      const country = await controller.countryRepository.findOne({
        where: { id: Number(id) },
      });
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(200).json(country);
    } catch (error: any) {
      console.error('Error fetching country:', error.message);
      return res.status(500).json({ message: 'Error fetching country', error: error.message });
    }
  }

  static async getAllCountries(req: Request, res: Response): Promise<Response> {
    const controller = new CountryController();
    try {
      const countries = await controller.countryRepository.find();
      return res.status(200).json(countries);
    } catch (error: any) {
      console.error('Error fetching countries:', error.message);
      return res.status(500).json({ message: 'Error fetching countries', error: error.message });
    }
  }

  static async updateCountry(req: Request, res: Response): Promise<Response> {
    const controller = new CountryController();
    try {
      const { id } = req.params;
      const { code, slug, currency } = req.body;
      if (!code && !slug && !currency) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedCountry = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const country = await transactionalEntityManager.findOne(Country, { where: { id: Number(id) } });
        if (!country) {
          throw new Error('Country not found');
        }
        transactionalEntityManager.merge(Country, country, { code, slug, currency });
        return await transactionalEntityManager.save(country);
      });
      return res.status(200).json({ message: 'Country updated successfully', country: updatedCountry });
    } catch (error: any) {
      console.error('Error updating country:', error.message);
      if (error.message === 'Country not found') {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(500).json({ message: 'Error updating country', error: error.message });
    }
  }

  static async deleteCountry(req: Request, res: Response): Promise<Response> {
    const controller = new CountryController();
    try {
      const { id } = req.params;
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const country = await transactionalEntityManager.findOne(Country, { where: { id: Number(id) } });
        if (!country) {
          throw new Error('Country not found');
        }
        await transactionalEntityManager.remove(country);
        return true;
      });
      return res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting country:', error.message);
      if (error.message === 'Country not found') {
        return res.status(404).json({ message: 'Country not found' });
      }
      return res.status(500).json({ message: 'Error deleting country', error: error.message });
    }
  }
}

export default CountryController;
