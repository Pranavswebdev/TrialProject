# FoodRush Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the FoodRush REST API — phone OTP auth, seeded restaurants/menus, order placement with status tracking, user profile.

**Architecture:** Express.js REST API with MongoDB via Mongoose. OTPs stored in a JavaScript Map with 5-minute TTL. JWT auth (7-day expiry) on protected routes. Configured for Render deployment with MongoDB Atlas.

**Tech Stack:** Node.js 18, Express 4, Mongoose 8, jsonwebtoken, cors, helmet, dotenv, Jest + Supertest + mongodb-memory-server (tests)

---

## File Map

| File | Responsibility |
|------|----------------|
| `backend/server.js` | Connect to MongoDB, start HTTP server |
| `backend/app.js` | Express setup, middleware, route mounting |
| `backend/src/models/User.js` | User schema — phone, name, defaultAddress |
| `backend/src/models/Restaurant.js` | Restaurant schema |
| `backend/src/models/Category.js` | Menu category, belongs to restaurant |
| `backend/src/models/MenuItem.js` | Menu item, belongs to category + restaurant |
| `backend/src/models/Order.js` | Order with 5-status enum |
| `backend/src/utils/otpStore.js` | In-memory Map: phone → {otp, expiresAt} |
| `backend/src/middleware/auth.middleware.js` | Verify JWT Bearer token, attach req.userId |
| `backend/src/controllers/auth.controller.js` | sendOtp, verifyOtpHandler |
| `backend/src/routes/auth.routes.js` | POST /send-otp, POST /verify-otp |
| `backend/src/controllers/restaurant.controller.js` | listRestaurants, getRestaurant |
| `backend/src/routes/restaurant.routes.js` | GET /, GET /:id |
| `backend/src/controllers/order.controller.js` | placeOrder, listOrders, getOrder, updateOrderStatus |
| `backend/src/routes/order.routes.js` | POST /, GET /, GET /:id, PATCH /:id/status |
| `backend/src/controllers/profile.controller.js` | getProfile, updateProfile |
| `backend/src/routes/profile.routes.js` | GET /, PUT / |
| `backend/src/seed/seed.js` | Seed 10 restaurants with categories and menu items |
| `backend/tests/auth.test.js` | Auth endpoint tests |
| `backend/tests/restaurant.test.js` | Restaurant endpoint tests |
| `backend/tests/order.test.js` | Order endpoint tests |
| `backend/tests/profile.test.js` | Profile endpoint tests |

---

### Task 1: Project Setup & Server Skeleton

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env.example`
- Create: `backend/.gitignore`
- Create: `backend/app.js`
- Create: `backend/server.js`
- Create: `backend/src/routes/auth.routes.js` (stub)
- Create: `backend/src/routes/restaurant.routes.js` (stub)
- Create: `backend/src/routes/order.routes.js` (stub)
- Create: `backend/src/routes/profile.routes.js` (stub)

- [ ] **Step 1: Install dependencies**

```bash
cd backend
npm init -y
npm install express mongoose jsonwebtoken cors helmet dotenv
npm install -D jest supertest mongodb-memory-server
```

- [ ] **Step 2: Update package.json scripts and jest config**

Edit `backend/package.json` — set the `scripts` and add `jest` config:
```json
{
  "name": "foodrush-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "seed": "node src/seed/seed.js",
    "test": "jest --runInBand --forceExit"
  },
  "jest": {
    "testEnvironment": "node",
    "testTimeout": 30000
  }
}
```

- [ ] **Step 3: Create .env.example and local .env**

Create `backend/.env.example`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodrush
JWT_SECRET=change_me_in_production
NODE_ENV=development
```

Copy to `backend/.env` with real local values (keep JWT_SECRET as any string for local dev).

- [ ] **Step 4: Create .gitignore**

Create `backend/.gitignore`:
```
node_modules/
.env
```

- [ ] **Step 5: Create stub route files**

Create `backend/src/routes/auth.routes.js`:
```js
const router = require('express').Router();
module.exports = router;
```

Create `backend/src/routes/restaurant.routes.js`:
```js
const router = require('express').Router();
module.exports = router;
```

Create `backend/src/routes/order.routes.js`:
```js
const router = require('express').Router();
module.exports = router;
```

Create `backend/src/routes/profile.routes.js`:
```js
const router = require('express').Router();
module.exports = router;
```

