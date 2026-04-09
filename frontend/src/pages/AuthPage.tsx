import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

const loginBenefits = [
  { title: 'Compra rápida', description: 'Finaliza tus compras en segundos.' },
  { title: 'Historial de pedidos', description: 'Rastrea todas tus compras fácilmente.' },
  { title: 'Ofertas exclusivas', description: 'Accede a descuentos especiales para tu cuenta.' },
];

const registerBenefits = [
  { title: 'Registro gratuito', description: 'Crea tu cuenta sin costos ocultos.' },
  { title: 'Envío gratis', description: 'Aprovecha beneficios especiales en tu primera compra.' },
  { title: 'Programa de puntos', description: 'Gana recompensas por cada pedido que realices.' },
];

const inputBaseClass =
  'w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-950/80 dark:text-white dark:placeholder:text-gray-500';

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

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-12 transition-colors dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-2xl shadow-primary-200/40 backdrop-blur-xl dark:border-blue-900/50 dark:bg-gray-900/90 dark:shadow-blue-950/30 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative min-h-[700px] overflow-hidden bg-white/95 dark:bg-gray-900/95">
            <div className="absolute inset-x-0 top-0 z-20 flex justify-center p-6">
              <div className="inline-flex rounded-full border border-gray-200 bg-gray-100/90 p-1 dark:border-gray-800 dark:bg-gray-950/80">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    isLogin
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    !isLogin
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  Crear cuenta
                </button>
              </div>
            </div>

            <section
              aria-hidden={!isLogin}
              className={`absolute inset-0 px-6 pb-8 pt-28 transition-all duration-500 ease-out sm:px-10 md:px-12 ${
                isLogin
                  ? 'translate-x-0 opacity-100 pointer-events-auto'
                  : '-translate-x-8 opacity-0 pointer-events-none'
              }`}
            >
              <div className="mx-auto flex h-full max-w-md flex-col justify-center">
                <div className="mb-8">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h1>
                  <p className="text-gray-600 dark:text-gray-400">Bienvenido de vuelta a Sleider Universe.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className={`${inputBaseClass} pl-10`}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={`${inputBaseClass} pl-10 pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="button" className="text-sm font-medium text-primary-600 transition hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300">
                      ¿Has olvidado tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?{' '}
                  <button type="button" onClick={() => setIsLogin(false)} className="font-semibold text-primary-600 transition hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Regístrate aquí
                  </button>
                </div>

              </div>
            </section>

            <section
              aria-hidden={isLogin}
              className={`absolute inset-0 overflow-y-auto px-6 pb-8 pt-28 transition-all duration-500 ease-out sm:px-10 md:px-12 ${
                isLogin
                  ? 'translate-x-8 opacity-0 pointer-events-none'
                  : 'translate-x-0 opacity-100 pointer-events-auto'
              }`}
            >
              <div className="mx-auto flex min-h-full max-w-md flex-col justify-center">
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h1>
                  <p className="text-gray-600 dark:text-gray-400">Regístrate y empieza a comprar con estilo.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={registerData.nombre}
                          onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                          className={`${inputBaseClass} pl-10`}
                          placeholder="Juan"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="register-lastname" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Apellido *
                      </label>
                      <input
                        id="register-lastname"
                        type="text"
                        required
                        value={registerData.apellido}
                        onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                        className={inputBaseClass}
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className={`${inputBaseClass} pl-10`}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className={`${inputBaseClass} pl-10 pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-phone" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id="register-phone"
                        type="tel"
                        value={registerData.telefono}
                        onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                        className={`${inputBaseClass} pl-10`}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-address" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        id="register-address"
                        value={registerData.direccion}
                        onChange={(e) => setRegisterData({ ...registerData, direccion: e.target.value })}
                        className={`${inputBaseClass} min-h-[88px] resize-none pl-10`}
                        placeholder="Calle Principal 123"
                        rows={3}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Ya tengo una cuenta
                  </button>
                </form>
              </div>
            </section>
          </div>

          <aside className="relative hidden min-h-[700px] overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 text-white md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />

            <section
              aria-hidden={!isLogin}
              className={`absolute inset-0 flex flex-col justify-center p-12 transition-all duration-500 ease-out ${
                isLogin
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-8 opacity-0 pointer-events-none'
              }`}
            >
              <div className="relative z-10 max-w-md">
                <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                  Experiencia premium
                </p>
                <h2 className="mb-4 text-4xl font-bold">Estás iniciando sesión</h2>
                <p className="mb-8 text-lg text-primary-100">
                  Accede a tu cuenta para disfrutar de todas las funcionalidades de Sleider Universe.
                </p>
                <div className="space-y-4">
                  {loginBenefits.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">✓</div>
                      <div>
                        <h3 className="mb-1 font-semibold">{item.title}</h3>
                        <p className="text-sm text-primary-100">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              aria-hidden={isLogin}
              className={`absolute inset-0 flex flex-col justify-center p-12 transition-all duration-500 ease-out ${
                isLogin
                  ? 'translate-x-8 opacity-0 pointer-events-none'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="relative z-10 max-w-md">
                <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                  Nueva cuenta
                </p>
                <h2 className="mb-4 text-4xl font-bold">¡Únete a nosotros!</h2>
                <p className="mb-8 text-lg text-primary-100">
                  Crea tu cuenta y comienza a disfrutar de una experiencia de compra moderna y ágil.
                </p>
                <div className="space-y-4">
                  {registerBenefits.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">✓</div>
                      <div>
                        <h3 className="mb-1 font-semibold">{item.title}</h3>
                        <p className="text-sm text-primary-100">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};
