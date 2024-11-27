import { Request, Response } from 'express';
import { Place } from '../../model/places/Place';
import { RestaurantBar } from '../../model/places/RestaurantBar';
import { Category } from '../../model/categories/Category';
import { PlaceCategory } from '../../model/categories/PlaceCategory';

class RestaurantBarController {
  // Créer un restaurant/bar avec une place associée
  static async createRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const { place, ...restaurantBarData } = req.body;

      if (!place) {
        return res.status(400).json({ message: 'Place data is required' });
      }

      // Vérifier si la place existe déjà
      let existingPlace = await Place.findOne({ where: { slug: place.slug } });
      if (!existingPlace) {
        // Créer la place si elle n'existe pas
        existingPlace = await Place.create(place).save();
      }

      // Associer la place au restaurant/bar
      const restaurantBar = await RestaurantBar.create({
        ...restaurantBarData,
        place: existingPlace,
      }).save();

      // Associer la place à la catégorie "bar_restaurant"
      const category = await Category.findOne({ where: { slug: 'bar_restaurant' } });
      if (category) {
        await PlaceCategory.createPlaceCategory({
          place: existingPlace,
          category: category,
        });
      }

      return res.status(201).json({
        message: 'Restaurant/Bar and Place created successfully',
        restaurantBar,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Error creating restaurant/bar and place',
        error: error.message,
      });
    }
  }

  // Récupérer un restaurant/bar par ID avec la place associée
  static async getRestaurantBarById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const restaurantBar = await RestaurantBar.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });
      if (!restaurantBar) {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }
      return res.status(200).json(restaurantBar);
    } catch (error) {
      return res.status(400).json({
        message: 'Error fetching restaurant/bar',
        error: error.message,
      });
    }
  }

  // Récupérer tous les restaurants/bars avec leurs places associées
  static async getAllRestaurantBars(req: Request, res: Response): Promise<Response> {
    try {
      const restaurantBars = await RestaurantBar.find({ relations: ['place'] });
      return res.status(200).json(restaurantBars);
    } catch (error) {
      return res.status(400).json({
        message: 'Error fetching restaurants/bars',
        error: error.message,
      });
    }
  }

  // Mettre à jour un restaurant/bar et éventuellement la place associée
  static async updateRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { place, ...restaurantBarData } = req.body;

      const restaurantBar = await RestaurantBar.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!restaurantBar) {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }

      // Mettre à jour les données de la place si nécessaire
      if (place && restaurantBar.place) {
        Object.assign(restaurantBar.place, place);
        await restaurantBar.place.save();
      }

      // Mettre à jour les données du restaurant/bar
      Object.assign(restaurantBar, restaurantBarData);
      await restaurantBar.save();

      return res.status(200).json({
        message: 'Restaurant/Bar updated successfully',
        restaurantBar,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Error updating restaurant/bar',
        error: error.message,
      });
    }
  }

  // Supprimer un restaurant/bar
  static async deleteRestaurantBar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const restaurantBar = await RestaurantBar.findOne({
        where: { id: Number(id) },
        relations: ['place'],
      });

      if (!restaurantBar) {
        return res.status(404).json({ message: 'Restaurant/Bar not found' });
      }

      await restaurantBar.remove();
      return res.status(200).json({ message: 'Restaurant/Bar deleted successfully' });
    } catch (error) {
      return res.status(400).json({
        message: 'Error deleting restaurant/bar',
        error: error.message,
      });
    }
  }
}

export default RestaurantBarController;
