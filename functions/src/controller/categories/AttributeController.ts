import { Request, Response } from 'express';
import { Attribute } from '../../model/categories/Attribute';

class AttributeController {
  static async createAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const attribute = await Attribute.createAttribute(data);
      return res.status(201).json({ message: 'Attribute created successfully', attribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating attribute', error: error.message });
    }
  }

  static async getAttributeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const attribute = await Attribute.findById(Number(id));
      if (!attribute) {
        return res.status(404).json({ message: 'Attribute not found' });
      }
      return res.status(200).json(attribute);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching attribute', error: error.message });
    }
  }

  static async getAllAttributes(req: Request, res: Response): Promise<Response> {
    try {
      const attributes = await Attribute.findAll();
      return res.status(200).json(attributes);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching attributes', error: error.message });
    }
  }

  static async updateAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const attribute = await Attribute.updateAttribute(Number(id), data);
      if (!attribute) {
        return res.status(404).json({ message: 'Attribute not found' });
      }
      return res.status(200).json({ message: 'Attribute updated successfully', attribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating attribute', error: error.message });
    }
  }

  static async deleteAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Attribute.deleteAttribute(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Attribute not found' });
      }
      return res.status(200).json({ message: 'Attribute deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting attribute', error: error.message });
    }
  }
}

export default AttributeController;
