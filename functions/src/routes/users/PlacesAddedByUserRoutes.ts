import { Router } from 'express';
import PlacesAddedByUserController from '../../controller/users/PlacesAddedByUserController';

const router = Router();

router.post('/', PlacesAddedByUserController.createPlaceAdded.bind(PlacesAddedByUserController));
router.get('/user/:userId', PlacesAddedByUserController.getPlacesAddedByUser.bind(PlacesAddedByUserController));

router.get('/:userId/:placeId', PlacesAddedByUserController.getPlaceAddedById.bind(PlacesAddedByUserController));
router.put('/:userId/:placeId', PlacesAddedByUserController.updatePlaceAdded.bind(PlacesAddedByUserController));
router.delete('/:userId/:placeId', PlacesAddedByUserController.deletePlaceAdded.bind(PlacesAddedByUserController));

export default router;
