import { Router } from 'express';
import TxAttributeController from '../../controller/translations/TxAttributeController';

const router = Router();

router.post('/', TxAttributeController.createTxAttribute.bind(TxAttributeController));
router.get('/attribute/:attributeId', TxAttributeController.getTxAttributesByAttribute.bind(TxAttributeController));
router.get('/language/:languageId', TxAttributeController.getTxAttributesByLanguage.bind(TxAttributeController));
router.get('/:attributeId/:languageId', TxAttributeController.getTxAttributeByAttributeAndLanguage.bind(TxAttributeController));
router.put('/:attributeId/:languageId', TxAttributeController.updateTxAttribute.bind(TxAttributeController));
router.delete('/:attributeId/:languageId', TxAttributeController.deleteTxAttribute.bind(TxAttributeController));

export default router;
