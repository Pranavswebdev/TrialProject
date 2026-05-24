const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: Number, default: 30 },
  deliveryFee: { type: Number, default: 49 },
  minOrder: { type: Number, default: 99 },
  isOpen: { type: Boolean, default: true },
  imageUrl: { type: String, default: '' },
  address: { type: String, default: '' },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
