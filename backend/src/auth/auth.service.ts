// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { Usuario } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';
const JWT_EXPIRES_IN = '7d';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
}

export interface AuthResponse {
  usuario: Omit<Usuario, 'password'>;
  token: string;
}

/**
 * Registrar nuevo usuario
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  // Verificar si el email ya existe
  const existingUser = await prisma.usuario.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hashear password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Crear usuario
  const usuario = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: hashedPassword,
      telefono: data.telefono,
      direccion: data.direccion,
      rol: 'cliente' // Por defecto es cliente
    }
  });

  // Generar token
  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      rol: usuario.rol 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remover password del response
  const { password, ...usuarioSinPassword } = usuario;

  return {
    usuario: usuarioSinPassword,
    token
  };
}

/**
 * Login de usuario
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  // Buscar usuario por email
  const usuario = await prisma.usuario.findUnique({
    where: { email: credentials.email }
  });

  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar password
  const passwordValido = await bcrypt.compare(credentials.password, usuario.password);

  if (!passwordValido) {
    throw new Error('Credenciales inválidas');
  }

  // Generar token
  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      rol: usuario.rol 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remover password del response
  const { password, ...usuarioSinPassword } = usuario;

  return {
    usuario: usuarioSinPassword,
    token
  };
}

/**
 * Verificar token y obtener usuario
 */
export async function verifyToken(token: string): Promise<Omit<Usuario, 'password'>> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  } catch (error) {
    throw new Error('Token inválido');
  }
}
