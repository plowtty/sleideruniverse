import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
	const navigate = useNavigate();
	const setUsuario = useAuthStore((state) => state.setUsuario);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		nombre: '',
		apellido: '',
		email: '',
		password: '',
		telefono: '',
		direccion: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
			toast.error('Por favor completa los campos obligatorios');
			return;
		}

		try {
			setLoading(true);
			const response = await authService.register(formData);
			setUsuario(response.data.usuario);
			toast.success('¡Cuenta creada exitosamente!');
			navigate('/');
		} catch (error: any) {
			console.error('Error al registrarse:', error);
			toast.error(error.response?.data?.message || 'No se pudo crear la cuenta');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div className="card">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
						<p className="mt-2 text-gray-600">
							¿Ya tienes cuenta?{' '}
							<Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
								Inicia sesión aquí
							</Link>
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
									Nombre *
								</label>
								<input
									id="nombre"
									type="text"
									required
									value={formData.nombre}
									onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
									className="input"
									placeholder="Juan"
								/>
							</div>
							<div>
								<label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
									Apellido *
								</label>
								<input
									id="apellido"
									type="text"
									required
									value={formData.apellido}
									onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
									className="input"
									placeholder="Pérez"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Correo Electrónico *
							</label>
							<input
								id="email"
								type="email"
								required
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className="input"
								placeholder="tu@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Contraseña *
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									required
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className="input pr-12"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						<div>
							<label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
								Teléfono
							</label>
							<input
								id="telefono"
								type="tel"
								value={formData.telefono}
								onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
								className="input"
								placeholder="+51 999 999 999"
							/>
						</div>

						<div>
							<label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
								Dirección
							</label>
							<input
								id="direccion"
								type="text"
								value={formData.direccion}
								onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
								className="input"
								placeholder="Calle Principal 123"
							/>
						</div>

						<button type="submit" disabled={loading} className="w-full btn-primary mt-2">
							{loading ? 'Creando cuenta...' : 'Crear cuenta'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
