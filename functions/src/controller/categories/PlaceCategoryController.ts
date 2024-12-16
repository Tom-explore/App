import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PlaceCategory } from '../../model/categories/PlaceCategory';
import { Place } from '../../model/places/Place';
import { Category } from '../../model/categories/Category';
import { Repository } from 'typeorm';

class PlaceCategoryController {
  private placeCategoryRepository: Repository<PlaceCategory>;
  private placeRepository: Repository<Place>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.placeCategoryRepository = AppDataSource.getRepository(PlaceCategory);
    this.placeRepository = AppDataSource.getRepository(Place);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  static async createPlaceCategory(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { placeId, categoryId, main } = req.body;
      if (!placeId || !categoryId) {
        return res.status(400).json({ message: 'placeId and categoryId are required' });
      }
      const placeCategory = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
        if (!place) {
          throw new Error(`Place with ID ${placeId} not found`);
        }
        const category = await transactionalEntityManager.findOne(Category, { where: { id: categoryId } });
        if (!category) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        const newPlaceCategory = transactionalEntityManager.create(PlaceCategory, {
          place,
          category,
          main: main || false,
        });
        return await transactionalEntityManager.save(newPlaceCategory);
      });
      return res.status(201).json({ message: 'Place category created successfully', placeCategory });
    } catch (error: any) {
      console.error('Error creating place category:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating place category', error: error.message });
    }
  }

  static async getPlaceCategoryById(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { id } = req.params;
      const placeCategory = await controller.placeCategoryRepository.findOne({
        where: { id: Number(id) },
        relations: ['place', 'category'],
      });
      if (!placeCategory) {
        return res.status(404).json({ message: 'Place category not found' });
      }
      return res.status(200).json(placeCategory);
    } catch (error: any) {
      console.error('Error fetching place category:', error.message);
      return res.status(500).json({ message: 'Error fetching place category', error: error.message });
    }
  }

  static async getPlaceCategoriesByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { placeId } = req.params;
      const placeCategories = await controller.placeCategoryRepository.find({
        where: { place: { id: Number(placeId) } },
        relations: ['place', 'category'],
      });
      return res.status(200).json(placeCategories);
    } catch (error: any) {
      console.error('Error fetching place categories by place:', error.message);
      return res.status(500).json({ message: 'Error fetching place categories by place', error: error.message });
    }
  }

  static async getPlaceCategoriesByCategory(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { categoryId } = req.params;
      const placeCategories = await controller.placeCategoryRepository.find({
        where: { category: { id: Number(categoryId) } },
        relations: ['place', 'category'],
      });
      return res.status(200).json(placeCategories);
    } catch (error: any) {
      console.error('Error fetching place categories by category:', error.message);
      return res.status(500).json({ message: 'Error fetching place categories by category', error: error.message });
    }
  }

  static async updatePlaceCategory(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { id } = req.params;
      const { placeId, categoryId, main } = req.body;
      if (!placeId && !categoryId && main === undefined) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedPlaceCategory = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeCategory = await transactionalEntityManager.findOne(PlaceCategory, { where: { id: Number(id) }, relations: ['place', 'category'] });
        if (!placeCategory) {
          throw new Error('Place category not found');
        }
        if (placeId) {
          const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
          if (!place) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          placeCategory.place = place;
        }
        if (categoryId) {
          const category = await transactionalEntityManager.findOne(Category, { where: { id: categoryId } });
          if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
          }
          placeCategory.category = category;
        }
        if (main !== undefined) {
          placeCategory.main = main;
        }
        transactionalEntityManager.merge(PlaceCategory, placeCategory, {
          place: placeCategory.place,
          category: placeCategory.category,
          main: placeCategory.main,
        });
        return await transactionalEntityManager.save(placeCategory);
      });
      return res.status(200).json({ message: 'Place category updated successfully', placeCategory: updatedPlaceCategory });
    } catch (error: any) {
      console.error('Error updating place category:', error.message);
      if (error.message === 'Place category not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating place category', error: error.message });
    }
  }

  static async deletePlaceCategory(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceCategoryController();
    try {
      const { id } = req.params;
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeCategory = await transactionalEntityManager.findOne(PlaceCategory, { where: { id: Number(id) } });
        if (!placeCategory) {
          throw new Error('Place category not found');
        }
        await transactionalEntityManager.remove(placeCategory);
        return true;
      });
      return res.status(200).json({ message: 'Place category deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting place category:', error.message);
      if (error.message === 'Place category not found') {
        return res.status(404).json({ message: 'Place category not found' });
      }
      return res.status(500).json({ message: 'Error deleting place category', error: error.message });
    }
  }
}

export default PlaceCategoryController;
