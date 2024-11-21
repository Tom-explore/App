import { Router } from 'express';
import PlaceCategoryController from '../../controller/categories/PlaceCategoryController';

const router = Router();

router.post('/', PlaceCategoryController.createPlaceCategory.bind(PlaceCategoryController));
router.get('/:id', PlaceCategoryController.getPlaceCategoryById.bind(PlaceCategoryController));
router.get('/place/:placeId', PlaceCategoryController.getPlaceCategoriesByPlace.bind(PlaceCategoryController));
router.get('/category/:categoryId', PlaceCategoryController.getPlaceCategoriesByCategory.bind(PlaceCategoryController));
router.put('/:id', PlaceCategoryController.updatePlaceCategory.bind(PlaceCategoryController));
router.delete('/:id', PlaceCategoryController.deletePlaceCategory.bind(PlaceCategoryController));

export default router;
