import { Request, Response } from 'express';
import { TxPostBloc } from '../../model/translations/TxPostBloc';

class TxPostBlocController {
  static async createTxPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txPostBloc = await TxPostBloc.createTxPostBloc(data);
      return res.status(201).json({ message: 'TxPostBloc created successfully', txPostBloc });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxPostBloc', error: error.message });
    }
  }

  static async getTxPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { postBlocId, languageId } = req.params;
      const txPostBloc = await TxPostBloc.findByPostBlocAndLanguage(Number(postBlocId), Number(languageId));
      if (!txPostBloc) return res.status(404).json({ message: 'TxPostBloc not found' });
      return res.status(200).json(txPostBloc);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostBloc', error: error.message });
    }
  }

  static async getTxPostBlocsByPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { postBlocId } = req.params;
      const txPostBlocs = await TxPostBloc.findByPostBloc(Number(postBlocId));
      return res.status(200).json(txPostBlocs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostBlocs by post bloc', error: error.message });
    }
  }

  static async getTxPostBlocsByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txPostBlocs = await TxPostBloc.findByLanguage(Number(languageId));
      return res.status(200).json(txPostBlocs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostBlocs by language', error: error.message });
    }
  }

  static async updateTxPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { postBlocId, languageId } = req.params;
      const data = req.body;
      const txPostBloc = await TxPostBloc.updateTxPostBloc(Number(postBlocId), Number(languageId), data);
      if (!txPostBloc) return res.status(404).json({ message: 'TxPostBloc not found' });
      return res.status(200).json({ message: 'TxPostBloc updated successfully', txPostBloc });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxPostBloc', error: error.message });
    }
  }

  static async deleteTxPostBloc(req: Request, res: Response): Promise<Response> {
    try {
      const { postBlocId, languageId } = req.params;
      const success = await TxPostBloc.deleteTxPostBloc(Number(postBlocId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxPostBloc not found' });
      return res.status(200).json({ message: 'TxPostBloc deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxPostBloc', error: error.message });
    }
  }
}

export default TxPostBlocController;
