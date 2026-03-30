import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Producto } from '@/types';

interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  
  // Acciones
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  
  // Getters
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (productoId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (producto, cantidad = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.producto.id === producto.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { producto, cantidad }],
          };
        }),

      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
        })),

      updateQuantity: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + parseFloat(item.producto.precio) * item.cantidad;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.cantidad, 0);
      },

      getItem: (productoId) => {
        const { items } = get();
        return items.find((item) => item.producto.id === productoId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
