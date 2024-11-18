import { Request, Response } from 'express';
import { PlaceImg } from '../../model/places/PlaceImg';

class PlaceImgController {
  static async createPlaceImg(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const placeImg = await PlaceImg.createPlaceImg(data);
      return res.status(201).json({ message: 'Place image created successfully', placeImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place image', error: error.message });
    }
  }

  static async getPlaceImgById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const placeImg = await PlaceImg.findById(Number(id));
      if (!placeImg) return res.status(404).json({ message: 'Place image not found' });
      return res.status(200).json(placeImg);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place image', error: error.message });
    }
  }

  static async getPlaceImgsByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const placeImgs = await PlaceImg.findByPlace(Number(placeId));
      return res.status(200).json(placeImgs);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place images', error: error.message });
    }
  }

  static async updatePlaceImg(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const placeImg = await PlaceImg.updatePlaceImg(Number(id), data);
      if (!placeImg) return res.status(404).json({ message: 'Place image not found' });
      return res.status(200).json({ message: 'Place image updated successfully', placeImg });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place image', error: error.message });
    }
  }

  static async deletePlaceImg(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await PlaceImg.deletePlaceImg(Number(id));
      if (!success) return res.status(404).json({ message: 'Place image not found' });
      return res.status(200).json({ message: 'Place image deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place image', error: error.message });
    }
  }
}

export default PlaceImgController;
