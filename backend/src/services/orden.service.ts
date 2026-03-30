import { prisma } from '../config/prisma';
import { createError } from '../middlewares/error.middleware';

interface CrearOrdenItemInput {
	productoId: number;
	cantidad: number;
}

interface CrearOrdenInput {
	usuarioId: number;
	direccionEnvio: string;
	metodoPago: string;
	notas?: string;
	items: CrearOrdenItemInput[];
}

class OrdenService {
	async obtenerTodas(usuarioId?: number) {
		return prisma.orden.findMany({
			where: usuarioId ? { usuarioId } : undefined,
			include: {
				items: {
					include: {
						producto: {
							select: {
								id: true,
								nombre: true,
								imagenUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				fechaCreacion: 'desc',
			},
		});
	}

	async obtenerPorId(id: number) {
		const orden = await prisma.orden.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						producto: {
							select: {
								id: true,
								nombre: true,
								imagenUrl: true,
							},
						},
					},
				},
				usuario: {
					select: {
						id: true,
						nombre: true,
						email: true,
					},
				},
			},
		});

		if (!orden) {
			throw createError('Orden no encontrada', 404);
		}

		return orden;
	}

	async crear(input: CrearOrdenInput) {
		const itemsNormalizados = input.items
			.filter((item) => Number.isInteger(item.productoId) && item.productoId > 0 && Number.isInteger(item.cantidad) && item.cantidad > 0)
			.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad }));

		if (itemsNormalizados.length === 0) {
			throw createError('La orden debe tener al menos un producto válido', 400);
		}

		return prisma.$transaction(async (tx) => {
			const productoIds = [...new Set(itemsNormalizados.map((item) => item.productoId))];

			const productos = await tx.producto.findMany({
				where: {
					id: { in: productoIds },
					activo: true,
				},
			});

			if (productos.length !== productoIds.length) {
				throw createError('Uno o más productos no existen o no están activos', 400);
			}

			const productosMap = new Map(productos.map((producto) => [producto.id, producto]));

			const itemsConPrecio = itemsNormalizados.map((item) => {
				const producto = productosMap.get(item.productoId);

				if (!producto) {
					throw createError(`Producto ${item.productoId} no encontrado`, 400);
				}

				if (producto.stock < item.cantidad) {
					throw createError(`Stock insuficiente para ${producto.nombre}`, 400);
				}

				const precioUnitario = Number(producto.precio);
				const subtotal = precioUnitario * item.cantidad;

				return {
					productoId: item.productoId,
					cantidad: item.cantidad,
					precioUnitario,
					subtotal,
				};
			});

			const total = itemsConPrecio.reduce((acumulado, item) => acumulado + item.subtotal, 0);
			const referenciaPago = `SIM-${Date.now().toString().slice(-8)}`;
			const notasPago = input.notas
				? `${input.notas} | Ref: ${referenciaPago}`
				: `Pago simulado aprobado | Ref: ${referenciaPago}`;

			const ordenCreada = await tx.orden.create({
				data: {
					usuarioId: input.usuarioId,
					direccionEnvio: input.direccionEnvio,
					metodoPago: input.metodoPago,
					estado: 'procesando',
					notas: notasPago,
					total,
					items: {
						create: itemsConPrecio.map((item) => ({
							productoId: item.productoId,
							cantidad: item.cantidad,
							precioUnitario: item.precioUnitario,
							subtotal: item.subtotal,
						})),
					},
				},
				include: {
					items: {
						include: {
							producto: {
								select: {
									id: true,
									nombre: true,
									imagenUrl: true,
								},
							},
						},
					},
				},
			});

			await Promise.all(
				itemsConPrecio.map((item) =>
					tx.producto.update({
						where: { id: item.productoId },
						data: {
							stock: {
								decrement: item.cantidad,
							},
						},
					})
				)
			);

			return ordenCreada;
		});
	}

	async cancelar(id: number) {
		const orden = await this.obtenerPorId(id);

		if (orden.estado === 'cancelado' || orden.estado === 'entregado') {
			throw createError('Esta orden no puede cancelarse en su estado actual', 400);
		}

		return prisma.$transaction(async (tx) => {
			await Promise.all(
				orden.items.map((item) =>
					tx.producto.update({
						where: { id: item.productoId },
						data: {
							stock: {
								increment: item.cantidad,
							},
						},
					})
				)
			);

			return tx.orden.update({
				where: { id },
				data: {
					estado: 'cancelado',
				},
				include: {
					items: {
						include: {
							producto: {
								select: {
									id: true,
									nombre: true,
									imagenUrl: true,
								},
							},
						},
					},
				},
			});
		});
	}
}

export const ordenService = new OrdenService();
