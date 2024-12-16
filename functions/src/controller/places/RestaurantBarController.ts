import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { RestaurantBar } from '../../model/places/RestaurantBar';
import { Place } from '../../model/places/Place';
import { Category } from '../../model/categories/Category';
import { PlaceCategory } from '../../model/categories/PlaceCategory';
import { Repository } from 'typeorm';

class RestaurantBarController {
  private restaurantBarRepository: Repository<RestaurantBar>;
  private placeRepository: Repository<Place>;
  private categoryRepository: Repository<Category>;
  private placeCategoryRepository: Repository<PlaceCategory>;

  constructor() {
    this.restaurantBarRepository = AppDataSource.getRepository(RestaurantBar);
    this.placeRepository = AppDataSource.getRepository(Place);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.placeCategoryRepository = AppDataSource.getRepository(PlaceCategory);
  }

  static async createRestaurantBar(req: Request, res: Response): Promise<Response> {
    const controller = new RestaurantBarController();
    try {
      const { place, ...restaurantBarData } = req.body;
      if (!place || !place.slug) {
        return res.status(400).json({ message: 'Place data with slug is required' });
      }
      const restaurantBar = await AppDataSource.transaction(async (transactionalEntityManager) => {
        let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
        if (!existingPlace) {
          existingPlace = transactionalEntityManager.create(Place, place);
          existingPlace = await transactionalEntityManager.save(existingPlace);
        }
        const newRestaurantBar = transactionalEntityManager.create(RestaurantBar, {
          ...restaurantBarData,
          place: existingPlace,
        });
        const savedRestaurantBar = await transactionalEntityManager.save(newRestaurantBar);
        const category = await transactionalEntityManager.findOne(Category, { where: { slug: 'bar_restaurant' } });
        if (category) {
          const placeCategory = transactionalEntityManager.create(PlaceCategory, {
            place: existingPlace,
            category: category,
          });
          await transactionalEntityManager.save(placeCategory);
        }
        return savedRestaurantBar;
      });
      return res.status(201).json({ message: 'Restaurant/Bar and Place created successfully', restaurantBar });
    } catch (error: any) {
      console.error('Error creating restaurant/bar and place:', error.message);
      return res.status(500).json({ message: 'Error creating restaurant/bar and place', error: error.message });
    }
  }

  static async getRestaurantBarById(req: Request, res: Response): Promise<Response> {
    const controller = new RestaurantBarController();
    try {
      const { id } = req.params;
      const restaurantBar = await controller.restaurantBarRepository.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!restaurantBar) {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }
      return res.status(200).json(restaurantBar);
    } catch (error: any) {
      console.error('Error fetching restaurant/bar:', error.message);
      return res.status(500).json({ message: 'Error fetching restaurant/bar', error: error.message });
    }
  }

  static async getAllRestaurantBars(req: Request, res: Response): Promise<Response> {
    const controller = new RestaurantBarController();
    try {
      const restaurantBars = await controller.restaurantBarRepository.find({ relations: ['place'] });
      return res.status(200).json(restaurantBars);
    } catch (error: any) {
      console.error('Error fetching restaurants/bars:', error.message);
      return res.status(500).json({ message: 'Error fetching restaurants/bars', error: error.message });
    }
  }

  static async updateRestaurantBar(req: Request, res: Response): Promise<Response> {
    const controller = new RestaurantBarController();
    try {
      const { id } = req.params;
      const { place, ...restaurantBarData } = req.body;
      const updatedRestaurantBar = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const restaurantBar = await transactionalEntityManager.findOne(RestaurantBar, {
          where: { id: Number(id) },
          relations: ['place'],
        });
        if (!restaurantBar) {
          throw new Error('Restaurant/Bar not found');
        }
        if (place && place.slug) {
          let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
          if (!existingPlace) {
            existingPlace = transactionalEntityManager.create(Place, place);
            existingPlace = await transactionalEntityManager.save(existingPlace);
            const category = await transactionalEntityManager.findOne(Category, { where: { slug: 'bar_restaurant' } });
            if (category) {
              const placeCategory = transactionalEntityManager.create(PlaceCategory, {
                place: existingPlace,
                category: category,
              });
              await transactionalEntityManager.save(placeCategory);
            }
          }
          restaurantBar.place = existingPlace;
        }
        transactionalEntityManager.merge(RestaurantBar, restaurantBar, restaurantBarData);
        return await transactionalEntityManager.save(restaurantBar);
      });
      return res.status(200).json({ message: 'Restaurant/Bar updated successfully', restaurantBar: updatedRestaurantBar });
    } catch (error: any) {
      console.error('Error updating restaurant/bar:', error.message);
      if (error.message === 'Restaurant/Bar not found') {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }
      return res.status(500).json({ message: 'Error updating restaurant/bar', error: error.message });
    }
  }

  static async deleteRestaurantBar(req: Request, res: Response): Promise<Response> {
    const controller = new RestaurantBarController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const restaurantBar = await transactionalEntityManager.findOne(RestaurantBar, {
          where: { id: Number(id) },
          relations: ['place'],
        });
        if (!restaurantBar) {
          throw new Error('Restaurant/Bar not found');
        }
        await transactionalEntityManager.remove(restaurantBar);
      });
      return res.status(200).json({ message: 'Restaurant/Bar deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting restaurant/bar:', error.message);
      if (error.message === 'Restaurant/Bar not found') {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }
      return res.status(500).json({ message: 'Error deleting restaurant/bar', error: error.message });
    }
  }
}

export default RestaurantBarController;
