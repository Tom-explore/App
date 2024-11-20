import { Router } from 'express';
import TxPlaceController from '../../controller/translations/TxPlaceController';

const router = Router();

router.post('/', TxPlaceController.createTxPlace.bind(TxPlaceController));
router.get('/place/:placeId', TxPlaceController.getTxPlacesByPlace.bind(TxPlaceController));
router.get('/language/:languageId', TxPlaceController.getTxPlacesByLanguage.bind(TxPlaceController));

router.get('/:placeId/:languageId', TxPlaceController.getTxPlace.bind(TxPlaceController));
router.put('/:placeId/:languageId', TxPlaceController.updateTxPlace.bind(TxPlaceController));
router.delete('/:placeId/:languageId', TxPlaceController.deleteTxPlace.bind(TxPlaceController));

export default router;
