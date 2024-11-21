import { Request, Response } from 'express';
import { Language } from '../../model/translations/Language';

class LanguageController {
  static async createLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const language = await Language.createLanguage(data);
      return res.status(201).json({ message: 'Language created successfully', language });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating language', error: error.message });
    }
  }

  static async getLanguageById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const language = await Language.findById(Number(id));
      if (!language) return res.status(404).json({ message: 'Language not found' });
      return res.status(200).json(language);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching language', error: error.message });
    }
  }

  static async getAllLanguages(req: Request, res: Response): Promise<Response> {
    try {
      const languages = await Language.findAll();
      return res.status(200).json(languages);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching languages', error: error.message });
    }
  }

  static async updateLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const language = await Language.updateLanguage(Number(id), data);
      if (!language) return res.status(404).json({ message: 'Language not found' });
      return res.status(200).json({ message: 'Language updated successfully', language });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating language', error: error.message });
    }
  }

  static async deleteLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Language.deleteLanguage(Number(id));
      if (!success) return res.status(404).json({ message: 'Language not found' });
      return res.status(200).json({ message: 'Language deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting language', error: error.message });
    }
  }
}

export default LanguageController;
