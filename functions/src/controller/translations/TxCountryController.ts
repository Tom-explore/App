import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxCountry } from '../../model/translations/TxCountry';

class TxCountryController {
  private txCountryRepository = AppDataSource.getRepository(TxCountry);

  static async createTxCountry(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const data = req.body;
      const txCountry = controller.txCountryRepository.create(data);
      await controller.txCountryRepository.save(txCountry);
      return res.status(201).json({ message: 'TxCountry created successfully', txCountry });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxCountry', error: error.message });
    }
  }

  static async getTxCountry(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const { countryId, languageId } = req.params;
      const txCountry = await controller.txCountryRepository.findOne({
        where: { country_id: Number(countryId), language_id: Number(languageId) },
        relations: ['country', 'language'],
      });
      if (!txCountry) return res.status(404).json({ message: 'TxCountry not found' });
      return res.status(200).json(txCountry);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCountry', error: error.message });
    }
  }

  static async getTxCountriesByCountry(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const { countryId } = req.params;
      const txCountries = await controller.txCountryRepository.find({
        where: { country_id: Number(countryId) },
        relations: ['country', 'language'],
      });
      return res.status(200).json(txCountries);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCountries by country', error: error.message });
    }
  }

  static async getTxCountriesByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const { languageId } = req.params;
      const txCountries = await controller.txCountryRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['country', 'language'],
      });
      return res.status(200).json(txCountries);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCountries by language', error: error.message });
    }
  }

  static async updateTxCountry(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const { countryId, languageId } = req.params;
      const data = req.body;

      const txCountry = await controller.txCountryRepository.findOne({
        where: { country_id: Number(countryId), language_id: Number(languageId) },
      });
      if (!txCountry) return res.status(404).json({ message: 'TxCountry not found' });

      controller.txCountryRepository.merge(txCountry, data);
      await controller.txCountryRepository.save(txCountry);

      return res.status(200).json({ message: 'TxCountry updated successfully', txCountry });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxCountry', error: error.message });
    }
  }

  static async deleteTxCountry(req: Request, res: Response): Promise<Response> {
    const controller = new TxCountryController();
    try {
      const { countryId, languageId } = req.params;

      const txCountry = await controller.txCountryRepository.findOne({
        where: { country_id: Number(countryId), language_id: Number(languageId) },
      });
      if (!txCountry) return res.status(404).json({ message: 'TxCountry not found' });

      await controller.txCountryRepository.remove(txCountry);
      return res.status(200).json({ message: 'TxCountry deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxCountry', error: error.message });
    }
  }
}

export default TxCountryController;
