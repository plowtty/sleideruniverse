import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShoppingCart, Sparkles, Truck, Heart, Share2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/services/product.service';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Producto } from '@/types';

const beneficios = [
	{
		icon: ShieldCheck,
		titulo: 'Compra segura',
		descripcion: 'Protección de datos y experiencia confiable durante todo el proceso.',
	},
	{
		icon: Truck,
		titulo: 'Entrega eficiente',
		descripcion: 'Una compra clara, rápida y enfocada en una buena experiencia de usuario.',
	},
	{
		icon: Sparkles,
		titulo: 'Presentación premium',
		descripcion: 'Detalle más visual para que el producto se sienta mejor presentado.',
	},
];

export const ProductoDetalle = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const addItem = useCartStore((state) => state.addItem);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const [producto, setProducto] = useState<Producto | null>(null);
	const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([]);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const loadProducto = async () => {
			if (!id) {
				navigate('/productos');
				return;
			}

			try {
				setLoading(true);
				const data = await productService.getById(Number(id));
				setProducto(data);

				// Cargar productos relacionados de la misma categoría
				if (data.categoriaId) {
					const relacionados = await productService.getAll(1, 8, '', data.categoriaId);
					setProductosRelacionados(relacionados.data.filter(p => p.id !== data.id).slice(0, 4));
				}
			} catch (error) {
				console.error('Error al cargar producto:', error);
				toast.error('No se pudo cargar el producto');
				navigate('/productos');
			} finally {
				setLoading(false);
			}
		};

		loadProducto();
	}, [id, navigate]);

	const precio = useMemo(() => {
		if (!producto) return '0.00';
		return Number(producto.precio).toFixed(2);
	}, [producto]);

	const handleAddToCart = () => {
		if (!producto) return;

		if (!isAuthenticated) {
			toast.error('Debes iniciar sesión para poder agregar artículos al carrito', {
				duration: 4000,
				icon: '🔒',
			});
			setTimeout(() => navigate('/login'), 1500);
			return;
		}

		for (let i = 0; i < quantity; i++) {
			addItem(producto);
		}
		toast.success(`${quantity} ${producto.nombre}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito`);
		setQuantity(1);
	};

	const handleShare = () => {
		const url = window.location.href;
		const text = `Mira este producto: ${producto?.nombre} por $${precio}`;
		
		if (navigator.share) {
			navigator.share({ title: producto?.nombre, text });
		} else {
			navigator.clipboard.writeText(url);
			toast.success('Enlace copiado al portapapeles');
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	if (!producto) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<ScrollReveal direction="fade">
					<Link
						to="/productos"
						className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:text-primary-600 dark:border-blue-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-blue-400"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a productos
					</Link>
				</ScrollReveal>

				<div className="grid gap-12 lg:grid-cols-2">
					{/* Imagen */}
					<ScrollReveal direction="up">
						<div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/70 dark:border-blue-900 dark:bg-gray-900 dark:shadow-blue-950/10">
							<div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
								{producto.imagenUrl ? (
									<img
										src={producto.imagenUrl}
										alt={producto.nombre}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
								) : (
									<div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-600">
										Sin imagen
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>

							{/* Overlay de stock */}
							{producto.stock === 0 && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
									<span className="rounded-2xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg text-lg">Agotado</span>
								</div>
							)}
						</div>
					</ScrollReveal>

					{/* Información */}
					<ScrollReveal direction="left">
						<div className="flex flex-col justify-between">
							{/* Header */}
							<div>
								{producto.categoria && (
									<span className="inline-flex rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-primary-700 dark:bg-blue-950/60 dark:text-blue-300">
										{producto.categoria.nombre}
									</span>
								)}

								<h1 className="mt-6 text-5xl font-black text-gray-900 dark:text-white leading-tight">
									{producto.nombre}
								</h1>

								<div className="mt-4 flex items-center gap-2">
									<div className="flex gap-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
										))}
									</div>
									<span className="text-sm text-gray-600 dark:text-gray-400">(328 reseñas)</span>
								</div>

								<p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-400">
									{producto.descripcion || 'Producto destacado con una presentación premium. Diseñado para ofrecer la mejor experiencia de compra.'}
								</p>

								{/* Características rápidas */}
								<div className="mt-8 grid grid-cols-3 gap-4">
									<div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/50 text-center">
										<div className="text-2xl font-bold text-primary-600 dark:text-blue-400">100%</div>
										<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Original</div>
									</div>
									<div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/50 text-center">
										<div className="text-2xl font-bold text-primary-600 dark:text-blue-400">{producto.stock}</div>
										<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">En Stock</div>
									</div>
									<div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/50 text-center">
										<div className="text-2xl font-bold text-primary-600 dark:text-blue-400">4.8★</div>
										<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Calificación</div>
									</div>
								</div>
							</div>

							{/* Precio y acciones */}
							<div className="mt-10">
								<div className="flex items-end gap-4 mb-8">
									<div>
										<p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Precio especial</p>
										<p className="text-5xl font-black text-gray-900 dark:text-white">${precio}</p>
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400 line-through">
										${(Number(precio) * 1.2).toFixed(2)}
									</div>
								</div>

								{/* Selector de cantidad */}
								<div className="flex items-center gap-4 mb-6">
									<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cantidad:</label>
									<div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
										<button
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
										>
											-
										</button>
										<input
											type="number"
											value={quantity}
											onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
											className="w-12 text-center font-semibold bg-transparent border-none dark:text-white focus:outline-none"
											min="1"
										/>
										<button
											onClick={() => setQuantity(quantity + 1)}
											className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
										>
											+
										</button>
									</div>
								</div>

								{/* Botones de acción */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
									<button
										onClick={handleAddToCart}
										disabled={producto.stock === 0}
										className="sm:col-span-2 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-primary-600/30 transition hover:-translate-y-1 hover:from-primary-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-lg"
									>
										<ShoppingCart className="w-6 h-6" />
										Agregar al carrito
									</button>
									<button
										onClick={() => setIsFavorite(!isFavorite)}
										className="rounded-2xl border border-gray-300 bg-white p-4 text-gray-700 transition hover:border-red-400 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400"
									>
										<Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
									</button>
								</div>

								{/* Botón compartir */}
								<button
									onClick={handleShare}
									className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									<Share2 className="w-5 h-5" />
									Compartir
								</button>
							</div>
						</div>
					</ScrollReveal>
				</div>

				{/* Beneficios */}
				<section className="mt-20 grid gap-6 md:grid-cols-3">
					{beneficios.map((beneficio, index) => {
						const Icon = beneficio.icon;
						return (
							<ScrollReveal key={beneficio.titulo} direction="up" delay={index * 0.1}>
								<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg shadow-gray-200/50 dark:border-blue-900 dark:bg-gray-900 dark:shadow-blue-950/10 hover:shadow-xl hover:-translate-y-1 transition">
									<div className="mb-4 inline-flex rounded-2xl bg-primary-50 p-4 text-primary-600 dark:bg-blue-950 dark:text-blue-400">
										<Icon className="h-6 w-6" />
									</div>
									<h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{beneficio.titulo}</h3>
									<p className="mt-2 text-gray-600 dark:text-gray-400">{beneficio.descripcion}</p>
								</div>
							</ScrollReveal>
						);
					})}
				</section>

				{/* Productos Relacionados */}
				{productosRelacionados.length > 0 && (
					<section className="mt-20">
						<ScrollReveal direction="down">
							<div className="mb-12">
								<h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Productos Relacionados</h2>
								<p className="text-gray-600 dark:text-gray-400">Otros productos que te podrían interesar de la misma categoría</p>
							</div>
						</ScrollReveal>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{productosRelacionados.map((prod, idx) => (
								<ScrollReveal
									key={prod.id}
									direction="up"
									delay={idx * 0.12}
									triggerOnce
								>
									<ProductCard producto={prod} />
								</ScrollReveal>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
};
