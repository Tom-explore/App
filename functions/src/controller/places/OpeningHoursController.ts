import { Request, Response } from 'express';
import { OpeningHours } from '../../model/places/OpeningHours';

class OpeningHoursController {
  static async createOpeningHour(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const openingHour = await OpeningHours.createOpeningHour(data);
      return res.status(201).json({ message: 'Opening hour created successfully', openingHour });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating opening hour', error: error.message });
    }
  }

  static async getOpeningHourById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const openingHour = await OpeningHours.findById(Number(id));
      if (!openingHour) {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(200).json(openingHour);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching opening hour', error: error.message });
    }
  }

  static async getOpeningHoursByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const openingHours = await OpeningHours.findByPlace(Number(placeId));
      return res.status(200).json(openingHours);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching opening hours', error: error.message });
    }
  }

  static async updateOpeningHour(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const openingHour = await OpeningHours.updateOpeningHour(Number(id), data);
      if (!openingHour) {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(200).json({ message: 'Opening hour updated successfully', openingHour });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating opening hour', error: error.message });
    }
  }

  static async deleteOpeningHour(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await OpeningHours.deleteOpeningHour(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Opening hour not found' });
      }
      return res.status(200).json({ message: 'Opening hour deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting opening hour', error: error.message });
    }
  }
}

export default OpeningHoursController;
