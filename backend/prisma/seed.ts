// ============================================
// SCRIPT DE SEED - DATOS DE PRUEBA
// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos de prueba...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.ordenItem.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.carritoItem.deleteMany();
  await prisma.carrito.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // Crear categorías
  console.log('📁 Creando categorías...');
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nombre: 'Electrónica',
        descripcion: 'Productos electrónicos y tecnología',
        imagenUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
        orden: 1,
        activo: true
      }
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Ropa',
        descripcion: 'Moda y vestimenta para todos',
        imagenUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
        orden: 2,
        activo: true
      }
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Hogar',
        descripcion: 'Artículos para el hogar y decoración',
        imagenUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55',
        orden: 3,
        activo: true
      }
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Deportes',
        descripcion: 'Equipamiento deportivo y fitness',
        imagenUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
        orden: 4,
        activo: true
      }
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Libros',
        descripcion: 'Libros y material educativo',
        imagenUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
        orden: 5,
        activo: true
      }
    })
  ]);

  console.log(`✅ ${categorias.length} categorías creadas`);

  // Crear productos
  console.log('📦 Creando productos...');
  const productos = await Promise.all([
    // Electrónica
    prisma.producto.create({
      data: {
        nombre: 'Laptop Dell XPS 15',
        descripcion: 'Laptop profesional con procesador Intel i7, 16GB RAM, 512GB SSD',
        precio: 1299.99,
        stock: 15,
        categoriaId: categorias[0].id,
        imagenUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'iPhone 14 Pro',
        descripcion: 'Smartphone Apple con cámara de 48MP, chip A16 Bionic',
        precio: 699.99,
        stock: 25,
        categoriaId: categorias[0].id,
        imagenUrl: '/images/articulos/iphone14pro.jpeg',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Samsung Smart TV 55"',
        descripcion: 'Televisor 4K UHD con HDR, Smart TV, WiFi integrado',
        precio: 699.99,
        stock: 10,
        categoriaId: categorias[0].id,
        imagenUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'AirPods Pro',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido activa',
        precio: 249.99,
        stock: 50,
        categoriaId: categorias[0].id,
        imagenUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
        activo: true
      }
    }),

    // Ropa
    prisma.producto.create({
      data: {
        nombre: 'Jeans Levi\'s 501',
        descripcion: 'Jeans clásicos de corte recto, 100% algodón',
        precio: 79.99,
        stock: 100,
        categoriaId: categorias[1].id,
        imagenUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Camiseta Nike Dri-FIT',
        descripcion: 'Camiseta deportiva de secado rápido',
        precio: 34.99,
        stock: 150,
        categoriaId: categorias[1].id,
        imagenUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Zapatillas Adidas Ultraboost',
        descripcion: 'Zapatillas running con tecnología Boost',
        precio: 149.99,
        stock: 75,
        categoriaId: categorias[1].id,
        imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        activo: true
      }
    }),

    // Hogar
    prisma.producto.create({
      data: {
        nombre: 'Cafetera Nespresso',
        descripcion: 'Cafetera automática con 19 bares de presión',
        precio: 199.99,
        stock: 30,
        categoriaId: categorias[2].id,
        imagenUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Lámpara LED Moderna',
        descripcion: 'Lámpara de mesa con control táctil y regulador de intensidad',
        precio: 45.99,
        stock: 60,
        categoriaId: categorias[2].id,
        imagenUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Juego de Sábanas Premium',
        descripcion: 'Sábanas 100% algodón egipcio, 600 hilos',
        precio: 89.99,
        stock: 40,
        categoriaId: categorias[2].id,
        imagenUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
        activo: true
      }
    }),

    // Deportes
    prisma.producto.create({
      data: {
        nombre: 'Bicicleta de Montaña',
        descripcion: 'MTB 29" con suspensión delantera, 21 velocidades',
        precio: 499.99,
        stock: 12,
        categoriaId: categorias[3].id,
        imagenUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Mancuernas Ajustables',
        descripcion: 'Set de mancuernas 5-25kg con ajuste rápido',
        precio: 129.99,
        stock: 35,
        categoriaId: categorias[3].id,
        imagenUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Balón de Fútbol Adidas',
        descripcion: 'Balón oficial tamaño 5, tecnología thermobonding',
        precio: 29.99,
        stock: 80,
        categoriaId: categorias[3].id,
        imagenUrl: '/images/articulos/balonadidas.jpeg',
        activo: true
      }
    }),

    // Libros
    prisma.producto.create({
      data: {
        nombre: 'Clean Code - Robert Martin',
        descripcion: 'Guía para escribir código limpio y mantenible',
        precio: 39.99,
        stock: 45,
        categoriaId: categorias[4].id,
        imagenUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'El Principito',
        descripcion: 'Clásico de la literatura universal',
        precio: 14.99,
        stock: 100,
        categoriaId: categorias[4].id,
        imagenUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
        activo: true
      }
    }),
    prisma.producto.create({
      data: {
        nombre: 'Sapiens - Yuval Noah Harari',
        descripcion: 'De animales a dioses: Breve historia de la humanidad',
        precio: 24.99,
        stock: 55,
        categoriaId: categorias[4].id,
        imagenUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
        activo: true
      }
    })
  ]);

  console.log(`✅ ${productos.length} productos creados`);
  // Crear usuarios de prueba
  console.log('👥 Creando usuarios...');
  
  // Hashear passwords
  const passwordHash = await bcrypt.hash('test1', 10);
  
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin1@test.com',
        password: passwordHash,
        rol: 'admin',
        telefono: '+1234567890',
        direccion: 'Oficina Principal, Calle 123',
        activo: true
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        password: passwordHash,
        rol: 'cliente',
        telefono: '+9876543210',
        direccion: 'Av. Principal 456',
        activo: true
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: 'María',
        apellido: 'García',
        email: 'maria@example.com',
        password: passwordHash,
        rol: 'cliente',
        telefono: '+1122334455',
        direccion: 'Calle Secundaria 789',
        activo: true
      }
    })
  ]);

  console.log(`✅ ${usuarios.length} usuarios creados`);

  console.log('');
  console.log('=================================================');
  console.log('✅ Seed completado exitosamente!');
  console.log('=================================================');
  console.log(`📁 ${categorias.length} categorías`);
  console.log(`📦 ${productos.length} productos`);
  console.log(`👥 ${usuarios.length} usuarios`);
  console.log('=================================================');
  console.log('');
  console.log('👤 Usuarios de prueba:');
  console.log('   Admin: admin1@test.com (password: test1)');
  console.log('   Cliente 1: juan@example.com');
  console.log('   Cliente 2: maria@example.com');
  console.log('=================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
