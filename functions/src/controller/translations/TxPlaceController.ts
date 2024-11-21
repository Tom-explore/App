import { Request, Response } from 'express';
import { TxPlace } from '../../model/translations/TxPlace';

class TxPlaceController {
  static async createTxPlace(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txPlace = await TxPlace.createTxPlace(data);
      return res.status(201).json({ message: 'TxPlace created successfully', txPlace });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxPlace', error: error.message });
    }
  }

  static async getTxPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, languageId } = req.params;
      const txPlace = await TxPlace.findByPlaceAndLanguage(Number(placeId), Number(languageId));
      if (!txPlace) return res.status(404).json({ message: 'TxPlace not found' });
      return res.status(200).json(txPlace);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPlace', error: error.message });
    }
  }

  static async getTxPlacesByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const txPlaces = await TxPlace.findByPlace(Number(placeId));
      return res.status(200).json(txPlaces);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPlaces by place', error: error.message });
    }
  }

  static async getTxPlacesByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txPlaces = await TxPlace.findByLanguage(Number(languageId));
      return res.status(200).json(txPlaces);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPlaces by language', error: error.message });
    }
  }

  static async updateTxPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, languageId } = req.params;
      const data = req.body;
      const txPlace = await TxPlace.updateTxPlace(Number(placeId), Number(languageId), data);
      if (!txPlace) return res.status(404).json({ message: 'TxPlace not found' });
      return res.status(200).json({ message: 'TxPlace updated successfully', txPlace });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxPlace', error: error.message });
    }
  }

  static async deleteTxPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, languageId } = req.params;
      const success = await TxPlace.deleteTxPlace(Number(placeId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxPlace not found' });
      return res.status(200).json({ message: 'TxPlace deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxPlace', error: error.message });
    }
  }
}

export default TxPlaceController;
