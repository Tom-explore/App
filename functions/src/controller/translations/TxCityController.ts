import { Request, Response } from 'express';
import { TxCity } from '../../model/translations/TxCity';

class TxCityController {
  static async createTxCity(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txCity = await TxCity.createTxCity(data);
      return res.status(201).json({ message: 'TxCity created successfully', txCity });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxCity', error: error.message });
    }
  }

  static async getTxCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId, languageId } = req.params;
      const txCity = await TxCity.findByCityAndLanguage(Number(cityId), Number(languageId));
      if (!txCity) return res.status(404).json({ message: 'TxCity not found' });
      return res.status(200).json(txCity);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCity', error: error.message });
    }
  }

  static async getTxCitiesByCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId } = req.params;
      const txCities = await TxCity.findByCity(Number(cityId));
      return res.status(200).json(txCities);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCities by city', error: error.message });
    }
  }

  static async getTxCitiesByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txCities = await TxCity.findByLanguage(Number(languageId));
      return res.status(200).json(txCities);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxCities by language', error: error.message });
    }
  }

  static async updateTxCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId, languageId } = req.params;
      const data = req.body;
      const txCity = await TxCity.updateTxCity(Number(cityId), Number(languageId), data);
      if (!txCity) return res.status(404).json({ message: 'TxCity not found' });
      return res.status(200).json({ message: 'TxCity updated successfully', txCity });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxCity', error: error.message });
    }
  }

  static async deleteTxCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId, languageId } = req.params;
      const success = await TxCity.deleteTxCity(Number(cityId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxCity not found' });
      return res.status(200).json({ message: 'TxCity deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxCity', error: error.message });
    }
  }
}

export default TxCityController;
