import { Router } from 'express';
import AttributeController from '../../controller/categories/AttributeController';

const router = Router();

router.post('/', AttributeController.createAttribute.bind(AttributeController));
router.get('/:id', AttributeController.getAttributeById.bind(AttributeController));
router.get('/', AttributeController.getAllAttributes.bind(AttributeController));
router.put('/:id', AttributeController.updateAttribute.bind(AttributeController));
router.delete('/:id', AttributeController.deleteAttribute.bind(AttributeController));

export default router;
