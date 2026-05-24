import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';
import MenuItemCard from '../components/MenuItemCard';
import CategoryTabs from '../components/CategoryTabs';
import FloatingCartBar from '../components/FloatingCartBar';
import useCartStore from '../stores/cartStore';

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const categorySectionRefs = useRef({});

  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const setCartRestaurant = useCartStore((state) => state.setRestaurant);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);

        if (data.categories && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }

        if (cartRestaurantId !== id) {
          setCartRestaurant(id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, cartRestaurantId, setCartRestaurant]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);

    const element = categorySectionRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading restaurant...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 text-indigo-500 font-semibold"
        >
          ← Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Restaurant not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 px-3 py-1 bg-white rounded-full shadow-md text-gray-900 font-semibold"
        >
          ←
        </button>

        <div className="aspect-video bg-gray-200 relative">
          <img
            src={restaurant.image || 'https://via.placeholder.com/800x400'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurant.name}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisines?.map((cuisine) => (
              <span
                key={cuisine}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {cuisine}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-yellow-500">★ {restaurant.rating}</p>
            </div>
            <div>
              <p>⏱️ {restaurant.deliveryTime} min</p>
            </div>
            <div>
              <p>Delivery: ₹{restaurant.deliveryCharge}</p>
            </div>
            <div>
              <p>Min order: ₹{restaurant.minOrder}</p>
            </div>
          </div>

          {!restaurant.isOpen && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold text-center">
              Currently Closed
            </div>
          )}
        </div>
      </div>

      {restaurant.categories && restaurant.categories.length > 0 && (
        <CategoryTabs
          categories={restaurant.categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />
      )}

      <div className="px-4 py-4">
        {restaurant.categories?.map((category) => (
          <div
            key={category.id}
            ref={(el) => {
              categorySectionRefs.current[category.id] = el;
            }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-16 bg-gray-50 py-2 z-10">
              {category.name}
            </h2>

            {category.items?.map((item) => (
              <MenuItemCard
                key={item.id}
                item={{
                  id: item.id,
                  ...item,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <FloatingCartBar />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4">
          <button
            onClick={() => navigate('/home')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-500 font-semibold hover:text-indigo-500"
          >
            🏠 Home
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-500 font-semibold hover:text-indigo-500">
            🛒 Cart
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-500 font-semibold hover:text-indigo-500">
            📦 Orders
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-500 font-semibold hover:text-indigo-500">
            👤 Profile
          </button>
        </div>
      </div>
    </div>
  );
}
