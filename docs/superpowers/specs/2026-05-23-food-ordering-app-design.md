# Food Ordering App — Design Spec
**Date:** 2026-05-23
**Project:** FoodRush — Swiggy-style customer food ordering app

---

## Summary

A mobile-first, responsive food ordering web app with a React + Vite frontend (Vercel) and a Node.js + Express + MongoDB backend (Render). Customers can browse seeded restaurants, add items to cart, place mock orders, and track order progress via an auto-advancing status timer.

---

## Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Scope | Customer app only | Fastest MVP; no restaurant/admin portal |
| Restaurant data | Seeded | 10 pre-loaded restaurants with menus; no admin UI needed |
| Payments | Mock checkout | No gateway keys needed; simulates payment success |
| Authentication | Phone OTP | Swiggy-authentic; no passwords; OTP logged to console (no SMS provider) |
| Order tracking | Simulated auto-advance | Frontend timer cycles status every 45s; no WebSockets |
| Frontend | React + Vite + Tailwind | SPA, deploys to Vercel |
| Backend | Node.js + Express + MongoDB | REST API, deploys to Render |
| Architecture | Monorepo, REST + SPA | `/backend` and `/frontend` in one Git repo |
| Color palette | Electric Indigo | `#4F46E5` primary · `#F5F3FF` bg · `#7C3AED` gradient |

---

## Screens & User Flows

### Auth Flow
1. **Splash** — Logo + tagline, 2s redirect to Login
2. **Phone Login** — `+91` prefix input, "Get OTP" button → POST `/api/v1/auth/send-otp`
3. **OTP Verify** — 6-digit input, 30s resend timer, auto-submit on last digit → POST `/api/v1/auth/verify-otp` → JWT stored in `localStorage`

### Main App Flow
4. **Home** — Location bar (manual text), search bar, horizontal cuisine filter chips, vertical list of restaurant cards
5. **Restaurant Detail** — Banner image, restaurant info (rating, delivery time, min order), sticky category tab bar, menu items with veg/non-veg badge, add/remove quantity controls, floating cart bar at bottom
6. **Cart** — Item list with qty controls, subtotal + delivery fee + grand total, "Proceed to Checkout" button
7. **Checkout** — Delivery address input, read-only order summary, mock payment section ("Pay ₹XXX"), "Place Order" button → POST `/api/v1/orders`

### Post-Order Flow
8. **Order Confirmed** — Success animation, order ID, ETA, "Track Order" CTA
9. **Order Tracking** — 5-step progress stepper (Placed → Confirmed → Preparing → Out for Delivery → Delivered), auto-advances every 45s, ETA countdown. Each advance calls `PATCH /api/v1/orders/:id/status` to keep the DB in sync.

### Account (Bottom Nav)
10. **Order History** — Past orders list: restaurant name, date, total, status badge, "Reorder" button
11. **Profile** — Name (editable), phone (read-only), saved delivery address, Logout

### Navigation
- **Bottom nav:** Home · Orders · Profile
- **Floating cart bar:** shown on Restaurant Detail and Cart screens when cart has items
- **Back arrow:** header on all drill-down screens

---

## Visual Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#4F46E5` | Buttons, active states, badges |
| Primary Gradient | `#4F46E5` → `#7C3AED` | Restaurant card banners, hero elements |
| Primary Light | `#EEF2FF` | Chip selected bg, input focus ring |
| Surface | `#F5F3FF` | App background |
| Card | `#FFFFFF` | Cards, modals |
| Text Dark | `#1E1B4B` | Headings, prices |
| Text Muted | `#6366F1` | Ratings, captions, secondary info |
| Text Body | `#4B5563` | Body text, descriptions |
| Veg | `#16A34A` | Veg indicator dot/border |
| Non-Veg | `#DC2626` | Non-veg indicator |
| Success | `#10B981` | Order confirmed, delivered status |
| Divider | `#E5E7EB` | Separators |

### Typography — Inter (Google Fonts)
| Role | Size | Weight |
|------|------|--------|
| Screen title | 24px | 700 |
| Section heading | 18px | 600 |
| Category tab | 16px | 500 |
| Item name / body | 14px | 400 |
| Caption / price / rating | 12px | 400 |

### Spacing & Layout
- Base unit: 4px
- Card padding: 16px
- Screen horizontal padding: 16px (mobile), 24px (tablet+)
- Border radius: 8px (cards), 20px (chips/pills), 50% (avatars/dots)
- Max content width (desktop): 480px centered

### Responsive Breakpoints
- Mobile (default): full-width, bottom nav visible
- Tablet (≥ 768px): centered 480px column, side padding increases
- Desktop (≥ 1024px): fixed 480px column centered, bottom nav stays (mobile-first app)

---

## Core UI Components

| Component | Description |
|-----------|-------------|
| `RestaurantCard` | Image banner, name, cuisine tags, rating badge, delivery time + fee |
| `MenuItemCard` | Veg/non-veg dot, name, description, price, image, +/- qty control |
| `CuisineChip` | Horizontal scrollable pill filter; selected state fills with primary color |
| `FloatingCartBar` | Sticky bottom bar: item count + subtotal + "View Cart" → primary bg |
| `OrderStepper` | 5-step horizontal progress with icons; completed steps filled, active pulsing |
| `BottomNav` | 3-tab bar: Home, Orders, Profile; active tab uses primary color |
| `OTPInput` | 6 individual digit boxes; auto-focus next on input; auto-submit on last |
| `PrimaryButton` | Full-width, `#4F46E5`, 14px bold, 12px radius, 48px height |
| `OutlineButton` | Full-width, `#4F46E5` border + text, transparent bg |

