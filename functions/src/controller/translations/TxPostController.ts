import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxPost } from '../../model/translations/TxPost';

class TxPostController {
  private txPostRepository = AppDataSource.getRepository(TxPost);

  static async createTxPost(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const data = req.body;
      const txPost = controller.txPostRepository.create(data);
      await controller.txPostRepository.save(txPost);
      return res.status(201).json({ message: 'TxPost created successfully', txPost });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxPost', error: error.message });
    }
  }

  static async getTxPost(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const { postId, languageId } = req.params;
      const txPost = await controller.txPostRepository.findOne({
        where: { postId: Number(postId), languageId: Number(languageId) },
        relations: ['post', 'language'],
      });
      if (!txPost) return res.status(404).json({ message: 'TxPost not found' });
      return res.status(200).json(txPost);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPost', error: error.message });
    }
  }

  static async getTxPostsByPost(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const { postId } = req.params;
      const txPosts = await controller.txPostRepository.find({
        where: { postId: Number(postId) },
        relations: ['post', 'language'],
      });
      return res.status(200).json(txPosts);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPosts by post', error: error.message });
    }
  }

  static async getTxPostsByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const { languageId } = req.params;
      const txPosts = await controller.txPostRepository.find({
        where: { languageId: Number(languageId) },
        relations: ['post', 'language'],
      });
      return res.status(200).json(txPosts);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPosts by language', error: error.message });
    }
  }

  static async updateTxPost(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const { postId, languageId } = req.params;
      const data = req.body;

      const txPost = await controller.txPostRepository.findOne({
        where: { postId: Number(postId), languageId: Number(languageId) },
      });
      if (!txPost) return res.status(404).json({ message: 'TxPost not found' });

      controller.txPostRepository.merge(txPost, data);
      await controller.txPostRepository.save(txPost);

      return res.status(200).json({ message: 'TxPost updated successfully', txPost });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxPost', error: error.message });
    }
  }

  static async deleteTxPost(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostController();
    try {
      const { postId, languageId } = req.params;

      const txPost = await controller.txPostRepository.findOne({
        where: { postId: Number(postId), languageId: Number(languageId) },
      });
      if (!txPost) return res.status(404).json({ message: 'TxPost not found' });

      await controller.txPostRepository.remove(txPost);
      return res.status(200).json({ message: 'TxPost deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxPost', error: error.message });
    }
  }
}

export default TxPostController;
