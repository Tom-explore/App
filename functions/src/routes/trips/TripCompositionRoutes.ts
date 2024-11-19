import { Router } from 'express';
import TripCompositionController from '../../controller/trips/TripCompositionController';

const router = Router();

router.post('/', TripCompositionController.createComposition.bind(TripCompositionController));
router.get('/:tripId/:day/:position', TripCompositionController.getComposition.bind(TripCompositionController));
router.get('/trip/:tripId', TripCompositionController.getCompositionsByTrip.bind(TripCompositionController));
router.put('/:tripId/:day/:position', TripCompositionController.updateComposition.bind(TripCompositionController));
router.delete('/:tripId/:day/:position', TripCompositionController.deleteComposition.bind(TripCompositionController));

export default router;
