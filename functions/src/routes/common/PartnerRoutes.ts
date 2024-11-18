import { Router } from 'express';
import PartnerController from '../../controller/common/PartnerController';

const router = Router();

router.post('/', PartnerController.createPartner.bind(PartnerController));
router.get('/:id', PartnerController.getPartnerById.bind(PartnerController));
router.get('/', PartnerController.getAllPartners.bind(PartnerController));
router.put('/:id', PartnerController.updatePartner.bind(PartnerController));
router.delete('/:id', PartnerController.deletePartner.bind(PartnerController));

export default router;
