const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Restaurant = require('../models/Restaurant');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Restaurant.deleteMany({});
});

describe('Restaurant Endpoints', () => {
  describe('GET /api/v1/restaurants', () => {
    it('should return empty array when no restaurants', async () => {
      const res = await request(app).get('/api/v1/restaurants');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should return all restaurants', async () => {
      const restaurants = [
        {
          name: 'Pizza Place',
          cuisines: ['Italian'],
          isOpen: true,
          categories: [
            {
              id: 'pizzas',
              name: 'Pizzas',
              items: [
                { id: 'p1', name: 'Margherita', price: 299, isVeg: true, isAvailable: true },
              ],
            },
          ],
        },
        {
          name: 'Burger Barn',
          cuisines: ['American'],
          isOpen: true,
          categories: [
            {
              id: 'burgers',
              name: 'Burgers',
              items: [
                { id: 'b1', name: 'Cheeseburger', price: 249, isVeg: false, isAvailable: true },
              ],
            },
          ],
        },
      ];

      await Restaurant.insertMany(restaurants);

      const res = await request(app).get('/api/v1/restaurants');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe('Pizza Place');
      expect(res.body[1].name).toBe('Burger Barn');
    });

    it('should include restaurant details', async () => {
      const restaurant = {
        name: 'Test Restaurant',
        rating: 4.5,
        deliveryTime: 30,
        cuisines: ['Test'],
        isOpen: true,
        categories: [
          {
            id: 'cat1',
            name: 'Category 1',
            items: [
              { id: 'i1', name: 'Item 1', price: 100, isVeg: true, isAvailable: true },
            ],
          },
        ],
      };

      await Restaurant.create(restaurant);

      const res = await request(app).get('/api/v1/restaurants');

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('rating');
      expect(res.body[0]).toHaveProperty('deliveryTime');
      expect(res.body[0]).toHaveProperty('categories');
      expect(res.body[0].categories[0].items.length).toBe(1);
    });

    it('should filter restaurants by cuisine', async () => {
      const restaurants = [
        {
          name: 'Pizza Place',
          cuisines: ['Italian', 'Pizza'],
          isOpen: true,
          categories: [
            {
              id: 'pizzas',
              name: 'Pizzas',
              items: [{ id: 'p1', name: 'Margherita', price: 299, isVeg: true, isAvailable: true }],
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
              items: [{ id: 'b1', name: 'Cheeseburger', price: 249, isVeg: false, isAvailable: true }],
            },
          ],
        },
      ];

      await Restaurant.insertMany(restaurants);

      const res = await request(app).get('/api/v1/restaurants?cuisine=Pizza');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Pizza Place');
    });

    it('should search restaurants by name (case-insensitive)', async () => {
      const restaurants = [
        {
          name: 'Pizza Paradise',
          cuisines: ['Italian'],
          isOpen: true,
          categories: [
            {
              id: 'pizzas',
              name: 'Pizzas',
              items: [{ id: 'p1', name: 'Margherita', price: 299, isVeg: true, isAvailable: true }],
            },
          ],
        },
        {
          name: 'Burger Barn',
          cuisines: ['American'],
          isOpen: true,
          categories: [
            {
              id: 'burgers',
              name: 'Burgers',
              items: [{ id: 'b1', name: 'Cheeseburger', price: 249, isVeg: false, isAvailable: true }],
            },
          ],
        },
      ];

      await Restaurant.insertMany(restaurants);

      const res = await request(app).get('/api/v1/restaurants?search=pizza');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Pizza Paradise');
    });

    it('should search restaurants by cuisine name', async () => {
      const restaurants = [
        {
          name: 'Pizza Paradise',
          cuisines: ['Italian'],
          isOpen: true,
          categories: [
            {
              id: 'pizzas',
              name: 'Pizzas',
              items: [{ id: 'p1', name: 'Margherita', price: 299, isVeg: true, isAvailable: true }],
            },
          ],
        },
        {
          name: 'Burger Barn',
          cuisines: ['American'],
          isOpen: true,
          categories: [
            {
              id: 'burgers',
              name: 'Burgers',
              items: [{ id: 'b1', name: 'Cheeseburger', price: 249, isVeg: false, isAvailable: true }],
            },
          ],
        },
      ];

      await Restaurant.insertMany(restaurants);

      const res = await request(app).get('/api/v1/restaurants?search=Italian');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Pizza Paradise');
    });
  });

  describe('GET /api/v1/restaurants/:id', () => {
    it('should return a specific restaurant', async () => {
      const restaurant = await Restaurant.create({
        name: 'Test Restaurant',
        cuisines: ['Test'],
        isOpen: true,
        categories: [
          {
            id: 'cat1',
            name: 'Category 1',
            items: [{ id: 'i1', name: 'Item 1', price: 100, isVeg: true, isAvailable: true }],
          },
        ],
      });

      const res = await request(app).get(`/api/v1/restaurants/${restaurant._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test Restaurant');
      expect(res.body._id).toBe(restaurant._id.toString());
    });

    it('should return 404 for non-existent restaurant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/restaurants/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Restaurant not found');
    });
  });
});
