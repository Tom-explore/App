import { Router } from 'express';
import OpeningHoursController from '../../controller/places/OpeningHoursController';

const router = Router();

router.post('/', OpeningHoursController.createOpeningHour.bind(OpeningHoursController));
router.get('/:id', OpeningHoursController.getOpeningHourById.bind(OpeningHoursController));
router.get('/place/:placeId', OpeningHoursController.getOpeningHoursByPlace.bind(OpeningHoursController));
router.put('/:id', OpeningHoursController.updateOpeningHour.bind(OpeningHoursController));
router.delete('/:id', OpeningHoursController.deleteOpeningHour.bind(OpeningHoursController));

export default router;
