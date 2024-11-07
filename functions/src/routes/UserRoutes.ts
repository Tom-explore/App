import { Router } from 'express';
import userController from '../controller/UserController'; 

const router = Router();

router.post('/', userController.createUser); 
router.get('/:id', userController.getUserById); 
router.get('/:id/sayHello', userController.sayHello); 
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser); 
router.delete('/:id', userController.deleteUser);

export default router;
