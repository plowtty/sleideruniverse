import { Request, Response } from 'express';
import { asyncHandler, createError } from '../middlewares/error.middleware';
import { ordenService } from '../services/orden.service';
import * as authService from '../auth/auth.service';

interface OrdenItemPayload {
	productoId: number;
	cantidad: number;
}

class OrdenController {
	obtenerTodas = asyncHandler(async (req: Request, res: Response) => {
		const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
		const ordenes = await ordenService.obtenerTodas(usuarioId);

		res.status(200).json({
			success: true,
			data: ordenes,
			count: ordenes.length,
		});
	});

	obtenerMisOrdenes = asyncHandler(async (req: Request, res: Response) => {
		const token = req.headers.authorization?.replace('Bearer ', '');
		if (!token) {
			throw createError('Token no proporcionado', 401);
		}

		const usuario = await authService.verifyToken(token);
		const ordenes = await ordenService.obtenerTodas(usuario.id);

		res.status(200).json({
			success: true,
			data: ordenes,
			count: ordenes.length,
		});
	});

	obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			throw createError('ID de orden inválido', 400);
		}

		const orden = await ordenService.obtenerPorId(id);
		res.status(200).json({
			success: true,
			data: orden,
		});
	});

	crear = asyncHandler(async (req: Request, res: Response) => {
		const token = req.headers.authorization?.replace('Bearer ', '');
		if (!token) {
			throw createError('Debes iniciar sesión para completar la compra', 401);
		}

		const usuario = await authService.verifyToken(token);
		const { direccionEnvio, metodoPago, notas, items } = req.body as {
			direccionEnvio?: string;
			metodoPago?: string;
			notas?: string;
			items?: OrdenItemPayload[];
		};

		if (!direccionEnvio || !metodoPago || !items || items.length === 0) {
			throw createError('direccionEnvio, metodoPago e items son requeridos', 400);
		}

		const orden = await ordenService.crear({
			usuarioId: usuario.id,
			direccionEnvio,
			metodoPago,
			notas,
			items,
		});

		res.status(201).json({
			success: true,
			message: 'Pago simulado aprobado y orden creada exitosamente',
			data: orden,
		});
	});

	cancelar = asyncHandler(async (req: Request, res: Response) => {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			throw createError('ID de orden inválido', 400);
		}

		const orden = await ordenService.cancelar(id);
		res.status(200).json({
			success: true,
			message: 'Orden cancelada exitosamente',
			data: orden,
		});
	});
}

export const ordenController = new OrdenController();
