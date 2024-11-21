import { Router } from 'express';
import TxPostImgController from '../../controller/translations/TxPostImgController';

const router = Router();

router.post('/', TxPostImgController.createTxPostImg.bind(TxPostImgController));
router.get('/postimg/:postImgId', TxPostImgController.getTxPostImgsByPostImg.bind(TxPostImgController));
router.get('/language/:languageId', TxPostImgController.getTxPostImgsByLanguage.bind(TxPostImgController));

router.get('/:postImgId/:languageId', TxPostImgController.getTxPostImg.bind(TxPostImgController));
router.put('/:postImgId/:languageId', TxPostImgController.updateTxPostImg.bind(TxPostImgController));
router.delete('/:postImgId/:languageId', TxPostImgController.deleteTxPostImg.bind(TxPostImgController));

export default router;
