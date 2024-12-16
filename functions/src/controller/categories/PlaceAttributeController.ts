import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PlaceAttribute } from '../../model/categories/PlaceAttribute';
import { Place } from '../../model/places/Place';
import { Attribute } from '../../model/categories/Attribute';
import { Repository } from 'typeorm';

class PlaceAttributeController {
  private placeAttributeRepository: Repository<PlaceAttribute>;
  private placeRepository: Repository<Place>;
  private attributeRepository: Repository<Attribute>;

  constructor() {
    this.placeAttributeRepository = AppDataSource.getRepository(PlaceAttribute);
    this.placeRepository = AppDataSource.getRepository(Place);
    this.attributeRepository = AppDataSource.getRepository(Attribute);
  }

  static async createPlaceAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceAttributeController();
    try {
      const { placeId, attributeId, value } = req.body;
      if (!placeId || !attributeId || value === undefined) {
        return res.status(400).json({ message: 'placeId, attributeId, and value are required' });
      }
      const placeAttribute = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
        if (!place) {
          throw new Error(`Place with ID ${placeId} not found`);
        }
        const attribute = await transactionalEntityManager.findOne(Attribute, { where: { id: attributeId } });
        if (!attribute) {
          throw new Error(`Attribute with ID ${attributeId} not found`);
        }
        const newPlaceAttribute = transactionalEntityManager.create(PlaceAttribute, {
          place,
          attribute,
          value,
        });
        return await transactionalEntityManager.save(newPlaceAttribute);
      });
      return res.status(201).json({ message: 'Place attribute created successfully', placeAttribute });
    } catch (error: any) {
      console.error('Error creating place attribute:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating place attribute', error: error.message });
    }
  }

  static async getPlaceAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceAttributeController();
    try {
      const { id } = req.params;
      const placeAttribute = await controller.placeAttributeRepository.findOne({
        where: { id: Number(id) },
        relations: ['place', 'attribute'],
      });
      if (!placeAttribute) {
        return res.status(404).json({ message: 'Place attribute not found' });
      }
      return res.status(200).json(placeAttribute);
    } catch (error: any) {
      console.error('Error fetching place attribute:', error.message);
      return res.status(500).json({ message: 'Error fetching place attribute', error: error.message });
    }
  }

  static async getPlaceAttributeByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceAttributeController();
    try {
      const { placeId } = req.params;
      const placeAttributes = await controller.placeAttributeRepository.find({
        where: { place: { id: Number(placeId) } },
        relations: ['place', 'attribute'],
      });
      return res.status(200).json(placeAttributes);
    } catch (error: any) {
      console.error('Error fetching place attributes:', error.message);
      return res.status(500).json({ message: 'Error fetching place attributes', error: error.message });
    }
  }

  static async updatePlaceAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceAttributeController();
    try {
      const { id } = req.params;
      const { placeId, attributeId, value } = req.body;
      if (!placeId && !attributeId && value === undefined) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedPlaceAttribute = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeAttribute = await transactionalEntityManager.findOne(PlaceAttribute, { where: { id: Number(id) }, relations: ['place', 'attribute'] });
        if (!placeAttribute) {
          throw new Error('Place attribute not found');
        }
        if (placeId) {
          const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
          if (!place) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          placeAttribute.place = place;
        }
        if (attributeId) {
          const attribute = await transactionalEntityManager.findOne(Attribute, { where: { id: attributeId } });
          if (!attribute) {
            throw new Error(`Attribute with ID ${attributeId} not found`);
          }
          placeAttribute.attribute = attribute;
        }
        if (value !== undefined) {
          placeAttribute.value = value;
        }
        transactionalEntityManager.merge(PlaceAttribute, placeAttribute, {
          place: placeAttribute.place,
          attribute: placeAttribute.attribute,
          value: placeAttribute.value,
        });
        return await transactionalEntityManager.save(placeAttribute);
      });
      return res.status(200).json({ message: 'Place attribute updated successfully', placeAttribute: updatedPlaceAttribute });
    } catch (error: any) {
      console.error('Error updating place attribute:', error.message);
      if (error.message === 'Place attribute not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating place attribute', error: error.message });
    }
  }

  static async deletePlaceAttribute(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceAttributeController();
    try {
      const { id } = req.params;
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeAttribute = await transactionalEntityManager.findOne(PlaceAttribute, { where: { id: Number(id) } });
        if (!placeAttribute) {
          throw new Error('Place attribute not found');
        }
        await transactionalEntityManager.remove(placeAttribute);
        return true;
      });
      return res.status(200).json({ message: 'Place attribute deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting place attribute:', error.message);
      if (error.message === 'Place attribute not found') {
        return res.status(404).json({ message: 'Place attribute not found' });
      }
      return res.status(500).json({ message: 'Error deleting place attribute', error: error.message });
    }
  }
}

export default PlaceAttributeController;
