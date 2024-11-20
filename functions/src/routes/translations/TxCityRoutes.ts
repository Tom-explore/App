import { Router } from 'express';
import TxCityController from '../../controller/translations/TxCityController';

const router = Router();

router.post('/', TxCityController.createTxCity.bind(TxCityController));
router.get('/city/:cityId', TxCityController.getTxCitiesByCity.bind(TxCityController));
router.get('/language/:languageId', TxCityController.getTxCitiesByLanguage.bind(TxCityController));

router.get('/:cityId/:languageId', TxCityController.getTxCity.bind(TxCityController));
router.put('/:cityId/:languageId', TxCityController.updateTxCity.bind(TxCityController));
router.delete('/:cityId/:languageId', TxCityController.deleteTxCity.bind(TxCityController));

export default router;
