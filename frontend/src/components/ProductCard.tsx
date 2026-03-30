import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Producto } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard = ({ producto }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para poder agregar artículos al carrito', {
        duration: 4000,
        icon: '🔒',
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    addItem(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  const precio = parseFloat(producto.precio);

  return (
    <Link
      to={`/productos/${producto.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-lg shadow-gray-200/70 transition-all duration-300 hover:-translate-y-2 hover:border-primary-400 hover:shadow-2xl dark:border-blue-900 dark:bg-gray-900 dark:shadow-blue-950/10 dark:hover:border-blue-700"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
        {producto.imagenUrl ? (
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-gray-400 dark:text-gray-600">
            Sin imagen
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-60" />
        {producto.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white shadow-lg">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Categoría */}
        {producto.categoria && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700 dark:bg-blue-950 dark:text-blue-300">
            {producto.categoria.nombre}
          </span>
        )}

        {/* Nombre */}
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800 dark:text-white">
          {producto.nombre}
        </h3>

        {/* Descripción */}
        {producto.descripcion && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 dark:text-gray-400">
            {producto.descripcion}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
              Precio
            </p>
            <span className="text-2xl font-black text-gray-800 dark:text-white">
              ${precio.toFixed(2)}
            </span>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Stock: {producto.stock}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:shadow-blue-900/30 dark:hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </Link>
  );
};
