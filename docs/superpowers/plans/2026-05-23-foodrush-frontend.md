# FoodRush Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the FoodRush customer-facing React SPA — 11 screens across Auth, Restaurant browsing, Cart, Checkout, Order Tracking, and Account flows.

**Architecture:** React 18 + Vite SPA. React Router v6 with protected routes. Zustand for auth/cart/order state (auth persisted to localStorage). Axios with Bearer token interceptor. Tailwind CSS with Electric Indigo custom palette. Mobile-first layout capped at 480px.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, React Router v6, Zustand, Axios, Vitest, @testing-library/react

**Prerequisite:** Backend must be running locally on `http://localhost:5000` and seeded before testing UI against live API.

---

## File Map

| File | Responsibility |
|------|----------------|
| `frontend/vite.config.js` | Vite config with proxy to backend |
| `frontend/tailwind.config.js` | Electric Indigo color tokens |
| `frontend/src/main.jsx` | React root, Router wrapper |
| `frontend/src/App.jsx` | Route definitions, ProtectedRoute |
| `frontend/src/services/api.js` | Axios instance, auth interceptor, all API calls |
| `frontend/src/store/authStore.js` | Zustand: token, user, login(), logout() — persisted |
| `frontend/src/store/cartStore.js` | Zustand: items[], restaurant, addItem(), removeItem(), clear() |
| `frontend/src/store/orderStore.js` | Zustand: activeOrder, history, setActiveOrder(), setHistory() |
| `frontend/src/hooks/useOrderTracking.js` | Auto-advance order status timer |
| `frontend/src/components/ui/Button.jsx` | PrimaryButton, OutlineButton, GhostButton |
| `frontend/src/components/ui/Input.jsx` | Styled text input with label |
| `frontend/src/components/ui/Badge.jsx` | Status badge with color variants |
| `frontend/src/components/ui/Spinner.jsx` | Loading spinner |
| `frontend/src/components/ui/OTPInput.jsx` | 6-box OTP input with auto-focus |
| `frontend/src/components/layout/BottomNav.jsx` | 3-tab bottom navigation |
| `frontend/src/components/layout/PageHeader.jsx` | Back arrow + title bar |
| `frontend/src/components/layout/PageLayout.jsx` | Max-width wrapper + BottomNav slot |
| `frontend/src/components/restaurant/RestaurantCard.jsx` | Restaurant listing card |
| `frontend/src/components/restaurant/CuisineChip.jsx` | Filter pill chip |
| `frontend/src/components/restaurant/MenuItemCard.jsx` | Menu item with +/- qty controls |
| `frontend/src/components/restaurant/CategoryTabs.jsx` | Sticky horizontal category tabs |
| `frontend/src/components/cart/FloatingCartBar.jsx` | Sticky bottom "View Cart" bar |
| `frontend/src/components/cart/CartItem.jsx` | Cart item with qty controls |
| `frontend/src/components/order/OrderStepper.jsx` | 5-step progress stepper |
| `frontend/src/components/order/OrderCard.jsx` | Order history list item |
| `frontend/src/pages/Splash.jsx` | Logo + tagline, 2s redirect |
| `frontend/src/pages/Login.jsx` | Phone number entry |
| `frontend/src/pages/OTPVerify.jsx` | OTP verification |
| `frontend/src/pages/Home.jsx` | Restaurant listing with search + filter |
| `frontend/src/pages/Restaurant.jsx` | Restaurant detail + menu |
| `frontend/src/pages/Cart.jsx` | Cart screen |
| `frontend/src/pages/Checkout.jsx` | Checkout + mock payment |
| `frontend/src/pages/OrderConfirmed.jsx` | Success screen |
| `frontend/src/pages/OrderTracking.jsx` | Live tracking stepper |
| `frontend/src/pages/OrderHistory.jsx` | Past orders |
| `frontend/src/pages/Profile.jsx` | User profile |

---

### Task 1: Project Setup

**Files:**
- Create: `frontend/package.json` (via npm create)
- Create: `frontend/tailwind.config.js`
- Create: `frontend/vite.config.js`
- Create: `frontend/src/index.css`
- Create: `frontend/.env.example`

- [ ] **Step 1: Scaffold Vite + React project**

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install react-router-dom zustand axios
npm install -D tailwindcss postcss autoprefixer vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind with Electric Indigo tokens**

Replace `frontend/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        accent: '#7C3AED',
        surface: '#F5F3FF',
        card: '#FFFFFF',
        'text-dark': '#1E1B4B',
        'text-muted': '#6366F1',
        'text-body': '#4B5563',
        veg: '#16A34A',
        'non-veg': '#DC2626',
        success: '#10B981',
        divider: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        app: '480px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Update src/index.css**

Replace `frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface font-sans text-text-body;
  }
}
```

- [ ] **Step 5: Configure Vite with dev proxy and Vitest**

Replace `frontend/vite.config.js`:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
});
```

- [ ] **Step 6: Create test setup file**

Create `frontend/src/test-setup.js`:
```js
import '@testing-library/jest-dom';
```

- [ ] **Step 7: Create .env.example**

Create `frontend/.env.example`:
```
VITE_API_URL=http://localhost:5000
```

Create `frontend/.env` locally with the same content.

- [ ] **Step 8: Update package.json scripts**

Add to `frontend/package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server at `http://localhost:5173`

- [ ] **Step 10: Commit**

```bash
cd ..
git add frontend/
git commit -m "feat(frontend): Vite + React + Tailwind + Zustand + Router setup"
```

---

### Task 2: API Service + Stores