- [ ] **Step 6: Create app.js**

Create `backend/app.js`:
```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./src/routes/auth.routes');
const restaurantRoutes = require('./src/routes/restaurant.routes');
const orderRoutes = require('./src/routes/order.routes');
const profileRoutes = require('./src/routes/profile.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/profile', profileRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
```

- [ ] **Step 7: Create server.js**

Create `backend/server.js`:
```js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrush';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
```

- [ ] **Step 8: Verify health endpoint works**

```bash
node server.js &
curl http://localhost:5000/health
```
Expected: `{"status":"ok"}`

- [ ] **Step 9: Commit**

```bash
git add backend/
git commit -m "feat(backend): project setup, express app skeleton, env config"
```

---

### Task 2: MongoDB Models

**Files:**
- Create: `backend/src/models/User.js`
- Create: `backend/src/models/Restaurant.js`
- Create: `backend/src/models/Category.js`
- Create: `backend/src/models/MenuItem.js`
- Create: `backend/src/models/Order.js`

- [ ] **Step 1: Create User model**

Create `backend/src/models/User.js`:
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, match: /^[6-9]\d{9}$/ },
  name: { type: String, default: '' },
  defaultAddress: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

- [ ] **Step 2: Create Restaurant model**

Create `backend/src/models/Restaurant.js`:
```js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  deliveryTime: { type: Number, default: 30 },
  deliveryFee: { type: Number, default: 30 },
  minOrder: { type: Number, default: 99 },
  isOpen: { type: Boolean, default: true },
  imageUrl: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
```

- [ ] **Step 3: Create Category model**

Create `backend/src/models/Category.js`:
```js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
});

module.exports = mongoose.model('Category', categorySchema);
```

- [ ] **Step 4: Create MenuItem model**

Create `backend/src/models/MenuItem.js`:
```js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
```

- [ ] **Step 5: Create Order model**

Create `backend/src/models/Order.js`:
```js
const mongoose = require('mongoose');

const ORDER_STATUSES = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ORDER_STATUSES, default: 'placed' },
  deliveryAddress: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/models/
git commit -m "feat(backend): Mongoose models — User, Restaurant, Category, MenuItem, Order"
```

---

### Task 3: OTP Store + Auth Middleware + Auth Tests

**Files:**
- Create: `backend/src/utils/otpStore.js`
- Create: `backend/src/middleware/auth.middleware.js`
- Create: `backend/tests/auth.test.js`

- [ ] **Step 1: Create OTP in-memory store**

Create `backend/src/utils/otpStore.js`:
```js
const store = new Map();

function setOtp(phone, otp) {
  store.set(phone, { otp: String(otp), expiresAt: Date.now() + 5 * 60 * 1000 });
}

function verifyOtp(phone, otp) {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) { store.delete(phone); return false; }
  if (entry.otp !== String(otp)) return false;
  store.delete(phone);
  return true;
}

module.exports = { setOtp, verifyOtp };
```

- [ ] **Step 2: Create auth middleware**

Create `backend/src/middleware/auth.middleware.js`:
```js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

module.exports = authMiddleware;
```

- [ ] **Step 3: Write auth tests**

Create `backend/tests/auth.test.js`:
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const { setOtp } = require('../src/utils/otpStore');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

