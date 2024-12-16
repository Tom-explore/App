import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Attribute } from '../../model/categories/Attribute';
import { Repository } from 'typeorm';
import { Category } from '../../model/categories/Category';

class AttributeController {
  private attributeRepository: Repository<Attribute>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.attributeRepository = AppDataSource.getRepository(Attribute);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  static async createAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new AttributeController();

    try {
      const { slug, is_food_restriction, is_atmosphere } = req.body;

      // Validation des données
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const attribute = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const newAttribute = transactionalEntityManager.create(Attribute, {
          slug,
          is_food_restriction,
          is_atmosphere,
        });

        return await transactionalEntityManager.save(newAttribute);
      });

      return res.status(201).json({ message: 'Attribute created successfully', attribute });
    } catch (error: any) {
      console.error('Error creating attribute:', error.message);
      return res.status(500).json({ message: 'Error creating attribute', error: error.message });
    }
  }

  static async getAttributeById(req: Request, res: Response): Promise<Response> {
    const controller = new AttributeController();

    try {
      const { id } = req.params;

      const attribute = await controller.attributeRepository.findOne({
        where: { id: Number(id) },
      });

      if (!attribute) {
        return res.status(404).json({ message: 'Attribute not found' });
      }

      return res.status(200).json(attribute);
    } catch (error: any) {
      console.error('Error fetching attribute:', error.message);
      return res.status(500).json({ message: 'Error fetching attribute', error: error.message });
    }
  }

  static async getAllAttributes(req: Request, res: Response): Promise<Response> {
    const controller = new AttributeController();

    try {
      const attributes = await controller.attributeRepository.find({
        relations: ['translations', 'translations.language'],
      });

      return res.status(200).json(attributes);
    } catch (error: any) {
      console.error('Error fetching attributes:', error.message);
      return res.status(500).json({ message: 'Error fetching attributes', error: error.message });
    }
  }

  static async updateAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new AttributeController();

    try {
      const { id } = req.params;
      const { slug, is_food_restriction, is_atmosphere } = req.body;

      // Validation des données
      if (!slug && is_food_restriction === undefined && is_atmosphere === undefined) {
        return res.status(400).json({ message: 'At least one field (slug, is_food_restriction, is_atmosphere) is required to update' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedAttribute = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const attribute = await transactionalEntityManager.findOne(Attribute, { where: { id: Number(id) } });
        if (!attribute) {
          throw new Error('Attribute not found');
        }

        transactionalEntityManager.merge(Attribute, attribute, {
          slug: slug !== undefined ? slug : attribute.slug,
          is_food_restriction: is_food_restriction !== undefined ? is_food_restriction : attribute.is_food_restriction,
          is_atmosphere: is_atmosphere !== undefined ? is_atmosphere : attribute.is_atmosphere,
        });

        return await transactionalEntityManager.save(attribute);
      });

      return res.status(200).json({ message: 'Attribute updated successfully', attribute: updatedAttribute });
    } catch (error: any) {
      console.error('Error updating attribute:', error.message);
      if (error.message === 'Attribute not found') {
        return res.status(404).json({ message: 'Attribute not found' });
      }
      return res.status(500).json({ message: 'Error updating attribute', error: error.message });
    }
  }

  static async deleteAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new AttributeController();

    try {
      const { id } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const attribute = await transactionalEntityManager.findOne(Attribute, { where: { id: Number(id) } });
        if (!attribute) {
          throw new Error('Attribute not found');
        }

        await transactionalEntityManager.remove(attribute);
        return true;
      });

      return res.status(200).json({ message: 'Attribute deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting attribute:', error.message);
      if (error.message === 'Attribute not found') {
        return res.status(404).json({ message: 'Attribute not found' });
      }
      return res.status(500).json({ message: 'Error deleting attribute', error: error.message });
    }
  }

}

export default AttributeController;
