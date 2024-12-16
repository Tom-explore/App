import { Request, Response } from 'express';
import AppDataSource from '../../config/AppDataSource';
import { People } from '../../model/trips/People';

class PeopleController {
  private peopleRepository = AppDataSource.getRepository(People);

  static async createPerson(req: Request, res: Response): Promise<Response> {
    const controller = new PeopleController();
    try {
      const data = req.body;
      const person = controller.peopleRepository.create(data);
      await controller.peopleRepository.save(person);
      return res.status(201).json({ message: 'Person created successfully', person });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error creating person', error: error.message });
    }
  }

  static async getPerson(req: Request, res: Response): Promise<Response> {
    const controller = new PeopleController();
    try {
      const { id } = req.params;
      const person = await controller.peopleRepository.findOne({
        where: { id: Number(id) },
        relations: ['trip'],
      });
      if (!person) return res.status(404).json({ message: 'Person not found' });
      return res.status(200).json(person);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching person', error: error.message });
    }
  }

  static async getPeopleByTrip(req: Request, res: Response): Promise<Response> {
    const controller = new PeopleController();
    try {
      const { tripId } = req.params;
      const people = await controller.peopleRepository.find({
        where: { trip: { id: Number(tripId) } },
        relations: ['trip'],
      });
      return res.status(200).json(people);
    } catch (error: any) {
      return res.status(400).json({ message: 'Error fetching people by trip', error: error.message });
    }
  }

  static async updatePerson(req: Request, res: Response): Promise<Response> {
    const controller = new PeopleController();
    try {
      const { id } = req.params;
      const data = req.body;
      const person = await controller.peopleRepository.findOne({ where: { id: Number(id) } });
      if (!person) return res.status(404).json({ message: 'Person not found' });

      controller.peopleRepository.merge(person, data);
      await controller.peopleRepository.save(person);

      return res.status(200).json({ message: 'Person updated successfully', person });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error updating person', error: error.message });
    }
  }

  static async deletePerson(req: Request, res: Response): Promise<Response> {
    const controller = new PeopleController();
    try {
      const { id } = req.params;
      const person = await controller.peopleRepository.findOne({ where: { id: Number(id) } });
      if (!person) return res.status(404).json({ message: 'Person not found' });

      await controller.peopleRepository.remove(person);
      return res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: 'Error deleting person', error: error.message });
    }
  }
}

export default PeopleController;
