import { Router } from 'express';
import PeopleController from '../../controller/trips/PeopleController';

const router = Router();

router.post('/', PeopleController.createPerson.bind(PeopleController));
router.get('/:id', PeopleController.getPerson.bind(PeopleController));
router.get('/trip/:tripId', PeopleController.getPeopleByTrip.bind(PeopleController));
router.put('/:id', PeopleController.updatePerson.bind(PeopleController));
router.delete('/:id', PeopleController.deletePerson.bind(PeopleController));

export default router;
