import { Request, Response } from 'express';
import { TxPost } from '../../model/translations/TxPost';

class TxPostController {
  static async createTxPost(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txPost = await TxPost.createTxPost(data);
      return res.status(201).json({ message: 'TxPost created successfully', txPost });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxPost', error: error.message });
    }
  }

  static async getTxPost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, languageId } = req.params;
      const txPost = await TxPost.findByPostAndLanguage(Number(postId), Number(languageId));
      if (!txPost) return res.status(404).json({ message: 'TxPost not found' });
      return res.status(200).json(txPost);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPost', error: error.message });
    }
  }

  static async getTxPostsByPost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId } = req.params;
      const txPosts = await TxPost.findByPost(Number(postId));
      return res.status(200).json(txPosts);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPosts by post', error: error.message });
    }
  }

  static async getTxPostsByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txPosts = await TxPost.findByLanguage(Number(languageId));
      return res.status(200).json(txPosts);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPosts by language', error: error.message });
    }
  }

  static async updateTxPost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, languageId } = req.params;
      const data = req.body;
      const txPost = await TxPost.updateTxPost(Number(postId), Number(languageId), data);
      if (!txPost) return res.status(404).json({ message: 'TxPost not found' });
      return res.status(200).json({ message: 'TxPost updated successfully', txPost });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxPost', error: error.message });
    }
  }

  static async deleteTxPost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId, languageId } = req.params;
      const success = await TxPost.deleteTxPost(Number(postId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxPost not found' });
      return res.status(200).json({ message: 'TxPost deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxPost', error: error.message });
    }
  }
}

export default TxPostController;
