const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
