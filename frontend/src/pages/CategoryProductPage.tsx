import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { Producto, Categoria } from '@/types';
import toast from 'react-hot-toast';

export const CategoryProductPage = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'nombre' | 'precio-asc' | 'precio-desc' | 'reciente'>('reciente');

  useEffect(() => {
    loadData();
  }, [categoriaId, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (categoriaId) {
        // Obtener categoría
        const categoriasData = await categoryService.getAll(true);
        const categoriaFound = categoriasData.find(c => c.id === parseInt(categoriaId));
        setCategoria(categoriaFound || null);

        // Obtener productos de la categoría
        const productosData = await productService.getAll(1, 100, '', parseInt(categoriaId));
        let sorted = [...productosData.data];

        // Aplicar ordenamiento
        switch (sortBy) {
          case 'nombre':
            sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
          case 'precio-asc':
            sorted.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            break;
          case 'precio-desc':
            sorted.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            break;
          case 'reciente':
          default:
            // Ya vienen ordenados por fecha
            break;
        }

        setProductos(sorted);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!categoria) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Categoría no encontrada</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <ScrollReveal direction="down" delay={0}>
        <div className="relative min-h-[400px] overflow-hidden flex items-end pt-20 pb-10">
          {/* Background con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600/20 via-transparent to-transparent dark:from-blue-600/20" />
          
          {/* Imagen de categoría si existe */}
          {categoria.imagenUrl && (
            <div className="absolute inset-0">
              <img
                src={categoria.imagenUrl}
                alt={categoria.nombre}
                className="w-full h-full object-cover opacity-40 dark:opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-50 dark:to-gray-950" />
            </div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
              {categoria.nombre}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {productos.length} producto{productos.length !== 1 ? 's' : ''} disponible{productos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ordenar por:</label>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-blue-900 dark:bg-gray-900 dark:text-white"
            >
              <option value="reciente">Más Recientes</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio-asc">Precio (Menor a Mayor)</option>
              <option value="precio-desc">Precio (Mayor a Menor)</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-1 dark:border-blue-900 dark:bg-gray-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded p-2 transition ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white dark:bg-blue-600'
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-blue-400'
              }`}
              title="Vista en Grid"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-2 transition ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white dark:bg-blue-600'
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-blue-400'
              }`}
              title="Vista en Lista"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Productos */}
        {productos.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {productos.map((producto, idx) => (
              <ScrollReveal
                key={producto.id}
                direction="up"
                delay={idx % 3 * 0.1}
                triggerOnce
              >
                {viewMode === 'grid' ? (
                  <ProductCard producto={producto} />
                ) : (
                  <Link
                    to={`/productos/${producto.id}`}
                    className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-lg dark:border-blue-900 dark:bg-gray-900"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      {producto.imagenUrl ? (
                        <img
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {producto.descripcion}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600 dark:text-blue-400">
                          ${parseFloat(producto.precio).toFixed(2)}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          producto.stock > 0
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay productos</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              En esta categoría no hay productos disponibles en este momento.
            </p>
            <Link
              to="/productos"
              className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
