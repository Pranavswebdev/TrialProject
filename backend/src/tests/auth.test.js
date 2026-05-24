const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../models/User');
const { otpStore } = require('../controllers/authController');

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
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/send-otp', () => {
    it('should send OTP for valid Indian phone', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phone: '+919876543210' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('OTP sent successfully');
    });

    it('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phone: '+911234567890' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid');
    });

    it('should reject missing phone', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/auth/verify-otp', () => {
    it('should verify OTP and return token', async () => {
      const phone = '+919876543210';

      await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phone });

      const actualOtp = otpStore.get(phone).otp;

      const sendRes = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone, otp: actualOtp });

      expect(sendRes.statusCode).toBe(200);
      expect(sendRes.body).toHaveProperty('token');
      expect(sendRes.body).toHaveProperty('user');
      expect(sendRes.body.user.phone).toBe(phone);
    });

    it('should create user on first OTP verification', async () => {
      const phone = '+919876543210';

      await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phone });

      const initialUser = await User.findOne({ phone });
      expect(initialUser).toBeNull();

      const actualOtp = otpStore.get(phone).otp;

      await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone, otp: actualOtp });

      const createdUser = await User.findOne({ phone });
      expect(createdUser).not.toBeNull();
    });

    it('should reject invalid OTP', async () => {
      const phone = '+919876543210';

      await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phone });

      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone, otp: '999999' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid OTP');
    });

    it('should reject missing OTP', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phone: '+919876543210' });

      expect(res.statusCode).toBe(400);
    });
  });
});
