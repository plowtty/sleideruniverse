import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData);
      setUsuario(response.data.usuario);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      toast.error(error.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Usuarios de prueba:</p>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin@storeweb.com</p>
              <p><strong>Cliente:</strong> juan@example.com</p>
              <p className="mt-2 text-blue-600">
                <em>Nota: Las contraseñas son de ejemplo. En producción deberían estar hasheadas.</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
