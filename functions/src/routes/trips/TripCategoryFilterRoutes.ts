import { Router } from 'express';
import TripCategoryFilterController from '../../controller/trips/TripCategoryFilterController';

const router = Router();

router.post('/', TripCategoryFilterController.createTripCategoryFilter.bind(TripCategoryFilterController));
router.get('/:tripId/:categoryId', TripCategoryFilterController.getTripCategoryFilter.bind(TripCategoryFilterController));
router.get('/', TripCategoryFilterController.getAllTripCategoryFilters.bind(TripCategoryFilterController));
router.delete('/:tripId/:categoryId', TripCategoryFilterController.deleteTripCategoryFilter.bind(TripCategoryFilterController));

export default router;
