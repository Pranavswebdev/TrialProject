import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';

export default function FloatingCartBar() {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getCartItemCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-4 mb-4">
      <button
        onClick={() => navigate('/cart')}
        className="w-full py-4 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span>🛒 {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <span>₹{cartTotal.toFixed(0)} • View Cart</span>
        </div>
      </button>
    </div>
  );
}
