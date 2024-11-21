import { Router } from 'express';
import UserController from '../../controller/users/UserController';

const router = Router();

router.post('/', UserController.createUser.bind(UserController));
router.get('/:id', UserController.getUserById.bind(UserController));
router.get('/', UserController.getUserByEmail.bind(UserController));
router.put('/:id', UserController.updateUser.bind(UserController));
router.delete('/:id', UserController.deleteUser.bind(UserController));

export default router;
