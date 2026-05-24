import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: (i.quantity || 1) + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...state.items, { ...item, quantity: 1 }],
          });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === itemId
                ? { ...i, quantity: Math.max(0, (i.quantity || 1) - 1) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      setRestaurant: (restaurantId) => {
        set({ restaurantId });
      },

      clearCart: () => {
        set({ items: [], restaurantId: null });
      },

      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
      },

      getCartItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);

export default useCartStore;