**Files:**
- Create: `frontend/src/services/api.js`
- Create: `frontend/src/store/authStore.js`
- Create: `frontend/src/store/cartStore.js`
- Create: `frontend/src/store/orderStore.js`

- [ ] **Step 1: Create Axios API service**

Create `frontend/src/services/api.js`:
```js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const sendOtp = (phone) => api.post('/auth/send-otp', { phone });
export const verifyOtp = (phone, otp) => api.post('/auth/verify-otp', { phone, otp });

// Restaurants
export const getRestaurants = (params) => api.get('/restaurants', { params });
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

export default api;
```

- [ ] **Step 2: Create auth store**

Create `frontend/src/store/authStore.js`:
```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      updateUser: (user) => set((s) => ({ user: { ...s.user, ...user } })),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'foodrush-auth' }
  )
);
```

- [ ] **Step 3: Create cart store**

Create `frontend/src/store/cartStore.js`:
```js
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: '',

  addItem: (menuItem, restaurantId, restaurantName) => {
    const { items, restaurantId: currentRestaurantId } = get();
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      // New restaurant — clear cart
      set({ items: [{ ...menuItem, qty: 1 }], restaurantId, restaurantName });
      return;
    }
    const existing = items.find((i) => i._id === menuItem._id);
    if (existing) {
      set({ items: items.map((i) => i._id === menuItem._id ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ items: [...items, { ...menuItem, qty: 1 }], restaurantId, restaurantName });
    }
  },

  removeItem: (menuItemId) => {
    const items = get().items;
    const item = items.find((i) => i._id === menuItemId);
    if (!item) return;
    if (item.qty <= 1) {
      const next = items.filter((i) => i._id !== menuItemId);
      set({ items: next, ...(next.length === 0 ? { restaurantId: null, restaurantName: '' } : {}) });
    } else {
      set({ items: items.map((i) => i._id === menuItemId ? { ...i, qty: i.qty - 1 } : i) });
    }
  },

  getItemQty: (menuItemId) => get().items.find((i) => i._id === menuItemId)?.qty || 0,

  getTotalItems: () => get().items.reduce((s, i) => s + i.qty, 0),

  getSubtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),

  clear: () => set({ items: [], restaurantId: null, restaurantName: '' }),
}));
```

- [ ] **Step 4: Create order store**

Create `frontend/src/store/orderStore.js`:
```js
import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  activeOrder: null,
  history: [],
  setActiveOrder: (order) => set({ activeOrder: order }),
  setHistory: (history) => set({ history }),
  clearActiveOrder: () => set({ activeOrder: null }),
}));
```

- [ ] **Step 5: Write store tests**

Create `frontend/src/store/cartStore.test.js`:
```js
import { useCartStore } from './cartStore';

const item = { _id: 'item1', name: 'Pizza', price: 249, isVeg: true };
const item2 = { _id: 'item2', name: 'Pasta', price: 199, isVeg: true };

beforeEach(() => useCartStore.getState().clear());

test('addItem adds item to empty cart', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().items[0].qty).toBe(1);
});

test('addItem increments qty for existing item', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  expect(useCartStore.getState().items[0].qty).toBe(2);
});

test('addItem clears cart when switching restaurant', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().addItem(item2, 'resto2', 'Burger Barn');
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().restaurantId).toBe('resto2');
});

test('removeItem decrements qty', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().removeItem('item1');
  expect(useCartStore.getState().items[0].qty).toBe(1);
});

test('removeItem removes item when qty reaches 0', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().removeItem('item1');
  expect(useCartStore.getState().items).toHaveLength(0);
});

test('getSubtotal calculates correctly', () => {
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  useCartStore.getState().addItem(item, 'resto1', 'Pizza Palace');
  expect(useCartStore.getState().getSubtotal()).toBe(498);
});
```

- [ ] **Step 6: Run store tests**

```bash
cd frontend && npm test -- cartStore
```
Expected: PASS — 6 tests green

- [ ] **Step 7: Commit**

```bash
git add frontend/src/services/ frontend/src/store/
git commit -m "feat(frontend): API service, auth/cart/order Zustand stores"
```

---

### Task 3: Base UI Components

**Files:**
- Create: `frontend/src/components/ui/Button.jsx`
- Create: `frontend/src/components/ui/Input.jsx`
- Create: `frontend/src/components/ui/Badge.jsx`
- Create: `frontend/src/components/ui/Spinner.jsx`
- Create: `frontend/src/components/ui/OTPInput.jsx`
- Create: `frontend/src/components/layout/BottomNav.jsx`
- Create: `frontend/src/components/layout/PageHeader.jsx`
- Create: `frontend/src/components/layout/PageLayout.jsx`

- [ ] **Step 1: Create Button component**