---

## Backend Architecture

### Project Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Category.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── order.routes.js
│   │   └── profile.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── restaurant.controller.js
│   │   ├── order.controller.js
│   │   └── profile.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verify, attaches req.userId
│   └── seed/
│       └── seed.js                # 10 restaurants, categories, menu items
├── app.js                         # Express setup, routes, CORS
├── server.js                      # MongoDB connect + listen
└── package.json
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/send-otp` | — | Accept `{ phone }`, generate 6-digit OTP, store in memory/DB with 5min TTL, log to console |
| POST | `/api/v1/auth/verify-otp` | — | Accept `{ phone, otp }`, verify, return `{ token, user }` |
| GET | `/api/v1/restaurants` | — | List restaurants; supports `?cuisine=Pizza&search=keyword` |
| GET | `/api/v1/restaurants/:id` | — | Restaurant detail + full menu (categories with items) |
| POST | `/api/v1/orders` | ✓ | Place order; body `{ restaurantId, items[], deliveryAddress }`; returns order with `status: placed` |
| GET | `/api/v1/orders` | ✓ | Current user's order history, newest first |
| GET | `/api/v1/orders/:id` | ✓ | Single order detail (for tracking screen) |
| PATCH | `/api/v1/orders/:id/status` | ✓ | Advance order status; body `{ status }`; called by frontend tracking timer |
| GET | `/api/v1/profile` | ✓ | Get `{ name, phone, defaultAddress }` |
| PUT | `/api/v1/profile` | ✓ | Update `{ name, defaultAddress }` |

### Data Models

**User**
```js
{ phone: String (unique), name: String, defaultAddress: String, createdAt: Date }
```

**Restaurant**
```js
{
  name: String, cuisine: [String], rating: Number, deliveryTime: Number,
  deliveryFee: Number, minOrder: Number, isOpen: Boolean,
  imageUrl: String, address: String
}
```

**Category**
```js
{ restaurantId: ObjectId, name: String, sortOrder: Number }
```

**MenuItem**
```js
{
  categoryId: ObjectId, restaurantId: ObjectId, name: String,
  description: String, price: Number, imageUrl: String,
  isVeg: Boolean, isAvailable: Boolean
}
```

**Order**
```js
{
  userId: ObjectId, restaurantId: ObjectId,
  items: [{ menuItemId: ObjectId, name: String, price: Number, qty: Number }],
  subtotal: Number, deliveryFee: Number, total: Number,
  status: String,  // placed | confirmed | preparing | out_for_delivery | delivered
  deliveryAddress: String, createdAt: Date
}
```

### Seed Data Plan
10 restaurants across 6 cuisines: Pizza, Burgers, Biryani, Chinese, Healthy, Desserts.
Each restaurant has 3–4 categories and 4–6 menu items per category.
Mix of veg and non-veg items with realistic Indian pricing (₹99–₹599).

---

## Frontend Architecture

### Project Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Splash.jsx
│   │   ├── Login.jsx            # Phone input
│   │   ├── OTPVerify.jsx        # OTP input
│   │   ├── Home.jsx             # Restaurant listing
│   │   ├── Restaurant.jsx       # Menu + cart
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmed.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── OrderHistory.jsx
│   │   └── Profile.jsx
│   ├── components/
│   │   ├── ui/                  # Button, Input, Badge, Spinner, Modal
│   │   ├── layout/              # BottomNav, PageHeader, PageLayout
│   │   ├── restaurant/          # RestaurantCard, MenuItemCard, CuisineChip, CategoryTabs
│   │   ├── cart/                # FloatingCartBar, CartItem
│   │   └── order/               # OrderStepper, OrderCard
│   ├── store/
│   │   ├── authStore.js         # Zustand: token, user, login(), logout()
│   │   ├── cartStore.js         # Zustand: items[], addItem(), removeItem(), clear()
│   │   └── orderStore.js        # Zustand: orders[], activeOrder
│   ├── services/
│   │   └── api.js               # Axios instance with baseURL + auth interceptor
│   ├── hooks/
│   │   └── useOrderTracking.js  # Auto-advance timer hook
│   ├── App.jsx                  # React Router routes + ProtectedRoute wrapper
│   └── main.jsx
└── package.json
```

### State Management (Zustand)
- **authStore:** JWT token + user object; persisted to `localStorage`
- **cartStore:** Array of `{ menuItem, qty, restaurantId }`; clears on new restaurant selection
- **orderStore:** Active order + history; fetched from API

### Routing (React Router v6)
- Public: `/`, `/login`, `/otp`
- Protected (requires JWT): `/home`, `/restaurant/:id`, `/cart`, `/checkout`, `/order-confirmed/:id`, `/order/:id`, `/orders`, `/profile`

---

## Deployment

| Layer | Platform | Notes |
|-------|----------|-------|
| Frontend | Vercel | Auto-deploy from `frontend/` folder; set `VITE_API_URL` env var |
| Backend | Render | Web service from `backend/` folder; set `MONGODB_URI`, `JWT_SECRET` env vars |
| Database | MongoDB Atlas | Free tier M0 cluster; connection string in Render env vars |

---

## Out of Scope
- Restaurant owner dashboard / admin panel
- Real SMS OTP (OTP logged to console only)
- Real payment gateway (mock success only)
- Real-time WebSocket tracking
- Push notifications
- Reviews and ratings
- Coupons / promo codes
- Map-based location detection
- Delivery partner view
