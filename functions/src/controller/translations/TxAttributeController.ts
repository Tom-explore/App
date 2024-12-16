import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TxAttribute } from '../../model/translations/TxAttribute';

class TxAttributeController {
  private txAttributeRepository = AppDataSource.getRepository(TxAttribute);

  static async createTxAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const data = req.body;
      const txAttribute = controller.txAttributeRepository.create(data);
      await controller.txAttributeRepository.save(txAttribute);
      return res.status(201).json({ message: 'TxAttribute created successfully', txAttribute });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating TxAttribute', error: error.message });
    }
  }

  static async getTxAttributeByAttributeAndLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const { attributeId, languageId } = req.params;
      const txAttribute = await controller.txAttributeRepository.findOne({
        where: { attribute_id: Number(attributeId), language_id: Number(languageId) },
        relations: ['attribute', 'language'],
      });
      if (!txAttribute) return res.status(404).json({ message: 'TxAttribute not found' });
      return res.status(200).json(txAttribute);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxAttribute', error: error.message });
    }
  }

  static async getTxAttributesByAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const { attributeId } = req.params;
      const txAttributes = await controller.txAttributeRepository.find({
        where: { attribute_id: Number(attributeId) },
        relations: ['attribute', 'language'],
      });
      return res.status(200).json(txAttributes);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxAttributes by attribute', error: error.message });
    }
  }

  static async getTxAttributesByLanguage(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const { languageId } = req.params;
      const txAttributes = await controller.txAttributeRepository.find({
        where: { language_id: Number(languageId) },
        relations: ['attribute', 'language'],
      });
      return res.status(200).json(txAttributes);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching TxAttributes by language', error: error.message });
    }
  }

  static async updateTxAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const { attributeId, languageId } = req.params;
      const data = req.body;
      const txAttribute = await controller.txAttributeRepository.findOne({
        where: { attribute_id: Number(attributeId), language_id: Number(languageId) },
      });
      if (!txAttribute) return res.status(404).json({ message: 'TxAttribute not found' });

      controller.txAttributeRepository.merge(txAttribute, data);
      await controller.txAttributeRepository.save(txAttribute);

      return res.status(200).json({ message: 'TxAttribute updated successfully', txAttribute });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating TxAttribute', error: error.message });
    }
  }

  static async deleteTxAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new TxAttributeController();
    try {
      const { attributeId, languageId } = req.params;
      const txAttribute = await controller.txAttributeRepository.findOne({
        where: { attribute_id: Number(attributeId), language_id: Number(languageId) },
      });
      if (!txAttribute) return res.status(404).json({ message: 'TxAttribute not found' });

      await controller.txAttributeRepository.remove(txAttribute);
      return res.status(200).json({ message: 'TxAttribute deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting TxAttribute', error: error.message });
    }
  }
}

export default TxAttributeController;
