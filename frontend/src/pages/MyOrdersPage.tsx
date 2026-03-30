import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/authStore';
import { Orden } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const estadoStyles: Record<string, string> = {
  pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  procesando: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  enviado: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  entregado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  cancelado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  rechazado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export const MyOrdersPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.obtenerMisOrdenes();
        setOrdenes(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'No se pudieron cargar tus pedidos');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const totalOrdenes = useMemo(() => ordenes.length, [ordenes]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 dark:border-blue-900 bg-white dark:bg-gray-900 p-10 text-center shadow-sm">
            <PackageCheck className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Aún no tienes pedidos</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Cuando completes una compra, aquí aparecerá tu historial.</p>
            <Link to="/productos" className="btn-primary inline-block">Explorar productos</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Pedidos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Tienes {totalOrdenes} pedido{totalOrdenes === 1 ? '' : 's'} registrado{totalOrdenes === 1 ? '' : 's'}.</p>
        </div>

        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="rounded-2xl border border-gray-200 dark:border-blue-900 bg-white dark:bg-gray-900 p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pedido #{orden.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(orden.fechaCreacion).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      estadoStyles[orden.estado] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {orden.estado}
                  </span>
                  <p className="text-lg font-bold text-primary-600 dark:text-blue-400">${Number(orden.total).toFixed(2)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Productos</p>
                <div className="space-y-2">
                  {orden.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm gap-2">
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                        {item.producto?.nombre || `Producto #${item.productoId}`} x{item.cantidad}
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold whitespace-nowrap">
                        ${Number(item.subtotal ?? Number(item.precioUnitario ?? 0) * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  Método de pago: <span className="font-semibold text-gray-900 dark:text-white capitalize">{orden.metodoPago || 'N/A'}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-1">
                  Envío: <span className="font-medium">{orden.direccionEnvio}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
