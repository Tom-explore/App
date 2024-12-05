import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';
import { Hotel } from '../../model/places/Hotel';
import { RestaurantBar } from '../../model/places/RestaurantBar';
import { TouristAttraction } from '../../model/places/TouristAttraction';
import { TxPlace } from '../../model/translations/TxPlace';
import { PlaceImg } from '../../model/places/PlaceImg';
import { City } from '../../model/common/City';

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
  static async getAllPlacesByCity(req: Request, res: Response): Promise<Response> {
    try {
      const { citySlug } = req.params;
      const {
        languageId,
        limitRestaurantsBars = 8,
        limitHotels = 8,
        limitTouristAttractions = 8,
        offsetRestaurantsBars = 0,
        offsetHotels = 0,
        offsetTouristAttractions = 0,
      } = req.query;

      console.log('Request received with params:', { citySlug });
      console.log('Query params:', {
        languageId,
        limitRestaurantsBars,
        limitHotels,
        limitTouristAttractions,
        offsetRestaurantsBars,
        offsetHotels,
        offsetTouristAttractions,
      });

      if (!citySlug) {
        return res.status(400).json({ message: 'City slug is required' });
      }

      if (!languageId) {
        return res.status(400).json({ message: 'Language ID is required' });
      }

      const city = await City.findOne({ where: { slug: citySlug } });
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      console.log('City found:', city);

      // Convert query parameters to numbers
      const limitRB = parseInt(limitRestaurantsBars as string, 10);
      const offsetRB = parseInt(offsetRestaurantsBars as string, 10);
      const limitH = parseInt(limitHotels as string, 10);
      const offsetH = parseInt(offsetHotels as string, 10);
      const limitTA = parseInt(limitTouristAttractions as string, 10);
      const offsetTA = parseInt(offsetTouristAttractions as string, 10);

      // Fetch restaurants/bars
      const [restaurantBars, totalRB] = await RestaurantBar.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetRB,
        take: limitRB,
      });

      // Fetch hotels
      const [hotels, totalH] = await Hotel.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetH,
        take: limitH,
      });

      // Fetch tourist attractions
      const [touristAttractions, totalTA] = await TouristAttraction.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetTA,
        take: limitTA,
      });

      const enrichPlace = async (place: Place) => {
        const translation = await TxPlace.findByPlaceAndLanguage(place.id, Number(languageId));
        const images = await PlaceImg.findByPlace(place.id);
        return {
          id: place.id,
          slug: place.slug,
          description_scrapio: place.description_scrapio,
          lat: place.lat,
          lng: place.lng,
          address: place.address,
          link_insta: place.link_insta,
          link_fb: place.link_fb,
          link_maps: place.link_maps,
          link_website: place.link_website,
          reviews_google_rating: place.reviews_google_rating,
          reviews_google_count: place.reviews_google_count,
          translation: translation
            ? {
              slug: translation.slug,
              name: translation.name,
              title: translation.title,
              description: translation.description,
              meta_description: translation.meta_description,
            }
            : null,
          images: images.map((img) => ({
            id: img.id,
            slug: img.slug,
            author: img.author,
            license: img.license,
            top: img.top,
            source: img.source,
          })),
        };
      };

      const enrichedRB = await Promise.all(restaurantBars.map((rb) => enrichPlace(rb.place)));
      const enrichedH = await Promise.all(hotels.map((hotel) => enrichPlace(hotel.place)));
      const enrichedTA = await Promise.all(touristAttractions.map((ta) => enrichPlace(ta.place)));

      return res.status(200).json({
        restaurantsBars: enrichedRB,
        hotels: enrichedH,
        touristAttractions: enrichedTA,
        total: {
          restaurantsBars: totalRB,
          hotels: totalH,
          touristAttractions: totalTA,
        },
      });
    } catch (error) {
      console.error('Error occurred:', error.message);
      return res.status(400).json({
        message: 'Error fetching all places by city',
        error: error.message,
      });
    }
  }
}

export default PlaceController;
