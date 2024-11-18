import { Request, Response } from 'express';
import { PlaceAttribute } from '../../model/categories/PlaceAttribute';

class PlaceAttributeController {
  static async createPlaceAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const placeAttribute = await PlaceAttribute.createPlaceAttribute(data);
      return res.status(201).json({ message: 'Place attribute created successfully', placeAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating place attribute', error: error.message });
    }
  }

  static async getPlaceAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, attributeId } = req.params;
      const placeAttribute = await PlaceAttribute.findByPlaceAndAttribute(Number(placeId), Number(attributeId));
      if (!placeAttribute) {
        return res.status(404).json({ message: 'Place attribute not found' });
      }
      return res.status(200).json(placeAttribute);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place attribute', error: error.message });
    }
  }

  static async getPlaceAttributeByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const placeAttribute = await PlaceAttribute.findByPlace(Number(placeId));
      return res.status(200).json(placeAttribute);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching place attributes', error: error.message });
    }
  }

  static async updatePlaceAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, attributeId } = req.params;
      const data = req.body;
      const placeAttribute = await PlaceAttribute.updatePlaceAttribute(
        Number(placeId),
        Number(attributeId),
        data
      );
      if (!placeAttribute) {
        return res.status(404).json({ message: 'Place attribute not found' });
      }
      return res.status(200).json({ message: 'Place attribute updated successfully', placeAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating place attribute', error: error.message });
    }
  }

  static async deletePlaceAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId, attributeId } = req.params;
      const success = await PlaceAttribute.deletePlaceAttribute(Number(placeId), Number(attributeId));
      if (!success) {
        return res.status(404).json({ message: 'Place attribute not found' });
      }
      return res.status(200).json({ message: 'Place attribute deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting place attribute', error: error.message });
    }
  }
}

export default PlaceAttributeController;
