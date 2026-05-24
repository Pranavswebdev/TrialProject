import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="aspect-video bg-gray-200 overflow-hidden">
        <img
          src={restaurant.image || 'https://via.placeholder.com/400x300'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
          {!restaurant.isOpen && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
              Closed
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.cuisines?.slice(0, 3).map((cuisine) => (
            <span
              key={cuisine}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {cuisine}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-yellow-500">★</span>
            <span>{restaurant.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{restaurant.deliveryTime || 30} min</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Min order: ₹{restaurant.minOrder || 150} • Delivery: ₹{restaurant.deliveryCharge || 40}
          </p>
        </div>
      </div>
    </div>
  );
}
