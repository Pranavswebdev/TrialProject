import useCartStore from '../stores/cartStore';

export default function MenuItemCard({ item }) {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);

  const itemQuantity =
    cartItems.find((i) => i.id === item.id)?.quantity || 0;

  const handleAddClick = () => {
    addItem(item);
  };

  const handleRemoveClick = () => {
    if (itemQuantity > 0) {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-1">
          <div
            className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
              item.isVeg ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">₹{item.price}</span>

          {item.isAvailable ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveClick}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  itemQuantity > 0
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                −
              </button>
              {itemQuantity > 0 && (
                <span className="font-semibold text-gray-900 w-6 text-center">
                  {itemQuantity}
                </span>
              )}
              <button
                onClick={handleAddClick}
                className="px-3 py-1 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500 font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}
    </div>
  );
}
