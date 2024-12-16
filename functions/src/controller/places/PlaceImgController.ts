import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { PlaceImg } from '../../model/places/PlaceImg';
import { Place } from '../../model/places/Place';
import { Repository } from 'typeorm';

class PlaceImgController {
  private placeImgRepository: Repository<PlaceImg>;
  private placeRepository: Repository<Place>;

  constructor() {
    this.placeImgRepository = AppDataSource.getRepository(PlaceImg);
    this.placeRepository = AppDataSource.getRepository(Place);
  }

  static async createPlaceImg(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceImgController();
    try {
      const { placeId, slug, author, license, top, source } = req.body;
      if (!placeId || !slug) {
        return res.status(400).json({ message: 'placeId and slug are required' });
      }
      const placeImg = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
        if (!place) {
          throw new Error(`Place with ID ${placeId} not found`);
        }
        const newPlaceImg = transactionalEntityManager.create(PlaceImg, {
          slug,
          author,
          license,
          top,
          source,
          place,
        });
        return await transactionalEntityManager.save(newPlaceImg);
      });
      return res.status(201).json({ message: 'Place image created successfully', placeImg });
    } catch (error: any) {
      console.error('Error creating place image:', error.message);
      if (error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error creating place image', error: error.message });
    }
  }

  static async getPlaceImgById(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceImgController();
    try {
      const { id } = req.params;
      const placeImg = await controller.placeImgRepository.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!placeImg) {
        return res.status(404).json({ message: 'Place image not found' });
      }
      return res.status(200).json(placeImg);
    } catch (error: any) {
      console.error('Error fetching place image:', error.message);
      return res.status(500).json({ message: 'Error fetching place image', error: error.message });
    }
  }

  static async getPlaceImgsByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceImgController();
    try {
      const { placeId } = req.params;
      const placeImgs = await controller.placeImgRepository.find({
        where: { place: { id: Number(placeId) } },
        relations: ['place'],
      });
      return res.status(200).json(placeImgs);
    } catch (error: any) {
      console.error('Error fetching place images:', error.message);
      return res.status(500).json({ message: 'Error fetching place images', error: error.message });
    }
  }

  static async updatePlaceImg(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceImgController();
    try {
      const { id } = req.params;
      const { placeId, slug, author, license, top, source } = req.body;
      if (placeId === undefined && !slug && !author && !license && top === undefined && !source) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedPlaceImg = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeImg = await transactionalEntityManager.findOne(PlaceImg, {
          where: { id: Number(id) },
          relations: ['place'],
        });
        if (!placeImg) {
          throw new Error('Place image not found');
        }
        if (placeId !== undefined) {
          const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
          if (!place) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          placeImg.place = place;
        }
        if (slug !== undefined) {
          placeImg.slug = slug;
        }
        if (author !== undefined) {
          placeImg.author = author;
        }
        if (license !== undefined) {
          placeImg.license = license;
        }
        if (top !== undefined) {
          placeImg.top = top;
        }
        if (source !== undefined) {
          placeImg.source = source;
        }
        return await transactionalEntityManager.save(placeImg);
      });
      return res.status(200).json({ message: 'Place image updated successfully', placeImg: updatedPlaceImg });
    } catch (error: any) {
      console.error('Error updating place image:', error.message);
      if (error.message === 'Place image not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating place image', error: error.message });
    }
  }

  static async deletePlaceImg(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceImgController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const placeImg = await transactionalEntityManager.findOne(PlaceImg, { where: { id: Number(id) } });
        if (!placeImg) {
          throw new Error('Place image not found');
        }
        await transactionalEntityManager.remove(placeImg);
      });
      return res.status(200).json({ message: 'Place image deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting place image:', error.message);
      if (error.message === 'Place image not found') {
        return res.status(404).json({ message: 'Place image not found' });
      }
      return res.status(500).json({ message: 'Error deleting place image', error: error.message });
    }
  }
}

export default PlaceImgController;
