require('./setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');

async function setup() {
  const user = await User.create({ phone: '9876543210' });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  const restaurant = await Restaurant.create({
    name: 'Test Place',
    cuisine: ['Pizza'],
    deliveryFee: 49,
    minOrder: 99,
  });
  return { user, token, restaurant };
}

describe('POST /api/v1/orders', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/v1/orders').send({});
    expect(res.status).toBe(401);
  });

  it('returns 400 when body is incomplete', async () => {
    const { token } = await setup();
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId: 'abc' });
    expect(res.status).toBe(400);
  });

  it('creates an order and returns status placed', async () => {
    const { token, restaurant } = await setup();
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantId: restaurant._id,
        items: [{ menuItemId: null, name: 'Margherita', price: 249, qty: 2 }],
        deliveryAddress: '12, 3rd Cross, Koramangala',
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('placed');
    expect(res.body.subtotal).toBe(498);
    expect(res.body.deliveryFee).toBe(49);
    expect(res.body.total).toBe(547);
  });
});

describe('PATCH /api/v1/orders/:id/status', () => {
  it('advances status from placed to confirmed', async () => {
    const { token, restaurant } = await setup();
    const create = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantId: restaurant._id,
        items: [{ name: 'Item', price: 100, qty: 1 }],
        deliveryAddress: 'Test address',
      });
    const orderId = create.body._id;
    const res = await request(app)
      .patch(`/api/v1/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  it('rejects skipping a status', async () => {
    const { token, restaurant } = await setup();
    const create = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantId: restaurant._id,
        items: [{ name: 'Item', price: 100, qty: 1 }],
        deliveryAddress: 'Test address',
      });
    const res = await request(app)
      .patch(`/api/v1/orders/${create.body._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'preparing' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/orders', () => {
  it('returns only the current user orders', async () => {
    const { token, restaurant } = await setup();
    await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantId: restaurant._id,
        items: [{ name: 'Item', price: 100, qty: 1 }],
        deliveryAddress: 'Test',
      });
    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
