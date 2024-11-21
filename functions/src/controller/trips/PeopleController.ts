import { Request, Response } from 'express';
import { People } from '../../model/trips/People';

class PeopleController {
  static async createPerson(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const person = await People.createPerson(data);
      return res.status(201).json({ message: 'Person created successfully', person });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating person', error: error.message });
    }
  }

  static async getPerson(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const person = await People.findById(Number(id));
      if (!person) return res.status(404).json({ message: 'Person not found' });
      return res.status(200).json(person);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching person', error: error.message });
    }
  }

  static async getPeopleByTrip(req: Request, res: Response): Promise<Response> {
    try {
      const { tripId } = req.params;
      const people = await People.findByTrip(Number(tripId));
      return res.status(200).json(people);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching people by trip', error: error.message });
    }
  }

  static async updatePerson(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const person = await People.updatePerson(Number(id), data);
      if (!person) return res.status(404).json({ message: 'Person not found' });
      return res.status(200).json({ message: 'Person updated successfully', person });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating person', error: error.message });
    }
  }

  static async deletePerson(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const success = await People.deletePerson(Number(id));
      if (!success) return res.status(404).json({ message: 'Person not found' });
      return res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting person', error: error.message });
    }
  }
}

export default PeopleController;
