import { Router } from 'express';
import UserPlacesPreferenceController from '../../controller/users/UserPlacesPreferenceController';

const router = Router();

router.post('/', UserPlacesPreferenceController.createPreference.bind(UserPlacesPreferenceController));
router.get('/user/:user_id', UserPlacesPreferenceController.getPreferencesByUser.bind(UserPlacesPreferenceController));
router.get('/:user_id/:place_id', UserPlacesPreferenceController.getPreference.bind(UserPlacesPreferenceController));
router.put('/:user_id/:place_id', UserPlacesPreferenceController.updatePreference.bind(UserPlacesPreferenceController));
router.delete('/:user_id/:place_id', UserPlacesPreferenceController.deletePreference.bind(UserPlacesPreferenceController));

export default router;
