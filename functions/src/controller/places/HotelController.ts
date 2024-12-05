import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';
import { Hotel } from '../../model/places/Hotel';
import { Category } from '../../model/categories/Category';
import { PlaceCategory } from '../../model/categories/PlaceCategory';

class HotelController {
  // Créer un hôtel avec une place associée
  static async createHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { place, ...hotelData } = req.body;

      if (!place) {
        return res.status(400).json({ message: 'Place data is required' });
      }

      // Vérifier si la place existe déjà
      let existingPlace = await Place.findOne({ where: { slug: place.slug } });
      if (!existingPlace) {
        // Créer la place si elle n'existe pas
        existingPlace = await Place.create(place).save();
      }

      // Associer la place à l'hôtel
      const hotel = await Hotel.create({
        ...hotelData,
        place: existingPlace,
      }).save();

      // Associer la place à la catégorie "hotel"
      const category = await Category.findOne({ where: { slug: 'hotel' } });
      if (category) {
        await PlaceCategory.createPlaceCategory({
          place: existingPlace,
          category: category,
        });
      }

      return res.status(201).json({ message: 'Hotel and Place created successfully', hotel });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating hotel and place', error: error.message });
    }
  }

  // Récupérer un hôtel par ID avec la place associée
  static async getHotelById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const hotel = await Hotel.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(200).json(hotel);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching hotel', error: error.message });
    }
  }

  // Récupérer tous les hôtels avec leurs places associées
  static async getAllHotels(req: Request, res: Response): Promise<Response> {
    try {
      const hotels = await Hotel.find({ relations: ['place'] });
      return res.status(200).json(hotels);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching hotels', error: error.message });
    }
  }

  // Mettre à jour un hôtel et éventuellement la place associée
  static async updateHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { place, ...hotelData } = req.body;

      const hotel = await Hotel.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Mettre à jour les données de la place si nécessaire
      if (place && hotel.place) {
        Object.assign(hotel.place, place);
        await hotel.place.save();
      }

      // Mettre à jour les données de l'hôtel
      Object.assign(hotel, hotelData);
      await hotel.save();

      return res.status(200).json({ message: 'Hotel updated successfully', hotel });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating hotel', error: error.message });
    }
  }

  // Supprimer un hôtel
  static async deleteHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const hotel = await Hotel.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      await hotel.remove();
      return res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting hotel', error: error.message });
    }
  }
}

export default HotelController;
