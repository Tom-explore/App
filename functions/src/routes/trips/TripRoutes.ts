import { Router } from 'express';
import TripController from '../../controller/trips/TripController';

const router = Router();

router.post('/', TripController.createTrip.bind(TripController));
router.get('/:id', TripController.getTrip.bind(TripController));
router.get('/user/:userId', TripController.getTripsByUser.bind(TripController));
router.put('/:id', TripController.updateTrip.bind(TripController));
router.delete('/:id', TripController.deleteTrip.bind(TripController));

export default router;
