import { Router } from 'express';
import TxPostController from '../../controller/translations/TxPostController';

const router = Router();

router.post('/', TxPostController.createTxPost.bind(TxPostController));
router.get('/post/:postId', TxPostController.getTxPostsByPost.bind(TxPostController));
router.get('/language/:languageId', TxPostController.getTxPostsByLanguage.bind(TxPostController));
router.get('/:postId/:languageId', TxPostController.getTxPost.bind(TxPostController));
router.put('/:postId/:languageId', TxPostController.updateTxPost.bind(TxPostController));
router.delete('/:postId/:languageId', TxPostController.deleteTxPost.bind(TxPostController));

export default router;
