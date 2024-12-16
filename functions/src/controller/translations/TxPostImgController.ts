import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxPostImg } from '../../model/translations/TxPostImg';

class TxPostImgController {
  private txPostImgRepository = AppDataSource.getRepository(TxPostImg);

  static async createTxPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const data = req.body;
      const txPostImg = controller.txPostImgRepository.create(data);
      await controller.txPostImgRepository.save(txPostImg);
      return res.status(201).json({ message: 'TxPostImg created successfully', txPostImg });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxPostImg', error: error.message });
    }
  }

  static async getTxPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const { postImgId, languageId } = req.params;
      const txPostImg = await controller.txPostImgRepository.findOne({
        where: { post_img_id: Number(postImgId), language_id: Number(languageId) },
        relations: ['postImg', 'language'],
      });
      if (!txPostImg) return res.status(404).json({ message: 'TxPostImg not found' });
      return res.status(200).json(txPostImg);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostImg', error: error.message });
    }
  }

  static async getTxPostImgsByPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const { postImgId } = req.params;
      const txPostImgs = await controller.txPostImgRepository.find({
        where: { post_img_id: Number(postImgId) },
        relations: ['postImg', 'language'],
      });
      return res.status(200).json(txPostImgs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostImgs by post image', error: error.message });
    }
  }

  static async getTxPostImgsByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const { languageId } = req.params;
      const txPostImgs = await controller.txPostImgRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['postImg', 'language'],
      });
      return res.status(200).json(txPostImgs);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxPostImgs by language', error: error.message });
    }
  }

  static async updateTxPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const { postImgId, languageId } = req.params;
      const data = req.body;

      const txPostImg = await controller.txPostImgRepository.findOne({
        where: { post_img_id: Number(postImgId), language_id: Number(languageId) },
      });
      if (!txPostImg) return res.status(404).json({ message: 'TxPostImg not found' });

      controller.txPostImgRepository.merge(txPostImg, data);
      await controller.txPostImgRepository.save(txPostImg);

      return res.status(200).json({ message: 'TxPostImg updated successfully', txPostImg });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxPostImg', error: error.message });
    }
  }

  static async deleteTxPostImg(req: Request, res: Response): Promise<Response> {
    const controller = new TxPostImgController();
    try {
      const { postImgId, languageId } = req.params;

      const txPostImg = await controller.txPostImgRepository.findOne({
        where: { post_img_id: Number(postImgId), language_id: Number(languageId) },
      });
      if (!txPostImg) return res.status(404).json({ message: 'TxPostImg not found' });

      await controller.txPostImgRepository.remove(txPostImg);
      return res.status(200).json({ message: 'TxPostImg deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxPostImg', error: error.message });
    }
  }
}

export default TxPostImgController;
