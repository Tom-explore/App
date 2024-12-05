import { Request, Response } from 'express';
import { City } from '../../model/common/City';
import { TxCity } from '../../model/translations/TxCity';
import { Country } from '../../model/common/Country';
import { TxCountry } from '../../model/translations/TxCountry';

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
  static async getCitiesWithTranslations(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Fetching cities with countries...');
  
      // Récupérez les villes avec leurs relations (pays)
      const cities = await City.find({ relations: ['country'] });
  
      console.log('Fetched cities:', cities);
  
      const citiesWithTranslations = await Promise.all(
        cities.map(async (city) => {
            const translations = await TxCity.findByCity(city.id);
            const translationsForCountry = await TxCountry.findByCountry(city.country.id);
  
          return {
            id: city.id,
            lat: city.lat,
            lng: city.lng,
            slug:city.slug,
            translations: translations.map((translation) => ({
              language: translation.language_id,
              name: translation.name,
              description: translation.description,
              metaDescription: translation.meta_description,
            })),
            country: {
              id: city.country.id,
              code: city.country.code,
              translations: translationsForCountry.map((translation) => ({
                language: translation.language_id,
                name: translation.name,
                description: translation.description,
                metaDescription: translation.meta_description,
              })),
            },
          };
        })
      );  
      return res.status(200).json(citiesWithTranslations);
    } catch (error) {
      console.error('Error fetching cities with translations:', error);
      return res.status(400).json({ message: 'Error fetching cities with translations', error: error.message });
    }
  }
  
}

export default CityController;
