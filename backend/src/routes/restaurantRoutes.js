const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    let query = {};

    if (cuisine) {
      query.cuisines = { $in: [cuisine] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
