import { Router } from 'express';
import PostCategorizationController from '../../controller/blog/PostCategorizationController';
const router = Router();
router.post(
  '/',
  PostCategorizationController.createCategorization.bind(PostCategorizationController)
);
router.get(
  '/:postId/:categoryId',
  PostCategorizationController.getCategorization.bind(PostCategorizationController)
);
router.get(
  '/post/:postId',
  PostCategorizationController.getCategorizationsByPost.bind(PostCategorizationController)
);
router.put(
  '/:postId/:categoryId',
  PostCategorizationController.updateCategorization.bind(PostCategorizationController)
);
router.delete(
  '/:postId/:categoryId',
  PostCategorizationController.deleteCategorization.bind(PostCategorizationController)
);
export default router;
