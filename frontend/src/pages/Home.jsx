import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Home() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🍽️ FoodRush</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            Welcome, {user?.phone}!
          </p>
          <p className="text-gray-500 mt-2">
            Restaurant listing coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
