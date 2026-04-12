import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const enlaces = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/categorias', label: 'Categorías' },
  { to: '/nosotros', label: 'Nosotros' },
];

const beneficios = [
  { icon: ShieldCheck, label: 'Compra segura' },
  { icon: Truck, label: 'Experiencia ágil' },
  { icon: Sparkles, label: 'Selección premium' },
];

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100/85 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Sleider Universe Experience
            </div>
            <h3 className="mt-6 text-3xl font-black">Una vitrina digital diseñada para impresionar.</h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-blue-100/75">
              Sleider Universe combina diseño visual, navegación moderna y una experiencia pensada para destacar en tu portafolio como una tienda online atractiva y profesional.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {beneficios.map((beneficio) => {
                const Icon = beneficio.icon;
                return (
                  <div key={beneficio.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                    <Icon className="h-4 w-4 text-blue-300" />
                    {beneficio.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Navegación</h4>
            <div className="mt-5 flex flex-col gap-3">
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.to}
                  to={enlace.to}
                  className="w-fit text-sm text-blue-100/75 transition hover:text-white"
                >
                  {enlace.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Contacto</h4>
            <div className="mt-5 space-y-4 text-sm text-blue-100/75">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-blue-300" />
                <span>sleiderdev@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-blue-300" />
                <span>+506 8737 5302</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-300" />
                <span>Calle Principal 123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-blue-100/55">
          <p>&copy; {new Date().getFullYear()} Sleider Company. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
