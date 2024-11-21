import { Router } from 'express';
import PostImgController from '../../controller/blog/PostImgController';

const router = Router();

router.post('/', PostImgController.createPostImg.bind(PostImgController));
router.get('/:id', PostImgController.getPostImgById.bind(PostImgController));
router.get('/', PostImgController.getAllPostImgs.bind(PostImgController));
router.put('/:id', PostImgController.updatePostImg.bind(PostImgController));
router.delete('/:id', PostImgController.deletePostImg.bind(PostImgController));

export default router;
