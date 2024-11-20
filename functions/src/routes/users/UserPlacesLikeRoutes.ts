import { Router } from 'express';
import UserPlacesLikeController from '../../controller/users/UserPlacesLikeController';

const router = Router();

router.post('/', UserPlacesLikeController.createLike.bind(UserPlacesLikeController));
router.get('/user/:user_id', UserPlacesLikeController.getLikesByUser.bind(UserPlacesLikeController));
router.get('/:user_id/:place_id', UserPlacesLikeController.getLike.bind(UserPlacesLikeController));
router.put('/:user_id/:place_id', UserPlacesLikeController.updateLike.bind(UserPlacesLikeController));
router.delete('/:user_id/:place_id', UserPlacesLikeController.deleteLike.bind(UserPlacesLikeController));

export default router;
