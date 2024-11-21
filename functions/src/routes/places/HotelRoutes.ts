import { Router } from 'express';
import HotelController from '../../controller/places/HotelController';

const router = Router();

router.post('/', HotelController.createHotel.bind(HotelController));
router.get('/:id', HotelController.getHotelById.bind(HotelController));
router.get('/', HotelController.getAllHotels.bind(HotelController));
router.put('/:id', HotelController.updateHotel.bind(HotelController));
router.delete('/:id', HotelController.deleteHotel.bind(HotelController));

export default router;
