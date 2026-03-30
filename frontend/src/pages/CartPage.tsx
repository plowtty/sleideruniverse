import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  const handleUpdateQuantity = (productoId: number, newQuantity: number, stock: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      toast.error('No hay suficiente stock disponible');
      return;
    }
    updateQuantity(productoId, newQuantity);
  };

  const handleRemoveItem = (productoId: number, nombre: string) => {
    removeItem(productoId);
    toast.success(`${nombre} eliminado del carrito`);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
      toast.success('Carrito vaciado');
    }
  };

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Agrega algunos productos para comenzar a comprar
            </p>
            <Link to="/productos" className="btn-primary inline-block">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Carrito de Compras</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const precio = parseFloat(item.producto.precio);
              const subtotal = precio * item.cantidad;

              return (
                <div key={item.producto.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-blue-900 rounded-lg p-6 shadow-sm flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.producto.imagenUrl ? (
                      <img
                        src={item.producto.imagenUrl}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/productos/${item.producto.id}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-blue-400 block truncate"
                    >
                      {item.producto.nombre}
                    </Link>
                    {item.producto.categoria && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.producto.categoria.nombre}
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                      ${precio.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.producto.id, item.producto.nombre)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.producto.id,
                            item.cantidad - 1,
                            item.producto.stock
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
                        disabled={item.cantidad === 1}
                      >
                        <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">{item.cantidad}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.producto.id,
                            item.cantidad + 1,
                            item.producto.stock
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>

                    <p className="font-bold text-gray-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-blue-900 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full btn-primary mb-3 text-center block">
                Proceder al Pago
              </Link>

              <Link to="/productos" className="block text-center text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300">
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
