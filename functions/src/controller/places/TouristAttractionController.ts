import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';
import { TouristAttraction } from '../../model/places/TouristAttraction';
import { Category } from '../../model/categories/Category';
import { PlaceCategory } from '../../model/categories/PlaceCategory';

class TouristAttractionController {
  // Créer une attraction touristique avec une place associée
  static async createTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const { place, ...attractionData } = req.body;

      if (!place) {
        return res.status(400).json({ message: 'Place data is required' });
      }

      // Vérifier si la place existe déjà
      let existingPlace = await Place.findOne({ where: { slug: place.slug } });
      if (!existingPlace) {
        // Créer la place si elle n'existe pas
        existingPlace = await Place.create(place).save();
      }

      // Associer la place à l'attraction touristique
      const attraction = await TouristAttraction.create({
        ...attractionData,
        place: existingPlace,
      }).save();

      // Associer la place à la catégorie "tourist_attraction"
      const category = await Category.findOne({ where: { slug: 'tourist_attraction' } });
      if (category) {
        await PlaceCategory.createPlaceCategory({
          place: existingPlace,
          category: category,
        });
      }

      return res.status(201).json({
        message: 'Tourist attraction and Place created successfully',
        attraction,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Error creating tourist attraction and place',
        error: error.message,
      });
    }
  }

  // Récupérer une attraction touristique par ID avec la place associée
  static async getTouristAttractionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const attraction = await TouristAttraction.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!attraction) {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }
      return res.status(200).json(attraction);
    } catch (error) {
      return res.status(400).json({
        message: 'Error fetching tourist attraction',
        error: error.message,
      });
    }
  }

  // Récupérer toutes les attractions touristiques avec leurs places associées
  static async getAllTouristAttractions(req: Request, res: Response): Promise<Response> {
    try {
      const attractions = await TouristAttraction.find({ relations: ['place'] });
      return res.status(200).json(attractions);
    } catch (error) {
      return res.status(400).json({
        message: 'Error fetching tourist attractions',
        error: error.message,
      });
    }
  }

  // Mettre à jour une attraction touristique et éventuellement la place associée
  static async updateTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { place, ...attractionData } = req.body;

      const attraction = await TouristAttraction.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!attraction) {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }

      // Mettre à jour les données de la place si nécessaire
      if (place && attraction.place) {
        Object.assign(attraction.place, place);
        await attraction.place.save();
      }

      // Mettre à jour les données de l'attraction touristique
      Object.assign(attraction, attractionData);
      await attraction.save();

      return res.status(200).json({
        message: 'Tourist attraction updated successfully',
        attraction,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Error updating tourist attraction',
        error: error.message,
      });
    }
  }

  // Supprimer une attraction touristique
  static async deleteTouristAttraction(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const attraction = await TouristAttraction.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!attraction) {
        return res.status(404).json({ message: 'Tourist attraction not found' });
      }

      await attraction.remove();
      return res.status(200).json({ message: 'Tourist attraction deleted successfully' });
    } catch (error) {
      return res.status(400).json({
        message: 'Error deleting tourist attraction',
        error: error.message,
      });
    }
  }
}

export default TouristAttractionController;
