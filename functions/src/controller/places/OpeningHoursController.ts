import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { OpeningHours } from '../../model/places/OpeningHours';
import { Place } from '../../model/places/Place';
import { Repository } from 'typeorm';

class OpeningHoursController {
  private openingHoursRepository: Repository<OpeningHours>;
  private placeRepository: Repository<Place>;

  constructor() {
    this.openingHoursRepository = AppDataSource.getRepository(OpeningHours);
    this.placeRepository = AppDataSource.getRepository(Place);
  }

  static async createOpeningHour(req: Request, res: Response): Promise<Response> {
    const controller = new OpeningHoursController();
    try {
      const { placeId, day_of_week, start_time_1, stop_time_1, start_time_2, stop_time_2 } = req.body;
      if (
        placeId === undefined ||
        day_of_week === undefined ||
        !start_time_1 ||
        !stop_time_1
      ) {
        return res.status(400).json({ message: 'placeId, day_of_week, start_time_1, and stop_time_1 are required' });
      }
      const openingHour = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
        if (!place) {
          throw new Error(`Place with ID ${placeId} not found`);
        }
        const newOpeningHour = transactionalEntityManager.create(OpeningHours, {
          place,
          day_of_week,
          start_time_1,
          stop_time_1,
          start_time_2,
          stop_time_2,
        });
        return await transactionalEntityManager.save(newOpeningHour);
      });
      return res.status(201).json({ message: 'Opening hour created successfully', openingHour });
    } catch (error: any) {
      console.error('Error creating opening hour:', error.message);
      return res.status(500).json({ message: 'Error creating opening hour', error: error.message });
    }
  }

  static async getOpeningHourById(req: Request, res: Response): Promise<Response> {
    const controller = new OpeningHoursController();
    try {
      const { id } = req.params;
      const openingHour = await controller.openingHoursRepository.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!openingHour) {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(200).json(openingHour);
    } catch (error: any) {
      console.error('Error fetching opening hour:', error.message);
      return res.status(500).json({ message: 'Error fetching opening hour', error: error.message });
    }
  }

  static async getOpeningHoursByPlace(req: Request, res: Response): Promise<Response> {
    const controller = new OpeningHoursController();
    try {
      const { placeId } = req.params;
      const openingHours = await controller.openingHoursRepository.find({
        where: { place: { id: Number(placeId) } },
        relations: ['place'],
      });
      return res.status(200).json(openingHours);
    } catch (error: any) {
      console.error('Error fetching opening hours:', error.message);
      return res.status(500).json({ message: 'Error fetching opening hours', error: error.message });
    }
  }

  static async updateOpeningHour(req: Request, res: Response): Promise<Response> {
    const controller = new OpeningHoursController();
    try {
      const { id } = req.params;
      const { placeId, day_of_week, start_time_1, stop_time_1, start_time_2, stop_time_2 } = req.body;
      if (
        placeId === undefined &&
        day_of_week === undefined &&
        !start_time_1 &&
        !stop_time_1 &&
        !start_time_2 &&
        !stop_time_2
      ) {
        return res.status(400).json({ message: 'At least one field is required to update' });
      }
      const updatedOpeningHour = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const openingHour = await transactionalEntityManager.findOne(OpeningHours, {
          where: { id: Number(id) },
          relations: ['place'],
        });
        if (!openingHour) {
          throw new Error('Opening hour not found');
        }
        if (placeId !== undefined) {
          const place = await transactionalEntityManager.findOne(Place, { where: { id: placeId } });
          if (!place) {
            throw new Error(`Place with ID ${placeId} not found`);
          }
          openingHour.place = place;
        }
        if (day_of_week !== undefined) {
          openingHour.day_of_week = day_of_week;
        }
        if (start_time_1 !== undefined) {
          openingHour.start_time_1 = start_time_1;
        }
        if (stop_time_1 !== undefined) {
          openingHour.stop_time_1 = stop_time_1;
        }
        if (start_time_2 !== undefined) {
          openingHour.start_time_2 = start_time_2;
        }
        if (stop_time_2 !== undefined) {
          openingHour.stop_time_2 = stop_time_2;
        }
        return await transactionalEntityManager.save(openingHour);
      });
      return res.status(200).json({ message: 'Opening hour updated successfully', openingHour: updatedOpeningHour });
    } catch (error: any) {
      console.error('Error updating opening hour:', error.message);
      if (error.message === 'Opening hour not found') {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(500).json({ message: 'Error updating opening hour', error: error.message });
    }
  }

  static async deleteOpeningHour(req: Request, res: Response): Promise<Response> {
    const controller = new OpeningHoursController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const openingHour = await transactionalEntityManager.findOne(OpeningHours, { where: { id: Number(id) } });
        if (!openingHour) {
          throw new Error('Opening hour not found');
        }
        await transactionalEntityManager.remove(openingHour);
      });
      return res.status(200).json({ message: 'Opening hour deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting opening hour:', error.message);
      if (error.message === 'Opening hour not found') {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(500).json({ message: 'Error deleting opening hour', error: error.message });
    }
  }
}

export default OpeningHoursController;
