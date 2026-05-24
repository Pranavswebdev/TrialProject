import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Splash() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-indigo-500 to-purple-500">
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-4">🍽️</div>
        <h1 className="text-4xl font-bold text-white mb-2">FoodRush</h1>
        <p className="text-white text-lg">Food delivered to your door</p>
      </div>
    </div>
  );
}
