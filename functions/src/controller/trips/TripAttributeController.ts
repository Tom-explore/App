import { Request, Response } from 'express';
import { TripAttribute } from '../../model/trips/TripAttribute';

class TripAttributeController {
  static async createAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const tripAttribute = await TripAttribute.createAttribute(data);
      return res.status(201).json({ message: 'Trip attribute created successfully', tripAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating trip attribute', error: error.message });
    }
  }

  static async getAttributeById(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, attributeId } = req.params;
      const tripAttribute = await TripAttribute.findAttributeById(Number(tripId), Number(attributeId));
      if (!tripAttribute) return res.status(404).json({ message: 'Trip attribute not found' });
      return res.status(200).json(tripAttribute);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching trip attribute tra soeur', error: error.message });
    }
  }

  static async getAttributesByTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId } = req.params;
      console.log(tripId);
      const attributes = await TripAttribute.findAttributesByTrip(Number(tripId));
      return res.status(200).json(attributes);
    } catch (error) {
      return res.status(400).json({ message: `Error fetching trip attributes for trip id : ${req.params}` , error: error.message,  });
    }
  }

  static async updateAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, attributeId } = req.params;
      const data = req.body;
      const updatedAttribute = await TripAttribute.updateAttribute(Number(tripId), Number(attributeId), data);
      if (!updatedAttribute) return res.status(404).json({ message: 'Trip attribute not found' });
      return res.status(200).json({ message: 'Trip attribute updated successfully', updatedAttribute });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating trip attribute', error: error.message });
    }
  }

  static async deleteAttribute(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId, attributeId } = req.params;
      const success = await TripAttribute.deleteAttribute(Number(tripId), Number(attributeId));
      if (!success) return res.status(404).json({ message: 'Trip attribute not found' });
      return res.status(200).json({ message: 'Trip attribute deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting trip attribute', error: error.message });
    }
  }
}

export default TripAttributeController;
