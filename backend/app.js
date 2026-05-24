const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const restaurantRoutes = require('./src/routes/restaurant.routes');
const orderRoutes = require('./src/routes/order.routes');
const profileRoutes = require('./src/routes/profile.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());

app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/profile', profileRoutes);

module.exports = app;
