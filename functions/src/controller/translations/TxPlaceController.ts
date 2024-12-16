import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxPlace } from '../../model/translations/TxPlace';

class TxPlaceController {
  private txPlaceRepository = AppDataSource.getRepository(TxPlace);

  static async createTxPlace(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const data = req.body;
      const txPlace = controller.txPlaceRepository.create(data);
      await controller.txPlaceRepository.save(txPlace);
      return res.status(201).json({ message: 'TxPlace created successfully', txPlace });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxPlace', error: error.message });
    }
  }

  static async getTxPlace(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const { placeId, languageId } = req.params;
      const txPlace = await controller.txPlaceRepository.findOne({
        where: { place_id: Number(placeId), language_id: Number(languageId) },
        relations: ['place', 'language'],
      });
      if (!txPlace) return res.status(404).json({ message: 'TxPlace not found' });
      return res.status(200).json(txPlace);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPlace', error: error.message });
    }
  }

  static async getTxPlacesByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const { placeId } = req.params;
      const txPlaces = await controller.txPlaceRepository.find({
        where: { place_id: Number(placeId) },
        relations: ['place', 'language'],
      });
      return res.status(200).json(txPlaces);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPlaces by place', error: error.message });
    }
  }

  static async getTxPlacesByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const { languageId } = req.params;
      const txPlaces = await controller.txPlaceRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['place', 'language'],
      });
      return res.status(200).json(txPlaces);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPlaces by language', error: error.message });
    }
  }

  static async updateTxPlace(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const { placeId, languageId } = req.params;
      const data = req.body;

      const txPlace = await controller.txPlaceRepository.findOne({
        where: { place_id: Number(placeId), language_id: Number(languageId) },
      });
      if (!txPlace) return res.status(404).json({ message: 'TxPlace not found' });

      controller.txPlaceRepository.merge(txPlace, data);
      await controller.txPlaceRepository.save(txPlace);

      return res.status(200).json({ message: 'TxPlace updated successfully', txPlace });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxPlace', error: error.message });
    }
  }

  static async deleteTxPlace(req: Request, res: Response): Promise<Response> {
    const controller = new TxPlaceController();
    try {
      const { placeId, languageId } = req.params;

      const txPlace = await controller.txPlaceRepository.findOne({
        where: { place_id: Number(placeId), language_id: Number(languageId) },
      });
      if (!txPlace) return res.status(404).json({ message: 'TxPlace not found' });

      await controller.txPlaceRepository.remove(txPlace);
      return res.status(200).json({ message: 'TxPlace deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxPlace', error: error.message });
    }
  }
}

export default TxPlaceController;
