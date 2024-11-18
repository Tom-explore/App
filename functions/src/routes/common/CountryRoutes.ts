import { Router } from 'express';
import CountryController from '../../controller/common/CountryController';

const router = Router();

router.post('/', CountryController.createCountry.bind(CountryController));
router.get('/:id', CountryController.getCountryById.bind(CountryController));
router.get('/', CountryController.getAllCountries.bind(CountryController));
router.put('/:id', CountryController.updateCountry.bind(CountryController));
router.delete('/:id', CountryController.deleteCountry.bind(CountryController));

export default router;
