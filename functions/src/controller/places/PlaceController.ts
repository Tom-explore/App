import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { Place } from '../../model/places/Place';
import { Hotel } from '../../model/places/Hotel';
import { RestaurantBar } from '../../model/places/RestaurantBar';
import { TouristAttraction } from '../../model/places/TouristAttraction';
import { TxPlace } from '../../model/translations/TxPlace';
import { PlaceImg } from '../../model/places/PlaceImg';
import { City } from '../../model/common/City';
import { TxCity } from '../../model/translations/TxCity';
import { TxCountry } from '../../model/translations/TxCountry';
import { Repository } from 'typeorm';
import { PlaceAttribute } from '../../model/categories/PlaceAttribute';
import { PlaceCategory } from '../../model/categories/PlaceCategory';

class PlaceController {
  private placeRepository: Repository<Place>;
  private hotelRepository: Repository<Hotel>;
  private restaurantBarRepository: Repository<RestaurantBar>;
  private touristAttractionRepository: Repository<TouristAttraction>;
  private txPlaceRepository: Repository<TxPlace>;
  private placeImgRepository: Repository<PlaceImg>;
  private cityRepository: Repository<City>;
  private txCityRepository: Repository<TxCity>;
  private txCountryRepository: Repository<TxCountry>;

  constructor() {
    this.placeRepository = AppDataSource.getRepository(Place);
    this.hotelRepository = AppDataSource.getRepository(Hotel);
    this.restaurantBarRepository = AppDataSource.getRepository(RestaurantBar);
    this.touristAttractionRepository = AppDataSource.getRepository(TouristAttraction);
    this.txPlaceRepository = AppDataSource.getRepository(TxPlace);
    this.placeImgRepository = AppDataSource.getRepository(PlaceImg);
    this.cityRepository = AppDataSource.getRepository(City);
    this.txCityRepository = AppDataSource.getRepository(TxCity);
    this.txCountryRepository = AppDataSource.getRepository(TxCountry);
  }

  static async createPlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const { placeRepository } = controller;

