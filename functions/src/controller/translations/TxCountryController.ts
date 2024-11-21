import { Request, Response } from 'express';
import { TxCountry } from '../../model/translations/TxCountry';

class TxCountryController {
  static async createTxCountry(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txCountry = await TxCountry.createTxCountry(data);
      return res.status(201).json({ message: 'TxCountry created successfully', txCountry });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxCountry', error: error.message });
    }
  }

  static async getTxCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { countryId, languageId } = req.params;
      const txCountry = await TxCountry.findByCountryAndLanguage(Number(countryId), Number(languageId));
      if (!txCountry) return res.status(404).json({ message: 'TxCountry not found' });
      return res.status(200).json(txCountry);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCountry', error: error.message });
    }
  }

  static async getTxCountriesByCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { countryId } = req.params;
      const txCountries = await TxCountry.findByCountry(Number(countryId));
      return res.status(200).json(txCountries);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCountries by country', error: error.message });
    }
  }

  static async getTxCountriesByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txCountries = await TxCountry.findByLanguage(Number(languageId));
      return res.status(200).json(txCountries);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCountries by language', error: error.message });
    }
  }

  static async updateTxCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { countryId, languageId } = req.params;
      const data = req.body;
      const txCountry = await TxCountry.updateTxCountry(Number(countryId), Number(languageId), data);
      if (!txCountry) return res.status(404).json({ message: 'TxCountry not found' });
      return res.status(200).json({ message: 'TxCountry updated successfully', txCountry });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxCountry', error: error.message });
    }
  }

  static async deleteTxCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { countryId, languageId } = req.params;
      const success = await TxCountry.deleteTxCountry(Number(countryId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxCountry not found' });
      return res.status(200).json({ message: 'TxCountry deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxCountry', error: error.message });
    }
  }
}

export default TxCountryController;
