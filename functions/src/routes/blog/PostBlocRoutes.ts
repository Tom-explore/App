import { Router } from 'express';
import PostBlocController from '../../controller/blog/PostBlocController';

const router = Router();

router.post('/', PostBlocController.createPostBloc.bind(PostBlocController));
router.get('/:id', PostBlocController.getPostBlocById.bind(PostBlocController));
router.get('/', PostBlocController.getAllPostBlocs.bind(PostBlocController));
router.put('/:id', PostBlocController.updatePostBloc.bind(PostBlocController));
router.delete('/:id', PostBlocController.deletePostBloc.bind(PostBlocController));

export default router;
