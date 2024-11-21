import { Request, Response } from 'express';
import { TxCategoryCityLang } from '../../model/translations/TxCategoryCityLang';

class TxCategoryCityLangController {
  static async createTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txCategoryCityLang = await TxCategoryCityLang.createTxCategoryCityLang(data);
      return res.status(201).json({ message: 'TxCategoryCityLang created successfully', txCategoryCityLang });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxCategoryCityLang', error: error.message });
    }
  }

  static async getTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, cityId, languageId } = req.params;
      const txCategoryCityLang = await TxCategoryCityLang.findByCategoryCityLanguage(
        Number(categoryId),
        Number(cityId),
        Number(languageId)
      );
      if (!txCategoryCityLang) return res.status(404).json({ message: 'TxCategoryCityLang not found' });
      return res.status(200).json(txCategoryCityLang);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang', error: error.message });
    }
  }

  static async getTxCategoryCityLangByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;
      const txCategoryCityLangs = await TxCategoryCityLang.findByCategory(Number(categoryId));
      return res.status(200).json(txCategoryCityLangs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by category', error: error.message });
    }
  }

  static async getTxCategoryCityLangByCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId } = req.params;
      const txCategoryCityLangs = await TxCategoryCityLang.findByCity(Number(cityId));
      return res.status(200).json(txCategoryCityLangs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by city', error: error.message });
    }
  }

  static async getTxCategoryCityLangByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txCategoryCityLangs = await TxCategoryCityLang.findByLanguage(Number(languageId));
      return res.status(200).json(txCategoryCityLangs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCategoryCityLang by language', error: error.message });
    }
  }

  static async updateTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, cityId, languageId } = req.params;
      const data = req.body;
      const txCategoryCityLang = await TxCategoryCityLang.updateTxCategoryCityLang(
        Number(categoryId),
        Number(cityId),
        Number(languageId),
        data
      );
      if (!txCategoryCityLang) return res.status(404).json({ message: 'TxCategoryCityLang not found' });
      return res.status(200).json({ message: 'TxCategoryCityLang updated successfully', txCategoryCityLang });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxCategoryCityLang', error: error.message });
    }
  }

  static async deleteTxCategoryCityLang(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId, cityId, languageId } = req.params;
      const success = await TxCategoryCityLang.deleteTxCategoryCityLang(
        Number(categoryId),
        Number(cityId),
        Number(languageId)
      );
      if (!success) return res.status(404).json({ message: 'TxCategoryCityLang not found' });
      return res.status(200).json({ message: 'TxCategoryCityLang deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxCategoryCityLang', error: error.message });
    }
  }
}

export default TxCategoryCityLangController;