Create `frontend/src/components/ui/Button.jsx`:
```jsx
export function PrimaryButton({ children, onClick, disabled, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 bg-primary text-white font-semibold text-sm rounded-xl
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-12 border-2 border-primary text-primary font-semibold text-sm
        rounded-xl active:scale-95 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-12 bg-gray-100 text-text-body font-medium text-sm
        rounded-xl active:scale-95 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create Input component**

Create `frontend/src/components/ui/Input.jsx`:
```jsx
export function Input({ label, value, onChange, placeholder, type = 'text', prefix, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-text-dark">{label}</label>}
      <div className="flex items-center border border-divider rounded-xl px-4 h-12 bg-white
        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light transition-all">
        {prefix && <span className="text-text-muted text-sm mr-2 shrink-0">{prefix}</span>}
        {prefix && <div className="w-px h-4 bg-divider mr-3" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-text-dark placeholder:text-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Badge component**

Create `frontend/src/components/ui/Badge.jsx`:
```jsx
const VARIANTS = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ status }) {
  const label = status?.replace(/_/g, ' ') || '';
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${VARIANTS[status] || VARIANTS.default}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Create Spinner component**

Create `frontend/src/components/ui/Spinner.jsx`:
```jsx
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-3 border-primary-light border-t-primary rounded-full animate-spin`} />
    </div>
  );
}
```

- [ ] **Step 5: Create OTPInput component**

Create `frontend/src/components/ui/OTPInput.jsx`:
```jsx
import { useRef } from 'react';

export function OTPInput({ value, onChange }) {
  const digits = value.split('');
  const inputs = useRef([]);

  function handleChange(index, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    const newVal = next.join('');
    onChange(newVal);
    if (char && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-11 h-12 text-center text-lg font-bold border-2 border-divider rounded-xl
            focus:border-primary focus:ring-2 focus:ring-primary-light outline-none
            text-text-dark bg-white transition-all"
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create BottomNav**

Create `frontend/src/components/layout/BottomNav.jsx`:
```jsx
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/orders', label: 'Orders', icon: '📋' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-40">
      <div className="mx-auto max-w-app flex">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors
              ${isActive ? 'text-primary' : 'text-gray-400'}`
            }
          >
            <span className="text-xl">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 7: Create PageHeader**

Create `frontend/src/components/layout/PageHeader.jsx`:
```jsx
import { useNavigate } from 'react-router-dom';

export function PageHeader({ title, showBack = true, action }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-divider px-4 h-14 flex items-center gap-3">
      {showBack && (
        <button onClick={() => navigate(-1)} className="text-text-dark text-xl p-1 -ml-1">
          ←
        </button>
      )}
      <h1 className="flex-1 text-base font-semibold text-text-dark truncate">{title}</h1>
      {action}
    </header>
  );
}
```

- [ ] **Step 8: Create PageLayout**

Create `frontend/src/components/layout/PageLayout.jsx`:
```jsx
import { BottomNav } from './BottomNav';

export function PageLayout({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className={`mx-auto max-w-app ${showNav ? 'pb-16' : ''} ${className}`}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add frontend/src/components/
git commit -m "feat(frontend): base UI components — Button, Input, Badge, OTPInput, BottomNav, layouts"
```

---

### Task 4: App Routing + Auth Pages

**Files:**
- Create: `frontend/src/App.jsx`
- Modify: `frontend/src/main.jsx`
- Create: `frontend/src/pages/Splash.jsx`
- Create: `frontend/src/pages/Login.jsx`
- Create: `frontend/src/pages/OTPVerify.jsx`

- [ ] **Step 1: Create App.jsx with routing**

Create `frontend/src/App.jsx`:
```jsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Splash from './pages/Splash';
import Login from './pages/Login';
import OTPVerify from './pages/OTPVerify';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';

function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const token = useAuthStore((s) => s.token);
  return token ? <Navigate to="/home" replace /> : <Outlet />;
}

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/otp', element: <OTPVerify /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/restaurant/:id', element: <Restaurant /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order-confirmed/:id', element: <OrderConfirmed /> },
      { path: '/order/:id', element: <OrderTracking /> },
      { path: '/orders', element: <OrderHistory /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

- [ ] **Step 2: Update main.jsx**

Replace `frontend/src/main.jsx`:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 3: Create Splash page**

Create `frontend/src/pages/Splash.jsx`:
```jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Splash() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const timer = setTimeout(() => navigate(token ? '/home' : '/login'), 2000);
    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex flex-col items-center justify-center gap-4">
      <div className="text-6xl">🍔</div>
      <h1 className="text-4xl font-bold text-white tracking-tight">FoodRush</h1>
      <p className="text-primary-light text-sm">India's fastest food delivery</p>
      <div className="mt-8 w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

- [ ] **Step 4: Create Login page**

Create `frontend/src/pages/Login.jsx`:
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/api';
import { Input } from '../components/ui/Input';
import { PrimaryButton } from '../components/ui/Button';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSendOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendOtp(phone);
      navigate('/otp', { state: { phone } });
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">🍔</div>
          <h1 className="text-3xl font-bold text-white mb-1">FoodRush</h1>
          <p className="text-primary-light text-sm">India's fastest food delivery</p>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl">
        <h2 className="text-xl font-bold text-text-dark mb-1">Login or Sign up</h2>
        <p className="text-text-body text-sm mb-6">Enter your mobile number to continue</p>

        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="Mobile number"
          prefix="+91"
          type="tel"
          className="mb-2"
        />

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <PrimaryButton onClick={handleSendOtp} disabled={loading} className="mt-4">
          {loading ? 'Sending OTP...' : 'Get OTP'}
        </PrimaryButton>

        <p className="text-center text-xs text-text-body mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create OTPVerify page**

Create `frontend/src/pages/OTPVerify.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { OTPInput } from '../components/ui/OTPInput';
import { PrimaryButton } from '../components/ui/Button';

export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    if (!phone) { navigate('/login'); return; }
    const interval = setInterval(() => {
      setResendTimer((t) => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phone, navigate]);

  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp]);

  async function handleVerify() {
    if (otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(phone, otp);
      login(res.data.token, res.data.user);
      navigate('/home');
    } catch (e) {
      setError(e.response?.data?.error || 'Incorrect OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    await sendOtp(phone);
    setResendTimer(30);
    setOtp('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="bg-gradient-to-br from-primary to-accent h-40 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-1">📱</div>
          <h1 className="text-xl font-bold">Enter OTP</h1>
        </div>
      </div>

      <div className="flex-1 bg-white mx-4 -mt-6 rounded-2xl shadow-lg px-6 pt-8 pb-10">
        <p className="text-sm text-text-body mb-1">OTP sent to</p>
        <p className="font-semibold text-text-dark mb-6">+91 {phone}</p>

        <OTPInput value={otp} onChange={setOtp} />

        {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}

        <PrimaryButton onClick={handleVerify} disabled={loading || otp.length < 6} className="mt-8">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </PrimaryButton>

        <div className="text-center mt-4">
          {resendTimer > 0 ? (
            <p className="text-sm text-text-body">Resend OTP in <span className="text-primary font-semibold">{resendTimer}s</span></p>
          ) : (
            <button onClick={handleResend} className="text-primary font-semibold text-sm">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create placeholder pages for all protected routes (so router doesn't crash)**

Create `frontend/src/pages/Home.jsx`:
```jsx
export default function Home() { return <div className="p-4 text-text-dark">Home — coming in next task</div>; }
```

Repeat for: `Restaurant.jsx`, `Cart.jsx`, `Checkout.jsx`, `OrderConfirmed.jsx`, `OrderTracking.jsx`, `OrderHistory.jsx`, `Profile.jsx` — same one-liner pattern, different label text.

- [ ] **Step 7: Verify auth flow in browser**

```bash
npm run dev
```
Navigate to `http://localhost:5173` → Splash (2s) → Login → enter phone → OTP screen. Console should show OTP from backend.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): routing, Splash, Login, OTPVerify pages"
```

---

### Task 5: Restaurant Components + Home Screen

**Files:**
- Create: `frontend/src/components/restaurant/RestaurantCard.jsx`
- Create: `frontend/src/components/restaurant/CuisineChip.jsx`
- Create: `frontend/src/pages/Home.jsx` (full implementation)

- [ ] **Step 1: Write Home page tests**

Create `frontend/src/pages/Home.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './Home';
import * as api from '../services/api';

vi.mock('../services/api');
vi.mock('../store/authStore', () => ({ useAuthStore: () => ({ user: { name: 'Test' } }) }));
vi.mock('../store/cartStore', () => ({ useCartStore: () => ({ getTotalItems: () => 0 }) }));

test('shows restaurant list after fetch', async () => {
  api.getRestaurants.mockResolvedValue({
    data: [{ _id: '1', name: 'Pizza Palace', cuisine: ['Pizza'], rating: 4.3, deliveryTime: 30, deliveryFee: 30 }],
  });
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(await screen.findByText('Pizza Palace')).toBeInTheDocument();
});

test('shows empty state when no restaurants', async () => {
  api.getRestaurants.mockResolvedValue({ data: [] });
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(await screen.findByText(/no restaurants/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- Home
```
Expected: FAIL

- [ ] **Step 3: Create RestaurantCard**

Create `frontend/src/components/restaurant/RestaurantCard.jsx`:
```jsx
import { useNavigate } from 'react-router-dom';

const CUISINE_EMOJI = { Pizza: '🍕', Burgers: '🍔', Biryani: '🍛', Chinese: '🍜', 'South Indian': '🥞', Healthy: '🥗', Desserts: '🎂', Indian: '🍲', Thai: '🌶️', Continental: '🍽️' };

export function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const emoji = CUISINE_EMOJI[restaurant.cuisine?.[0]] || '🍴';

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-98 transition-transform cursor-pointer"
    >
      <div
        className="h-36 flex items-center justify-center text-5xl"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
      >
        {emoji}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-text-dark text-sm leading-tight">{restaurant.name}</h3>
            <p className="text-text-body text-xs mt-0.5">{restaurant.cuisine?.join(', ')}</p>
          </div>
          {!restaurant.isOpen && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">Closed</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-divider">
          <span className="flex items-center gap-1 text-xs font-semibold text-white bg-success px-1.5 py-0.5 rounded">
            ★ {restaurant.rating?.toFixed(1)}
          </span>
          <span className="text-xs text-text-body">{restaurant.deliveryTime} min</span>
          <span className="text-xs text-text-body">₹{restaurant.deliveryFee} delivery</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create CuisineChip**

Create `frontend/src/components/restaurant/CuisineChip.jsx`:
```jsx
const CUISINES = ['All', 'Pizza', 'Burgers', 'Biryani', 'Chinese', 'South Indian', 'Healthy', 'Desserts', 'Indian', 'Continental'];

export function CuisineFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CUISINES.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c === 'All' ? '' : c)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
            ${(c === 'All' && !selected) || selected === c
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-body border-divider'}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Implement full Home page**

Replace `frontend/src/pages/Home.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { getRestaurants } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { PageLayout } from '../components/layout/PageLayout';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { CuisineFilter } from '../components/restaurant/CuisineChip';
import { Spinner } from '../components/ui/Spinner';

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (cuisine) params.cuisine = cuisine;
    setLoading(true);
    getRestaurants(params)
      .then((r) => setRestaurants(r.data))
      .finally(() => setLoading(false));
  }, [search, cuisine]);

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📍</span>
          <div>
            <p className="text-xs text-text-muted">Delivering to</p>
            <p className="text-sm font-semibold text-text-dark truncate max-w-[200px]">
              {user?.defaultAddress || 'Set your location'}
            </p>
          </div>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for restaurants..."
          className="w-full h-10 px-4 bg-surface rounded-xl text-sm outline-none border border-divider focus:border-primary"
        />
      </div>

      {/* Cuisine Filter */}
      <div className="px-4 py-3 bg-white mt-2">
        <CuisineFilter selected={cuisine} onSelect={setCuisine} />
      </div>

      {/* Restaurant List */}
      <div className="px-4 py-4">
        <h2 className="text-base font-semibold text-text-dark mb-3">
          {cuisine || 'All Restaurants'} {restaurants.length > 0 && `(${restaurants.length})`}
        </h2>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-text-body text-sm">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
```

- [ ] **Step 6: Run Home tests — expect PASS**

```bash
npm test -- Home
```
Expected: PASS — 2 tests green

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/restaurant/ frontend/src/pages/Home.jsx frontend/src/pages/Home.test.jsx
git commit -m "feat(frontend): Home screen — search, cuisine filter, restaurant cards"
```

---

### Task 6: Restaurant Detail Screen

**Files:**
- Create: `frontend/src/components/restaurant/MenuItemCard.jsx`
- Create: `frontend/src/components/restaurant/CategoryTabs.jsx`
- Create: `frontend/src/components/cart/FloatingCartBar.jsx`
- Create: `frontend/src/pages/Restaurant.jsx`

- [ ] **Step 1: Create MenuItemCard**

Create `frontend/src/components/restaurant/MenuItemCard.jsx`:
```jsx
import { useCartStore } from '../../store/cartStore';

export function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { addItem, removeItem, getItemQty } = useCartStore();
  const qty = getItemQty(item._id);

  return (
    <div className="bg-white rounded-xl p-3 flex gap-3 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0
            ${item.isVeg ? 'border-veg' : 'border-non-veg'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-veg' : 'bg-non-veg'}`} />
          </div>
          <span className={`text-[10px] font-semibold ${item.isVeg ? 'text-veg' : 'text-non-veg'}`}>
            {item.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-text-dark leading-tight">{item.name}</h4>
        <p className="text-xs text-text-body mt-0.5 line-clamp-2">{item.description}</p>
        <p className="text-sm font-bold text-text-dark mt-2">₹{item.price}</p>
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center text-2xl">
          🍴
        </div>
        {qty === 0 ? (
          <button
            onClick={() => addItem(item, restaurantId, restaurantName)}
            className="w-16 h-7 border-2 border-primary text-primary text-xs font-bold rounded-lg"
          >
            ADD
          </button>
        ) : (
          <div className="w-16 h-7 border-2 border-primary rounded-lg flex items-center justify-between px-1.5">
            <button onClick={() => removeItem(item._id)} className="text-primary font-bold text-base leading-none">−</button>
            <span className="text-primary font-bold text-xs">{qty}</span>
            <button onClick={() => addItem(item, restaurantId, restaurantName)} className="text-primary font-bold text-base leading-none">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CategoryTabs**

Create `frontend/src/components/restaurant/CategoryTabs.jsx`:
```jsx
export function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors
            ${activeId === cat._id
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-body border-divider'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create FloatingCartBar**

Create `frontend/src/components/cart/FloatingCartBar.jsx`:
```jsx
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export function FloatingCartBar() {
  const navigate = useNavigate();
  const { getTotalItems, getSubtotal } = useCartStore();
  const total = getTotalItems();
  if (total === 0) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 z-30">
      <div className="mx-auto max-w-app">
        <button
          onClick={() => navigate('/cart')}
          className="w-full rounded-2xl shadow-xl flex items-center justify-between px-5 py-3.5"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          <div>
            <p className="text-white text-xs opacity-80">{total} {total === 1 ? 'item' : 'items'} · ₹{getSubtotal()}</p>
            <p className="text-white font-bold text-sm">View Cart</p>
          </div>
          <span className="text-white text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement Restaurant page**

Replace `frontend/src/pages/Restaurant.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant } from '../services/api';
import { PageHeader } from '../components/layout/PageHeader';
import { CategoryTabs } from '../components/restaurant/CategoryTabs';
import { MenuItemCard } from '../components/restaurant/MenuItemCard';
import { FloatingCartBar } from '../components/cart/FloatingCartBar';
import { Spinner } from '../components/ui/Spinner';

export default function Restaurant() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    getRestaurant(id).then((r) => {
      setData(r.data);
      setActiveCategory(r.data.menu?.[0]?._id || null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!data) return null;

  const activeMenu = data.menu.find((c) => c._id === activeCategory);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-app pb-32">
        <PageHeader title={data.name} />

        {/* Banner */}
        <div className="h-40 flex items-center justify-center text-6xl"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          🍴
        </div>

        {/* Info */}
        <div className="bg-white px-4 py-3 border-b border-divider">
          <h2 className="text-lg font-bold text-text-dark">{data.name}</h2>
          <p className="text-sm text-text-body">{data.cuisine?.join(', ')}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-white bg-success px-2 py-0.5 rounded">
              ★ {data.rating?.toFixed(1)}
            </span>
            <span className="text-xs text-text-body">{data.deliveryTime} min</span>
            <span className="text-xs text-text-body">Min order ₹{data.minOrder}</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white px-4 py-3 border-b border-divider sticky top-14 z-20">
          <CategoryTabs categories={data.menu} activeId={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4 flex flex-col gap-3">
          {activeMenu?.items?.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              restaurantId={data._id}
              restaurantName={data.name}
            />
          ))}
        </div>
      </div>

      <FloatingCartBar />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/restaurant/MenuItemCard.jsx frontend/src/components/restaurant/CategoryTabs.jsx frontend/src/components/cart/FloatingCartBar.jsx frontend/src/pages/Restaurant.jsx
git commit -m "feat(frontend): Restaurant detail — menu categories, item cards, floating cart bar"
```

---

### Task 7: Cart + Checkout Screens

**Files:**
- Create: `frontend/src/components/cart/CartItem.jsx`
- Create: `frontend/src/pages/Cart.jsx`
- Create: `frontend/src/pages/Checkout.jsx`

- [ ] **Step 1: Create CartItem**

Create `frontend/src/components/cart/CartItem.jsx`:
```jsx
import { useCartStore } from '../../store/cartStore';

export function CartItem({ item }) {
  const { addItem, removeItem, restaurantId, restaurantName } = useCartStore();
  return (
    <div className="flex items-center gap-3 py-3 border-b border-divider last:border-0">
      <div className={`w-3 h-3 rounded-sm border-2 shrink-0 ${item.isVeg ? 'border-veg' : 'border-non-veg'}`}>
        <div className={`w-1.5 h-1.5 rounded-full m-auto mt-0.5 ${item.isVeg ? 'bg-veg' : 'bg-non-veg'}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-dark">{item.name}</p>
        <p className="text-sm font-bold text-text-dark">₹{item.price}</p>
      </div>
      <div className="flex items-center border-2 border-primary rounded-lg">
        <button onClick={() => removeItem(item._id)} className="w-8 h-8 text-primary font-bold text-lg">−</button>
        <span className="w-6 text-center text-sm font-bold text-primary">{item.qty}</span>
        <button onClick={() => addItem(item, restaurantId, restaurantName)} className="w-8 h-8 text-primary font-bold text-lg">+</button>
      </div>
      <p className="text-sm font-semibold text-text-dark w-14 text-right">₹{item.price * item.qty}</p>
    </div>
  );
}
```

- [ ] **Step 2: Implement Cart page**

Replace `frontend/src/pages/Cart.jsx`:
```jsx
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { PageHeader } from '../components/layout/PageHeader';
import { CartItem } from '../components/cart/CartItem';
import { PrimaryButton } from '../components/ui/Button';

export default function Cart() {
  const navigate = useNavigate();
  const { items, restaurantName, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = 30;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <PageHeader title="Cart" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-5xl">🛒</div>
          <p className="text-text-body text-sm">Your cart is empty</p>
          <button onClick={() => navigate('/home')} className="text-primary font-semibold text-sm">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-app">
        <PageHeader title="Cart" />

        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 shadow-sm">
          <div className="py-3 border-b border-divider">
            <p className="text-xs text-text-body">Order from</p>
            <p className="font-semibold text-text-dark">{restaurantName}</p>
          </div>
          {items.map((item) => <CartItem key={item._id} item={item} />)}
        </div>

        {/* Bill Summary */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3">Bill Summary</h3>
          <div className="flex justify-between text-sm text-text-body mb-2">
            <span>Item total</span><span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-text-body mb-3">
            <span>Delivery fee</span><span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-text-dark border-t border-divider pt-3">
            <span>To pay</span><span>₹{subtotal + deliveryFee}</span>
          </div>
        </div>

        <div className="px-4 py-6">
          <PrimaryButton onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement Checkout page**

Replace `frontend/src/pages/Checkout.jsx`:
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { placeOrder } from '../services/api';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/Input';
import { PrimaryButton } from '../components/ui/Button';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, getSubtotal, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const setActiveOrder = useOrderStore((s) => s.setActiveOrder);
  const [address, setAddress] = useState(user?.defaultAddress || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const subtotal = getSubtotal();
  const deliveryFee = 30;

  async function handlePlaceOrder() {
    if (!address.trim()) { setError('Please enter a delivery address'); return; }
    setLoading(true);
    setError('');
    try {
      const orderItems = items.map((i) => ({ menuItemId: i._id, name: i.name, price: i.price, qty: i.qty }));
      const res = await placeOrder({ restaurantId, items: orderItems, deliveryAddress: address });
      setActiveOrder(res.data);
      clear();
      navigate(`/order-confirmed/${res.data._id}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-app">
        <PageHeader title="Checkout" />

        {/* Delivery Address */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3">📍 Delivery Address</h3>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3">Order Summary — {restaurantName}</h3>
          {items.map((i) => (
            <div key={i._id} className="flex justify-between text-sm py-1.5 border-b border-divider last:border-0">
              <span className="text-text-body">{i.name} × {i.qty}</span>
              <span className="font-medium text-text-dark">₹{i.price * i.qty}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-text-body mt-3 mb-1">
            <span>Item total</span><span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-text-body mb-2">
            <span>Delivery fee</span><span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-text-dark border-t border-divider pt-2">
            <span>Grand total</span><span>₹{subtotal + deliveryFee}</span>
          </div>
        </div>

        {/* Mock Payment */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-2">💳 Payment</h3>
          <div className="flex items-center gap-3 p-3 border border-primary-light bg-primary-light rounded-xl">
            <span className="text-xl">💜</span>
            <div>
              <p className="text-sm font-medium text-text-dark">Mock Pay</p>
              <p className="text-xs text-text-body">Payment simulated — no real charge</p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}

        <div className="px-4 py-6">
          <PrimaryButton onClick={handlePlaceOrder} disabled={loading}>
            {loading ? 'Placing Order...' : `Pay ₹${subtotal + deliveryFee}`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/cart/CartItem.jsx frontend/src/pages/Cart.jsx frontend/src/pages/Checkout.jsx
git commit -m "feat(frontend): Cart and Checkout screens with mock payment"
```

---

### Task 8: Order Confirmed + Tracking Screens

**Files:**
- Create: `frontend/src/components/order/OrderStepper.jsx`
- Create: `frontend/src/hooks/useOrderTracking.js`
- Create: `frontend/src/pages/OrderConfirmed.jsx`
- Create: `frontend/src/pages/OrderTracking.jsx`

- [ ] **Step 1: Create OrderStepper**

Create `frontend/src/components/order/OrderStepper.jsx`:
```jsx
const STEPS = [
  { key: 'placed', label: 'Placed', icon: '✓' },
  { key: 'confirmed', label: 'Confirmed', icon: '🏪' },
  { key: 'preparing', label: 'Preparing', icon: '🍳' },
  { key: 'out_for_delivery', label: 'On the way', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '🏠' },
];

const STATUS_INDEX = { placed: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4 };

export function OrderStepper({ status }) {
  const current = STATUS_INDEX[status] ?? 0;
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base
              ${i <= current ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
              ${i === current ? 'ring-4 ring-primary-light animate-pulse' : ''}`}>
              {step.icon}
            </div>
            <p className={`text-[9px] mt-1 font-medium ${i <= current ? 'text-primary' : 'text-gray-400'}`}>
              {step.label}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < current ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create useOrderTracking hook**

Create `frontend/src/hooks/useOrderTracking.js`:
```js
import { useEffect, useRef } from 'react';
import { updateOrderStatus } from '../services/api';

const SEQUENCE = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const INTERVAL_MS = 45000;

export function useOrderTracking(order, onStatusChange) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    timerRef.current = setInterval(async () => {
      const current = SEQUENCE.indexOf(order.status);
      if (current === -1 || current >= SEQUENCE.length - 1) {
        clearInterval(timerRef.current);
        return;
      }
      const next = SEQUENCE[current + 1];
      try {
        const res = await updateOrderStatus(order._id, next);
        onStatusChange(res.data);
        if (next === 'delivered') clearInterval(timerRef.current);
      } catch (e) {
        console.error('Status update failed', e);
      }
    }, INTERVAL_MS);

    return () => clearInterval(timerRef.current);
  }, [order?._id, order?.status]);
}
```

- [ ] **Step 3: Create OrderConfirmed page**

Replace `frontend/src/pages/OrderConfirmed.jsx`:
```jsx
import { useNavigate, useParams } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/Button';
import { OutlineButton } from '../components/ui/Button';

export default function OrderConfirmed() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="mx-auto max-w-app w-full flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-2xl font-bold text-text-dark mb-2">Order Placed!</h1>
        <p className="text-text-body text-sm text-center mb-1">
          Your order has been placed successfully.
        </p>
        <p className="text-xs text-text-muted mb-8">Order ID: <span className="font-mono">{id}</span></p>

        <div className="bg-primary-light rounded-2xl px-6 py-4 w-full text-center mb-8">
          <p className="text-xs text-text-body">Estimated delivery</p>
          <p className="text-2xl font-bold text-primary">~35 min</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <PrimaryButton onClick={() => navigate(`/order/${id}`)}>
            Track Order
          </PrimaryButton>
          <OutlineButton onClick={() => navigate('/home')}>
            Order More Food
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create OrderTracking page**

Replace `frontend/src/pages/OrderTracking.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/api';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { OrderStepper } from '../components/order/OrderStepper';
import { PageHeader } from '../components/layout/PageHeader';
import { PrimaryButton } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

const STATUS_MESSAGES = {
  placed: '⏳ Your order has been placed',
  confirmed: '🏪 Restaurant confirmed your order',
  preparing: '🍳 Your food is being prepared',
  out_for_delivery: '🛵 Out for delivery!',
  delivered: '🏠 Delivered! Enjoy your meal 🎉',
};

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  useOrderTracking(order, (updated) => setOrder(updated));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-app">
        <PageHeader title="Track Order" showBack />

        {/* Status Card */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <div className="bg-white px-4 py-5">
            <p className="text-base font-bold text-text-dark mb-1">
              {STATUS_MESSAGES[order.status]}
            </p>
            <p className="text-xs text-text-body">
              Order #{order._id.slice(-6).toUpperCase()} · {order.restaurantId?.name}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-6 shadow-sm">
          <OrderStepper status={order.status} />
          <p className="text-xs text-text-body text-center mt-4">
            {order.status !== 'delivered'
              ? 'Status updates every ~45 seconds'
              : 'Order delivered! Thank you for using FoodRush.'}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3">Order Details</h3>
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-divider last:border-0">
              <span className="text-text-body">{item.name} × {item.qty}</span>
              <span className="font-medium">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-text-dark mt-3 pt-2 border-t border-divider">
            <span>Total paid</span><span>₹{order.total}</span>
          </div>
        </div>

        {order.status === 'delivered' && (
          <div className="px-4 py-6">
            <PrimaryButton onClick={() => navigate('/home')}>Order Again</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/order/OrderStepper.jsx frontend/src/hooks/ frontend/src/pages/OrderConfirmed.jsx frontend/src/pages/OrderTracking.jsx
git commit -m "feat(frontend): Order Confirmed + Tracking screens with auto-advance timer"
```

---

### Task 9: Order History + Profile Screens

**Files:**
- Create: `frontend/src/components/order/OrderCard.jsx`
- Create: `frontend/src/pages/OrderHistory.jsx`
- Create: `frontend/src/pages/Profile.jsx`

- [ ] **Step 1: Create OrderCard**

Create `frontend/src/components/order/OrderCard.jsx`:
```jsx
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';

export function OrderCard({ order }) {
  const navigate = useNavigate();
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div
      onClick={() => navigate(`/order/${order._id}`)}
      className="bg-white rounded-2xl px-4 py-4 shadow-sm cursor-pointer active:scale-98 transition-transform"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-text-dark text-sm">{order.restaurantId?.name || 'Restaurant'}</p>
          <p className="text-xs text-text-body mt-0.5">{date}</p>
        </div>
        <Badge status={order.status} />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-divider">
        <p className="text-xs text-text-body">{order.items?.length} items</p>
        <p className="font-bold text-text-dark text-sm">₹{order.total}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement OrderHistory page**

Replace `frontend/src/pages/OrderHistory.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { PageLayout } from '../components/layout/PageLayout';
import { OrderCard } from '../components/order/OrderCard';
import { Spinner } from '../components/ui/Spinner';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-xl font-bold text-text-dark">Your Orders</h1>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-text-body text-sm">No orders yet</p>
          </div>
        ) : (
          orders.map((o) => <OrderCard key={o._id} order={o} />)
        )}
      </div>
    </PageLayout>
  );
}
```

- [ ] **Step 3: Implement Profile page**

Replace `frontend/src/pages/Profile.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { PageLayout } from '../components/layout/PageLayout';
import { Input } from '../components/ui/Input';
import { PrimaryButton } from '../components/ui/Button';
import { GhostButton } from '../components/ui/Button';

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.defaultAddress || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((r) => {
      setName(r.data.name);
      setAddress(r.data.defaultAddress || '');
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await updateProfile({ name, defaultAddress: address });
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageLayout>
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-xl font-bold text-text-dark">Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-white font-bold mb-2">
          {name?.[0]?.toUpperCase() || '?'}
        </div>
        <p className="font-semibold text-text-dark">{name || 'Set your name'}</p>
        <p className="text-sm text-text-muted">+91 {user?.phone}</p>
      </div>

      {/* Edit Form */}
      <div className="bg-white mx-4 rounded-2xl px-4 py-5 shadow-sm flex flex-col gap-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <div>
          <label className="text-sm font-medium text-text-dark block mb-1">Phone</label>
          <div className="h-12 px-4 border border-divider rounded-xl flex items-center bg-gray-50">
            <span className="text-sm text-gray-400">+91 {user?.phone}</span>
          </div>
        </div>
        <Input label="Default Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your home address" />

        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </PrimaryButton>
      </div>

      {/* Logout */}
      <div className="px-4 py-5">
        <GhostButton onClick={logout}>Logout</GhostButton>
      </div>
    </PageLayout>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/order/OrderCard.jsx frontend/src/pages/OrderHistory.jsx frontend/src/pages/Profile.jsx
git commit -m "feat(frontend): Order History and Profile screens"
```

---

### Task 10: Vitest Tests + Vercel Deploy Config

**Files:**
- Create: `frontend/src/components/ui/Button.test.jsx`
- Create: `frontend/src/hooks/useOrderTracking.test.js`
- Create: `frontend/vercel.json`
- Create: `frontend/.gitignore`

- [ ] **Step 1: Write Button component tests**

Create `frontend/src/components/ui/Button.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton, OutlineButton } from './Button';

test('PrimaryButton renders children and calls onClick', () => {
  const handler = vi.fn();
  render(<PrimaryButton onClick={handler}>Pay Now</PrimaryButton>);
  expect(screen.getByText('Pay Now')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Pay Now'));
  expect(handler).toHaveBeenCalledTimes(1);
});

test('PrimaryButton is disabled when disabled prop is true', () => {
  render(<PrimaryButton disabled>Pay Now</PrimaryButton>);
  expect(screen.getByText('Pay Now')).toBeDisabled();
});

test('OutlineButton renders children', () => {
  render(<OutlineButton>Cancel</OutlineButton>);
  expect(screen.getByText('Cancel')).toBeInTheDocument();
});
```

- [ ] **Step 2: Write useOrderTracking hook tests**

Create `frontend/src/hooks/useOrderTracking.test.js`:
```js
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useOrderTracking } from './useOrderTracking';
import * as api from '../services/api';

vi.mock('../services/api');
vi.useFakeTimers();

test('calls updateOrderStatus after 45s and fires onStatusChange', async () => {
  const order = { _id: 'o1', status: 'placed' };
  const onStatusChange = vi.fn();
  api.updateOrderStatus.mockResolvedValue({ data: { ...order, status: 'confirmed' } });

  renderHook(() => useOrderTracking(order, onStatusChange));

  await vi.advanceTimersByTimeAsync(45000);
  expect(api.updateOrderStatus).toHaveBeenCalledWith('o1', 'confirmed');
  expect(onStatusChange).toHaveBeenCalledWith({ _id: 'o1', status: 'confirmed' });
});

test('does not advance if already delivered', () => {
  const order = { _id: 'o1', status: 'delivered' };
  const onStatusChange = vi.fn();
  renderHook(() => useOrderTracking(order, onStatusChange));
  vi.advanceTimersByTime(45000);
  expect(api.updateOrderStatus).not.toHaveBeenCalled();
});
```

- [ ] **Step 3: Run all frontend tests**

```bash
cd frontend && npm test
```
Expected: All test suites pass (Button, cartStore, useOrderTracking, Home)

- [ ] **Step 4: Create vercel.json for SPA routing**

Create `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 5: Create frontend .gitignore**

Create `frontend/.gitignore`:
```
node_modules/
dist/
.env
```

- [ ] **Step 6: Final commit and push**

```bash
git add frontend/
git commit -m "feat(frontend): tests, Vercel config, full frontend complete"
git push origin main
```

**Vercel deployment:** Dashboard → New Project → Import repo → Set Root Directory to `frontend` → Framework: Vite → Add env var `VITE_API_URL=https://your-render-service.onrender.com` → Deploy.
