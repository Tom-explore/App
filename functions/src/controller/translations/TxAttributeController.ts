import { Request, Response } from 'express';
import { TxAttribute } from '../../model/translations/TxAttribute';

class TxAttributeController {
  static async createTxAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const txAttribute = await TxAttribute.createTxAttribute(data);
      return res.status(201).json({ message: 'TxAttribute created successfully', txAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating TxAttribute', error: error.message });
    }
  }

  static async getTxAttributeByAttributeAndLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { attributeId, languageId } = req.params;
      const txAttribute = await TxAttribute.findByAttributeAndLanguage(Number(attributeId), Number(languageId));
      if (!txAttribute) return res.status(404).json({ message: 'TxAttribute not found' });
      return res.status(200).json(txAttribute);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxAttribute', error: error.message });
    }
  }

  static async getTxAttributesByAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { attributeId } = req.params;
      const txAttributes = await TxAttribute.findByAttribute(Number(attributeId));
      return res.status(200).json(txAttributes);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxAttributes by attribute', error: error.message });
    }
  }

  static async getTxAttributesByLanguage(req: Request, res: Response): Promise<Response> {
    try {
      const { languageId } = req.params;
      const txAttributes = await TxAttribute.findByLanguage(Number(languageId));
      return res.status(200).json(txAttributes);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching TxAttributes by language', error: error.message });
    }
  }

  static async updateTxAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { attributeId, languageId } = req.params;
      const data = req.body;
      const txAttribute = await TxAttribute.updateTxAttribute(Number(attributeId), Number(languageId), data);
      if (!txAttribute) return res.status(404).json({ message: 'TxAttribute not found' });
      return res.status(200).json({ message: 'TxAttribute updated successfully', txAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating TxAttribute', error: error.message });
    }
  }

  static async deleteTxAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { attributeId, languageId } = req.params;
      const success = await TxAttribute.deleteTxAttribute(Number(attributeId), Number(languageId));
      if (!success) return res.status(404).json({ message: 'TxAttribute not found' });
      return res.status(200).json({ message: 'TxAttribute deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting TxAttribute', error: error.message });
    }
  }
}

export default TxAttributeController;
