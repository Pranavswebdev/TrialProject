require('./setup');
const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/auth/send-otp', () => {
  it('returns 400 for missing phone', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid phone (starts with 5)', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({ phone: '5123456789' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for phone shorter than 10 digits', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({ phone: '987654321' });
    expect(res.status).toBe(400);
  });

  it('returns 200 for valid Indian phone', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({ phone: '9876543210' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('OTP sent');
  });
});

describe('POST /api/v1/auth/verify-otp', () => {
  it('returns 401 for wrong OTP', async () => {
    await request(app).post('/api/v1/auth/send-otp').send({ phone: '9876543210' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phone: '9876543210', otp: '000000' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when phone or otp missing', async () => {
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phone: '9876543210' });
    expect(res.status).toBe(400);
  });
});
