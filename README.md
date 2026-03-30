# 🌟 Sleider Universe

Plataforma de e-commerce moderna y completa desarrollada con tecnologías de última generación.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📋 Descripción

**Sleider Universe** es una tienda online full-stack que ofrece una experiencia de compra excepcional. La aplicación incluye gestión de productos, categorías, carrito de compras, autenticación de usuarios, sistema de órdenes y pago simulado.

### ✨ Características Principales

- 🛒 **Carrito de Compras**: Sistema completo de gestión de productos en carrito
- 💳 **Pago Simulado**: Checkout funcional con validación de datos
- 📦 **Sistema de Órdenes**: Crear, ver historial y gestionar órdenes
- 🔐 **Autenticación JWT**: Sistema seguro de login y registro
- 🎨 **Modo Oscuro/Claro**: Tema personalizable con transiciones suaves
- 📱 **Diseño Responsivo**: Optimizado para todos los dispositivos
- 🏷️ **Gestión de Categorías**: Organización intuitiva de productos
- 👤 **Panel de Usuario**: Gestión de perfil, carrito y órdenes
- 🎯 **Productos Destacados**: Sección especial para promociones

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express** - Framework del servidor
- **TypeScript** - Tipado estático
- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos
- **Zustand** - Gestión de estado
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **React Hot Toast** - Notificaciones

## 📦 Estructura del Proyecto

```
storeweb/
├── backend/                # Servidor API
│   ├── src/
│   │   ├── models/        # Modelos de datos
│   │   ├── Controllers/   # Controladores
│   │   ├── services/      # Lógica de negocio
│   │   ├── routes/        # Rutas de la API
│   │   ├── middlewares/   # Middlewares
│   │   └── auth/          # Sistema de autenticación
│   ├── prisma/
│   │   ├── schema.prisma  # Esquema de BD
│   │   └── seed.ts        # Datos de prueba
│   ├── server.ts          # Punto de entrada
│   └── package.json
│
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la app
│   │   ├── contexts/      # Contextos de React
│   │   ├── store/         # Estado global (Zustand)
│   │   ├── services/      # Servicios API
│   │   ├── types/         # Tipos TypeScript
│   │   └── styles/        # Estilos globales
│   ├── public/
│   │   └── images/        # Imágenes estáticas
│   └── package.json
│
└── README.md
```

## 🚀 Instalación

### Prerequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd storeweb
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
# Puerto del servidor
PORT=3000

# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/storeweb"

# JWT Secret
JWT_SECRET=tu_clave_secreta_aqui

# Entorno
NODE_ENV=development
```

Configurar la base de datos:

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con datos de prueba
npm run prisma:seed
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🎮 Uso

### Iniciar Backend

```bash
cd backend
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Iniciar Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 👥 Usuarios de Prueba

Después de ejecutar el seed, puedes usar estos usuarios:

```
Admin:
  Email: admin1@test.com
  Password: test1

Cliente 1:
  Email: juan@example.com
  Password: test1

Cliente 2:
  Email: maria@example.com
  Password: test1
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

### Categorías
- `GET /api/categorias` - Listar categorías
- `GET /api/categorias/:id` - Obtener categoría
- `POST /api/categorias` - Crear categoría (Admin)
- `PUT /api/categorias/:id` - Actualizar categoría (Admin)
- `DELETE /api/categorias/:id` - Eliminar categoría (Admin)

### Órdenes
- `GET /api/ordenes` - Listar órdenes del usuario
- `GET /api/ordenes/:id` - Obtener orden
- `POST /api/ordenes` - Crear orden
- `PUT /api/ordenes/:id` - Actualizar estado (Admin)

### Usuarios (Admin)
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

## 🎨 Características de UI

### Tema Personalizable
- Modo oscuro y claro
- Transiciones suaves entre temas
- Persistencia con localStorage

### Animaciones
- Hover effects en tarjetas
- Efectos de escala y transiciones
- Animaciones en navegación

### Responsividad
- Mobile-first design
- Breakpoints optimizados
- Menú hamburguesa en móvil

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT para autenticación
- Middleware de autenticación en rutas protegidas
- Validación de datos en backend
- CORS configurado

## 📝 Scripts Disponibles

### Backend
```bash
npm run dev          # Iniciar en modo desarrollo
npm run build        # Compilar TypeScript
npm start           # Iniciar en producción
npm run prisma:studio  # Abrir Prisma Studio
npm run prisma:seed    # Poblar base de datos
```

### Frontend
```bash
npm run dev         # Iniciar en modo desarrollo
npm run build       # Compilar para producción
npm run preview     # Preview de build de producción
npm run lint        # Ejecutar linter
```

## 🌐 Base de Datos

### Modelos Principales

- **Usuario**: Información de usuarios y autenticación
- **Producto**: Catálogo de productos
- **Categoria**: Organización de productos
- **Carrito**: Carrito de compras temporal
- **CarritoItem**: Items en el carrito
- **Orden**: Órdenes completadas
- **OrdenItem**: Items de cada orden

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC License - ver archivo LICENSE para más detalles

## 👨‍💻 Autor

**Sleider García**
- Fundador & CEO de Sleider Universe
- Email: info@sleideruniverse.com

## 🚀 Deployment

### Opción 1: Vercel (Frontend) + Render (Backend)

#### Frontend a Vercel
1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Selecciona `frontend` como root directory
3. Configura la variable de entorno:
   - `VITE_API_URL`: URL del backend (ej: `https://tu-api.onrender.com/api`)
4. Deploy automático en cada push

#### Backend a Render
1. Conecta tu repositorio a [Render](https://render.com)
2. Crea un servicio Web
3. Selecciona `backend` como root directory
4. Configura variables de entorno:
   - `DATABASE_URL`: URL de PostgreSQL
   - `JWT_SECRET`: Clave secreta
   - `NODE_ENV`: production
   - `FRONTEND_URL`: URL de Vercel
5. Build Command: `npm install && npm run build && npx prisma migrate deploy`
6. Start Command: `npm start`

#### Base de Datos
Usa [Neon](https://neon.tech) o [Supabase](https://supabase.com) para PostgreSQL en la nube

### Opción 2: Railway/Fly.io
Alternativas modernas para backend y frontend

## 🎯 Roadmap

- [ ] Integración de pasarelas de pago reales
- [ ] Sistema de reseñas y calificaciones
- [ ] Lista de deseos
- [ ] Comparador de productos
- [ ] Chat de soporte en vivo
- [ ] Notificaciones push
- [ ] App móvil nativa
- [ ] Analytics y tracking

---

⭐ Si te gusta este proyecto, considera darle una estrella en GitHub!

Hecho con ❤️ por Sleider García - 2025
