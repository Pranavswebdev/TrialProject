const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const restaurantService = {
  getRestaurants: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.cuisine) {
      params.append('cuisine', filters.cuisine);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await fetch(`${API_BASE}/restaurants?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
  },

  getRestaurantById: async (id) => {
    const response = await fetch(`${API_BASE}/restaurants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch restaurant');
    return response.json();
  },
};
