require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const restaurants = [
  {
    name: 'Pizza Palace',
    cuisine: ['Pizza', 'Italian'],
    rating: 4.3,
    deliveryTime: 30,
    deliveryFee: 49,
    minOrder: 149,
    isOpen: true,
    address: 'Koramangala, Bangalore',
    categories: [
      {
        name: 'Starters',
        items: [
          { name: 'Garlic Bread', description: 'Crispy garlic bread with herbs', price: 99, isVeg: true },
          { name: 'Bruschetta', description: 'Toasted bread with tomato topping', price: 129, isVeg: true },
          { name: 'Chicken Wings', description: 'BBQ glazed wings', price: 199, isVeg: false },
          { name: 'Mozzarella Sticks', description: 'Fried cheese sticks with marinara', price: 149, isVeg: true },
        ],
      },
      {
        name: 'Pizzas',
        items: [
          { name: 'Margherita', description: 'Classic tomato base with mozzarella', price: 249, isVeg: true },
          { name: 'Pepperoni', description: 'Spicy pepperoni with cheese', price: 329, isVeg: false },
          { name: 'BBQ Chicken', description: 'Smoky BBQ chicken with peppers', price: 349, isVeg: false },
          { name: 'Veggie Supreme', description: 'Loaded with seasonal vegetables', price: 299, isVeg: true },
          { name: 'Mushroom Truffle', description: 'Wild mushrooms with truffle oil', price: 369, isVeg: true },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 149, isVeg: true },
          { name: 'Choco Lava Cake', description: 'Warm chocolate cake with molten centre', price: 129, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'Burger Barn',
    cuisine: ['Burgers', 'American'],
    rating: 4.5,
    deliveryTime: 25,
    deliveryFee: 0,
    minOrder: 199,
    isOpen: true,
    address: 'Indiranagar, Bangalore',
    categories: [
      {
        name: 'Burgers',
        items: [
          { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar and pickles', price: 249, isVeg: false },
          { name: 'Crispy Chicken Burger', description: 'Fried chicken fillet with slaw', price: 279, isVeg: false },
          { name: 'Veggie Burger', description: 'Spiced bean patty with lettuce', price: 199, isVeg: true },
          { name: 'Double Smash', description: 'Double smashed beef patties', price: 349, isVeg: false },
        ],
      },
      {
        name: 'Sides',
        items: [
          { name: 'Loaded Fries', description: 'Fries with cheese sauce and jalapeños', price: 149, isVeg: true },
          { name: 'Onion Rings', description: 'Crispy golden onion rings', price: 99, isVeg: true },
          { name: 'Coleslaw', description: 'Creamy homemade coleslaw', price: 69, isVeg: true },
        ],
      },
      {
        name: 'Shakes',
        items: [
          { name: 'Chocolate Shake', description: 'Thick Belgian chocolate milkshake', price: 149, isVeg: true },
          { name: 'Strawberry Shake', description: 'Fresh strawberry milkshake', price: 149, isVeg: true },
          { name: 'Oreo Shake', description: 'Crushed oreo blended shake', price: 169, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'Biryani House',
    cuisine: ['Biryani', 'Indian'],
    rating: 4.6,
    deliveryTime: 40,
    deliveryFee: 29,
    minOrder: 249,
    isOpen: true,
    address: 'Frazer Town, Bangalore',
    categories: [
      {
        name: 'Biryani',
        items: [
          { name: 'Chicken Dum Biryani', description: 'Slow-cooked dum biryani with raita', price: 299, isVeg: false },
          { name: 'Mutton Biryani', description: 'Tender mutton with aged basmati', price: 379, isVeg: false },
          { name: 'Veg Biryani', description: 'Seasonal vegetables with saffron rice', price: 229, isVeg: true },
          { name: 'Egg Biryani', description: 'Spiced egg biryani with onion raita', price: 249, isVeg: false },
          { name: 'Prawn Biryani', description: 'Coastal style prawn biryani', price: 399, isVeg: false },
        ],
      },
      {
        name: 'Kebabs',
        items: [
          { name: 'Seekh Kebab', description: 'Minced lamb kebab with mint chutney', price: 249, isVeg: false },
          { name: 'Paneer Tikka', description: 'Grilled paneer with spices', price: 219, isVeg: true },
          { name: 'Chicken Reshmi', description: 'Creamy chicken kebab', price: 239, isVeg: false },
        ],
      },
      {
        name: 'Accompaniments',
        items: [
          { name: 'Raita', description: 'Cooling yoghurt with cucumber', price: 49, isVeg: true },
          { name: 'Salan', description: 'Spicy mirchi ka salan', price: 79, isVeg: true },
          { name: 'Phirni', description: 'Chilled rice pudding', price: 89, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'Dragon Wok',
    cuisine: ['Chinese', 'Asian'],
    rating: 4.2,
    deliveryTime: 35,
    deliveryFee: 39,
    minOrder: 199,
    isOpen: true,
    address: 'MG Road, Bangalore',
    categories: [
      {
        name: 'Soups',
        items: [
          { name: 'Hot & Sour Soup', description: 'Tangy broth with vegetables', price: 99, isVeg: true },
          { name: 'Chicken Manchow', description: 'Crispy noodle soup', price: 129, isVeg: false },
          { name: 'Sweet Corn Soup', description: 'Creamy corn vegetable soup', price: 89, isVeg: true },
        ],
      },
      {
        name: 'Main Course',
        items: [
          { name: 'Chicken Manchurian', description: 'Crispy chicken in manchurian sauce', price: 249, isVeg: false },
          { name: 'Paneer Chilli', description: 'Stir-fried paneer with peppers', price: 229, isVeg: true },
          { name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts', price: 269, isVeg: false },
          { name: 'Mushroom in Black Bean', description: 'Mushrooms in black bean sauce', price: 219, isVeg: true },
        ],
      },
      {
        name: 'Rice & Noodles',
        items: [
          { name: 'Chicken Fried Rice', description: 'Wok-tossed egg fried rice', price: 199, isVeg: false },
          { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 169, isVeg: true },
          { name: 'Chicken Chow Mein', description: 'Classic chow mein with chicken', price: 219, isVeg: false },
          { name: 'Schezwan Fried Rice', description: 'Spicy schezwan rice with egg', price: 199, isVeg: false },
        ],
      },
    ],
  },
  {
    name: 'Green Bowl',
    cuisine: ['Healthy', 'Salads'],
    rating: 4.8,
    deliveryTime: 18,
    deliveryFee: 49,
    minOrder: 299,
    isOpen: true,
    address: 'HSR Layout, Bangalore',
    categories: [
      {
        name: 'Power Bowls',
        items: [
          { name: 'Quinoa Protein Bowl', description: 'Quinoa, grilled chicken, avocado', price: 349, isVeg: false },
          { name: 'Buddha Bowl', description: 'Brown rice, roasted veggies, tahini', price: 299, isVeg: true },
          { name: 'Greek Bowl', description: 'Falafel, hummus, tabbouleh, pita', price: 329, isVeg: true },
          { name: 'Keto Bowl', description: 'Grilled salmon, spinach, eggs', price: 399, isVeg: false },
        ],
      },
      {
        name: 'Salads',
        items: [
          { name: 'Classic Caesar', description: 'Romaine, croutons, parmesan', price: 229, isVeg: true },
          { name: 'Grilled Chicken Salad', description: 'Mixed greens with grilled chicken', price: 279, isVeg: false },
          { name: 'Watermelon Feta', description: 'Watermelon, feta, mint, balsamic', price: 249, isVeg: true },
        ],
      },
      {
        name: 'Smoothies',
        items: [
          { name: 'Green Detox', description: 'Spinach, banana, almond milk', price: 179, isVeg: true },
          { name: 'Berry Blast', description: 'Mixed berries with Greek yoghurt', price: 189, isVeg: true },
          { name: 'Mango Turmeric', description: 'Mango, turmeric, coconut milk', price: 169, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'Sweet Cravings',
    cuisine: ['Desserts', 'Bakery'],
    rating: 4.7,
    deliveryTime: 20,
    deliveryFee: 29,
    minOrder: 149,
    isOpen: true,
    address: 'Jayanagar, Bangalore',
    categories: [
      {
        name: 'Cakes',
        items: [
          { name: 'Chocolate Truffle', description: 'Rich dark chocolate cake', price: 199, isVeg: true },
          { name: 'Red Velvet', description: 'Classic red velvet with cream cheese', price: 219, isVeg: true },
          { name: 'Bento Cake (personalised)', description: 'Mini personalised cake', price: 349, isVeg: true },
        ],
      },
      {
        name: 'Waffles & Pancakes',
        items: [
          { name: 'Classic Waffle', description: 'Belgium waffle with maple syrup', price: 149, isVeg: true },
          { name: 'Nutella Waffle', description: 'Waffle with Nutella and banana', price: 179, isVeg: true },
          { name: 'Pancake Stack', description: 'Buttermilk pancakes with berries', price: 169, isVeg: true },
          { name: 'Choco Chip Pancakes', description: 'Fluffy pancakes with chocolate chips', price: 179, isVeg: true },
        ],
      },
      {
        name: 'Ice Cream',
        items: [
          { name: 'Sundae Royale', description: 'Triple scoop with hot fudge', price: 199, isVeg: true },
          { name: 'Banana Split', description: 'Banana with three flavours', price: 229, isVeg: true },
          { name: 'Kulfi Platter', description: 'Assorted kulfi with falooda', price: 149, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'Spice Route',
    cuisine: ['Indian', 'North Indian'],
    rating: 4.4,
    deliveryTime: 45,
    deliveryFee: 39,
    minOrder: 299,
    isOpen: true,
    address: 'Whitefield, Bangalore',
    categories: [
      {
        name: 'Dal & Curry',
        items: [
          { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter', price: 199, isVeg: true },
          { name: 'Butter Chicken', description: 'Creamy tomato chicken curry', price: 279, isVeg: false },
          { name: 'Paneer Butter Masala', description: 'Paneer in rich tomato gravy', price: 249, isVeg: true },
          { name: 'Mutton Rogan Josh', description: 'Slow-cooked Kashmiri mutton', price: 349, isVeg: false },
        ],
      },
      {
        name: 'Breads',
        items: [
          { name: 'Garlic Naan', description: 'Leavened flatbread with garlic butter', price: 49, isVeg: true },
          { name: 'Paratha', description: 'Whole wheat layered bread', price: 45, isVeg: true },
          { name: 'Roomali Roti', description: 'Thin handkerchief bread', price: 39, isVeg: true },
          { name: 'Laccha Paratha', description: 'Multi-layered flaky paratha', price: 55, isVeg: true },
        ],
      },
      {
        name: 'Rice',
        items: [
          { name: 'Jeera Rice', description: 'Fragrant cumin basmati rice', price: 99, isVeg: true },
          { name: 'Kashmiri Pulao', description: 'Sweet saffron rice with dry fruits', price: 149, isVeg: true },
          { name: 'Chicken Pulao', description: 'One-pot chicken and rice', price: 229, isVeg: false },
        ],
      },
    ],
  },
  {
    name: 'Thai Garden',
    cuisine: ['Thai', 'Asian'],
    rating: 4.3,
    deliveryTime: 35,
    deliveryFee: 49,
    minOrder: 249,
    isOpen: true,
    address: 'Sadashivanagar, Bangalore',
    categories: [
      {
        name: 'Starters',
        items: [
          { name: 'Spring Rolls', description: 'Crispy veg spring rolls with sweet chilli', price: 149, isVeg: true },
          { name: 'Satay Chicken', description: 'Grilled chicken skewers with peanut sauce', price: 199, isVeg: false },
          { name: 'Tom Kha Soup', description: 'Coconut galangal soup', price: 159, isVeg: false },
        ],
      },
      {
        name: 'Curries',
        items: [
          { name: 'Green Curry', description: 'Chicken in aromatic green curry', price: 299, isVeg: false },
          { name: 'Red Curry', description: 'Prawns in spicy red curry', price: 329, isVeg: false },
          { name: 'Massaman Curry', description: 'Slow-cooked potatoes and tofu', price: 269, isVeg: true },
          { name: 'Yellow Curry', description: 'Mild turmeric chicken curry', price: 289, isVeg: false },
        ],
      },
      {
        name: 'Noodles & Rice',
        items: [
          { name: 'Pad Thai', description: 'Stir-fried rice noodles with tofu or chicken', price: 249, isVeg: false },
          { name: 'Basil Fried Rice', description: 'Thai basil fried rice with egg', price: 229, isVeg: false },
          { name: 'Pineapple Fried Rice', description: 'Rice fried in pineapple shell', price: 269, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'The Continental',
    cuisine: ['Continental', 'European'],
    rating: 4.6,
    deliveryTime: 40,
    deliveryFee: 59,
    minOrder: 399,
    isOpen: true,
    address: 'UB City, Bangalore',
    categories: [
      {
        name: 'Starters',
        items: [
          { name: 'French Onion Soup', description: 'Caramelised onion soup with gruyere crouton', price: 199, isVeg: true },
          { name: 'Shrimp Cocktail', description: 'Chilled shrimp with cocktail sauce', price: 349, isVeg: false },
          { name: 'Caprese Salad', description: 'Tomato, mozzarella, basil, EVOO', price: 249, isVeg: true },
          { name: 'Pâté on Toast', description: 'Chicken liver pâté with cornichons', price: 279, isVeg: false },
        ],
      },
      {
        name: 'Mains',
        items: [
          { name: 'Grilled Salmon', description: 'Atlantic salmon with beurre blanc', price: 499, isVeg: false },
          { name: 'Beef Tenderloin', description: '200g tenderloin with truffle jus', price: 599, isVeg: false },
          { name: 'Mushroom Risotto', description: 'Arborio rice with wild mushrooms', price: 349, isVeg: true },
          { name: 'Chicken Cordon Bleu', description: 'Stuffed chicken with ham and cheese', price: 399, isVeg: false },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { name: 'Crème Brûlée', description: 'Classic vanilla custard with caramel crust', price: 199, isVeg: true },
          { name: 'Chocolate Fondant', description: 'Warm fondant with vanilla gelato', price: 219, isVeg: true },
          { name: 'Panna Cotta', description: 'Vanilla panna cotta with berry coulis', price: 189, isVeg: true },
        ],
      },
    ],
  },
  {
    name: 'South Spice',
    cuisine: ['South Indian', 'Indian'],
    rating: 4.5,
    deliveryTime: 25,
    deliveryFee: 29,
    minOrder: 99,
    isOpen: false,
    address: 'Malleshwaram, Bangalore',
    categories: [
      {
        name: 'Dosas',
        items: [
          { name: 'Masala Dosa', description: 'Crispy dosa with spiced potato', price: 99, isVeg: true },
          { name: 'Ghee Roast', description: 'Dosa roasted in pure ghee', price: 119, isVeg: true },
          { name: 'Rava Dosa', description: 'Crispy semolina dosa', price: 109, isVeg: true },
          { name: 'Set Dosa', description: 'Soft fluffy set of 3 dosas', price: 89, isVeg: true },
        ],
      },
      {
        name: 'Idli & Vada',
        items: [
          { name: 'Idli Sambar', description: '3 soft idlis with sambar and chutneys', price: 79, isVeg: true },
          { name: 'Medu Vada', description: '2 crispy vadas with sambar', price: 69, isVeg: true },
          { name: 'Rava Idli', description: 'Instant semolina idli with chutney', price: 89, isVeg: true },
        ],
      },
      {
        name: 'Rice Meals',
        items: [
          { name: 'Mini Meals', description: 'Rice, sambar, rasam, 3 curries, pappad, dessert', price: 149, isVeg: true },
          { name: 'Curd Rice', description: 'Seasoned curd rice with pickle', price: 89, isVeg: true },
          { name: 'Bisi Bele Bath', description: 'Lentil rice with vegetables and ghee', price: 119, isVeg: true },
          { name: 'Lemon Rice', description: 'Tangy turmeric rice with peanuts', price: 99, isVeg: true },
        ],
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB — seeding...');

  await MenuItem.deleteMany({});
  await Category.deleteMany({});
  await Restaurant.deleteMany({});

  for (const data of restaurants) {
    const { categories: cats, ...restaurantData } = data;
    const restaurant = await Restaurant.create(restaurantData);

    for (let i = 0; i < cats.length; i++) {
      const { items, ...catData } = cats[i];
      const category = await Category.create({ ...catData, restaurantId: restaurant._id, sortOrder: i });

      const menuItems = items.map((item) => ({
        ...item,
        categoryId: category._id,
        restaurantId: restaurant._id,
      }));
      await MenuItem.insertMany(menuItems);
    }
    console.log(`  ✓ ${restaurant.name}`);
  }

  console.log(`Seeded ${restaurants.length} restaurants.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
