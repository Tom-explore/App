import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { TouristAttraction } from '../../model/places/TouristAttraction';
import { Place } from '../../model/places/Place';
import { Repository } from 'typeorm';

class TouristAttractionController {
  private touristAttractionRepository: Repository<TouristAttraction>;
  private placeRepository: Repository<Place>;

  constructor() {
    this.touristAttractionRepository = AppDataSource.getRepository(TouristAttraction);
    this.placeRepository = AppDataSource.getRepository(Place);
  }

  static async createTouristAttraction(req: Request, res: Response): Promise<Response> {
    const controller = new TouristAttractionController();
    try {
      const { place, ...attractionData } = req.body;
      if (!place || !place.slug) {
        return res.status(400).json({ message: 'Place data with slug is required' });
      }

      const attraction = await AppDataSource.transaction(async (transactionalEntityManager) => {
        let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
        if (!existingPlace) {
          existingPlace = transactionalEntityManager.create(Place, place);
          existingPlace = await transactionalEntityManager.save(existingPlace);
        }

        const newAttraction = transactionalEntityManager.create(TouristAttraction, {
          ...attractionData,
          place: existingPlace,
        });

        return await transactionalEntityManager.save(newAttraction);
      });

      return res.status(201).json({ message: 'Tourist attraction and Place created successfully', attraction });
    } catch (error: any) {
      console.error('Error creating tourist attraction and place:', error.message);
      return res.status(500).json({ message: 'Error creating tourist attraction and place', error: error.message });
    }
  }

  static async getTouristAttractionById(req: Request, res: Response): Promise<Response> {
    const controller = new TouristAttractionController();
    try {
      const { id } = req.params;
      const attraction = await controller.touristAttractionRepository.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!attraction) {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }
      return res.status(200).json(attraction);
    } catch (error: any) {
      console.error('Error fetching tourist attraction:', error.message);
      return res.status(500).json({ message: 'Error fetching tourist attraction', error: error.message });
    }
  }

  static async getAllTouristAttractions(req: Request, res: Response): Promise<Response> {
    const controller = new TouristAttractionController();
    try {
      const attractions = await controller.touristAttractionRepository.find({ relations: ['place'] });
      return res.status(200).json(attractions);
    } catch (error: any) {
      console.error('Error fetching tourist attractions:', error.message);
      return res.status(500).json({ message: 'Error fetching tourist attractions', error: error.message });
    }
  }

  static async updateTouristAttraction(req: Request, res: Response): Promise<Response> {
    const controller = new TouristAttractionController();
    try {
      const { id } = req.params;
      const { place, ...attractionData } = req.body;

      const updatedAttraction = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const attraction = await transactionalEntityManager.findOne(TouristAttraction, {
          where: { id: Number(id) },
          relations: ['place'],
        });
        if (!attraction) {
          throw new Error('Tourist attraction not found');
        }

        if (place && place.slug) {
          let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
          if (!existingPlace) {
            existingPlace = transactionalEntityManager.create(Place, place);
            existingPlace = await transactionalEntityManager.save(existingPlace);
          }
          attraction.place = existingPlace;
        }

        transactionalEntityManager.merge(TouristAttraction, attraction, attractionData);
        return await transactionalEntityManager.save(attraction);
      });

      return res.status(200).json({ message: 'Tourist attraction updated successfully', attraction: updatedAttraction });
    } catch (error: any) {
      console.error('Error updating tourist attraction:', error.message);
      if (error.message === 'Tourist attraction not found') {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }
      return res.status(500).json({ message: 'Error updating tourist attraction', error: error.message });
    }
  }

  static async deleteTouristAttraction(req: Request, res: Response): Promise<Response> {
    const controller = new TouristAttractionController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const attraction = await transactionalEntityManager.findOne(TouristAttraction, { where: { id: Number(id) } });
        if (!attraction) {
          throw new Error('Tourist attraction not found');
        }
        await transactionalEntityManager.remove(attraction);
      });
      return res.status(200).json({ message: 'Tourist attraction deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting tourist attraction:', error.message);
      if (error.message === 'Tourist attraction not found') {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }
      return res.status(500).json({ message: 'Error deleting tourist attraction', error: error.message });
    }
  }
}

export default TouristAttractionController;