describe('POST /api/v1/auth/send-otp', () => {
  it('returns 200 for valid Indian phone number', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({ phone: '9876543210' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/otp sent/i);
  });

  it('returns 400 for invalid phone', async () => {
    const res = await request(app).post('/api/v1/auth/send-otp').send({ phone: '12345' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/verify-otp', () => {
  it('returns token and user for correct OTP', async () => {
    setOtp('9876543210', '123456');
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: '9876543210', otp: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.phone).toBe('9876543210');
  });

  it('creates user if first login', async () => {
    setOtp('9111111111', '654321');
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: '9111111111', otp: '654321' });
    expect(res.status).toBe(200);
    expect(res.body.user._id).toBeDefined();
  });

  it('returns 400 for wrong OTP', async () => {
    setOtp('9876543210', '111111');
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: '9876543210', otp: '999999' });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 4: Run tests — expect FAIL (routes are stubs)**

```bash
cd backend && npm test -- --testPathPattern=auth
```
Expected: FAIL — routes return 404

- [ ] **Step 5: Commit**

```bash
git add backend/src/utils/ backend/src/middleware/ backend/tests/auth.test.js
git commit -m "feat(backend): OTP store, auth middleware, auth tests (failing — routes pending)"
```

---

### Task 4: Auth Controller + Routes

**Files:**
- Create: `backend/src/controllers/auth.controller.js`
- Modify: `backend/src/routes/auth.routes.js`

- [ ] **Step 1: Implement auth controller**

Create `backend/src/controllers/auth.controller.js`:
```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { setOtp, verifyOtp } = require('../utils/otpStore');

async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number. Must be a 10-digit Indian mobile number.' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  setOtp(phone, otp);
  console.log(`[OTP] ${phone} → ${otp}`);
  return res.json({ message: 'OTP sent successfully' });
}

async function verifyOtpHandler(req, res) {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }
  const valid = verifyOtp(phone, otp);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
  return res.json({
    token,
    user: { _id: user._id, phone: user.phone, name: user.name, defaultAddress: user.defaultAddress },
  });
}

module.exports = { sendOtp, verifyOtpHandler };
```

- [ ] **Step 2: Wire auth routes**

Replace `backend/src/routes/auth.routes.js`:
```js
const router = require('express').Router();
const { sendOtp, verifyOtpHandler } = require('../controllers/auth.controller');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;
```

- [ ] **Step 3: Run auth tests — expect PASS**

```bash
cd backend && npm test -- --testPathPattern=auth
```
Expected: PASS — 5 tests green

- [ ] **Step 4: Commit**

```bash
git add backend/src/controllers/auth.controller.js backend/src/routes/auth.routes.js
git commit -m "feat(backend): auth endpoints — send-otp, verify-otp, JWT issue"
```

---

### Task 5: Restaurant Controller + Routes

**Files:**
- Create: `backend/src/controllers/restaurant.controller.js`
- Modify: `backend/src/routes/restaurant.routes.js`
- Create: `backend/tests/restaurant.test.js`

- [ ] **Step 1: Write failing restaurant tests**

Create `backend/tests/restaurant.test.js`:
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Restaurant = require('../src/models/Restaurant');
const Category = require('../src/models/Category');
const MenuItem = require('../src/models/MenuItem');

let mongod, restaurantId;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const r = await Restaurant.create({
    name: 'Pizza Palace', cuisine: ['Pizza'], rating: 4.3,
    deliveryTime: 30, deliveryFee: 30, minOrder: 199, isOpen: true,
  });
  restaurantId = r._id;
  const cat = await Category.create({ restaurantId: r._id, name: 'Classic Pizzas', sortOrder: 0 });
  await MenuItem.create({
    categoryId: cat._id, restaurantId: r._id,
    name: 'Margherita', description: 'Classic tomato', price: 249, isVeg: true, isAvailable: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('GET /api/v1/restaurants', () => {
  it('returns list of all restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Pizza Palace');
  });

  it('filters by cuisine query param', async () => {
    const res = await request(app).get('/api/v1/restaurants?cuisine=Burgers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('filters by search query param', async () => {
    const res = await request(app).get('/api/v1/restaurants?search=pizza');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Pizza Palace');
  });
});

describe('GET /api/v1/restaurants/:id', () => {
  it('returns restaurant with nested menu', async () => {
    const res = await request(app).get(`/api/v1/restaurants/${restaurantId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Pizza Palace');
    expect(res.body.menu).toHaveLength(1);
    expect(res.body.menu[0].name).toBe('Classic Pizzas');
    expect(res.body.menu[0].items).toHaveLength(1);
    expect(res.body.menu[0].items[0].name).toBe('Margherita');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get(`/api/v1/restaurants/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend && npm test -- --testPathPattern=restaurant
```
Expected: FAIL

- [ ] **Step 3: Implement restaurant controller**

Create `backend/src/controllers/restaurant.controller.js`:
```js
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

async function listRestaurants(req, res) {
  const { cuisine, search } = req.query;
  const filter = {};
  if (cuisine) filter.cuisine = { $in: [cuisine] };
  if (search) filter.name = { $regex: search, $options: 'i' };
  const restaurants = await Restaurant.find(filter).sort({ rating: -1 });
  return res.json(restaurants);
}

async function getRestaurant(req, res) {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

  const categories = await Category.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 });
  const menu = await Promise.all(
    categories.map(async (cat) => {
      const items = await MenuItem.find({ categoryId: cat._id, isAvailable: true });
      return { _id: cat._id, name: cat.name, sortOrder: cat.sortOrder, items };
    })
  );
  return res.json({ ...restaurant.toObject(), menu });
}

module.exports = { listRestaurants, getRestaurant };
```

- [ ] **Step 4: Wire restaurant routes**

Replace `backend/src/routes/restaurant.routes.js`:
```js
const router = require('express').Router();
const { listRestaurants, getRestaurant } = require('../controllers/restaurant.controller');

router.get('/', listRestaurants);
router.get('/:id', getRestaurant);

module.exports = router;
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd backend && npm test -- --testPathPattern=restaurant
```
Expected: PASS — 5 tests green

- [ ] **Step 6: Commit**

```bash
git add backend/src/controllers/restaurant.controller.js backend/src/routes/restaurant.routes.js backend/tests/restaurant.test.js
git commit -m "feat(backend): restaurant list + detail endpoints with nested menu"
```

---

### Task 6: Seed Script

**Files:**
- Create: `backend/src/seed/seed.js`

- [ ] **Step 1: Write seed script**

Create `backend/src/seed/seed.js`:
```js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrush';

const RESTAURANTS = [
  {
    name: 'Pizza Palace', cuisine: ['Pizza', 'Italian'], rating: 4.3,
    deliveryTime: 30, deliveryFee: 30, minOrder: 199, isOpen: true, address: '12 MG Road, Bengaluru',
    categories: [
      { name: 'Classic Pizzas', items: [
        { name: 'Margherita', description: 'Tomato sauce, mozzarella, fresh basil', price: 249, isVeg: true },
        { name: 'Farmhouse', description: 'Capsicum, mushroom, onion, tomato', price: 299, isVeg: true },
        { name: 'Pepperoni', description: 'Spicy pepperoni, mozzarella, tomato base', price: 349, isVeg: false },
        { name: 'BBQ Chicken', description: 'Smoky BBQ sauce, grilled chicken strips', price: 399, isVeg: false },
      ]},
      { name: 'Pasta & Sides', items: [
        { name: 'Penne Arrabbiata', description: 'Spicy tomato pasta, fresh herbs', price: 199, isVeg: true },
        { name: 'Garlic Bread', description: 'Toasted sourdough with herb butter', price: 99, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Burger Barn', cuisine: ['Burgers', 'American'], rating: 4.1,
    deliveryTime: 25, deliveryFee: 20, minOrder: 149, isOpen: true, address: '45 Koramangala, Bengaluru',
    categories: [
      { name: 'Veg Burgers', items: [
        { name: 'Crispy Veggie Burger', description: 'Crispy veggie patty, lettuce, tomato, mayo', price: 149, isVeg: true },
        { name: 'Mushroom Swiss Burger', description: 'Sautéed mushroom, Swiss cheese, brioche bun', price: 179, isVeg: true },
      ]},
      { name: 'Chicken Burgers', items: [
        { name: 'Classic Chicken Burger', description: 'Grilled chicken breast, coleslaw, pickles', price: 199, isVeg: false },
        { name: 'Spicy Sriracha Burger', description: 'Crispy chicken, sriracha mayo, jalapeños', price: 229, isVeg: false },
        { name: 'Double Patty Smash', description: 'Two smashed patties, American cheese, special sauce', price: 299, isVeg: false },
      ]},
      { name: 'Sides', items: [
        { name: 'Loaded Fries', description: 'Crispy fries, cheese sauce, jalapeños', price: 129, isVeg: true },
        { name: 'Onion Rings', description: 'Crispy beer-battered onion rings', price: 99, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Biryani Bros', cuisine: ['Biryani', 'Mughlai'], rating: 4.5,
    deliveryTime: 40, deliveryFee: 40, minOrder: 249, isOpen: true, address: '78 Frazer Town, Bengaluru',
    categories: [
      { name: 'Biryani', items: [
        { name: 'Veg Dum Biryani', description: 'Aromatic basmati, seasonal veggies, saffron', price: 249, isVeg: true },
        { name: 'Chicken Biryani', description: 'Classic Hyderabadi dum biryani', price: 299, isVeg: false },
        { name: 'Mutton Biryani', description: 'Slow-cooked mutton, fragrant spices', price: 399, isVeg: false },
        { name: 'Prawn Biryani', description: 'Fresh prawns, coastal spices, raita', price: 449, isVeg: false },
      ]},
      { name: 'Accompaniments', items: [
        { name: 'Raita', description: 'Cool yogurt with cucumber and mint', price: 59, isVeg: true },
        { name: 'Mirchi Ka Salan', description: 'Traditional green chilli gravy', price: 79, isVeg: true },
        { name: 'Shorba', description: 'Spiced broth, served hot', price: 69, isVeg: false },
      ]},
    ],
  },
  {
    name: 'Noodle House', cuisine: ['Chinese', 'Asian'], rating: 4.0,
    deliveryTime: 30, deliveryFee: 25, minOrder: 199, isOpen: true, address: '23 Indiranagar, Bengaluru',
    categories: [
      { name: 'Noodles', items: [
        { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with mixed vegetables', price: 179, isVeg: true },
        { name: 'Chicken Chow Mein', description: 'Wok-tossed noodles with tender chicken', price: 229, isVeg: false },
        { name: 'Schezwan Noodles', description: 'Fiery Schezwan sauce, mixed veggies', price: 199, isVeg: true },
      ]},
      { name: 'Fried Rice', items: [
        { name: 'Egg Fried Rice', description: 'Wok-tossed rice with scrambled egg', price: 199, isVeg: false },
        { name: 'Veg Fried Rice', description: 'Classic vegetable fried rice', price: 169, isVeg: true },
        { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken strips', price: 229, isVeg: false },
      ]},
      { name: 'Starters', items: [
        { name: 'Veg Manchurian', description: 'Crispy balls in tangy Manchurian sauce', price: 199, isVeg: true },
        { name: 'Chicken Spring Rolls', description: 'Crispy rolls with sweet chili dip', price: 229, isVeg: false },
      ]},
    ],
  },
  {
    name: 'Dosa Delight', cuisine: ['South Indian'], rating: 4.6,
    deliveryTime: 20, deliveryFee: 20, minOrder: 99, isOpen: true, address: '56 Basavanagudi, Bengaluru',
    categories: [
      { name: 'Dosas', items: [
        { name: 'Plain Dosa', description: 'Crispy rice crepe with sambar and chutney', price: 99, isVeg: true },
        { name: 'Masala Dosa', description: 'Spiced potato filling, coconut chutney', price: 129, isVeg: true },
        { name: 'Ghee Roast Dosa', description: 'Rich ghee roasted ultra-crispy dosa', price: 149, isVeg: true },
        { name: 'Onion Rava Dosa', description: 'Instant rava dosa with caramelised onion', price: 139, isVeg: true },
      ]},
      { name: 'Idli & Vada', items: [
        { name: 'Idli (2 pcs)', description: 'Fluffy steamed rice cakes, sambar, chutney', price: 79, isVeg: true },
        { name: 'Medu Vada (2 pcs)', description: 'Crispy lentil donuts, sambar', price: 89, isVeg: true },
        { name: 'Idli Vada Combo', description: '2 idli + 1 vada, sambar, 2 chutneys', price: 129, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Green Bowl', cuisine: ['Healthy', 'Salads'], rating: 4.4,
    deliveryTime: 25, deliveryFee: 35, minOrder: 199, isOpen: true, address: '34 HSR Layout, Bengaluru',
    categories: [
      { name: 'Salad Bowls', items: [
        { name: 'Classic Caesar Salad', description: 'Romaine, croutons, Parmesan, Caesar dressing', price: 249, isVeg: true },
        { name: 'Quinoa Power Bowl', description: 'Quinoa, roasted veggies, tahini dressing', price: 299, isVeg: true },
        { name: 'Grilled Chicken Salad', description: 'Mixed greens, grilled chicken, balsamic vinaigrette', price: 329, isVeg: false },
      ]},
      { name: 'Wraps', items: [
        { name: 'Hummus Veggie Wrap', description: 'Hummus, roasted peppers, spinach, wholewheat', price: 229, isVeg: true },
        { name: 'Grilled Chicken Wrap', description: 'Grilled chicken, avocado, fresh greens', price: 279, isVeg: false },
      ]},
      { name: 'Smoothies', items: [
        { name: 'Green Detox Smoothie', description: 'Spinach, apple, ginger, lemon, chia', price: 179, isVeg: true },
        { name: 'Berry Blast Smoothie', description: 'Mixed berries, banana, almond milk', price: 199, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Sweet Tooth', cuisine: ['Desserts', 'Bakes'], rating: 4.7,
    deliveryTime: 20, deliveryFee: 25, minOrder: 149, isOpen: true, address: '89 Whitefield, Bengaluru',
    categories: [
      { name: 'Cakes & Pastries', items: [
        { name: 'Chocolate Truffle Cake', description: 'Rich dark chocolate ganache, cocoa sponge', price: 349, isVeg: true },
        { name: 'Blueberry Cheesecake', description: 'New York style, fresh blueberry compote', price: 299, isVeg: true },
        { name: 'Red Velvet Slice', description: 'Classic red velvet, cream cheese frosting', price: 199, isVeg: true },
      ]},
      { name: 'Frozen Treats', items: [
        { name: 'Mango Sorbet', description: 'Fresh Alphonso mango sorbet, seasonal', price: 149, isVeg: true },
        { name: 'Kulfi on Stick', description: 'Traditional pistachio kulfi, rose syrup', price: 99, isVeg: true },
        { name: 'Brownie Sundae', description: 'Warm fudge brownie, vanilla ice cream, hot fudge', price: 249, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Spice Garden', cuisine: ['Indian', 'Curry'], rating: 4.2,
    deliveryTime: 35, deliveryFee: 30, minOrder: 199, isOpen: true, address: '67 Jayanagar, Bengaluru',
    categories: [
      { name: 'Curries', items: [
        { name: 'Paneer Butter Masala', description: 'Soft paneer in rich, creamy tomato gravy', price: 279, isVeg: true },
        { name: 'Dal Makhani', description: 'Slow-cooked black lentils, cream, butter', price: 229, isVeg: true },
        { name: 'Butter Chicken', description: 'Tender chicken in silky makhani gravy', price: 329, isVeg: false },
        { name: 'Lamb Rogan Josh', description: 'Aromatic Kashmiri lamb curry, whole spices', price: 399, isVeg: false },
      ]},
      { name: 'Breads', items: [
        { name: 'Butter Naan', description: 'Tandoor-baked, finished with butter', price: 49, isVeg: true },
        { name: 'Garlic Naan', description: 'Fresh garlic, coriander butter', price: 59, isVeg: true },
        { name: 'Lachha Paratha', description: 'Layered whole-wheat flatbread', price: 55, isVeg: true },
      ]},
      { name: 'Rice', items: [
        { name: 'Steamed Basmati Rice', description: 'Long-grain fragrant basmati', price: 79, isVeg: true },
        { name: 'Jeera Rice', description: 'Basmati rice tempered with cumin', price: 99, isVeg: true },
      ]},
    ],
  },
  {
    name: 'Wok & Roll', cuisine: ['Chinese', 'Thai'], rating: 4.1,
    deliveryTime: 30, deliveryFee: 30, minOrder: 199, isOpen: true, address: '22 Electronic City, Bengaluru',
    categories: [
      { name: 'Thai Curries', items: [
        { name: 'Green Thai Curry (Veg)', description: 'Coconut milk, green curry paste, vegetables', price: 299, isVeg: true },
        { name: 'Red Thai Curry (Chicken)', description: 'Red curry paste, tender chicken, basil', price: 349, isVeg: false },
        { name: 'Massaman Lamb Curry', description: 'Rich, nutty Massaman curry, potatoes', price: 399, isVeg: false },
      ]},
      { name: 'Dimsums', items: [
        { name: 'Veg Dimsums (6 pcs)', description: 'Steamed crystal dumplings, chili oil', price: 199, isVeg: true },
        { name: 'Chicken Dimsums (6 pcs)', description: 'Juicy chicken and ginger dumplings', price: 249, isVeg: false },
        { name: 'Prawn Har Gow (4 pcs)', description: 'Classic Cantonese shrimp dumplings', price: 279, isVeg: false },
      ]},
    ],
  },
  {
    name: 'Crave Kitchen', cuisine: ['Continental', 'Multi-cuisine'], rating: 4.3,
    deliveryTime: 35, deliveryFee: 35, minOrder: 249, isOpen: true, address: '15 Marathahalli, Bengaluru',
    categories: [
      { name: 'Sandwiches', items: [
        { name: 'Club Sandwich', description: 'Triple-decker, grilled chicken, egg, veggies', price: 229, isVeg: false },
        { name: 'Grilled Cheese Sandwich', description: 'Sourdough, cheddar, mozzarella, smoked gouda', price: 179, isVeg: true },
        { name: 'BLT Wrap', description: 'Bacon, lettuce, tomato, chipotle mayo', price: 249, isVeg: false },
      ]},
      { name: 'Mains', items: [
        { name: 'Spaghetti Bolognese', description: 'Slow-cooked beef ragù, Parmesan', price: 349, isVeg: false },
        { name: 'Mushroom Risotto', description: 'Arborio rice, wild mushrooms, truffle oil', price: 329, isVeg: true },
        { name: 'Grilled Salmon', description: 'Atlantic salmon fillet, lemon butter, asparagus', price: 499, isVeg: false },
        { name: 'Roasted Chicken', description: 'Half chicken, herb jus, seasonal veggies', price: 399, isVeg: false },
      ]},
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Restaurant.deleteMany({});
  await Category.deleteMany({});
  await MenuItem.deleteMany({});
  console.log('Cleared existing data');

  for (const data of RESTAURANTS) {
    const { categories, ...restaurantData } = data;
    const restaurant = await Restaurant.create(restaurantData);
    for (let i = 0; i < categories.length; i++) {
      const { items, ...categoryData } = categories[i];
      const category = await Category.create({ ...categoryData, restaurantId: restaurant._id, sortOrder: i });
      for (const item of items) {
        await MenuItem.create({ ...item, categoryId: category._id, restaurantId: restaurant._id });
      }
    }
    console.log(`Seeded: ${restaurant.name}`);
  }

  console.log('✓ Seed complete — 10 restaurants loaded');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run seed against local MongoDB**

```bash
cd backend && npm run seed
```
Expected output (in order): `Connected to MongoDB`, `Cleared existing data`, 10× `Seeded: <name>`, `✓ Seed complete — 10 restaurants loaded`

- [ ] **Step 3: Commit**

```bash
git add backend/src/seed/
git commit -m "feat(backend): seed script — 10 restaurants across 6 cuisines with menus"
```

---

### Task 7: Order Controller + Routes

**Files:**
- Create: `backend/src/controllers/order.controller.js`
- Modify: `backend/src/routes/order.routes.js`
- Create: `backend/tests/order.test.js`

- [ ] **Step 1: Write failing order tests**

Create `backend/tests/order.test.js`:
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const MenuItem = require('../src/models/MenuItem');
const Category = require('../src/models/Category');

let mongod, token, userId, restaurantId, menuItemId;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const user = await User.create({ phone: '9123456789' });
  userId = user._id;
  token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret');

  const r = await Restaurant.create({ name: 'Test Resto', cuisine: ['Pizza'], deliveryFee: 30, minOrder: 99 });
  restaurantId = r._id;
  const cat = await Category.create({ restaurantId: r._id, name: 'Mains', sortOrder: 0 });
  const item = await MenuItem.create({ categoryId: cat._id, restaurantId: r._id, name: 'Pizza', price: 249, isVeg: true });
  menuItemId = item._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('POST /api/v1/orders', () => {
  it('places an order with status placed', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId, items: [{ menuItemId, name: 'Pizza', price: 249, qty: 2 }], deliveryAddress: '123 Test St' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('placed');
    expect(res.body.total).toBe(528); // 249*2 + 30
    expect(res.body.subtotal).toBe(498);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/v1/orders').send({});
    expect(res.status).toBe(401);
  });

  it('returns 400 when items are missing', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId, deliveryAddress: 'Test' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/orders', () => {
  it('returns user order history', async () => {
    const res = await request(app).get('/api/v1/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/orders/:id', () => {
  it('returns single order detail', async () => {
    const placed = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId, items: [{ menuItemId, name: 'Pizza', price: 249, qty: 1 }], deliveryAddress: 'Test' });
    const res = await request(app)
      .get(`/api/v1/orders/${placed.body._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(placed.body._id);
  });
});

describe('PATCH /api/v1/orders/:id/status', () => {
  it('advances order status to confirmed', async () => {
    const placed = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId, items: [{ menuItemId, name: 'Pizza', price: 249, qty: 1 }], deliveryAddress: 'Test' });

    const res = await request(app)
      .patch(`/api/v1/orders/${placed.body._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });

  it('returns 400 for invalid status', async () => {
    const placed = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ restaurantId, items: [{ menuItemId, name: 'Pizza', price: 249, qty: 1 }], deliveryAddress: 'Test' });

    const res = await request(app)
      .patch(`/api/v1/orders/${placed.body._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'flying' });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend && npm test -- --testPathPattern=order
```
Expected: FAIL

- [ ] **Step 3: Implement order controller**

Create `backend/src/controllers/order.controller.js`:
```js
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const VALID_STATUSES = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

async function placeOrder(req, res) {
  const { restaurantId, items, deliveryAddress } = req.body;
  if (!restaurantId || !items?.length || !deliveryAddress) {
    return res.status(400).json({ error: 'restaurantId, items, and deliveryAddress are required' });
  }
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = restaurant.deliveryFee;
  const order = await Order.create({
    userId: req.userId, restaurantId, items, subtotal,
    deliveryFee, total: subtotal + deliveryFee, deliveryAddress, status: 'placed',
  });
  return res.status(201).json(order);
}

async function listOrders(req, res) {
  const orders = await Order.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .populate('restaurantId', 'name imageUrl');
  return res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, userId: req.userId })
    .populate('restaurantId', 'name deliveryTime imageUrl');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}

module.exports = { placeOrder, listOrders, getOrder, updateOrderStatus };
```

- [ ] **Step 4: Wire order routes**

Replace `backend/src/routes/order.routes.js`:
```js
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { placeOrder, listOrders, getOrder, updateOrderStatus } = require('../controllers/order.controller');

router.post('/', auth, placeOrder);
router.get('/', auth, listOrders);
router.get('/:id', auth, getOrder);
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd backend && npm test -- --testPathPattern=order
```
Expected: PASS — 7 tests green

- [ ] **Step 6: Commit**

```bash
git add backend/src/controllers/order.controller.js backend/src/routes/order.routes.js backend/tests/order.test.js
git commit -m "feat(backend): order endpoints — place, list, get, status advance"
```

---

### Task 8: Profile Controller + Routes

**Files:**
- Create: `backend/src/controllers/profile.controller.js`
- Modify: `backend/src/routes/profile.routes.js`
- Create: `backend/tests/profile.test.js`

- [ ] **Step 1: Write failing profile tests**

Create `backend/tests/profile.test.js`:
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../src/models/User');

let mongod, token, userId;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  const user = await User.create({ phone: '9000000001', name: 'Test User' });
  userId = user._id;
  token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('GET /api/v1/profile', () => {
  it('returns profile for authenticated user', async () => {
    const res = await request(app).get('/api/v1/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('9000000001');
    expect(res.body.name).toBe('Test User');
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/profile');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/v1/profile', () => {
  it('updates name and defaultAddress', async () => {
    const res = await request(app)
      .put('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', defaultAddress: '456 New Street, Bengaluru' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.defaultAddress).toBe('456 New Street, Bengaluru');
  });

  it('partial update — only updates provided fields', async () => {
    const res = await request(app)
      .put('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Only Name Updated' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Only Name Updated');
    expect(res.body.defaultAddress).toBe('456 New Street, Bengaluru');
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend && npm test -- --testPathPattern=profile
```
Expected: FAIL

- [ ] **Step 3: Implement profile controller**

Create `backend/src/controllers/profile.controller.js`:
```js
const User = require('../models/User');

async function getProfile(req, res) {
  const user = await User.findById(req.userId).select('-__v');
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
}

async function updateProfile(req, res) {
  const { name, defaultAddress } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (defaultAddress !== undefined) updates.defaultAddress = defaultAddress;

  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, select: '-__v' });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
}

module.exports = { getProfile, updateProfile };
```

- [ ] **Step 4: Wire profile routes**

Replace `backend/src/routes/profile.routes.js`:
```js
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

module.exports = router;
```

- [ ] **Step 5: Run ALL tests — expect full PASS**

```bash
cd backend && npm test
```
Expected: 4 test suites, all tests green.

- [ ] **Step 6: Commit**

```bash
git add backend/src/controllers/profile.controller.js backend/src/routes/profile.routes.js backend/tests/profile.test.js
git commit -m "feat(backend): profile get + update endpoints, all tests passing"
git push origin main
```

**Render deployment:** Dashboard → New Web Service → connect repo → Root Directory: `backend` → Build: `npm install` → Start: `npm start` → Env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.
