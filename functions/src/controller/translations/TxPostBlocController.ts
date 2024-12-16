import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxPostBloc } from '../../model/translations/TxPostBloc';

class TxPostBlocController {
  private txPostBlocRepository = AppDataSource.getRepository(TxPostBloc);

  static async createTxPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const data = req.body;
      const txPostBloc = controller.txPostBlocRepository.create(data);
      await controller.txPostBlocRepository.save(txPostBloc);
      return res.status(201).json({ message: 'TxPostBloc created successfully', txPostBloc });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxPostBloc', error: error.message });
    }
  }

  static async getTxPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const { postBlocId, languageId } = req.params;
      const txPostBloc = await controller.txPostBlocRepository.findOne({
        where: { post_bloc_id: Number(postBlocId), language_id: Number(languageId) },
        relations: ['postBloc', 'language'],
      });
      if (!txPostBloc) return res.status(404).json({ message: 'TxPostBloc not found' });
      return res.status(200).json(txPostBloc);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostBloc', error: error.message });
    }
  }

  static async getTxPostBlocsByPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const { postBlocId } = req.params;
      const txPostBlocs = await controller.txPostBlocRepository.find({
        where: { post_bloc_id: Number(postBlocId) },
        relations: ['postBloc', 'language'],
      });
      return res.status(200).json(txPostBlocs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostBlocs by post bloc', error: error.message });
    }
  }

  static async getTxPostBlocsByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const { languageId } = req.params;
      const txPostBlocs = await controller.txPostBlocRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['postBloc', 'language'],
      });
      return res.status(200).json(txPostBlocs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostBlocs by language', error: error.message });
    }
  }

  static async updateTxPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const { postBlocId, languageId } = req.params;
      const data = req.body;

      const txPostBloc = await controller.txPostBlocRepository.findOne({
        where: { post_bloc_id: Number(postBlocId), language_id: Number(languageId) },
      });
      if (!txPostBloc) return res.status(404).json({ message: 'TxPostBloc not found' });

      controller.txPostBlocRepository.merge(txPostBloc, data);
      await controller.txPostBlocRepository.save(txPostBloc);

      return res.status(200).json({ message: 'TxPostBloc updated successfully', txPostBloc });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxPostBloc', error: error.message });
    }
  }

  static async deleteTxPostBloc(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostBlocController();
    try {
      const { postBlocId, languageId } = req.params;

      const txPostBloc = await controller.txPostBlocRepository.findOne({
        where: { post_bloc_id: Number(postBlocId), language_id: Number(languageId) },
      });
      if (!txPostBloc) return res.status(404).json({ message: 'TxPostBloc not found' });

      await controller.txPostBlocRepository.remove(txPostBloc);
      return res.status(200).json({ message: 'TxPostBloc deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxPostBloc', error: error.message });
    }
  }
}

export default TxPostBlocController;
