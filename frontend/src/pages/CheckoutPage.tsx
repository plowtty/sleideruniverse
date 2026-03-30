import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/order.service';
import { Orden } from '@/types';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'transferencia'>('tarjeta');
  const [titular, setTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState<Orden | null>(null);

  const total = useMemo(() => getTotal(), [getTotal, items]);

  const formatoTarjeta = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatoExpiracion = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validarFormulario = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para completar tu compra');
      navigate('/login');
      return false;
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      navigate('/carrito');
      return false;
    }

    if (direccionEnvio.trim().length < 10) {
      toast.error('Ingresa una dirección de envío válida');
      return false;
    }

    if (metodoPago === 'tarjeta') {
      if (titular.trim().length < 3) {
        toast.error('Ingresa el nombre del titular');
        return false;
      }

      const cardDigits = numeroTarjeta.replace(/\s/g, '');
      if (cardDigits.length < 16) {
        toast.error('Ingresa una tarjeta válida de 16 dígitos');
        return false;
      }

      if (expiracion.length !== 5) {
        toast.error('Ingresa una fecha de expiración válida (MM/AA)');
        return false;
      }

      if (cvv.replace(/\D/g, '').length < 3) {
        toast.error('Ingresa un CVV válido');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setIsProcessing(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const orden = await orderService.crear({
        direccionEnvio,
        metodoPago,
        notas: metodoPago === 'tarjeta' ? `Pago simulado con tarjeta **** ${numeroTarjeta.replace(/\s/g, '').slice(-4)}` : 'Pago simulado por transferencia bancaria',
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
      });

      setOrdenConfirmada(orden);
      clearCart();
      toast.success('¡Pago simulado aprobado! Orden creada correctamente');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo procesar el pago simulado';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (ordenConfirmada) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-gray-900 p-8 shadow-sm text-center">
            <ShieldCheck className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pago simulado completado</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tu orden fue registrada con éxito.
            </p>

            <div className="mt-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">Número de orden</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-4">#{ordenConfirmada.id}</p>

              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-primary-600 dark:text-blue-400 mb-4">
                ${Number(ordenConfirmada.total).toFixed(2)}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white capitalize">{ordenConfirmada.estado}</p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/productos" className="btn-primary inline-block">
                Seguir Comprando
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Ir al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay productos para pagar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Agrega productos al carrito para continuar.</p>
          <Link to="/productos" className="btn-primary inline-block">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout · Pago Simulado</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-blue-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dirección de envío</h2>
              <textarea
                value={direccionEnvio}
                onChange={(event) => setDireccionEnvio(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Calle, número, ciudad, estado y referencia"
                required
              />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-blue-900 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Método de pago</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    metodoPago === 'tarjeta'
                      ? 'border-primary-500 bg-primary-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <CreditCard className="w-4 h-4" />
                    Tarjeta (simulada)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodoPago('transferencia')}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    metodoPago === 'transferencia'
                      ? 'border-primary-500 bg-primary-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <Landmark className="w-4 h-4" />
                    Transferencia (simulada)
                  </div>
                </button>
              </div>

              {metodoPago === 'tarjeta' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Titular</label>
                    <input
                      value={titular}
                      onChange={(event) => setTitular(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nombre en la tarjeta"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de tarjeta</label>
                    <input
                      value={numeroTarjeta}
                      onChange={(event) => setNumeroTarjeta(formatoTarjeta(event.target.value))}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiración</label>
                    <input
                      value={expiracion}
                      onChange={(event) => setExpiracion(formatoExpiracion(event.target.value))}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                    <input
                      value={cvv}
                      onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-800 dark:text-blue-300">
                  Simulación de transferencia bancaria activa. Al confirmar, se aprobará automáticamente el pago de prueba.
                </div>
              )}
            </div>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-blue-900 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Resumen</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex justify-between gap-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                      {item.producto.nombre} x{item.cantidad}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      ${(parseFloat(item.producto.precio) * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full btn-primary mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando pago simulado...' : 'Confirmar Pago Simulado'}
              </button>

              <Link
                to="/carrito"
                className="block mt-3 text-center text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300"
              >
                Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
