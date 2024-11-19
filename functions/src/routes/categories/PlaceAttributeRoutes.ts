import { Router } from 'express';
import PlaceAttributeController from '../../controller/categories/PlaceAttributeController';

const router = Router();

router.post('/', PlaceAttributeController.createPlaceAttribute.bind(PlaceAttributeController));
router.get('/:id', PlaceAttributeController.getPlaceAttribute.bind(PlaceAttributeController));
router.get('/:placeId', PlaceAttributeController.getPlaceAttributeByPlace.bind(PlaceAttributeController));
router.put('/:id', PlaceAttributeController.updatePlaceAttribute.bind(PlaceAttributeController));
router.delete('/:id', PlaceAttributeController.deletePlaceAttribute.bind(PlaceAttributeController));

export default router;
