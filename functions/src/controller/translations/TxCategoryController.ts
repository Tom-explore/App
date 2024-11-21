import { Request, Response } from 'express';
import { TxCategory } from '../../model/translations/TxCategory';

class TxCategoryController {
  static async createTxCategory(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txCategory = await TxCategory.createTxCategory(data);
      return res.status(201).json({ message: 'TxCategory created successfully', txCategory });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxCategory', error: error.message });
    }
  }

  static async getTxCategoryByCategoryAndLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, languageId } = req.params;
      const txCategory = await TxCategory.findByCategoryAndLanguage(Number(categoryId), Number(languageId));
      if (!txCategory) return res.status(404).json({ message: 'TxCategory not found' });
      return res.status(200).json(txCategory);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategory', error: error.message });
    }
  }

  static async getTxCategoriesByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;
      const txCategories = await TxCategory.findByCategory(Number(categoryId));
      return res.status(200).json(txCategories);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategories by category', error: error.message });
    }
  }

  static async getTxCategoriesByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txCategories = await TxCategory.findByLanguage(Number(languageId));
      return res.status(200).json(txCategories);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategories by language', error: error.message });
    }
  }

  static async updateTxCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, languageId } = req.params;
      const data = req.body;
      const txCategory = await TxCategory.updateTxCategory(Number(categoryId), Number(languageId), data);
      if (!txCategory) return res.status(404).json({ message: 'TxCategory not found' });
      return res.status(200).json({ message: 'TxCategory updated successfully', txCategory });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxCategory', error: error.message });
    }
  }

  static async deleteTxCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, languageId } = req.params;
      const success = await TxCategory.deleteTxCategory(Number(categoryId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxCategory not found' });
      return res.status(200).json({ message: 'TxCategory deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxCategory', error: error.message });
    }
  }
}

export default TxCategoryController;
