import { Router } from 'express';
import TxCategoryCityLangController from '../../controller/translations/TxCategoryCityLangController';

const router = Router();

router.post('/', TxCategoryCityLangController.createTxCategoryCityLang.bind(TxCategoryCityLangController));
router.get('/:categoryId/:cityId/:languageId', TxCategoryCityLangController.getTxCategoryCityLang.bind(TxCategoryCityLangController));
router.get('/category/:categoryId', TxCategoryCityLangController.getTxCategoryCityLangByCategory.bind(TxCategoryCityLangController));
router.get('/city/:cityId', TxCategoryCityLangController.getTxCategoryCityLangByCity.bind(TxCategoryCityLangController));
router.get('/language/:languageId', TxCategoryCityLangController.getTxCategoryCityLangByLanguage.bind(TxCategoryCityLangController));
router.put('/:categoryId/:cityId/:languageId', TxCategoryCityLangController.updateTxCategoryCityLang.bind(TxCategoryCityLangController));
router.delete('/:categoryId/:cityId/:languageId', TxCategoryCityLangController.deleteTxCategoryCityLang.bind(TxCategoryCityLangController));

export default router;
