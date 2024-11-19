import { Router } from 'express';
import RestaurantBarController from '../../controller/places/RestaurantBarController';

const router = Router();

router.post('/', RestaurantBarController.createRestaurantBar.bind(RestaurantBarController));
router.get('/:id', RestaurantBarController.getRestaurantBarById.bind(RestaurantBarController));
router.get('/', RestaurantBarController.getAllRestaurantBars.bind(RestaurantBarController));
router.put('/:id', RestaurantBarController.updateRestaurantBar.bind(RestaurantBarController));
router.delete('/:id', RestaurantBarController.deleteRestaurantBar.bind(RestaurantBarController));

export default router;
    