import { Router } from 'express';
import PlaceController from '../../controller/places/PlaceController';

const router = Router();

router.post('/', PlaceController.createPlace.bind(PlaceController));
router.get('/:id', PlaceController.getPlaceById.bind(PlaceController));
router.get('/', PlaceController.getAllPlaces.bind(PlaceController));
router.put('/:id', PlaceController.updatePlace.bind(PlaceController));
router.delete('/:id', PlaceController.deletePlace.bind(PlaceController));

export default router;
