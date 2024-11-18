import { Request, Response } from 'express';
import { PostCategorization } from '../../model/blog/PostCategorization';

class PostCategorizationController {
  static async createCategorization(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const categorization = await PostCategorization.createCategorization(data);
      return res.status(201).json({ message: 'Categorization created successfully', categorization });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating categorization', error: error.message });
    }
  }

  static async getCategorization(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, categoryId } = req.params;
      const categorization = await PostCategorization.findByPostAndCategory(Number(postId), Number(categoryId));
      if (!categorization) {
        return res.status(404).json({ message: 'Categorization not found' });
      }
      return res.status(200).json(categorization);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching categorization', error: error.message });
    }
  }

  static async getCategorizationsByPost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId } = req.params;
      const categorizations = await PostCategorization.findByPost(Number(postId));
      return res.status(200).json(categorizations);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching categorizations', error: error.message });
    }
  }

  static async updateCategorization(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, categoryId } = req.params;
      const data = req.body;
      const categorization = await PostCategorization.updateCategorization(
        Number(postId),
        Number(categoryId),
        data
      );
      if (!categorization) {
        return res.status(404).json({ message: 'Categorization not found' });
      }
      return res.status(200).json({ message: 'Categorization updated successfully', categorization });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating categorization', error: error.message });
    }
  }

  static async deleteCategorization(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, categoryId } = req.params;
      const success = await PostCategorization.deleteCategorization(Number(postId), Number(categoryId));
      if (!success) {
        return res.status(404).json({ message: 'Categorization not found' });
      }
      return res.status(200).json({ message: 'Categorization deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting categorization', error: error.message });
    }
  }
}

export default PostCategorizationController;
