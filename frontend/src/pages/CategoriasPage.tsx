import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { categoryService } from '@/services/category.service';
import { Categoria } from '@/types';
import toast from 'react-hot-toast';

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAll(true);
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        toast.error('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    loadCategorias();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Todas las Categorías
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explora nuestras categorías y encuentra lo que buscas
          </p>
        </div>

        {/* Categorías Grid */}
        {categorias.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hay categorías disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/productos?categoria=${categoria.id}`}
                className="group relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-blue-900 rounded-xl overflow-hidden hover:scale-105 hover:border-primary-500 dark:hover:border-blue-600 hover:shadow-2xl transition-all duration-300"
              >
                {/* Imagen */}
                {categoria.imagenUrl && (
                  <div className="relative h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={categoria.imagenUrl}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Contador de productos - Badge flotante */}
                    {categoria._count && (
                      <div className="absolute top-4 right-4 bg-primary-600 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {categoria._count.productos}
                      </div>
                    )}
                  </div>
                )}

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">
                    {categoria.nombre}
                  </h3>
                  
                  {categoria.descripcion && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {categoria.descripcion}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {categoria._count ? `${categoria._count.productos} productos` : 'Ver productos'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary-600 dark:text-blue-400 transform translate-x-0 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Badge "Explorar" - aparece en hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white dark:bg-gray-900 text-primary-600 dark:text-blue-400 px-6 py-3 rounded-full font-bold shadow-2xl border-2 border-primary-500 dark:border-blue-500">
                    Explorar
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-8 md:p-12 text-center border-2 border-primary-900 dark:border-blue-800">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl text-primary-100 dark:text-blue-200 mb-8">
            Explora todos nuestros productos o usa el buscador
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center bg-white text-primary-600 dark:bg-blue-100 dark:text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-blue-50 transition shadow-lg"
          >
            Ver Todos los Productos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
