import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Partner } from '../../model/common/Partner';
import { Language } from '../../model/translations/Language';
import { Repository } from 'typeorm';

class PartnerController {
  private partnerRepository: Repository<Partner>;
  private languageRepository: Repository<Language>;

  constructor() {
    this.partnerRepository = AppDataSource.getRepository(Partner);
    this.languageRepository = AppDataSource.getRepository(Language);
  }

  static async createPartner(req: Request, res: Response): Promise<Response> {
    const controller = new PartnerController();
    try {
      const { name, website, contact_mail, phone, gyg_id, booking_id, favorite_language_id } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const partner = await AppDataSource.transaction(async (transactionalEntityManager) => {
        let favorite_language = undefined;
        if (favorite_language_id) {
          favorite_language = await transactionalEntityManager.findOne(Language, { where: { id: favorite_language_id } });
          if (!favorite_language) {
            throw new Error(`Language with ID ${favorite_language_id} not found`);
          }
        }
        const newPartner = transactionalEntityManager.create(Partner, {
          name,
          website,
          contact_mail,
          phone,
          gyg_id,
          booking_id,
          favorite_language
        });
        return await transactionalEntityManager.save(newPartner);
      });
      return res.status(201).json({ message: 'Partner created successfully', partner });
    } catch (error: any) {
      console.error('Error creating partner:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating partner', error: error.message });
    }
  }

  static async getPartnerById(req: Request, res: Response): Promise<Response> {
    const controller = new PartnerController();
    try {
      const { id } = req.params;
      const partner = await controller.partnerRepository.findOne({
        where: { id: Number(id) },
        relations: ['favorite_language']
      });
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
      return res.status(200).json(partner);
    } catch (error: any) {
      console.error('Error fetching partner:', error.message);
      return res.status(500).json({ message: 'Error fetching partner', error: error.message });
    }
  }

  static async getAllPartners(req: Request, res: Response): Promise<Response> {
    const controller = new PartnerController();
    try {
      const partners = await controller.partnerRepository.find({ relations: ['favorite_language'] });
      return res.status(200).json(partners);
    } catch (error: any) {
      console.error('Error fetching partners:', error.message);
      return res.status(500).json({ message: 'Error fetching partners', error: error.message });
    }
  }

  static async updatePartner(req: Request, res: Response): Promise<Response> {
    const controller = new PartnerController();
    try {
      const { id } = req.params;
      const { name, website, contact_mail, phone, gyg_id, booking_id, favorite_language_id } = req.body;
      if (!name && !website && !contact_mail && !phone && !gyg_id && !booking_id && favorite_language_id === undefined) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedPartner = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const partner = await transactionalEntityManager.findOne(Partner, { where: { id: Number(id) }, relations: ['favorite_language'] });
        if (!partner) {
          throw new Error('Partner not found');
        }
        let favorite_language = partner.favorite_language;
        if (favorite_language_id !== undefined) {
          if (favorite_language_id === null) {
            favorite_language = undefined;
          } else {
            favorite_language = await transactionalEntityManager.findOne(Language, { where: { id: favorite_language_id } });
            if (!favorite_language) {
              throw new Error(`Language with ID ${favorite_language_id} not found`);
            }
          }
        }
        transactionalEntityManager.merge(Partner, partner, {
          name,
          website,
          contact_mail,
          phone,
          gyg_id,
          booking_id,
          favorite_language
        });
        return await transactionalEntityManager.save(partner);
      });
      return res.status(200).json({ message: 'Partner updated successfully', partner: updatedPartner });
    } catch (error: any) {
      console.error('Error updating partner:', error.message);
      if (error.message === 'Partner not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating partner', error: error.message });
    }
  }

  static async deletePartner(req: Request, res: Response): Promise<Response> {
    const controller = new PartnerController();
    try {
      const { id } = req.params;
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const partner = await transactionalEntityManager.findOne(Partner, { where: { id: Number(id) } });
        if (!partner) {
          throw new Error('Partner not found');
        }
        await transactionalEntityManager.remove(partner);
        return true;
      });
      return res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting partner:', error.message);
      if (error.message === 'Partner not found') {
        return res.status(404).json({ message: 'Partner not found' });
      }
      return res.status(500).json({ message: 'Error deleting partner', error: error.message });
    }
  }
}

export default PartnerController;
