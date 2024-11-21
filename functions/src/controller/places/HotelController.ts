import { Request, Response } from 'express';
import { Hotel } from '../../model/places/Hotel';

class HotelController {
  static async createHotel(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const hotel = await Hotel.createHotel(data);
      return res.status(201).json({ message: 'Hotel created successfully', hotel });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating hotel', error: error.message });
    }
  }

  static async getHotelById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const hotel = await Hotel.findById(Number(id));
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(200).json(hotel);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching hotel', error: error.message });
    }
  }

  static async getAllHotels(req: Request, res: Response): Promise<Response> {
    try {
      const hotels = await Hotel.findAll();
      return res.status(200).json(hotels);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching hotels', error: error.message });
    }
  }

  static async updateHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const hotel = await Hotel.updateHotel(Number(id), data);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(200).json({ message: 'Hotel updated successfully', hotel });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating hotel', error: error.message });
    }
  }

  static async deleteHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await Hotel.deleteHotel(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
      return res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting hotel', error: error.message });
    }
  }
}

export default HotelController;
