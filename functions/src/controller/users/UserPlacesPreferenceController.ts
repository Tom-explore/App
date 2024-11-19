import { Request, Response } from 'express';
import { UserPlacesPreference } from '../../model/users/UserPlacesPreferences';

class UserPlacesPreferenceController {
  static async createPreference(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const existingPreference = await UserPlacesPreference.findPreferenceById(data.user_id, data.place_id);
      if (existingPreference) {
        return res.status(400).json({ message: 'Preference already exists for this user and place' });
      }
      const preference = await UserPlacesPreference.createPreference(data);
      return res.status(201).json({ message: 'Preference successfully created', preference });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating preference', error: error.message });
    }
  }

  static async getPreference(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;
      const preference = await UserPlacesPreference.findPreferenceById(Number(user_id), Number(place_id));
      if (!preference) {
        return res.status(404).json({ message: 'Preference not found' });
      }
      return res.status(200).json(preference);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching preference', error: error.message });
    }
  }

  static async getPreferencesByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id } = req.params;
      const preferences = await UserPlacesPreference.findPreferencesByUser(Number(user_id));
      return res.status(200).json(preferences);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching preferences by user', error: error.message });
    }
  }

  static async updatePreference(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;
      const data = req.body;
      const updatedPreference = await UserPlacesPreference.updatePreference(
        Number(user_id),
        Number(place_id),
        data
      );
      if (!updatedPreference) {
        return res.status(404).json({ message: 'Preference not found' });
      }
      return res.status(200).json({ message: 'Preference successfully updated', updatedPreference });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating preference', error: error.message });
    }
  }

  static async deletePreference(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id, place_id } = req.params;
      const success = await UserPlacesPreference.deletePreference(Number(user_id), Number(place_id));
      if (!success) {
        return res.status(404).json({ message: 'Preference not found' });
      }
      return res.status(200).json({ message: 'Preference successfully deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting preference', error: error.message });
    }
  }
}

export default UserPlacesPreferenceController;
