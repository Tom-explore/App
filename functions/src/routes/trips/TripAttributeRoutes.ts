import { Router } from 'express';
import TripAttributeController from '../../controller/trips/TripAttributeController';

const router = Router();

router.post('/', TripAttributeController.createAttribute.bind(TripAttributeController));
router.get('/attributesbytrip/:tripId', TripAttributeController.getAttributesByTrip.bind(TripAttributeController));
router.get('/:tripId/:attributeId', TripAttributeController.getAttributeById.bind(TripAttributeController));
router.put('/:tripId/:attributeId', TripAttributeController.updateAttribute.bind(TripAttributeController));
router.delete('/:tripId/:attributeId', TripAttributeController.deleteAttribute.bind(TripAttributeController));

export default router;
