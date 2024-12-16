import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Category } from '../../model/categories/Category';
import { Repository } from 'typeorm';

class CategoryController {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  static async createCategory(req: Request, res: Response): Promise<Response> {
    const controller = new CategoryController();

    try {
      const { slug, is_food_restriction, is_atmosphere, for_feed, for_trip_form, for_posts } = req.body;

      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
      }

      const category = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const newCategory = transactionalEntityManager.create(Category, {
          slug,
          is_food_restriction,
          is_atmosphere,
          for_feed,
          for_trip_form,
          for_posts,
        });

        return await transactionalEntityManager.save(newCategory);
      });

      return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error: any) {
      console.error('Error creating category:', error.message);
      return res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<Response> {
    const controller = new CategoryController();

    try {
      const { id } = req.params;

      const category = await controller.categoryRepository.findOne({
        where: { id: Number(id) },
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json(category);
    } catch (error: any) {
      console.error('Error fetching category:', error.message);
      return res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<Response> {
    const controller = new CategoryController();

    try {
      const categories = await controller.categoryRepository.find({
        relations: ['translations', 'translations.language'], // Include translations and their associated languages
      });

      return res.status(200).json(categories);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
      return res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  }


  static async updateCategory(req: Request, res: Response): Promise<Response> {
    const controller = new CategoryController();

    try {
      const { id } = req.params;
      const { slug, is_food_restriction, is_atmosphere, for_feed, for_trip_form, for_posts } = req.body;

      if (!slug && is_food_restriction === undefined && is_atmosphere === undefined && for_feed === undefined && for_trip_form === undefined && for_posts === undefined) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }

      const updatedCategory = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const category = await transactionalEntityManager.findOne(Category, { where: { id: Number(id) } });
        if (!category) {
          throw new Error('Category not found');
        }

        transactionalEntityManager.merge(Category, category, {
          slug,
          for_feed,
          for_trip_form,
          for_posts,
        });

        return await transactionalEntityManager.save(category);
      });

      return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(500).json({ message: 'Error updating category', error: error.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<Response> {
    const controller = new CategoryController();

    try {
      const { id } = req.params;

      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const category = await transactionalEntityManager.findOne(Category, { where: { id: Number(id) } });
        if (!category) {
          throw new Error('Category not found');
        }

        await transactionalEntityManager.remove(category);
        return true;
      });

      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      if (error.message === 'Category not found') {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  }
}

export default CategoryController;
