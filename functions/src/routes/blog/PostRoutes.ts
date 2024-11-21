import { Router } from 'express';
import PostController from '../../controller/blog/PostController';

const router = Router();

router.post('/', PostController.createPost.bind(PostController));
router.get('/', PostController.getAllPosts.bind(PostController));
router.get('/:id', PostController.getPostById.bind(PostController));
router.put('/:id', PostController.updatePost.bind(PostController));
router.delete('/:id', PostController.deletePost.bind(PostController));

export default router;
