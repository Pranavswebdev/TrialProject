const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { placeOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/order.controller');

router.use(auth);
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
