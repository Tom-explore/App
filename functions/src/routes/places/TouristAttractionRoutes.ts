import { Router } from 'express';
import TouristAttractionController from '../../controller/places/TouristAttractionController';

const router = Router();

router.post('/', TouristAttractionController.createTouristAttraction.bind(TouristAttractionController));
router.get('/:id', TouristAttractionController.getTouristAttractionById.bind(TouristAttractionController));
router.get('/', TouristAttractionController.getAllTouristAttractions.bind(TouristAttractionController));
router.put('/:id', TouristAttractionController.updateTouristAttraction.bind(TouristAttractionController));
router.delete('/:id', TouristAttractionController.deleteTouristAttraction.bind(TouristAttractionController));

export default router;
