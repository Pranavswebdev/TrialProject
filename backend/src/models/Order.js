const mongoose = require('mongoose');

const STATUS_SEQUENCE = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: STATUS_SEQUENCE, default: 'placed' },
  deliveryAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
module.exports.STATUS_SEQUENCE = STATUS_SEQUENCE;
