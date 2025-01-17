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
import { PlaceType } from '../../model/enums/PlaceType';
import { CrowdLevels } from '../../model/places/CrowdLevel';
import { OpeningHours } from '../../model/places/OpeningHours';
import { firestore } from '../../config/Firestore';


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

  static async getAllPlacesByCity(req: Request, res: Response): Promise<void> {
    const controller = new PlaceController();
    const {
      cityRepository,
      txCityRepository,
      txCountryRepository,
      restaurantBarRepository,
      hotelRepository,
      touristAttractionRepository,
    } = controller;

    try {
      console.time('Total Execution Time');

      const { citySlug } = req.params;

      const {
        categories,
        limit: genericLimit = '8',
        offset: genericOffset = '0',
        limitRestaurantsBars = genericLimit,
        offsetRestaurantsBars = genericOffset,
        limitHotels = genericLimit,
        offsetHotels = genericOffset,
        limitTouristAttractions = genericLimit,
        offsetTouristAttractions = genericOffset,
      } = req.query;
      const languageId = Number(req.query.languageId);

      console.log('Received query params:', {
        citySlug,
        languageId,
        categories,
        limitRestaurantsBars,
        offsetRestaurantsBars,
        limitHotels,
        offsetHotels,
        limitTouristAttractions,
        offsetTouristAttractions,
      });

      if (!citySlug || !languageId) {
        console.error('Missing required parameters');
        res.status(400).json({ message: 'City slug and language ID are required' });
        console.timeEnd('Total Execution Time');
        return;
      }

      console.time('Fetch City and Country');
      // Fetch city and its country
      const city = await cityRepository.findOne({
        where: { slug: citySlug },
        relations: ['country'],
      });

      if (!city) {
        console.error('City not found:', citySlug);
        res.status(404).json({ message: 'City not found' });
        console.timeEnd('Fetch City and Country');
        console.timeEnd('Total Execution Time');
        return;
      }
      console.timeEnd('Fetch City and Country');

      console.time('Fetch Translations');
      // Fetch city and country translations in parallel
      const [txCity, txCountry] = await Promise.all([
        txCityRepository.findOne({
          where: { city: { id: city.id }, language_id: Number(languageId) },
        }),
        txCountryRepository.findOne({
          where: { country: { id: city.country.id }, language_id: Number(languageId) },
        }),
      ]);
      console.timeEnd('Fetch Translations');

      if (!txCity) {
        console.error('TxCity not found for language ID:', languageId);
        res.status(404).json({ message: 'City translation not found' });
        console.timeEnd('Total Execution Time');
        return;
      }

      if (!txCountry) {
        console.error('TxCountry not found for language ID:', languageId);
        res.status(404).json({ message: 'Country translation not found' });
        console.timeEnd('Total Execution Time');
        return;
      }

      console.time('Process Categories and Fetch Places');
      // Parse pagination parameters
      const parseNumber = (value: string | undefined, defaultValue: number) =>
        value ? parseInt(value, 10) : defaultValue;

      // Déterminer les catégories à récupérer
      let requestedCategories: string[] = [];

      if (categories) {
        if (Array.isArray(categories)) {
          // Force TypeScript à considérer cet array comme un tableau de strings
          const catArray = categories as string[];
          requestedCategories = catArray
            .filter((cat): cat is string => typeof cat === 'string')
            .map(cat => cat.toLowerCase());
        } else if (typeof categories === 'string') {
          requestedCategories = [categories.toLowerCase()];
        } else {
          throw new Error('Invalid categories format');
        }
      } else {
        // Si aucune catégorie n'est spécifiée, on récupère toutes les catégories par défaut
        requestedCategories = ['restaurant_bar', 'hotel', 'tourist_attraction'];
      }

      // Valider les catégories
      const validCategories = ['restaurant_bar', 'hotel', 'tourist_attraction'];
      requestedCategories = requestedCategories.filter(cat => validCategories.includes(cat));

      if (requestedCategories.length === 0) {
        console.error('No valid categories provided');
        res.status(400).json({ message: 'No valid categories provided' });
        console.timeEnd('Process Categories and Fetch Places');
        console.timeEnd('Total Execution Time');
        return;
      }

      // Mapping des catégories aux repositories et labels
      const categoryMapping: { [key: string]: { repository: Repository<any>; label: string } } = {
        'restaurant_bar': { repository: restaurantBarRepository, label: 'restaurantsBars' },
        'hotel': { repository: hotelRepository, label: 'hotels' },
        'tourist_attraction': { repository: touristAttractionRepository, label: 'touristAttractions' },
      };

      // Préparer les promesses pour chaque catégorie demandée
      const placePromises = requestedCategories.map(async (category) => {
        const { repository, label } = categoryMapping[category];
        let limit = 8;
        let offset = 0;

        // Déterminer limit et offset spécifiques à la catégorie
        switch (category) {
          case 'restaurant_bar':
            limit = parseNumber(limitRestaurantsBars as string, 8);
            offset = parseNumber(offsetRestaurantsBars as string, 0);
            break;
          case 'hotel':
            limit = parseNumber(limitHotels as string, 8);
            offset = parseNumber(offsetHotels as string, 0);
            break;
          case 'tourist_attraction':
            limit = parseNumber(limitTouristAttractions as string, 8);
            offset = parseNumber(offsetTouristAttractions as string, 0);
            break;
          default:
            limit = 8;
            offset = 0;
        }

        // Fetch places avec pagination et ordre déterministe
        const [entities, count] = await repository.findAndCount({
          relations: ['place'],
          where: { place: { city: { id: city.id } } },
          skip: offset,
          take: limit,
          order: { id: 'ASC' }, // Ajout de l'ordre
        });

        const enrichedPlaces = await Promise.all(
          entities.map(async (entity: any) => ({
            id: entity.id,
            placeId: entity.place.id,
            name: entity.place.slug,
            ...await controller.enrichPlace(entity.place, languageId),
          }))
        );

        return { label, places: enrichedPlaces, count };
      });

      // Exécuter toutes les promesses
      const results = await Promise.all(placePromises);
      const validResults = results.filter(result => result !== null);
      console.timeEnd('Process Categories and Fetch Places');

      console.time('Write to Firestore');
      console.log('Final Response:', JSON.stringify(validResults, null, 2));

      // Nom du document Firestore: "slug-language"
      const documentName = `${city.slug}-${languageId}`;
      console.log(`Writing to Firestore collection: City, document: ${documentName}`);

      // Utiliser Batch Writes pour optimiser les écritures
      const batch = firestore.batch();
      const cityDocRef = firestore.collection("City").doc(documentName);

      for (const result of validResults) {
        const subCollectionRef = cityDocRef.collection(result.label);
        for (const place of result.places) {
          const placeDocRef = subCollectionRef.doc(place.placeId.toString());
          batch.set(placeDocRef, place);
        }
      }

      await batch.commit();
      console.timeEnd('Write to Firestore');

      // Répondre à l'utilisateur que les données ont été écrites
      res.status(200).json({ message: `Données écrites dans Firestore sous le document ${documentName} de la collection City` });

      console.timeEnd('Total Execution Time');
    } catch (error: any) {
      console.error('Error fetching all places by city:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error fetching all places by city', error: error.message });
      } else {
        res.end();
      }
    }
  }


  /**
   * Fonction pour enrichir les données d'une place.
   * @param place La place à enrichir
   * @param languageId L'ID de la langue pour les traductions
   * @returns Un objet enrichi représentant la place
   */
  private async enrichPlace(place: Place, languageId: number): Promise<any> {
    // Récupérer les traductions, images, attributs et catégories
    const [translation, images, placeAttributes, placeCategories] = await Promise.all([
      this.txPlaceRepository.findOne({
        where: { place: { id: place.id }, language_id: languageId },
      }),
      this.placeImgRepository.find({ where: { place: { id: place.id } } }),
      PlaceAttribute.find({
        where: { place: { id: place.id } },
        relations: ['attribute'],
      }),
      PlaceCategory.find({
        where: { place: { id: place.id } },
        relations: ['category'],
      }),
    ]);

    // Récupérer les heures d'ouverture et les niveaux de fréquentation
    const [openingHours, crowdLevels] = await Promise.all([
      OpeningHours.find({ where: { place: { id: place.id } } }),
      CrowdLevels.find({ where: { place: { id: place.id } } }),
    ]);

    // Récupérer les données spécifiques au type de lieu
    const [restaurantBar, hotel, touristAttraction] = await Promise.all([
      RestaurantBar.findOne({ where: { place: { id: place.id } } }),
      Hotel.findOne({ where: { place: { id: place.id } } }),
      TouristAttraction.findOne({ where: { place: { id: place.id } } }),
    ]);

    const attributes = placeAttributes.map((pa) => ({
      ...pa.attribute,
      value: pa.value,
    }));

    const categories = placeCategories.map((pc) => ({
      ...pc.category,
      main: pc.main,
    }));

    // Déterminer le type de lieu et inclure les données spécifiques
    let specificData = {};
    let placeType: PlaceType | null = null;

    if (restaurantBar) {
      placeType = PlaceType.RESTAURANT_BAR; // Assurez-vous que PlaceType contient ces valeurs
      specificData = {
        menu: restaurantBar.menu,
        price_min: restaurantBar.price_min,
        price_max: restaurantBar.price_max,
      };
    } else if (hotel) {
      placeType = PlaceType.HOTEL;
      specificData = {
        booking_link: hotel.booking_link,
        avg_price_per_night: hotel.avg_price_per_night,
      };
    } else if (touristAttraction) {
      placeType = PlaceType.TOURIST_ATTRACTION;
      specificData = {
        name_original: touristAttraction.name_original,
        wiki_link: touristAttraction.wiki_link,
        price_regular: touristAttraction.price_regular,
        price_children: touristAttraction.price_children,
        tickets_gyg: touristAttraction.tickets_gyg,
        tickets_civitatis: touristAttraction.tickets_civitatis,
        tickets_direct_site: touristAttraction.tickets_direct_site,
      };
    }

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
      attributes,
      categories,
      ...specificData, // Inclure les données spécifiques au type de lieu
      placeType, // Inclure le type de lieu
      openingHours: openingHours.map((oh) => ({
        day_of_week: oh.day_of_week,
        start_time_1: oh.start_time_1,
        stop_time_1: oh.stop_time_1,
        start_time_2: oh.start_time_2,
        stop_time_2: oh.stop_time_2,
      })),
      crowdLevels: crowdLevels.map((cl) => ({
        day_of_week: cl.day_of_week,
        hour: cl.hour,
        status: cl.status,
      })),
    };
  }

}
export default PlaceController;

