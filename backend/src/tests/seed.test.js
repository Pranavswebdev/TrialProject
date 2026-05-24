const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Restaurant = require('../models/Restaurant');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Seed Data - US-010', () => {
  beforeEach(async () => {
    await Restaurant.deleteMany({});
  });

  test('should seed 10 restaurants with complete data', async () => {
    const seedData = [
      {
        name: 'Pizza Paradise',
        cuisines: ['Italian', 'Pizza'],
        isOpen: true,
        categories: [
          {
            id: 'pizzas',
            name: 'Pizzas',
            items: [
              { id: 'p1', name: 'Margherita', price: 299, isVeg: true, isAvailable: true },
              { id: 'p2', name: 'Pepperoni', price: 349, isVeg: false, isAvailable: true },
              { id: 'p3', name: 'Veggie Supreme', price: 329, isVeg: true, isAvailable: true },
              { id: 'p4', name: 'BBQ Chicken', price: 379, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'sides',
            name: 'Sides & Salads',
            items: [
              { id: 's1', name: 'Garlic Bread', price: 129, isVeg: true, isAvailable: true },
              { id: 's2', name: 'Caesar Salad', price: 199, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Burger Barn',
        cuisines: ['American', 'Burgers'],
        isOpen: true,
        categories: [
          {
            id: 'burgers',
            name: 'Burgers',
            items: [
              { id: 'b1', name: 'Classic Cheeseburger', price: 249, isVeg: false, isAvailable: true },
              { id: 'b2', name: 'Veggie Burger', price: 199, isVeg: true, isAvailable: true },
              { id: 'b3', name: 'Double Burger', price: 349, isVeg: false, isAvailable: true },
              { id: 'b4', name: 'Spicy Chicken Burger', price: 299, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'sides',
            name: 'Sides',
            items: [
              { id: 'b5', name: 'Fries', price: 99, isVeg: true, isAvailable: true },
              { id: 'b6', name: 'Onion Rings', price: 129, isVeg: true, isAvailable: false },
            ],
          },
        ],
      },
      {
        name: 'Biryani House',
        cuisines: ['Indian', 'Biryani'],
        isOpen: true,
        categories: [
          {
            id: 'biryani',
            name: 'Biryani',
            items: [
              { id: 'bi1', name: 'Chicken Biryani', price: 299, isVeg: false, isAvailable: true },
              { id: 'bi2', name: 'Mutton Biryani', price: 349, isVeg: false, isAvailable: true },
              { id: 'bi3', name: 'Veg Biryani', price: 249, isVeg: true, isAvailable: true },
              { id: 'bi4', name: 'Egg Biryani', price: 229, isVeg: true, isAvailable: true },
            ],
          },
          {
            id: 'curries',
            name: 'Curries',
            items: [
              { id: 'bi5', name: 'Butter Chicken', price: 279, isVeg: false, isAvailable: true },
              { id: 'bi6', name: 'Dal Makhani', price: 199, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Dragon Wok',
        cuisines: ['Chinese'],
        isOpen: true,
        categories: [
          {
            id: 'noodles',
            name: 'Noodles',
            items: [
              { id: 'd1', name: 'Hakka Noodles', price: 199, isVeg: true, isAvailable: true },
              { id: 'd2', name: 'Chicken Noodles', price: 249, isVeg: false, isAvailable: true },
              { id: 'd3', name: 'Chow Mein', price: 219, isVeg: true, isAvailable: true },
            ],
          },
          {
            id: 'rice',
            name: 'Fried Rice',
            items: [
              { id: 'd4', name: 'Egg Fried Rice', price: 189, isVeg: true, isAvailable: true },
              { id: 'd5', name: 'Chicken Fried Rice', price: 239, isVeg: false, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Healthy Bowl',
        cuisines: ['Healthy', 'Salads'],
        isOpen: false,
        categories: [
          {
            id: 'bowls',
            name: 'Bowls',
            items: [
              { id: 'h1', name: 'Quinoa Bowl', price: 279, isVeg: true, isAvailable: true },
              { id: 'h2', name: 'Grilled Chicken Bowl', price: 329, isVeg: false, isAvailable: true },
              { id: 'h3', name: 'Vegan Buddha Bowl', price: 249, isVeg: true, isAvailable: true },
            ],
          },
          {
            id: 'smoothies',
            name: 'Smoothies',
            items: [
              { id: 'h4', name: 'Mango Smoothie', price: 129, isVeg: true, isAvailable: true },
              { id: 'h5', name: 'Green Detox', price: 149, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Taco Fiesta',
        cuisines: ['Mexican'],
        isOpen: true,
        categories: [
          {
            id: 'tacos',
            name: 'Tacos',
            items: [
              { id: 't1', name: 'Chicken Tacos', price: 229, isVeg: false, isAvailable: true },
              { id: 't2', name: 'Veggie Tacos', price: 179, isVeg: true, isAvailable: true },
              { id: 't3', name: 'Beef Tacos', price: 259, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'bowls',
            name: 'Bowls',
            items: [
              { id: 't4', name: 'Chicken Burrito Bowl', price: 299, isVeg: false, isAvailable: true },
              { id: 't5', name: 'Veggie Burrito Bowl', price: 249, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Sushi Sensations',
        cuisines: ['Japanese', 'Sushi'],
        isOpen: true,
        categories: [
          {
            id: 'sushi',
            name: 'Sushi Rolls',
            items: [
              { id: 'su1', name: 'California Roll', price: 349, isVeg: false, isAvailable: true },
              { id: 'su2', name: 'Vegetable Roll', price: 279, isVeg: true, isAvailable: true },
              { id: 'su3', name: 'Spicy Tuna Roll', price: 399, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'bowls',
            name: 'Poke Bowls',
            items: [
              { id: 'su4', name: 'Salmon Poke Bowl', price: 429, isVeg: false, isAvailable: true },
              { id: 'su5', name: 'Tofu Poke Bowl', price: 349, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Dessert Delight',
        cuisines: ['Desserts', 'Bakery'],
        isOpen: true,
        categories: [
          {
            id: 'cakes',
            name: 'Cakes',
            items: [
              { id: 'de1', name: 'Chocolate Cake', price: 199, isVeg: true, isAvailable: true },
              { id: 'de2', name: 'Cheesecake', price: 249, isVeg: true, isAvailable: true },
              { id: 'de3', name: 'Carrot Cake', price: 229, isVeg: true, isAvailable: true },
            ],
          },
          {
            id: 'ice_cream',
            name: 'Ice Cream',
            items: [
              { id: 'de4', name: 'Vanilla Scoop', price: 99, isVeg: true, isAvailable: true },
              { id: 'de5', name: 'Chocolate Scoop', price: 99, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Thai Spice',
        cuisines: ['Thai'],
        isOpen: true,
        categories: [
          {
            id: 'curries',
            name: 'Curries',
            items: [
              { id: 'th1', name: 'Green Curry', price: 289, isVeg: true, isAvailable: true },
              { id: 'th2', name: 'Red Curry Chicken', price: 319, isVeg: false, isAvailable: true },
              { id: 'th3', name: 'Massaman Curry', price: 329, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'pad',
            name: 'Pad Thai',
            items: [
              { id: 'th4', name: 'Pad Thai Veg', price: 219, isVeg: true, isAvailable: true },
              { id: 'th5', name: 'Pad Thai Shrimp', price: 299, isVeg: false, isAvailable: true },
            ],
          },
        ],
      },
      {
        name: 'Mediterranean Grill',
        cuisines: ['Mediterranean', 'Greek'],
        isOpen: true,
        categories: [
          {
            id: 'gyros',
            name: 'Gyros',
            items: [
              { id: 'mg1', name: 'Chicken Gyro', price: 249, isVeg: false, isAvailable: true },
              { id: 'mg2', name: 'Vegetable Gyro', price: 199, isVeg: true, isAvailable: true },
              { id: 'mg3', name: 'Lamb Gyro', price: 289, isVeg: false, isAvailable: true },
            ],
          },
          {
            id: 'sides',
            name: 'Sides',
            items: [
              { id: 'mg4', name: 'Hummus & Pita', price: 129, isVeg: true, isAvailable: true },
              { id: 'mg5', name: 'Greek Salad', price: 179, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
    ];

    // Seed the data
    const created = await Restaurant.insertMany(seedData);
    expect(created.length).toBe(10);

    // Verify 10 restaurants exist
    const count = await Restaurant.countDocuments();
    expect(count).toBe(10);

    // Verify each restaurant has at least 2 categories
    const restaurants = await Restaurant.find();
    restaurants.forEach(restaurant => {
      expect(restaurant.categories.length).toBeGreaterThanOrEqual(2);
    });

    // Verify each category has at least 2 menu items
    restaurants.forEach(restaurant => {
      restaurant.categories.forEach(category => {
        expect(category.items.length).toBeGreaterThanOrEqual(2);
      });
    });

    // Verify pricing is realistic (45–599)
    restaurants.forEach(restaurant => {
      restaurant.categories.forEach(category => {
        category.items.forEach(item => {
          expect(item.price).toBeGreaterThanOrEqual(45);
          expect(item.price).toBeLessThanOrEqual(599);
        });
      });
    });

    // Verify at least one item is unavailable
    let hasUnavailable = false;
    restaurants.forEach(restaurant => {
      restaurant.categories.forEach(category => {
        category.items.forEach(item => {
          if (!item.isAvailable) {
            hasUnavailable = true;
          }
        });
      });
    });
    expect(hasUnavailable).toBe(true);
  });

  test('seed script should be idempotent', async () => {
    const testData = [
      {
        name: 'Test Restaurant',
        cuisines: ['Test'],
        isOpen: true,
        categories: [
          {
            id: 'test',
            name: 'Test Category',
            items: [
              { id: 't1', name: 'Test Item', price: 100, isVeg: true, isAvailable: true },
            ],
          },
        ],
      },
    ];

    // Insert once
    await Restaurant.insertMany(testData);
    let countAfterFirst = await Restaurant.countDocuments();

    // Delete and insert again
    await Restaurant.deleteMany({ name: 'Test Restaurant' });
    await Restaurant.insertMany(testData);
    let countAfterSecond = await Restaurant.countDocuments();

    expect(countAfterFirst).toBe(countAfterSecond);
  });
});
