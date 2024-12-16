import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxCity } from '../../model/translations/TxCity';

class TxCityController {
  private txCityRepository = AppDataSource.getRepository(TxCity);

  static async createTxCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const data = req.body;
      const txCity = controller.txCityRepository.create(data);
      await controller.txCityRepository.save(txCity);
      return res.status(201).json({ message: 'TxCity created successfully', txCity });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxCity', error: error.message });
    }
  }

  static async getTxCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const { cityId, languageId } = req.params;
      const txCity = await controller.txCityRepository.findOne({
        where: { city_id: Number(cityId), language_id: Number(languageId) },
        relations: ['city', 'language'],
      });
      if (!txCity) return res.status(404).json({ message: 'TxCity not found' });
      return res.status(200).json(txCity);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCity', error: error.message });
    }
  }

  static async getTxCitiesByCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const { cityId } = req.params;
      const txCities = await controller.txCityRepository.find({
        where: { city_id: Number(cityId) },
        relations: ['city', 'language'],
      });
      return res.status(200).json(txCities);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCities by city', error: error.message });
    }
  }

  static async getTxCitiesByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const { languageId } = req.params;
      const txCities = await controller.txCityRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['city', 'language'],
      });
      return res.status(200).json(txCities);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxCities by language', error: error.message });
    }
  }

  static async updateTxCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const { cityId, languageId } = req.params;
      const data = req.body;

      const txCity = await controller.txCityRepository.findOne({
        where: { city_id: Number(cityId), language_id: Number(languageId) },
      });
      if (!txCity) return res.status(404).json({ message: 'TxCity not found' });

      controller.txCityRepository.merge(txCity, data);
      await controller.txCityRepository.save(txCity);

      return res.status(200).json({ message: 'TxCity updated successfully', txCity });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxCity', error: error.message });
    }
  }

  static async deleteTxCity(req: Request, res: Response): Promise<Response> {
    const controller = new TxCityController();
    try {
      const { cityId, languageId } = req.params;

      const txCity = await controller.txCityRepository.findOne({
        where: { city_id: Number(cityId), language_id: Number(languageId) },
      });
      if (!txCity) return res.status(404).json({ message: 'TxCity not found' });

      await controller.txCityRepository.remove(txCity);
      return res.status(200).json({ message: 'TxCity deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxCity', error: error.message });
    }
  }
}

export default TxCityController;
