import { Router } from 'express';
import LanguageController from '../../controller/translations/LanguageController';

const router = Router();

router.post('/', LanguageController.createLanguage.bind(LanguageController));
router.get('/:id', LanguageController.getLanguageById.bind(LanguageController));
router.get('/', LanguageController.getAllLanguages.bind(LanguageController));
router.put('/:id', LanguageController.updateLanguage.bind(LanguageController));
router.delete('/:id', LanguageController.deleteLanguage.bind(LanguageController));

export default router;
