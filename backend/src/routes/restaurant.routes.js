const router = require('express').Router();
const { listRestaurants, getRestaurant } = require('../controllers/restaurant.controller');

router.get('/', listRestaurants);
router.get('/:id', getRestaurant);

module.exports = router;
