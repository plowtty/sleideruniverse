import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ScrollReveal } from '@/components/ScrollReveal';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { Producto, Categoria } from '@/types';

const beneficios = [
  {
    icon: ShieldCheck,
    titulo: 'Compra Segura',
    descripcion: 'Protección en tus pedidos y navegación confiable en toda la tienda.',
  },
  {
    icon: Truck,
    titulo: 'Entrega Ágil',
    descripcion: 'Una experiencia pensada para comprar rápido y encontrar lo que buscas.',
  },
  {
    icon: Sparkles,
    titulo: 'Selección Premium',
    descripcion: 'Productos elegidos para dar una imagen más moderna y aspiracional.',
  },
];

export const HomePage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [productosData, categoriasData] = await Promise.all([
          productService.getAll(1, 8),
          categoryService.getAll(true),
        ]);
        setProductos(productosData.data);
        setCategorias(categoriasData.slice(0, 5));
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="text-6xl">🔌</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No se pudo conectar al servidor</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            El servidor está tardando en responder. Por favor, inténtalo de nuevo en unos momentos.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden">
      <section
        className="relative isolate border-b border-white/10 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/inicio/banner.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/75 to-primary-900/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <ScrollReveal direction="up">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Diseño moderno, compra simple y experiencia premium
              </div>

              <h1 className="text-4xl font-black leading-tight drop-shadow-lg sm:text-5xl lg:text-7xl">
                Lleva tu estilo y tecnología a otro nivel con
                <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                  Sleider Universe
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-blue-50/90 sm:text-xl">
                Una tienda visualmente atractiva, con productos destacados, colecciones modernas y una experiencia
                pensada para impresionar desde el primer vistazo.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/productos"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-primary-700 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Explorar productos
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/categorias"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15"
                >
                  Ver categorías
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <div className="grid gap-4 self-end lg:pt-10">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.3em] text-blue-100/80">Tendencias</span>
                  <Star className="h-5 w-5 text-yellow-300" />
                </div>
                <p className="text-2xl font-bold">Descubre artículos seleccionados para una vitrina moderna.</p>
                <p className="mt-3 text-sm text-blue-100/85">
                  Construye una demo con mejor presencia visual, mejores bloques y productos que destaquen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-5 backdrop-blur-md">
                  <p className="text-3xl font-black">500+</p>
                  <p className="mt-2 text-sm text-blue-100/80">Productos disponibles</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-5 backdrop-blur-md">
                  <p className="text-3xl font-black">24/7</p>
                  <p className="mt-2 text-sm text-blue-100/80">Atención al cliente</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative -mt-10 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          <ScrollReveal direction="up">
            <div className="rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-gray-200/70 backdrop-blur dark:border-blue-900/50 dark:bg-gray-900/85 dark:shadow-blue-950/20">
              <Package className="mb-4 h-10 w-10 text-primary-500 dark:text-blue-400" />
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">500+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Productos disponibles con una presentación mucho más cuidada.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-gray-200/70 backdrop-blur dark:border-blue-900/50 dark:bg-gray-900/85 dark:shadow-blue-950/20">
              <ShoppingBag className="mb-4 h-10 w-10 text-primary-500 dark:text-blue-400" />
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">1000+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Clientes satisfechos gracias a una navegación intuitiva y atractiva.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-gray-200/70 backdrop-blur dark:border-blue-900/50 dark:bg-gray-900/85 dark:shadow-blue-950/20">
              <TrendingUp className="mb-4 h-10 w-10 text-primary-500 dark:text-blue-400" />
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">Premium</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Una estética pensada para que la demo se sienta moderna y profesional.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-blue-400">
                Experiencia destacada
              </p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
                Un e-commerce con mejor presencia, más confianza y más intención de compra.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {beneficios.map((beneficio, index) => {
              const Icon = beneficio.icon;
              return (
                <ScrollReveal key={beneficio.titulo} direction="up" delay={index * 0.1} className="h-full">
                  <div className="h-full rounded-3xl border border-gray-200 bg-white p-7 shadow-lg shadow-gray-200/60 transition hover:-translate-y-2 hover:shadow-2xl dark:border-blue-900 dark:bg-gray-900 dark:shadow-blue-950/10">
                    <div className="mb-5 inline-flex rounded-2xl bg-primary-50 p-4 text-primary-600 dark:bg-blue-950 dark:text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{beneficio.titulo}</h3>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">{beneficio.descripcion}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-blue-400">
                  Colecciones visuales
                </p>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">Categorías populares con una presencia más editorial</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Cada bloque ahora puede sentirse más como una colección destacada que como una simple tarjeta.
                </p>
              </div>
              <Link to="/categorias" className="text-primary-600 dark:text-blue-400 hover:text-primary-500 dark:hover:text-blue-300 font-semibold transition">
                Ver todas →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categorias.map((categoria, index) => (
              <ScrollReveal key={categoria.id} direction="up" delay={index * 0.08} className="h-full">
                <Link
                  to={`/productos?categoria=${categoria.id}`}
                  className="group block h-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-lg shadow-gray-200/60 transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-blue-900 dark:bg-gray-900 dark:shadow-blue-950/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    {categoria.imagenUrl ? (
                      <img
                        src={categoria.imagenUrl}
                        alt={categoria.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                        Categoría
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-700 shadow-md">
                        {categoria._count?.productos ?? 0} productos
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-2xl font-black">{categoria.nombre}</h3>
                      <p className="mt-2 max-w-md text-sm text-white/85 line-clamp-2">
                        {categoria.descripcion || 'Explora una selección cuidada y visualmente atractiva.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span>Explorar colección</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-blue-400">
                  Selección destacada
                </p>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">Productos con una vitrina más premium y moderna</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Una selección inicial para que la home tenga mejor ritmo visual y una sensación más profesional.
                </p>
              </div>
              <Link to="/productos" className="text-primary-600 dark:text-blue-400 hover:text-primary-500 dark:hover:text-blue-300 font-semibold transition">
                Ver todos →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {productos.map((producto, index) => (
              <ScrollReveal key={producto.id} direction="up" delay={index * 0.05} className="h-full">
                <ProductCard producto={producto} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-slate-950 via-blue-950 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="fade">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md sm:p-12">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">Da el siguiente paso</p>
              <h2 className="text-3xl font-black text-white sm:text-5xl">Haz que tu primera compra se sienta especial desde el primer clic.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100/85">
                Regístrate, explora la tienda y sigue construyendo una demo llamativa lista para impresionar en tu portafolio.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 font-semibold text-primary-700 transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Crear cuenta
                </Link>
                <Link
                  to="/productos"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/15"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
