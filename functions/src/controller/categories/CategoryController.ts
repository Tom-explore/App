import { Request, Response } from 'express';
import { Category } from '../../model/categories/Category';

class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const category = await Category.createCategory(data);
      return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating category', error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const category = await Category.findById(Number(id));
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching category', error: error.message });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching categories', error: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const category = await Category.updateCategory(Number(id), data);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating category', error: error.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Category.deleteCategory(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting category', error: error.message });
    }
  }
}

export default CategoryController;
