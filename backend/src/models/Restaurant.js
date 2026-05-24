const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: Number,
      default: 30,
    },
    deliveryCharge: {
      type: Number,
      default: 40,
    },
    minOrder: {
      type: Number,
      default: 150,
    },
    cuisines: [String],
    isOpen: {
      type: Boolean,
      default: true,
    },
    categories: [
      {
        id: String,
        name: String,
        items: [
          {
            id: String,
            name: String,
            description: String,
            price: Number,
            image: String,
            isVeg: Boolean,
            isAvailable: {
              type: Boolean,
              default: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
