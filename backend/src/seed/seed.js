require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrush';

const restaurants = [
  {
    name: 'Pizza Paradise',
    image: 'https://via.placeholder.com/300?text=Pizza+Paradise',
    rating: 4.5,
    deliveryTime: 25,
    deliveryCharge: 50,
    minOrder: 200,
    cuisines: ['Italian', 'Pizza'],
    isOpen: true,
    categories: [
      {
        id: 'pizzas',
        name: 'Pizzas',
        items: [
          { id: 'p1', name: 'Margherita', description: 'Classic cheese pizza', price: 299, isVeg: true, isAvailable: true },
          { id: 'p2', name: 'Pepperoni', description: 'With pepperoni', price: 349, isVeg: false, isAvailable: true },
          { id: 'p3', name: 'Veggie Supreme', description: 'Loaded with vegetables', price: 329, isVeg: true, isAvailable: true },
          { id: 'p4', name: 'BBQ Chicken', description: 'Grilled chicken & BBQ sauce', price: 379, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'sides',
        name: 'Sides & Salads',
        items: [
          { id: 's1', name: 'Garlic Bread', description: 'Crispy garlic bread', price: 129, isVeg: true, isAvailable: true },
          { id: 's2', name: 'Caesar Salad', description: 'Fresh greens with dressing', price: 199, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Burger Barn',
    image: 'https://via.placeholder.com/300?text=Burger+Barn',
    rating: 4.3,
    deliveryTime: 20,
    deliveryCharge: 40,
    minOrder: 150,
    cuisines: ['American', 'Burgers'],
    isOpen: true,
    categories: [
      {
        id: 'burgers',
        name: 'Burgers',
        items: [
          { id: 'b1', name: 'Classic Cheeseburger', description: 'Beef patty with cheddar', price: 249, isVeg: false, isAvailable: true },
          { id: 'b2', name: 'Veggie Burger', description: 'Plant-based patty', price: 199, isVeg: true, isAvailable: true },
          { id: 'b3', name: 'Double Burger', description: 'Two beef patties', price: 349, isVeg: false, isAvailable: true },
          { id: 'b4', name: 'Spicy Chicken Burger', description: 'Crispy chicken with spice', price: 299, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'sides',
        name: 'Sides',
        items: [
          { id: 'b5', name: 'Fries', description: 'Golden crispy fries', price: 99, isVeg: true, isAvailable: true },
          { id: 'b6', name: 'Onion Rings', description: 'Crispy onion rings', price: 129, isVeg: true, isAvailable: false },
        ],
      },
    ],
  },
  {
    name: 'Biryani House',
    image: 'https://via.placeholder.com/300?text=Biryani+House',
    rating: 4.7,
    deliveryTime: 35,
    deliveryCharge: 60,
    minOrder: 250,
    cuisines: ['Indian', 'Biryani'],
    isOpen: true,
    categories: [
      {
        id: 'biryani',
        name: 'Biryani',
        items: [
          { id: 'bi1', name: 'Chicken Biryani', description: 'Aromatic rice with chicken', price: 299, isVeg: false, isAvailable: true },
          { id: 'bi2', name: 'Mutton Biryani', description: 'With tender mutton pieces', price: 349, isVeg: false, isAvailable: true },
          { id: 'bi3', name: 'Veg Biryani', description: 'Mixed vegetables biryani', price: 249, isVeg: true, isAvailable: true },
          { id: 'bi4', name: 'Egg Biryani', description: 'With boiled eggs', price: 229, isVeg: true, isAvailable: true },
        ],
      },
      {
        id: 'curries',
        name: 'Curries',
        items: [
          { id: 'bi5', name: 'Butter Chicken', description: 'Creamy tomato curry', price: 279, isVeg: false, isAvailable: true },
          { id: 'bi6', name: 'Dal Makhani', description: 'Creamy lentil curry', price: 199, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Dragon Wok',
    image: 'https://via.placeholder.com/300?text=Dragon+Wok',
    rating: 4.4,
    deliveryTime: 28,
    deliveryCharge: 45,
    minOrder: 180,
    cuisines: ['Chinese'],
    isOpen: true,
    categories: [
      {
        id: 'noodles',
        name: 'Noodles',
        items: [
          { id: 'd1', name: 'Hakka Noodles', description: 'Stir-fried with vegetables', price: 199, isVeg: true, isAvailable: true },
          { id: 'd2', name: 'Chicken Noodles', description: 'With tender chicken', price: 249, isVeg: false, isAvailable: true },
          { id: 'd3', name: 'Chow Mein', description: 'Classic stir-fried noodles', price: 219, isVeg: true, isAvailable: true },
        ],
      },
      {
        id: 'rice',
        name: 'Fried Rice',
        items: [
          { id: 'd4', name: 'Egg Fried Rice', description: 'With scrambled eggs', price: 189, isVeg: true, isAvailable: true },
          { id: 'd5', name: 'Chicken Fried Rice', description: 'With diced chicken', price: 239, isVeg: false, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Healthy Bowl',
    image: 'https://via.placeholder.com/300?text=Healthy+Bowl',
    rating: 4.6,
    deliveryTime: 22,
    deliveryCharge: 40,
    minOrder: 200,
    cuisines: ['Healthy', 'Salads'],
    isOpen: false,
    categories: [
      {
        id: 'bowls',
        name: 'Bowls',
        items: [
          { id: 'h1', name: 'Quinoa Bowl', description: 'With grilled vegetables', price: 279, isVeg: true, isAvailable: true },
          { id: 'h2', name: 'Grilled Chicken Bowl', description: 'Lean protein salad', price: 329, isVeg: false, isAvailable: true },
          { id: 'h3', name: 'Vegan Buddha Bowl', description: 'Organic vegetables', price: 249, isVeg: true, isAvailable: true },
        ],
      },
      {
        id: 'smoothies',
        name: 'Smoothies',
        items: [
          { id: 'h4', name: 'Mango Smoothie', description: 'Fresh mango blend', price: 129, isVeg: true, isAvailable: true },
          { id: 'h5', name: 'Green Detox', description: 'Spinach & apple', price: 149, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Taco Fiesta',
    image: 'https://via.placeholder.com/300?text=Taco+Fiesta',
    rating: 4.2,
    deliveryTime: 25,
    deliveryCharge: 45,
    minOrder: 200,
    cuisines: ['Mexican'],
    isOpen: true,
    categories: [
      {
        id: 'tacos',
        name: 'Tacos',
        items: [
          { id: 't1', name: 'Chicken Tacos', description: 'Grilled chicken tacos', price: 229, isVeg: false, isAvailable: true },
          { id: 't2', name: 'Veggie Tacos', description: 'Bean and vegetable tacos', price: 179, isVeg: true, isAvailable: true },
          { id: 't3', name: 'Beef Tacos', description: 'Spiced ground beef', price: 259, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'bowls',
        name: 'Bowls',
        items: [
          { id: 't4', name: 'Chicken Burrito Bowl', description: 'Rice, beans, chicken', price: 299, isVeg: false, isAvailable: true },
          { id: 't5', name: 'Veggie Burrito Bowl', description: 'Mixed vegetables', price: 249, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Sushi Sensations',
    image: 'https://via.placeholder.com/300?text=Sushi+Sensations',
    rating: 4.8,
    deliveryTime: 30,
    deliveryCharge: 60,
    minOrder: 300,
    cuisines: ['Japanese', 'Sushi'],
    isOpen: true,
    categories: [
      {
        id: 'sushi',
        name: 'Sushi Rolls',
        items: [
          { id: 'su1', name: 'California Roll', description: 'Crab and avocado', price: 349, isVeg: false, isAvailable: true },
          { id: 'su2', name: 'Vegetable Roll', description: 'Cucumber and carrot', price: 279, isVeg: true, isAvailable: true },
          { id: 'su3', name: 'Spicy Tuna Roll', description: 'Tuna with spice', price: 399, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'bowls',
        name: 'Poke Bowls',
        items: [
          { id: 'su4', name: 'Salmon Poke Bowl', description: 'Fresh salmon', price: 429, isVeg: false, isAvailable: true },
          { id: 'su5', name: 'Tofu Poke Bowl', description: 'Marinated tofu', price: 349, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Dessert Delight',
    image: 'https://via.placeholder.com/300?text=Dessert+Delight',
    rating: 4.9,
    deliveryTime: 20,
    deliveryCharge: 30,
    minOrder: 150,
    cuisines: ['Desserts', 'Bakery'],
    isOpen: true,
    categories: [
      {
        id: 'cakes',
        name: 'Cakes',
        items: [
          { id: 'de1', name: 'Chocolate Cake', description: 'Rich chocolate layers', price: 199, isVeg: true, isAvailable: true },
          { id: 'de2', name: 'Cheesecake', description: 'New York style', price: 249, isVeg: true, isAvailable: true },
          { id: 'de3', name: 'Carrot Cake', description: 'With cream cheese frosting', price: 229, isVeg: true, isAvailable: true },
        ],
      },
      {
        id: 'ice_cream',
        name: 'Ice Cream',
        items: [
          { id: 'de4', name: 'Vanilla Scoop', description: 'Premium vanilla', price: 99, isVeg: true, isAvailable: true },
          { id: 'de5', name: 'Chocolate Scoop', description: 'Rich chocolate', price: 99, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Thai Spice',
    image: 'https://via.placeholder.com/300?text=Thai+Spice',
    rating: 4.5,
    deliveryTime: 32,
    deliveryCharge: 55,
    minOrder: 220,
    cuisines: ['Thai'],
    isOpen: true,
    categories: [
      {
        id: 'curries',
        name: 'Curries',
        items: [
          { id: 'th1', name: 'Green Curry', description: 'Spicy green curry', price: 289, isVeg: true, isAvailable: true },
          { id: 'th2', name: 'Red Curry Chicken', description: 'With chicken', price: 319, isVeg: false, isAvailable: true },
          { id: 'th3', name: 'Massaman Curry', description: 'Rich and mild', price: 329, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'pad',
        name: 'Pad Thai',
        items: [
          { id: 'th4', name: 'Pad Thai Veg', description: 'Vegetable noodles', price: 219, isVeg: true, isAvailable: true },
          { id: 'th5', name: 'Pad Thai Shrimp', description: 'With shrimp', price: 299, isVeg: false, isAvailable: true },
        ],
      },
    ],
  },
  {
    name: 'Mediterranean Grill',
    image: 'https://via.placeholder.com/300?text=Mediterranean+Grill',
    rating: 4.4,
    deliveryTime: 28,
    deliveryCharge: 50,
    minOrder: 200,
    cuisines: ['Mediterranean', 'Greek'],
    isOpen: true,
    categories: [
      {
        id: 'gyros',
        name: 'Gyros',
        items: [
          { id: 'mg1', name: 'Chicken Gyro', description: 'Marinated chicken', price: 249, isVeg: false, isAvailable: true },
          { id: 'mg2', name: 'Vegetable Gyro', description: 'Grilled vegetables', price: 199, isVeg: true, isAvailable: true },
          { id: 'mg3', name: 'Lamb Gyro', description: 'Spiced lamb', price: 289, isVeg: false, isAvailable: true },
        ],
      },
      {
        id: 'sides',
        name: 'Sides',
        items: [
          { id: 'mg4', name: 'Hummus & Pita', description: 'Creamy hummus', price: 129, isVeg: true, isAvailable: true },
          { id: 'mg5', name: 'Greek Salad', description: 'Fresh vegetables', price: 179, isVeg: true, isAvailable: true },
        ],
      },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    const created = await Restaurant.insertMany(restaurants);
    console.log(`✓ Seeded ${created.length} restaurants`);

    const count = await Restaurant.countDocuments();
    console.log(`Total restaurants in DB: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
