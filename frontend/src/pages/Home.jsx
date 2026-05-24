import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { restaurantService } from '../services/restaurantService';
import RestaurantCard from '../components/RestaurantCard';
import CuisineChip from '../components/CuisineChip';

const CUISINES = ['All', 'Italian', 'Pizza', 'American', 'Burgers', 'Indian', 'Biryani', 'Chinese', 'Healthy', 'Salads', 'Mexican', 'Japanese', 'Sushi', 'Thai', 'Mediterranean', 'Greek', 'Desserts', 'Bakery'];

export default function Home() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (selectedCuisine !== 'All') {
        filters.cuisine = selectedCuisine;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const data = await restaurantService.getRestaurants(filters);
      setRestaurants(data);
    } catch (err) {
      setError(err.message || 'Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCuisine, searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchRestaurants]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">🍽️ FoodRush</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              placeholder="📍 Search location..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled
            />
            <input
              type="text"
              placeholder="🔍 Search restaurant or cuisine..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2">
              {CUISINES.map((cuisine) => (
                <CuisineChip
                  key={cuisine}
                  label={cuisine}
                  isSelected={selectedCuisine === cuisine}
                  onClick={() => handleCuisineSelect(cuisine)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants found</p>
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <>
            <p className="text-gray-600 mb-6">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-indigo-500 font-semibold">
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
