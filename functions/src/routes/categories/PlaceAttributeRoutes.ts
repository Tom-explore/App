import { Router } from 'express';
import PlaceAttributeController from '../../controller/categories/PlaceAttributeController';

const router = Router();

router.post('/', PlaceAttributeController.createPlaceAttribute.bind(PlaceAttributeController));
router.get('/:placeId/:attributeId', PlaceAttributeController.getPlaceAttribute.bind(PlaceAttributeController));
router.get('/:placeId', PlaceAttributeController.getPlaceAttributeByPlace.bind(PlaceAttributeController));
router.put('/:placeId/:attributeId', PlaceAttributeController.updatePlaceAttribute.bind(PlaceAttributeController));
router.delete('/:placeId/:attributeId', PlaceAttributeController.deletePlaceAttribute.bind(PlaceAttributeController));

export default router;