    try {
      const data = req.body;

      // Validation des données (à implémenter selon vos besoins)
      if (!data.name || !data.cityId) {
        return res.status(400).json({ message: 'Name and cityId are required' });
      }

      // Utilisation de la transaction pour garantir l'intégrité
      const place = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const newPlace = transactionalEntityManager.create(Place, data);
        return await transactionalEntityManager.save(newPlace);
      });

      return res.status(201).json({ message: 'Place created successfully', place });
    } catch (error: any) {
      console.error('Error creating place:', error);
      return res.status(500).json({ message: 'Error creating place', error: error.message });
    }
  }

  static async getPlaceById(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const { placeRepository } = controller;

    try {
      const { id } = req.params;
      const place = await placeRepository.findOne({
        where: { id: Number(id) },
        relations: ['city', 'translations', 'images'], // Ajouter les relations nécessaires
      });

      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }

      return res.status(200).json(place);
    } catch (error: any) {
      console.error('Error fetching place:', error);
      return res.status(500).json({ message: 'Error fetching place', error: error.message });
    }
  }

  static async getAllPlaces(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const { placeRepository } = controller;

    try {
      const places = await placeRepository.find({
        relations: ['city', 'translations', 'images'], // Ajouter les relations nécessaires
      });

      return res.status(200).json(places);
    } catch (error: any) {
      console.error('Error fetching places:', error);
      return res.status(500).json({ message: 'Error fetching places', error: error.message });
    }
  }

  static async updatePlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const { placeRepository } = controller;

    try {
      const { id } = req.params;
      const data = req.body;

      // Utilisation de la transaction pour garantir l'intégrité
      const updatedPlace = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: Number(id) } });
        if (!place) {
          throw new Error('Place not found');
        }
        transactionalEntityManager.merge(Place, place, data);
        return await transactionalEntityManager.save(place);
      });

      return res.status(200).json({ message: 'Place updated successfully', place: updatedPlace });
    } catch (error: any) {
      if (error.message === 'Place not found') {
        return res.status(404).json({ message: 'Place not found' });
      }
      console.error('Error updating place:', error);
      return res.status(500).json({ message: 'Error updating place', error: error.message });
    }
  }

  static async deletePlace(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const { placeRepository } = controller;

    try {
      const { id } = req.params;

      // Utilisation de la transaction pour garantir l'intégrité
      const success = await AppDataSource.transaction(async (transactionalEntityManager) => {
        const place = await transactionalEntityManager.findOne(Place, { where: { id: Number(id) } });
        if (!place) {
          throw new Error('Place not found');
        }
        await transactionalEntityManager.remove(place);
        return true;
      });

      return res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Place not found') {
        return res.status(404).json({ message: 'Place not found' });
      }
      console.error('Error deleting place:', error);
      return res.status(500).json({ message: 'Error deleting place', error: error.message });
    }
  }

  static async getPlacesByCity(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const {
      restaurantBarRepository,
      hotelRepository,
      touristAttractionRepository,
      txPlaceRepository,
    } = controller;

    try {
      const { cityId } = req.params;
      const languageId = req.query.languageId ? Number(req.query.languageId) : null;

      if (!languageId) {
        return res.status(400).json({ message: 'Language ID is required' });
      }

      // Récupérer les restaurants/bars associés à la ville
      const restaurantsBars = await restaurantBarRepository.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });

      // Récupérer les hôtels associés à la ville
      const hotels = await hotelRepository.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });

      // Récupérer les attractions touristiques associées à la ville
      const attractions = await touristAttractionRepository.find({
        relations: ['place'],
        where: { place: { city: { id: Number(cityId) } } },
      });

      // Fonction pour récupérer la traduction d'une place
      const getTranslation = async (placeId: number) => {
        const translation = await txPlaceRepository.findOne({
          where: { place: { id: placeId }, language_id: languageId },
        });
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
      console.log('Final Response:', JSON.stringify(result, null, 2));

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching places by city:', error);
      return res.status(500).json({ message: 'Error fetching places by city', error: error.message });
    }
  }

  static async getAllPlacesByCity(req: Request, res: Response): Promise<Response> {
    const controller = new PlaceController();
    const {
      cityRepository,
      txCityRepository,
      txCountryRepository,
      restaurantBarRepository,
      hotelRepository,
      touristAttractionRepository,
      txPlaceRepository,
      placeImgRepository,
    } = controller;

    try {
      const { citySlug } = req.params;

      const {
        languageId,
        limit: genericLimit = 8,
        offset: genericOffset = 0,
        limitRestaurantsBars = genericLimit,
        offsetRestaurantsBars = genericOffset,
        limitHotels = genericLimit,
        offsetHotels = genericOffset,
        limitTouristAttractions = genericLimit,
        offsetTouristAttractions = genericOffset,
      } = req.query;

      console.log('Received query params:', {
        citySlug,
        languageId,
        limitRestaurantsBars,
        offsetRestaurantsBars,
        limitHotels,
        offsetHotels,
        limitTouristAttractions,
        offsetTouristAttractions,
      });

      if (!citySlug || !languageId) {
        console.error('Missing required parameters');
        return res.status(400).json({ message: 'City slug and language ID are required' });
      }

      const city = await cityRepository.findOne({
        where: { slug: citySlug },
        relations: ['country'],
      });

      if (!city) {
        console.error('City not found:', citySlug);
        return res.status(404).json({ message: 'City not found' });
      }

      // Fetch the city translation
      const txCity = await txCityRepository.findOne({
        where: { city: { id: city.id }, language_id: Number(languageId) },
      });
      if (!txCity) {
        console.error('TxCity not found for language ID:', languageId);
        return res.status(404).json({ message: 'City translation not found' });
      }

      // Fetch the country translation
      const txCountry = await txCountryRepository.findOne({
        where: { country: { id: city.country.id }, language_id: Number(languageId) },
      });
      if (!txCountry) {
        console.error('TxCountry not found for language ID:', languageId);
        return res.status(404).json({ message: 'Country translation not found' });
      }

      const limitRB = parseInt(limitRestaurantsBars as string, 10);
      const offsetRB = parseInt(offsetRestaurantsBars as string, 10);
      const limitH = parseInt(limitHotels as string, 10);
      const offsetH = parseInt(offsetHotels as string, 10);
      const limitTA = parseInt(limitTouristAttractions as string, 10);
      const offsetTA = parseInt(offsetTouristAttractions as string, 10);

      console.log('Parsed pagination params:', {
        limitRB,
        offsetRB,
        limitH,
        offsetH,
        limitTA,
        offsetTA,
      });

      // Utilize repositories with appropriate methods
      const [restaurantBars, rbCount] = await restaurantBarRepository.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetRB,
        take: limitRB,
      });

      const [hotels, hCount] = await hotelRepository.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetH,
        take: limitH,
      });

      const [touristAttractions, taCount] = await touristAttractionRepository.findAndCount({
        relations: ['place'],
        where: { place: { city: { id: city.id } } },
        skip: offsetTA,
        take: limitTA,
      });

      // Function to enrich places with translations, images, attributes, and categories
      const enrichPlace = async (place: Place) => {
        // Fetch translation
        const translation = await txPlaceRepository.findOne({
          where: { place: { id: place.id }, language_id: Number(languageId) },
        });

        // Fetch images
        const images = await placeImgRepository.find({ where: { place: { id: place.id } } });

        // Fetch attributes with full Attribute objects
        const placeAttributes = await PlaceAttribute.find({
          where: { place: { id: place.id } },
          relations: ['attribute'],
        });
        console.log(`Attributes for Place ID ${place.id}:`, placeAttributes);

        const attributes: any[] = placeAttributes.map((pa) => ({
          ...pa.attribute,
          value: pa.value,
        }));

        // Fetch categories with full Category objects
        const placeCategories = await PlaceCategory.find({
          where: { place: { id: place.id } },
          relations: ['category'],
        });
        const categories: any[] = placeCategories.map((pc) => ({
          ...pc.category,
          main: pc.main,
        }));
        console.log(`Categories for Place ID ${place.id}:`, placeCategories);


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
          attributes, // Included full Attribute objects with 'value'
          categories, // Included full Category objects with 'main'
        };

      };

      const enrichedRB = await Promise.all(restaurantBars.map((rb) => enrichPlace(rb.place)));
      console.log(enrichedRB)
      const enrichedH = await Promise.all(hotels.map((hotel) => enrichPlace(hotel.place)));
      const enrichedTA = await Promise.all(touristAttractions.map((ta) => enrichPlace(ta.place)));

      return res.status(200).json({
        city: {
          id: city.id,
          slug: city.slug,
          scrapio: city.scrapio,
          timezone: city.timezone,
          lat: city.lat,
          lng: city.lng,
          duration: city.duration,
          country: {
            id: city.country.id,
            code: city.country.code,
            slug: city.country.slug,
            translation: {
              slug: txCountry.slug,
              name: txCountry.name,
              description: txCountry.description,
              meta_description: txCountry.meta_description,
            },
          },
          translation: {
            slug: txCity.slug,
            name: txCity.name,
            description: txCity.description,
            meta_description: txCity.meta_description,
          },
        },
        places: {
          restaurantsBars: enrichedRB,
          hotels: enrichedH,
          touristAttractions: enrichedTA,
        },
        counts: {
          restaurantsBars: rbCount,
          hotels: hCount,
          touristAttractions: taCount,
        },
      });
    } catch (error: any) {
      console.error('Error fetching all places by city:', error);
      return res.status(500).json({ message: 'Error fetching all places by city', error: error.message });
    }
  }
}
export default PlaceController;

