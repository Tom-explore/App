import { Router } from 'express';
import CategoryController from '../../controller/categories/CategoryController';

const router = Router();

router.post('/', CategoryController.createCategory.bind(CategoryController));
router.get('/:id', CategoryController.getCategoryById.bind(CategoryController));
router.get('/', CategoryController.getAllCategories.bind(CategoryController));
router.put('/:id', CategoryController.updateCategory.bind(CategoryController));
router.delete('/:id', CategoryController.deleteCategory.bind(CategoryController));

export default router;
