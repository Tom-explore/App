import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxCategory } from '../../model/translations/TxCategory';

class TxCategoryController {
  private txCategoryRepository = AppDataSource.getRepository(TxCategory);

  static async createTxCategory(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const data = req.body;
      const txCategory = controller.txCategoryRepository.create(data);
      await controller.txCategoryRepository.save(txCategory);
      return res.status(201).json({ message: 'TxCategory created successfully', txCategory });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxCategory', error: error.message });
    }
  }

  static async getTxCategoryByCategoryAndLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const { categoryId, languageId } = req.params;
      const txCategory = await controller.txCategoryRepository.findOne({
        where: { category_id: Number(categoryId), language_id: Number(languageId) },
        relations: ['category', 'language'],
      });
      if (!txCategory) return res.status(404).json({ message: 'TxCategory not found' });
      return res.status(200).json(txCategory);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategory', error: error.message });
    }
  }

  static async getTxCategoriesByCategory(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const { categoryId } = req.params;
      const txCategories = await controller.txCategoryRepository.find({
        where: { category_id: Number(categoryId) },
        relations: ['category', 'language'],
      });
      return res.status(200).json(txCategories);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategories by category', error: error.message });
    }
  }

  static async getTxCategoriesByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const { languageId } = req.params;
      const txCategories = await controller.txCategoryRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['category', 'language'],
      });
      return res.status(200).json(txCategories);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategories by language', error: error.message });
    }
  }

  static async updateTxCategory(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const { categoryId, languageId } = req.params;
      const data = req.body;

      const txCategory = await controller.txCategoryRepository.findOne({
        where: { category_id: Number(categoryId), language_id: Number(languageId) },
      });
      if (!txCategory) return res.status(404).json({ message: 'TxCategory not found' });

      controller.txCategoryRepository.merge(txCategory, data);
      await controller.txCategoryRepository.save(txCategory);

      return res.status(200).json({ message: 'TxCategory updated successfully', txCategory });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxCategory', error: error.message });
    }
  }

  static async deleteTxCategory(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryController();
    try {
      const { categoryId, languageId } = req.params;

      const txCategory = await controller.txCategoryRepository.findOne({
        where: { category_id: Number(categoryId), language_id: Number(languageId) },
      });
      if (!txCategory) return res.status(404).json({ message: 'TxCategory not found' });

      await controller.txCategoryRepository.remove(txCategory);
      return res.status(200).json({ message: 'TxCategory deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxCategory', error: error.message });
    }
  }
}

export default TxCategoryController;
