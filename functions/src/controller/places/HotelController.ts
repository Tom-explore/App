import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Hotel } from '../../model/places/Hotel';
import { Place } from '../../model/places/Place';
import { Category } from '../../model/categories/Category';
import { PlaceCategory } from '../../model/categories/PlaceCategory';
import { Repository } from 'typeorm';

class HotelController {
  private hotelRepository: Repository<Hotel>;
  private placeRepository: Repository<Place>;
  private categoryRepository: Repository<Category>;
  private placeCategoryRepository: Repository<PlaceCategory>;

  constructor() {
    this.hotelRepository = AppDataSource.getRepository(Hotel);
    this.placeRepository = AppDataSource.getRepository(Place);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.placeCategoryRepository = AppDataSource.getRepository(PlaceCategory);
  }

  static async createHotel(req: Request, res: Response): Promise<Response> {
    const controller = new HotelController();
    try {
      const { place, ...hotelData } = req.body;
      if (!place || !place.slug) {
        return res.status(400).json({ message: 'Place data with slug is required' });
      }
      const hotel = await AppDataSource.transaction(async (transactionalEntityManager) => {
        let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
        if (!existingPlace) {
          existingPlace = transactionalEntityManager.create(Place, place);
          existingPlace = await transactionalEntityManager.save(existingPlace);
        }
        const newHotel = transactionalEntityManager.create(Hotel, { ...hotelData, place: existingPlace });
        const savedHotel = await transactionalEntityManager.save(newHotel);
        const category = await transactionalEntityManager.findOne(Category, { where: { slug: 'hotel' } });
        if (category) {
          const placeCategory = transactionalEntityManager.create(PlaceCategory, {
            place: existingPlace,
            category: category,
          });
          await transactionalEntityManager.save(placeCategory);
        }
        return savedHotel;
      });
      return res.status(201).json({ message: 'Hotel and Place created successfully', hotel });
    } catch (error: any) {
      console.error('Error creating hotel and place:', error.message);
      return res.status(500).json({ message: 'Error creating hotel and place', error: error.message });
    }
  }

  static async getHotelById(req: Request, res: Response): Promise<Response> {
    const controller = new HotelController();
    try {
      const { id } = req.params;
      const hotel = await controller.hotelRepository.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(200).json(hotel);
    } catch (error: any) {
      console.error('Error fetching hotel:', error.message);
      return res.status(500).json({ message: 'Error fetching hotel', error: error.message });
    }
  }

  static async getAllHotels(req: Request, res: Response): Promise<Response> {
    const controller = new HotelController();
    try {
      const hotels = await controller.hotelRepository.find({ relations: ['place'] });
      return res.status(200).json(hotels);
    } catch (error: any) {
      console.error('Error fetching hotels:', error.message);
      return res.status(500).json({ message: 'Error fetching hotels', error: error.message });
    }
  }

  static async updateHotel(req: Request, res: Response): Promise<Response> {
    const controller = new HotelController();
    try {
      const { id } = req.params;
      const { place, ...hotelData } = req.body;
      const updatedHotel = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const hotel = await transactionalEntityManager.findOne(Hotel, { where: { id: Number(id) }, relations: ['place'] });
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        if (place && place.slug) {
          let existingPlace = await transactionalEntityManager.findOne(Place, { where: { slug: place.slug } });
          if (!existingPlace) {
            existingPlace = transactionalEntityManager.create(Place, place);
            existingPlace = await transactionalEntityManager.save(existingPlace);
            const category = await transactionalEntityManager.findOne(Category, { where: { slug: 'hotel' } });
            if (category) {
              const placeCategory = transactionalEntityManager.create(PlaceCategory, {
                place: existingPlace,
                category: category,
              });
              await transactionalEntityManager.save(placeCategory);
            }
          }
          hotel.place = existingPlace;
        }
        transactionalEntityManager.merge(Hotel, hotel, hotelData);
        return await transactionalEntityManager.save(hotel);
      });
      return res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (error: any) {
      console.error('Error updating hotel:', error.message);
      if (error.message === 'Hotel not found') {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(500).json({ message: 'Error updating hotel', error: error.message });
    }
  }

  static async deleteHotel(req: Request, res: Response): Promise<Response> {
    const controller = new HotelController();
    try {
      const { id } = req.params;
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const hotel = await transactionalEntityManager.findOne(Hotel, { where: { id: Number(id) }, relations: ['place'] });
        if (!hotel) {
          throw new Error('Hotel not found');
        }
        await transactionalEntityManager.remove(hotel);
      });
      return res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting hotel:', error.message);
      if (error.message === 'Hotel not found') {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(500).json({ message: 'Error deleting hotel', error: error.message });
    }
  }
}

export default HotelController;
