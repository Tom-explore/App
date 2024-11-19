import { Router } from 'express';
import PlaceImgController from '../../controller/places/PlaceImgController';

const router = Router();

router.post('/', PlaceImgController.createPlaceImg.bind(PlaceImgController));
router.get('/:id', PlaceImgController.getPlaceImgById.bind(PlaceImgController));
router.get('/place/:placeId', PlaceImgController.getPlaceImgsByPlace.bind(PlaceImgController));
router.put('/:id', PlaceImgController.updatePlaceImg.bind(PlaceImgController));
router.delete('/:id', PlaceImgController.deletePlaceImg.bind(PlaceImgController));

export default router;
