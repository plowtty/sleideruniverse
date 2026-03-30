import { Users, Target, Award, Heart, TrendingUp, Shield } from 'lucide-react';

export const AboutPage = () => {
  const valores = [
    {
      icon: Heart,
      titulo: 'Pasión por el Cliente',
      descripcion: 'Nos dedicamos a proporcionar la mejor experiencia de compra, poniendo siempre al cliente primero.',
    },
    {
      icon: Shield,
      titulo: 'Confianza y Seguridad',
      descripcion: 'Garantizamos transacciones seguras y protección de datos en cada compra que realizas.',
    },
    {
      icon: Award,
      titulo: 'Calidad Garantizada',
      descripcion: 'Seleccionamos cuidadosamente cada producto para asegurar la más alta calidad.',
    },
    {
      icon: TrendingUp,
      titulo: 'Innovación Constante',
      descripcion: 'Nos mantenemos a la vanguardia de la tecnología para mejorar continuamente nuestros servicios.',
    },
  ];

  const equipo = [
    {
      nombre: 'Sleider García',
      puesto: 'Fundador & CEO',
      imagen: '/images/nosotros/ceo.jpeg',
      descripcion: 'Fundador de Sleider Universe, apasionado por crear experiencias de compra excepcionales.',
    },
  ];

  const estadisticas = [
    { numero: '1K+', texto: 'Productos Disponibles' },
    { numero: '100+', texto: 'Clientes Satisfechos' },
    { numero: '2025', texto: 'Año de Fundación' },
    { numero: '100%', texto: 'Compromiso con Calidad' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-blue-900 dark:to-blue-950 text-white py-20 border-b-4 border-primary-900 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 dark:text-blue-200 max-w-3xl mx-auto">
              Conectando personas con productos de calidad desde 2025
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-primary-100 dark:bg-blue-900 p-4 rounded-full mr-4">
                  <Target className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nuestra Misión</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Democratizar el acceso a productos de calidad, ofreciendo una plataforma 
                confiable, segura y fácil de usar que conecte a compradores y vendedores 
                de todo el mundo. Nos comprometemos a proporcionar una experiencia de 
                compra excepcional que supere las expectativas de nuestros clientes.
              </p>
            </div>

            {/* Visión */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="bg-primary-100 dark:bg-blue-900 p-4 rounded-full mr-4">
                  <Users className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nuestra Visión</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Ser la plataforma de e-commerce líder en América Latina, reconocida por 
                nuestra innovación tecnológica, compromiso con la excelencia y dedicación 
                al servicio al cliente. Aspiramos a crear un ecosistema digital donde cada 
                transacción sea una experiencia positiva y memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-blue-400 mb-2">
                  {stat.numero}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.texto}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Los principios que guían cada decisión que tomamos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => {
              const Icon = valor.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-blue-900 rounded-xl p-6 hover:border-primary-500 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-blue-900 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {valor.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {valor.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Las personas detrás de Sleider Universe
            </p>
          </div>

          <div className="flex justify-center">
            {equipo.map((miembro, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-blue-900 rounded-xl overflow-hidden hover:border-primary-500 dark:hover:border-blue-600 hover:shadow-2xl transition-all duration-300 max-w-sm"
              >
                {/* Imagen */}
                <div className="relative h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Contenido */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {miembro.nombre}
                  </h3>
                  <p className="text-primary-600 dark:text-blue-400 font-medium mb-3">
                    {miembro.puesto}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {miembro.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-blue-900 dark:to-blue-950 border-t-4 border-primary-900 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu experiencia?
          </h2>
          <p className="text-xl text-primary-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos y descubre por qué somos la mejor opción
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/productos"
              className="inline-block bg-white text-primary-600 dark:bg-blue-100 dark:text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-blue-50 transition shadow-lg"
            >
              Explorar Productos
            </a>
            <a
              href="/register"
              className="inline-block bg-primary-800 dark:bg-blue-950 text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 dark:hover:bg-blue-900 transition shadow-lg"
            >
              Crear Cuenta
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
