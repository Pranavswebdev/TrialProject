const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

router.use(auth);
router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
