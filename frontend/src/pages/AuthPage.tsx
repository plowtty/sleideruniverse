import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage = ({ initialMode = 'login' }: AuthPageProps) => {
  const navigate = useNavigate();
  const setUsuario = useAuthStore((state) => state.setUsuario);
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(loginData);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.nombre || !registerData.apellido || !registerData.email || !registerData.password) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(registerData);
      setUsuario(response.data.usuario);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      toast.error(error.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl w-full">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-blue-900" style={{ minHeight: '600px' }}>
          {/* Container con animación puerta corrediza */}
          <div className="relative h-full w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                width: '200%',
                transform: isLogin ? 'translateX(0)' : 'translateX(-50%)'
              }}
            >
              {/* Panel de Login */}
              <div className="w-1/2 grid md:grid-cols-2" style={{ minHeight: '600px' }}>
                {/* Formulario de Login - Izquierda */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Iniciar Sesión</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Bienvenido de vuelta</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo Electrónico
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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

                      {/* Forgot Password */}
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          ¿Has olvidado tu contraseña?
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                      </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <button
                          onClick={() => setIsLogin(false)}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Regístrate aquí
                        </button>
                      </p>
                    </div>

                    {/* Demo Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Usuarios de prueba:</p>
                      <div className="text-xs text-blue-800 space-y-1">
                        <p><strong>Admin:</strong> admin1@test.com | Contraseña: test1</p>
                        <p><strong>Cliente:</strong> juan@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Derecho - Info Login */}
                <div className="hidden md:flex bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-center text-white">
                  <div className="max-w-md">
                    <h3 className="text-4xl font-bold mb-4">Estás iniciando sesión</h3>
                    <p className="text-primary-100 text-lg mb-8">
                      Accede a tu cuenta para disfrutar de todas las funcionalidades de Sleider Universe
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Compra rápida</h4>
                          <p className="text-primary-100 text-sm">Finaliza tus compras en segundos</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Historial de pedidos</h4>
                          <p className="text-primary-100 text-sm">Rastrea todas tus compras</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Ofertas exclusivas</h4>
                          <p className="text-primary-100 text-sm">Accede a descuentos especiales</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel de Registro */}
              <div className="w-1/2 grid md:grid-cols-2" style={{ minHeight: '600px' }}>
                {/* Panel Izquierdo - Info Registro */}
                <div className="hidden md:flex bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-center text-white">
                  <div className="max-w-md">
                    <h3 className="text-4xl font-bold mb-4">¡Únete a nosotros!</h3>
                    <p className="text-primary-100 text-lg mb-8">
                      Crea tu cuenta y comienza a disfrutar de una experiencia de compra única
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Registro gratuito</h4>
                          <p className="text-primary-100 text-sm">Sin costos ocultos</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Envío gratis</h4>
                          <p className="text-primary-100 text-sm">En tu primera compra</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Programa de puntos</h4>
                          <p className="text-primary-100 text-sm">Gana recompensas por tus compras</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulario de Registro - Derecha */}
                <div className="p-8 md:p-12 flex flex-col justify-start overflow-y-auto">
                  <div className="max-w-md w-full mx-auto">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
                      <p className="text-gray-600">Regístrate en Sleider Universe</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Nombre y Apellido */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={registerData.nombre}
                              onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                              placeholder="Juan"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido *
                          </label>
                          <input
                            type="text"
                            required
                            value={registerData.apellido}
                            onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                            placeholder="Pérez"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo Electrónico *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
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

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={registerData.telefono}
                            onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                      </div>

                      {/* Dirección */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <textarea
                            value={registerData.direccion}
                            onChange={(e) => setRegisterData({ ...registerData, direccion: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm resize-none"
                            placeholder="Calle Principal 123"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                      </button>

                      {/* Ya tengo cuenta Button */}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        Ya tengo una cuenta
                      </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                          onClick={() => setIsLogin(true)}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Inicia sesión aquí
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
