import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PostCategorization } from '../../model/blog/PostCategorization';
import { Post } from '../../model/blog/Post';
import { Category } from '../../model/categories/Category'; // Assuming there is a Category model
import { Repository } from 'typeorm';

class PostCategorizationController {
  private postCategorizationRepository: Repository<PostCategorization>;
  private postRepository: Repository<Post>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.postCategorizationRepository = AppDataSource.getRepository(PostCategorization);
    this.postRepository = AppDataSource.getRepository(Post);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  static async createCategorization(req: Request, res: Response): Promise<Response> {
    const controller = new PostCategorizationController();

    try {
      const { post_id, category_id, ...data } = req.body;

      // Validation des données
      if (!post_id || !category_id) {
        return res.status(400).json({ message: 'post_id and category_id are required' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const categorization = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const post = await transactionalEntityManager.findOne(Post, { where: { id: post_id } });
        if (!post) {
          throw new Error(`Post with ID ${post_id} not found`);
        }

        const category = await transactionalEntityManager.findOne(Category, { where: { id: category_id } });
        if (!category) {
          throw new Error(`Category with ID ${category_id} not found`);
        }

        const newCategorization = transactionalEntityManager.create(PostCategorization, {
          post,
          category,
          ...data,
        });

        return await transactionalEntityManager.save(newCategorization);
      });

      return res.status(201).json({ message: 'Categorization created successfully', categorization });
    } catch (error: any) {
      console.error('Error creating categorization:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating categorization', error: error.message });
    }
  }

  static async getCategorization(req: Request, res: Response): Promise<Response> {
    const controller = new PostCategorizationController();

    try {
      const { postId, categoryId } = req.params;

      const categorization = await controller.postCategorizationRepository.findOne({
        where: { post: { id: Number(postId) }, category: { id: Number(categoryId) } },
        relations: ['post', 'category'],
      });

      if (!categorization) {
        return res.status(404).json({ message: 'Categorization not found' });
      }

      return res.status(200).json(categorization);
    } catch (error: any) {
      console.error('Error fetching categorization:', error.message);
      return res.status(500).json({ message: 'Error fetching categorization', error: error.message });
    }
  }

  static async getCategorizationsByPost(req: Request, res: Response): Promise<Response> {
    const controller = new PostCategorizationController();

    try {
      const { postId } = req.params;

      const categorizations = await controller.postCategorizationRepository.find({
        where: { post: { id: Number(postId) } },
        relations: ['post', 'category'],
      });

      return res.status(200).json(categorizations);
    } catch (error: any) {
      console.error('Error fetching categorizations:', error.message);
      return res.status(500).json({ message: 'Error fetching categorizations', error: error.message });
    }
  }

  static async updateCategorization(req: Request, res: Response): Promise<Response> {
    const controller = new PostCategorizationController();

    try {
      const { postId, categoryId } = req.params;
      const data = req.body;

      // Validation des données
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedCategorization = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const categorization = await transactionalEntityManager.findOne(PostCategorization, {
          where: { post: { id: Number(postId) }, category: { id: Number(categoryId) } },
          relations: ['post', 'category'],
        });

        if (!categorization) {
          throw new Error('Categorization not found');
        }

        transactionalEntityManager.merge(PostCategorization, categorization, data);
        return await transactionalEntityManager.save(categorization);
      });

      return res.status(200).json({ message: 'Categorization updated successfully', categorization: updatedCategorization });
    } catch (error: any) {
      console.error('Error updating categorization:', error.message);
      if (error.message === 'Categorization not found') {
        return res.status(404).json({ message: 'Categorization not found' });
      }
      return res.status(500).json({ message: 'Error updating categorization', error: error.message });
    }
  }

  static async deleteCategorization(req: Request, res: Response): Promise<Response> {
    const controller = new PostCategorizationController();

    try {
      const { postId, categoryId } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const categorization = await transactionalEntityManager.findOne(PostCategorization, {
          where: { post: { id: Number(postId) }, category: { id: Number(categoryId) } },
        });

        if (!categorization) {
          throw new Error('Categorization not found');
        }

        await transactionalEntityManager.remove(categorization);
        return true;
      });

      return res.status(200).json({ message: 'Categorization deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting categorization:', error.message);
      if (error.message === 'Categorization not found') {
        return res.status(404).json({ message: 'Categorization not found' });
      }
      return res.status(500).json({ message: 'Error deleting categorization', error: error.message });
    }
  }
}

export default PostCategorizationController;
