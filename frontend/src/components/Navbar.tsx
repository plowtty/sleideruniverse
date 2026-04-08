import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Moon, Sun, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';
import { Categoria, Producto } from '@/types';

export const Navbar = () => {
  const location = useLocation();
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState<Record<number, Producto[]>>({});
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setShowBackdrop(false);
    setActiveCategory(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const loadData = async () => {
    try {
      const categoriasData = await categoryService.getAll(true);
      setCategorias(categoriasData);

      // Cargar productos para cada categoría
      const productosMap: Record<number, Producto[]> = {};
      for (const categoria of categoriasData) {
        const response = await productService.getAll(1, 6, '', categoria.id);
        productosMap[categoria.id] = response.data;
      }
      setProductosPorCategoria(productosMap);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleCategoryHover = (categoryId: number) => {
    setActiveCategory(categoryId);
    setShowBackdrop(true);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setShowBackdrop(false);
  };

  return (
    <div>
      {/* Global Backdrop */}
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-opacity duration-300"
          onMouseLeave={handleMouseLeave}
          onClick={handleMouseLeave}
        />
      )}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 shadow-lg shadow-gray-200/20 backdrop-blur-xl transition-colors dark:bg-gray-950/70 dark:shadow-blue-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 text-white shadow-lg shadow-primary-500/30 dark:shadow-blue-900/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                  Premium Store
                </div>
                <div className="text-lg font-black text-primary-700 transition group-hover:text-primary-600 dark:text-blue-400 dark:group-hover:text-blue-300">
                  Sleider Universe
                </div>
              </div>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0 relative">
            <Link 
              to="/" 
              className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400"
            >
              Inicio
              <span className="absolute bottom-0 left-4 right-4 h-1 bg-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform dark:bg-blue-400" />
            </Link>

            {/* Mega Dropdown - Categorías */}
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="relative group"
                onMouseEnter={() => handleCategoryHover(categoria.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400"
                >
                  {categoria.nombre}
                </button>

                {/* Mega Menu - Full width centered */}
                <div className="fixed inset-x-0 top-[76px] px-3 sm:px-6 lg:px-8 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="mx-auto max-w-7xl">
                    <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl dark:bg-gray-900/80 dark:border-white/10 overflow-hidden">
                      {/* Grid de productos */}
                      <div className="grid grid-cols-3 gap-0">
                      {/* Columna 1: Ver todos y filtros */}
                      <div className="border-r border-white/20 dark:border-white/5 p-8 bg-gradient-to-br from-white/40 via-transparent dark:from-white/5">
                        <div className="space-y-5">
                          <Link
                            to={`/categorias/${categoria.id}`}
                            className="group/all flex items-center justify-between rounded-2xl px-6 py-4 bg-gradient-to-r from-primary-600/20 to-blue-600/20 hover:from-primary-600/40 hover:to-blue-600/40 border border-white/30 hover:border-white/60 transition-all duration-200 backdrop-blur-lg dark:from-blue-500/10 dark:to-blue-600/10 dark:hover:from-blue-500/20 dark:hover:to-blue-600/20"
                          >
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-lg">Ver todos</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">({productosPorCategoria[categoria.id]?.length || 0} productos)</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-primary-600 dark:text-blue-400 opacity-70 group-hover/all:opacity-100 group-hover/all:translate-x-1 transition-all" />
                          </Link>

                          {/* Separador */}
                          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/5" />

                          {/* Filtros rápidos */}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-gray-400 px-2 py-2 mb-3">Filtros</p>
                            <div className="space-y-2">
                              <Link to={`/categorias/${categoria.id}?sort=reciente`} className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Más Recientes</Link>
                              <Link to={`/categorias/${categoria.id}?sort=precio-asc`} className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Precio: Menor</Link>
                              <Link to={`/categorias/${categoria.id}?sort=precio-desc`} className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Precio: Mayor</Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Columna 2 y 3: Productos en 2 columnas */}
                      <div className="col-span-2 p-8">
                        <div className="grid grid-cols-2 gap-6">
                          {(productosPorCategoria[categoria.id] || []).slice(0, 8).map((producto) => (
                            <Link
                              key={producto.id}
                              to={`/productos/${producto.id}`}
                              className="group/prod flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-white/20"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white group-hover/prod:text-primary-600 dark:group-hover/prod:text-blue-400 transition line-clamp-1 text-sm">
                                  {producto.nombre}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {producto.descripcion}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-bold text-primary-600 dark:text-blue-400 text-sm whitespace-nowrap">
                                  ${parseFloat(producto.precio).toFixed(2)}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover/prod:text-primary-600 dark:group-hover/prod:text-blue-400 opacity-0 group-hover/prod:opacity-100 transition-all" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/productos" className="relative group px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400">
              Todos
              <span className="absolute bottom-0 left-4 right-4 h-1 bg-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform dark:bg-blue-400" />
            </Link>

            <Link to="/nosotros" className="relative group px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:text-primary-600 dark:hover:text-blue-400">
              Nosotros
              <span className="absolute bottom-0 left-4 right-4 h-1 bg-primary-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform dark:bg-blue-400" />
            </Link>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-2xl border border-gray-200 bg-white/80 p-3 text-gray-700 transition hover:-translate-y-0.5 hover:text-primary-600 dark:border-blue-900 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:text-blue-400"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <Link
              to="/carrito"
              className="relative rounded-2xl border border-gray-200 bg-white/80 p-3 text-gray-700 transition hover:-translate-y-0.5 hover:text-primary-600 dark:border-blue-900 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/mis-pedidos"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:text-primary-600 dark:border-blue-900 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <User className="w-5 h-5" />
                  <span>{usuario?.nombre}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-gray-200 bg-white/80 p-3 text-gray-700 transition hover:text-red-600 dark:border-blue-900 dark:bg-gray-900/70 dark:text-gray-300"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-700 transition hover:text-primary-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="rounded-full bg-gradient-to-r from-primary-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:-translate-y-0.5 hover:from-primary-700 hover:to-blue-700">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-2xl border border-gray-200 bg-white/80 p-3 text-gray-700 md:hidden dark:border-blue-900 dark:bg-gray-900/70 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden dark:border-gray-800">
            <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-lg dark:border-blue-900 dark:bg-gray-900/90">
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              </button>
              
              <Link
                to="/"
                className="rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>

              {/* Mobile Categorías - Expandibles */}
              {categorias.map((categoria) => (
                <div key={categoria.id}>
                  <button
                    onClick={() => setActiveCategory(activeCategory === categoria.id ? null : categoria.id)}
                    className="w-full flex items-center justify-between rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                  >
                    <span className="font-semibold">{categoria.nombre}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeCategory === categoria.id ? 'rotate-180' : ''}`} />
                  </button>
                  {activeCategory === categoria.id && (
                    <div className="ml-3 mt-2 space-y-2 rounded-2xl bg-primary-50 p-3 dark:bg-blue-900/20">
                      <Link
                        to={`/categorias/${categoria.id}`}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 dark:text-blue-300 dark:hover:bg-blue-900/40 transition"
                        onClick={closeMobileMenu}
                      >
                        Ver todos ({productosPorCategoria[categoria.id]?.length || 0})
                      </Link>
                      {(productosPorCategoria[categoria.id] || []).slice(0, 4).map((producto) => (
                        <Link
                          key={producto.id}
                          to={`/productos/${producto.id}`}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-blue-900/30 transition line-clamp-1"
                          onClick={closeMobileMenu}
                        >
                          {producto.nombre}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/productos"
                className="rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                onClick={closeMobileMenu}
              >
                Todos los Productos
              </Link>

              <Link
                to="/nosotros"
                className="rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                onClick={closeMobileMenu}
              >
                Nosotros
              </Link>

              <Link
                to="/carrito"
                className="flex items-center gap-2 rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                onClick={closeMobileMenu}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito ({itemCount})</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/mis-pedidos"
                    className="rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                    onClick={closeMobileMenu}
                  >
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="rounded-2xl px-3 py-3 text-left text-gray-700 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/20"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-2xl px-3 py-3 text-gray-700 transition hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                    onClick={closeMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 px-4 py-3 text-center font-semibold text-white"
                    onClick={closeMobileMenu}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </div>
  );
};
