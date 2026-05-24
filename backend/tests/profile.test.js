require('./setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../src/models/User');

async function setupUser() {
  const user = await User.create({ phone: '9876543210', name: 'Test User' });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return { user, token };
}

describe('GET /api/v1/profile', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.status).toBe(401);
  });

  it('returns user profile', async () => {
    const { token } = await setupUser();
    const res = await request(app).get('/api/v1/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('9876543210');
    expect(res.body.name).toBe('Test User');
  });
});

describe('PUT /api/v1/profile', () => {
  it('updates name and defaultAddress', async () => {
    const { token } = await setupUser();
    const res = await request(app)
      .put('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', defaultAddress: '42, MG Road' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.defaultAddress).toBe('42, MG Road');
  });
});
