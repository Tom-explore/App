import { Request, Response } from 'express';
import { CrowdLevels } from '../../model/places/CrowdLevel';

class CrowdLevelController {
  static async createCrowdLevel(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const crowdLevel = await CrowdLevels.createCrowdLevel(data);
      return res.status(201).json({ message: 'Crowd level created successfully', crowdLevel });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating crowd level', error: error.message });
    }
  }

  static async getCrowdLevelById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const crowdLevel = await CrowdLevels.findById(Number(id));
      if (!crowdLevel) {
        return res.status(404).json({ message: 'Crowd level not found' });
      }
      return res.status(200).json(crowdLevel);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching crowd level', error: error.message });
    }
  }

  static async getCrowdLevelsByPlace(req: Request, res: Response): Promise<Response> {
    try {
      const { placeId } = req.params;
      const crowdLevels = await CrowdLevels.findByPlace(Number(placeId));
      return res.status(200).json(crowdLevels);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching crowd levels', error: error.message });
    }
  }

  static async updateCrowdLevel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const crowdLevel = await CrowdLevels.updateCrowdLevel(Number(id), data);
      if (!crowdLevel) {
        return res.status(404).json({ message: 'Crowd level not found' });
      }
      return res.status(200).json({ message: 'Crowd level updated successfully', crowdLevel });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating crowd level', error: error.message });
    }
  }

  static async deleteCrowdLevel(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await CrowdLevels.deleteCrowdLevel(Number(id));
      if (!success) {
        return res.status(404).json({ message: 'Crowd level not found' });
      }
      return res.status(200).json({ message: 'Crowd level deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting crowd level', error: error.message });
    }
  }
}

export default CrowdLevelController;
