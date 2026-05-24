const Order = require('../models/Order');
const { STATUS_SEQUENCE } = require('../models/Order');
const Restaurant = require('../models/Restaurant');

async function placeOrder(req, res) {
  const { restaurantId, items, deliveryAddress } = req.body;
  if (!restaurantId || !items || !items.length || !deliveryAddress) {
    return res.status(400).json({ message: 'restaurantId, items and deliveryAddress are required' });
  }
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;

  const order = await Order.create({
    userId: req.userId,
    restaurantId,
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryAddress,
    status: 'placed',
  });

  return res.status(201).json(order);
}

async function getOrders(req, res) {
  const orders = await Order.find({ userId: req.userId })
    .populate('restaurantId', 'name')
    .sort({ createdAt: -1 })
    .lean();
  return res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, userId: req.userId })
    .populate('restaurantId', 'name deliveryTime')
    .lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });
  return res.json(order);
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!status || !STATUS_SEQUENCE.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
  const nextIdx = STATUS_SEQUENCE.indexOf(status);
  if (nextIdx !== currentIdx + 1) {
    return res.status(400).json({ message: 'Status must advance by exactly one step' });
  }

  order.status = status;
  await order.save();
  return res.json(order);
}

module.exports = { placeOrder, getOrders, getOrder, updateOrderStatus };
