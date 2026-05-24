const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

async function listRestaurants(req, res) {
  const { cuisine, search } = req.query;
  const filter = {};
  if (cuisine) filter.cuisine = { $in: [cuisine] };
  if (search) {
    const re = new RegExp(search, 'i');
    filter.$or = [{ name: re }, { cuisine: re }];
  }
  const restaurants = await Restaurant.find(filter).lean();
  return res.json(restaurants);
}

async function getRestaurant(req, res) {
  const restaurant = await Restaurant.findById(req.params.id).lean();
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  const categories = await Category.find({ restaurantId: restaurant._id }).sort('sortOrder').lean();
  const categoryIds = categories.map((c) => c._id);
  const items = await MenuItem.find({ categoryId: { $in: categoryIds }, isAvailable: true }).lean();

  const itemsByCategory = {};
  items.forEach((item) => {
    const key = item.categoryId.toString();
    if (!itemsByCategory[key]) itemsByCategory[key] = [];
    itemsByCategory[key].push(item);
  });

  restaurant.categories = categories.map((cat) => ({
    ...cat,
    items: itemsByCategory[cat._id.toString()] || [],
  }));

  return res.json(restaurant);
}

module.exports = { listRestaurants, getRestaurant };
