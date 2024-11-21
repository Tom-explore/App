import { Router } from 'express';
import TxCategoryController from '../../controller/translations/TxCategoryController';

const router = Router();

router.post('/', TxCategoryController.createTxCategory.bind(TxCategoryController));
router.get('/language/:languageId', TxCategoryController.getTxCategoriesByLanguage.bind(TxCategoryController));
router.get('/category/:categoryId', TxCategoryController.getTxCategoriesByCategory.bind(TxCategoryController));
router.get('/:categoryId/:languageId', TxCategoryController.getTxCategoryByCategoryAndLanguage.bind(TxCategoryController));
router.put('/:categoryId/:languageId', TxCategoryController.updateTxCategory.bind(TxCategoryController));
router.delete('/:categoryId/:languageId', TxCategoryController.deleteTxCategory.bind(TxCategoryController));

export default router;
    