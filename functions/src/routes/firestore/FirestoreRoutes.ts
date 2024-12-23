import { Router } from 'express';
import FirestoreController from '../../controller/firestore/FirestoreController'; // Chemin corrigé

const router = Router();

router.post('/hello', FirestoreController.writeHelloWorld.bind(FirestoreController));

export default router;
