import { Request, Response } from 'express';
import { Partner } from '../../model/common/Partner';

class PartnerController {
  static async createPartner(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const partner = await Partner.createPartner(data);
      return res.status(201).json({ message: 'Partner created successfully', partner });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating partner', error: error.message });
    }
  }

  static async getPartnerById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const partner = await Partner.findById(Number(id));
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      return res.status(200).json(partner);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching partner', error: error.message });
    }
  }

  static async getAllPartners(req: Request, res: Response): Promise<Response> {
    try {
      const partners = await Partner.findAll();
      return res.status(200).json(partners);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching partners', error: error.message });
    }
  }

  static async updatePartner(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const partner = await Partner.updatePartner(Number(id), data);
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      return res.status(200).json({ message: 'Partner updated successfully', partner });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating partner', error: error.message });
    }
  }

  static async deletePartner(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Partner.deletePartner(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      return res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting partner', error: error.message });
    }
  }
}

export default PartnerController;
