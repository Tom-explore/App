import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxCategoryCityLang } from '../../model/translations/TxCategoryCityLang';

class TxCategoryCityLangController {
  private txCategoryCityLangRepository = AppDataSource.getRepository(TxCategoryCityLang);

  static async createTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const data = req.body;
      const txCategoryCityLang = controller.txCategoryCityLangRepository.create(data);
      await controller.txCategoryCityLangRepository.save(txCategoryCityLang);
      return res.status(201).json({ message: 'TxCategoryCityLang created successfully', txCategoryCityLang });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxCategoryCityLang', error: error.message });
    }
  }

  static async getTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { categoryId, cityId, languageId } = req.params;
      const txCategoryCityLang = await controller.txCategoryCityLangRepository.findOne({
        where: {
          category_id: Number(categoryId),
          city_id: Number(cityId),
          language_id: Number(languageId),
        },
        relations: ['category', 'city', 'language'],
      });
      if (!txCategoryCityLang) return res.status(404).json({ message: 'TxCategoryCityLang not found' });
      return res.status(200).json(txCategoryCityLang);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang', error: error.message });
    }
  }

  static async getTxCategoryCityLangByCategory(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { categoryId } = req.params;
      const txCategoryCityLangs = await controller.txCategoryCityLangRepository.find({
        where: { category_id: Number(categoryId) },
        relations: ['category', 'city', 'language'],
      });
      return res.status(200).json(txCategoryCityLangs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by category', error: error.message });
    }
  }

  static async getTxCategoryCityLangByCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { cityId } = req.params;
      const txCategoryCityLangs = await controller.txCategoryCityLangRepository.find({
        where: { city_id: Number(cityId) },
        relations: ['category', 'city', 'language'],
      });
      return res.status(200).json(txCategoryCityLangs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by city', error: error.message });
    }
  }

  static async getTxCategoryCityLangByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { languageId } = req.params;
      const txCategoryCityLangs = await controller.txCategoryCityLangRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['category', 'city', 'language'],
      });
      return res.status(200).json(txCategoryCityLangs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by language', error: error.message });
    }
  }

  static async updateTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { categoryId, cityId, languageId } = req.params;
      const data = req.body;

      const txCategoryCityLang = await controller.txCategoryCityLangRepository.findOne({
        where: {
          category_id: Number(categoryId),
          city_id: Number(cityId),
          language_id: Number(languageId),
        },
      });
      if (!txCategoryCityLang) return res.status(404).json({ message: 'TxCategoryCityLang not found' });

      controller.txCategoryCityLangRepository.merge(txCategoryCityLang, data);
      await controller.txCategoryCityLangRepository.save(txCategoryCityLang);

      return res.status(200).json({ message: 'TxCategoryCityLang updated successfully', txCategoryCityLang });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxCategoryCityLang', error: error.message });
    }
  }

  static async deleteTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    const controller = new TxCategoryCityLangController();
    try {
      const { categoryId, cityId, languageId } = req.params;

      const txCategoryCityLang = await controller.txCategoryCityLangRepository.findOne({
        where: {
          category_id: Number(categoryId),
          city_id: Number(cityId),
          language_id: Number(languageId),
        },
      });
      if (!txCategoryCityLang) return res.status(404).json({ message: 'TxCategoryCityLang not found' });

      await controller.txCategoryCityLangRepository.remove(txCategoryCityLang);
      return res.status(200).json({ message: 'TxCategoryCityLang deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxCategoryCityLang', error: error.message });
    }
  }
}

export default TxCategoryCityLangController;
