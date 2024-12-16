import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { City } from '../../model/common/City';
import { TxCity } from '../../model/translations/TxCity';
import { Country } from '../../model/common/Country';
import { TxCountry } from '../../model/translations/TxCountry';
import { Repository } from 'typeorm';

class CityController {
  private cityRepository: Repository<City>;
  private txCityRepository: Repository<TxCity>;
  private countryRepository: Repository<Country>;
  private txCountryRepository: Repository<TxCountry>;

  constructor() {
    this.cityRepository = AppDataSource.getRepository(City);
    this.txCityRepository = AppDataSource.getRepository(TxCity);
    this.countryRepository = AppDataSource.getRepository(Country);
    this.txCountryRepository = AppDataSource.getRepository(TxCountry);
  }

  static async createCity(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const {
        slug,
        lat,
        lng,
        video,
        main_img,
        img_marker,
        attraction_min_reviews,
        visible,
        scrapio,
        gyg,
        timezone,
        duration,
        link_city_card,
        link_taxi,
        link_car_rental,
        link_bike_rental,
        countryId
      } = req.body;
      if (!slug || !countryId) {
        return res.status(400).json({ message: 'slug and countryId are required' });
      }
      const city = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const country = await transactionalEntityManager.findOne(Country, { where: { id: countryId } });
        if (!country) {
          throw new Error(`Country with ID ${countryId} not found`);
        }
        const newCity = transactionalEntityManager.create(City, {
          slug,
          lat,
          lng,
          video,
          main_img,
          img_marker,
          attraction_min_reviews,
          visible,
          scrapio,
          gyg,
          timezone,
          duration,
          link_city_card,
          link_taxi,
          link_car_rental,
          link_bike_rental,
          country
        });
        return await transactionalEntityManager.save(newCity);
      });
      return res.status(201).json({ message: 'City created successfully', city });
    } catch (error: any) {
      console.error('Error creating city:', error.message);
      return res.status(500).json({ message: 'Error creating city', error: error.message });
    }
  }

  static async getCityById(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const { id } = req.params;
      const city = await controller.cityRepository.findOne({
        where: { id: Number(id) },
        relations: ['country']
      });
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      return res.status(200).json(city);
    } catch (error: any) {
      console.error('Error fetching city:', error.message);
      return res.status(500).json({ message: 'Error fetching city', error: error.message });
    }
  }

  static async getAllCities(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const cities = await controller.cityRepository.find({ relations: ['country'] });
      return res.status(200).json(cities);
    } catch (error: any) {
      console.error('Error fetching cities:', error.message);
      return res.status(500).json({ message: 'Error fetching cities', error: error.message });
    }
  }

  static async updateCity(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const { id } = req.params;
      const {
        slug,
        lat,
        lng,
        video,
        main_img,
        img_marker,
        attraction_min_reviews,
        visible,
        scrapio,
        gyg,
        timezone,
        duration,
        link_city_card,
        link_taxi,
        link_car_rental,
        link_bike_rental,
        countryId
      } = req.body;
      if (
        !slug &&
        lat === undefined &&
        lng === undefined &&
        !video &&
        !main_img &&
        !img_marker &&
        attraction_min_reviews === undefined &&
        visible === undefined &&
        !scrapio &&
        !gyg &&
        !timezone &&
        duration === undefined &&
        !link_city_card &&
        !link_taxi &&
        !link_car_rental &&
        !link_bike_rental &&
        countryId === undefined
      ) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedCity = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const city = await transactionalEntityManager.findOne(City, { where: { id: Number(id) } });
        if (!city) {
          throw new Error('City not found');
        }
        if (countryId) {
          const country = await transactionalEntityManager.findOne(Country, { where: { id: countryId } });
          if (!country) {
            throw new Error(`Country with ID ${countryId} not found`);
          }
          city.country = country;
        }
        transactionalEntityManager.merge(City, city, {
          slug,
          lat,
          lng,
          video,
          main_img,
          img_marker,
          attraction_min_reviews,
          visible,
          scrapio,
          gyg,
          timezone,
          duration,
          link_city_card,
          link_taxi,
          link_car_rental,
          link_bike_rental
        });
        return await transactionalEntityManager.save(city);
      });
      return res.status(200).json({ message: 'City updated successfully', city: updatedCity });
    } catch (error: any) {
      console.error('Error updating city:', error.message);
      if (error.message === 'City not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating city', error: error.message });
    }
  }

  static async deleteCity(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const { id } = req.params;
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const city = await transactionalEntityManager.findOne(City, { where: { id: Number(id) } });
        if (!city) {
          throw new Error('City not found');
        }
        await transactionalEntityManager.remove(city);
        return true;
      });
      return res.status(200).json({ message: 'City deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting city:', error.message);
      if (error.message === 'City not found') {
        return res.status(404).json({ message: 'City not found' });
      }
      return res.status(500).json({ message: 'Error deleting city', error: error.message });
    }
  }

  static async getCitiesWithTranslations(req: Request, res: Response): Promise<Response> {
    const controller = new CityController();
    try {
      const { languageId } = req.query;
      if (!languageId) {
        return res.status(400).json({ message: 'Language ID is required' });
      }
      const langId = Number(languageId);
      const cities = await controller.cityRepository.find({ relations: ['country'] });
      const citiesWithTranslations = await Promise.all(
        cities.map(async (city) => {
          const txCities = await controller.txCityRepository.find({ where: { city: { id: city.id } } });
          const txCountries = await controller.txCountryRepository.find({ where: { country: { id: city.country.id } } });
          return {
            id: city.id,
            lat: city.lat,
            lng: city.lng,
            slug: city.slug,
            translations: txCities
              .filter(tx => tx.language_id === langId)
              .map(tx => ({
                language: tx.language_id,
                name: tx.name,
                slug: tx.slug,
                description: tx.description,
                metaDescription: tx.meta_description
              })),
            country: {
              id: city.country.id,
              code: city.country.code,
              translations: txCountries
                .filter(tx => tx.language_id === langId)
                .map(tx => ({
                  language: tx.language_id,
                  name: tx.name,
                  description: tx.description,
                  metaDescription: tx.meta_description
                }))
            }
          };
        })
      );
      return res.status(200).json(citiesWithTranslations);
    } catch (error: any) {
      console.error('Error fetching cities with translations:', error.message);
      return res.status(500).json({ message: 'Error fetching cities with translations', error: error.message });
    }
  }
}

export default CityController;
