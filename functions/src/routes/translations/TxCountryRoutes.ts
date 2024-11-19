import { Router } from 'express';
import TxCountryController from '../../controller/translations/TxCountryController';

const router = Router();

router.post('/', TxCountryController.createTxCountry.bind(TxCountryController));
router.get('/:countryId/:languageId', TxCountryController.getTxCountry.bind(TxCountryController));
router.get('/country/:countryId', TxCountryController.getTxCountriesByCountry.bind(TxCountryController));
router.get('/language/:languageId', TxCountryController.getTxCountriesByLanguage.bind(TxCountryController));
router.put('/:countryId/:languageId', TxCountryController.updateTxCountry.bind(TxCountryController));
router.delete('/:countryId/:languageId', TxCountryController.deleteTxCountry.bind(TxCountryController));

export default router;
