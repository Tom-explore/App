import { Router } from 'express';
import TxPostBlocController from '../../controller/translations/TxPostBlocController';

const router = Router();

router.post('/', TxPostBlocController.createTxPostBloc.bind(TxPostBlocController));
router.get('/:postBlocId/:languageId', TxPostBlocController.getTxPostBloc.bind(TxPostBlocController));
router.get('/postbloc/:postBlocId', TxPostBlocController.getTxPostBlocsByPostBloc.bind(TxPostBlocController));
router.get('/language/:languageId', TxPostBlocController.getTxPostBlocsByLanguage.bind(TxPostBlocController));
router.put('/:postBlocId/:languageId', TxPostBlocController.updateTxPostBloc.bind(TxPostBlocController));
router.delete('/:postBlocId/:languageId', TxPostBlocController.deleteTxPostBloc.bind(TxPostBlocController));

export default router;
