import { Request, Response } from 'express';
import { TxPostImg } from '../../model/translations/TxPostImg';

class TxPostImgController {
  static async createTxPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txPostImg = await TxPostImg.createTxPostImg(data);
      return res.status(201).json({ message: 'TxPostImg created successfully', txPostImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxPostImg', error: error.message });
    }
  }

  static async getTxPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { postImgId, languageId } = req.params;
      const txPostImg = await TxPostImg.findByPostImgAndLanguage(Number(postImgId), Number(languageId));
      if (!txPostImg) return res.status(404).json({ message: 'TxPostImg not found' });
      return res.status(200).json(txPostImg);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostImg', error: error.message });
    }
  }

  static async getTxPostImgsByPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { postImgId } = req.params;
      const txPostImgs = await TxPostImg.findByPostImg(Number(postImgId));
      return res.status(200).json(txPostImgs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostImgs by post image', error: error.message });
    }
  }

  static async getTxPostImgsByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txPostImgs = await TxPostImg.findByLanguage(Number(languageId));
      return res.status(200).json(txPostImgs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxPostImgs by language', error: error.message });
    }
  }

  static async updateTxPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { postImgId, languageId } = req.params;
      const data = req.body;
      const txPostImg = await TxPostImg.updateTxPostImg(Number(postImgId), Number(languageId), data);
      if (!txPostImg) return res.status(404).json({ message: 'TxPostImg not found' });
      return res.status(200).json({ message: 'TxPostImg updated successfully', txPostImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxPostImg', error: error.message });
    }
  }

  static async deleteTxPostImg(req: Request, res: Response): Promise<Response> {
    try {
      const { postImgId, languageId } = req.params;
      const success = await TxPostImg.deleteTxPostImg(Number(postImgId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxPostImg not found' });
      return res.status(200).json({ message: 'TxPostImg deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxPostImg', error: error.message });
    }
  }
}

export default TxPostImgController;
