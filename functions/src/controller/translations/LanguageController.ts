import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Language } from '../../model/translations/Language';

class LanguageController {
  private languageRepository = AppDataSource.getRepository(Language);

  static async createLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new LanguageController();
    try {
      const data = req.body;
      const language = controller.languageRepository.create(data);
      await controller.languageRepository.save(language);
      return res.status(201).json({ message: 'Language created successfully', language });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating language', error: error.message });
    }
  }

  static async getLanguageById(req: Request, res: Response): Promise<Response> {
    const controller = new LanguageController();
    try {
      const { id } = req.params;
      const language = await controller.languageRepository.findOneBy({ id: Number(id) });
      if (!language) return res.status(404).json({ message: 'Language not found' });
      return res.status(200).json(language);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching language', error: error.message });
    }
  }

  static async getAllLanguages(req: Request, res: Response): Promise<Response> {
    const controller = new LanguageController();
    try {
      const languages = await controller.languageRepository.find();
      return res.status(200).json(languages);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching languages', error: error.message });
    }
  }

  static async updateLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new LanguageController();
    try {
      const { id } = req.params;
      const data = req.body;
      const language = await controller.languageRepository.findOneBy({ id: Number(id) });
      if (!language) return res.status(404).json({ message: 'Language not found' });

      controller.languageRepository.merge(language, data);
      await controller.languageRepository.save(language);

      return res.status(200).json({ message: 'Language updated successfully', language });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating language', error: error.message });
    }
  }

  static async deleteLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new LanguageController();
    try {
      const { id } = req.params;
      const language = await controller.languageRepository.findOneBy({ id: Number(id) });
      if (!language) return res.status(404).json({ message: 'Language not found' });

      await controller.languageRepository.remove(language);
      return res.status(200).json({ message: 'Language deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting language', error: error.message });
    }
  }
}

export default LanguageController;
