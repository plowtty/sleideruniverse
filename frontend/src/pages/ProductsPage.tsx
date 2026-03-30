import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { Producto, Categoria } from '@/types';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(searchParams.get('busqueda') || '');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(
    searchParams.get('categoria') ? Number(searchParams.get('categoria')) : undefined
  );
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await categoryService.getAll(true);
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll(
          pagination.page,
          12,
          busqueda || undefined,
          categoriaSeleccionada
        );
        setProductos(data.data);
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          total: data.pagination.total,
        });
      } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, [pagination.page, busqueda, categoriaSeleccionada]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (busqueda) params.busqueda = busqueda;
    if (categoriaSeleccionada) params.categoria = categoriaSeleccionada.toString();
    setSearchParams(params);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryFilter = (categoriaId: number | undefined) => {
    setCategoriaSeleccionada(categoriaId);
    const params: Record<string, string> = {};
    if (busqueda) params.busqueda = busqueda;
    if (categoriaId) params.categoria = categoriaId.toString();
    setSearchParams(params);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Productos</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-blue-400"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-blue-900 rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Categorías</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter(undefined)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    categoriaSeleccionada === undefined
                      ? 'bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-200 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Todas las categorías
                </button>
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => handleCategoryFilter(categoria.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      categoriaSeleccionada === categoria.id
                        ? 'bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-200 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {categoria.nombre}
                    {categoria._count && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({categoria._count.productos})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results info */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Mostrando {productos.length} de {pagination.total} productos
              </p>
            </div>

            {loading ? (
              <LoadingSpinner size="lg" className="py-20" />
            ) : productos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron productos</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="flex items-center px-4">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
