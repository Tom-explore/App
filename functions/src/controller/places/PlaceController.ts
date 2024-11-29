import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';
import {Hotel} from '../../model/places/Hotel';
import {RestaurantBar} from '../../model/places/RestaurantBar';
import {TouristAttraction} from '../../model/places/TouristAttraction';
import { TxPlace } from '../../model/translations/TxPlace';

class PlaceController {
  static async createPlace(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const place = await Place.createPlace(data);
      return res.status(201).json({ message: 'Place created successfully', place });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place', error: error.message });
    }
  }

  static async getPlaceById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const place = await Place.findById(Number(id));
      if (!place) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json(place);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place', error: error.message });
    }
  }

  static async getAllPlaces(req: Request, res: Response): Promise<Response> {
    try {
      const places = await Place.findAll();
      return res.status(200).json(places);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching places', error: error.message });
    }
  }

  static async updatePlace(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const place = await Place.updatePlace(Number(id), data);
      if (!place) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json({ message: 'Place updated successfully', place });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place', error: error.message });
    }
  }

  static async deletePlace(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Place.deletePlace(Number(id));
      if (!success) return res.status(404).json({ message: 'Place not found' });
      return res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place', error: error.message });
    }
  }
  static async getPlacesByCity(req: Request, res: Response): Promise<Response> {
    try {
      const { cityId } = req.params;
      const { languageId } = req.query; // Récupère le languageId depuis les paramètres de requête
  
      if (!languageId) {
        return res.status(400).json({ message: 'Language ID is required' });
      }
  
      // Récupérer les restaurants/bars associés à la ville
      const restaurantsBars = await RestaurantBar.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });
  
      // Récupérer les hôtels associés à la ville
      const hotels = await Hotel.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });
  
      // Récupérer les attractions touristiques associées à la ville
      const attractions = await TouristAttraction.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });
  
      // Fonction pour récupérer la traduction d'une place
      const getTranslation = async (placeId: number): Promise<any> => {
        const translation = await TxPlace.findByPlaceAndLanguage(placeId, Number(languageId));
        return translation
          ? {
              slug: translation.slug,
              name: translation.name,
              title: translation.title,
              description: translation.description,
              meta_description: translation.meta_description,
            }
          : null;
      };
  
      // Formatter les résultats avec les traductions
      const result = {
        restaurants_bars: await Promise.all(
          restaurantsBars.map(async (rb) => ({
            id: rb.id,
            placeId: rb.place.id,
            name: rb.place.slug,
            translation: await getTranslation(rb.place.id),
          }))
        ),
        hotels: await Promise.all(
          hotels.map(async (hotel) => ({
            id: hotel.id,
            placeId: hotel.place.id,
            name: hotel.place.slug,
            translation: await getTranslation(hotel.place.id),
          }))
        ),
        tourist_attractions: await Promise.all(
          attractions.map(async (attraction) => ({
            id: attraction.id,
            placeId: attraction.place.id,
            name: attraction.place.slug,
            translation: await getTranslation(attraction.place.id),
          }))
        ),
      };
  
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: 'Error fetching places by city',
        error: error.message,
      });
    }
  }
    
}


export default PlaceController;
