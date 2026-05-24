require('./setup');
const request = require('supertest');
const app = require('../app');
const Restaurant = require('../src/models/Restaurant');
const Category = require('../src/models/Category');
const MenuItem = require('../src/models/MenuItem');

async function createRestaurantWithMenu() {
  const restaurant = await Restaurant.create({
    name: 'Test Pizza',
    cuisine: ['Pizza'],
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 49,
    minOrder: 149,
  });
  const category = await Category.create({ restaurantId: restaurant._id, name: 'Pizzas', sortOrder: 0 });
  await MenuItem.create({ categoryId: category._id, restaurantId: restaurant._id, name: 'Margherita', price: 249, isVeg: true });
  return restaurant;
}

describe('GET /api/v1/restaurants', () => {
  it('returns empty array when no restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns seeded restaurants', async () => {
    await createRestaurantWithMenu();
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Pizza');
  });

  it('filters by cuisine', async () => {
    await Restaurant.create({ name: 'Burger Joint', cuisine: ['Burgers'] });
    await createRestaurantWithMenu();
    const res = await request(app).get('/api/v1/restaurants?cuisine=Burgers');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Burger Joint');
  });

  it('filters by search keyword', async () => {
    await createRestaurantWithMenu();
    await Restaurant.create({ name: 'Biryani House', cuisine: ['Biryani'] });
    const res = await request(app).get('/api/v1/restaurants?search=pizza');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Pizza');
  });
});

describe('GET /api/v1/restaurants/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/restaurants/64f000000000000000000001');
    expect(res.status).toBe(404);
  });

  it('returns restaurant with categories and items', async () => {
    const restaurant = await createRestaurantWithMenu();
    const res = await request(app).get(`/api/v1/restaurants/${restaurant._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Pizza');
    expect(res.body.categories).toHaveLength(1);
    expect(res.body.categories[0].items).toHaveLength(1);
    expect(res.body.categories[0].items[0].name).toBe('Margherita');
  });
});
