import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { CrowdLevels } from '../../model/places/CrowdLevel';
import { Place } from '../../model/places/Place';
import { Repository } from 'typeorm';

class CrowdLevelController {
  private crowdLevelRepository: Repository<CrowdLevels>;
  private placeRepository: Repository<Place>;

  constructor() {
    this.crowdLevelRepository = AppDataSource.getRepository(CrowdLevels);
    this.placeRepository = AppDataSource.getRepository(Place);
  }

  static async createCrowdLevel(req: Request, res: Response): Promise<Response> {
    const controller = new CrowdLevelController();
    try {
      const { day_of_week, hour, status, placeId } = req.body;
      if (day_of_week === undefined || !hour || !status || !placeId) {
        return res.status(400).json({ message: 'day_of_week, hour, status, and placeId are required' });
      }
      const crowdLevel = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
        if (!place) {
          throw new Error(`Place with ID ${placeId} not found`);
        }
        const newCrowdLevel = transactionalEntityManager.create(CrowdLevels, {
          day_of_week,
          hour,
          status,
          place
        });
        return await transactionalEntityManager.save(newCrowdLevel);
      });
      return res.status(201).json({ message: 'Crowd level created successfully', crowdLevel });
    } catch (error: any) {
      console.error('Error creating crowd level:', error.message);
      return res.status(500).json({ message: 'Error creating crowd level', error: error.message });
    }
  }

  static async getCrowdLevelById(req: Request, res: Response): Promise<Response> {
    const controller = new CrowdLevelController();
    try {
      const { id } = req.params;
      const crowdLevel = await controller.crowdLevelRepository.findOne({
        where: { id: Number(id) },
        relations: ['place']
      });
      if (!crowdLevel) {
        return res.status(404).json({ message: 'Crowd level not found' });
      }
      return res.status(200).json(crowdLevel);
    } catch (error: any) {
      console.error('Error fetching crowd level:', error.message);
      return res.status(500).json({ message: 'Error fetching crowd level', error: error.message });
    }
  }

  static async getCrowdLevelsByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new CrowdLevelController();
    try {
      const { placeId } = req.params;
      const crowdLevels = await controller.crowdLevelRepository.find({
        where: { place: { id: Number(placeId) } },
        relations: ['place']
      });
      return res.status(200).json(crowdLevels);
    } catch (error: any) {
      console.error('Error fetching crowd levels:', error.message);
      return res.status(500).json({ message: 'Error fetching crowd levels', error: error.message });
    }
  }

  static async updateCrowdLevel(req: Request, res: Response): Promise<Response> {
    const controller = new CrowdLevelController();
    try {
      const { id } = req.params;
      const { day_of_week, hour, status, placeId } = req.body;
      if (day_of_week === undefined && !hour && !status && placeId === undefined) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedCrowdLevel = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const crowdLevel = await transactionalEntityManager.findOne(CrowdLevels, { where: { id: Number(id) }, relations: ['place'] });
        if (!crowdLevel) {
          throw new Error('Crowd level not found');
        }
        if (placeId !== undefined) {
          const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
          if (!place) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          crowdLevel.place = place;
        }
        transactionalEntityManager.merge(CrowdLevels, crowdLevel, {
          day_of_week,
          hour,
          status
        });
        return await transactionalEntityManager.save(crowdLevel);
      });
      return res.status(200).json({ message: 'Crowd level updated successfully', crowdLevel: updatedCrowdLevel });
    } catch (error: any) {
      console.error('Error updating crowd level:', error.message);
      if (error.message === 'Crowd level not found' || error.message.includes('not found')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Error updating crowd level', error: error.message });
    }
  }

  static async deleteCrowdLevel(req: Request, res: Response): Promise<Response> {
    const controller = new CrowdLevelController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const crowdLevel = await transactionalEntityManager.findOne(CrowdLevels, { where: { id: Number(id) } });
        if (!crowdLevel) {
          throw new Error('Crowd level not found');
        }
        await transactionalEntityManager.remove(crowdLevel);
      });
      return res.status(200).json({ message: 'Crowd level deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting crowd level:', error.message);
      if (error.message === 'Crowd level not found') {
        return res.status(404).json({ message: 'Crowd level not found' });
      }
      return res.status(500).json({ message: 'Error deleting crowd level', error: error.message });
    }
  }
}

export default CrowdLevelController;
