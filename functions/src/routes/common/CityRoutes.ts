import { Router } from 'express';
import CityController from '../../controller/common/CityController';

const router = Router();
router.get('/getall', CityController.getCitiesWithTranslations.bind(CityController));

router.post('/', CityController.createCity.bind(CityController));
router.get('/:id', CityController.getCityById.bind(CityController));

router.get('/', CityController.getAllCities.bind(CityController));
router.put('/:id', CityController.updateCity.bind(CityController));
router.delete('/:id', CityController.deleteCity.bind(CityController));

export default router;
