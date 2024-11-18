import { Router } from 'express';
import CrowdLevelController from '../../controller/places/CrowdLevelController';

const router = Router();

router.post('/', CrowdLevelController.createCrowdLevel.bind(CrowdLevelController));
router.get('/:id', CrowdLevelController.getCrowdLevelById.bind(CrowdLevelController));
router.get('/place/:placeId', CrowdLevelController.getCrowdLevelsByPlace.bind(CrowdLevelController));
router.put('/:id', CrowdLevelController.updateCrowdLevel.bind(CrowdLevelController));
router.delete('/:id', CrowdLevelController.deleteCrowdLevel.bind(CrowdLevelController));

export default router;
