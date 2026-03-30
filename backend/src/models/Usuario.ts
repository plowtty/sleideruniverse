// ============================================
// INTERFAZ DE USUARIO
// ============================================

export interface IUsuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE USUARIO
// ============================================

export class Usuario implements IUsuario {
  // ========== PROPIEDADES ==========
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: IUsuario) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email;
    this.password = data.password;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
    this.rol = data.rol || 'cliente';
    this.activo = data.activo ?? true;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos del usuario
   */
  private validar(): void {
    // Validar nombre
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del usuario es requerido');
    }
    if (this.nombre.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    // Validar apellido
    if (!this.apellido || this.apellido.trim().length === 0) {
      throw new Error('El apellido del usuario es requerido');
    }
    if (this.apellido.length > 100) {
      throw new Error('El apellido no puede exceder 100 caracteres');
    }

    // Validar email
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('El email es requerido');
    }
    if (!this.esEmailValido(this.email)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar password
    if (!this.password || this.password.length === 0) {
      throw new Error('La contraseña es requerida');
    }

    // Validar rol
    const rolesValidos = ['cliente', 'admin', 'vendedor'];
    if (!rolesValidos.includes(this.rol)) {
      throw new Error('El rol debe ser: cliente, admin o vendedor');
    }

    // Validar teléfono si existe
    if (this.telefono && this.telefono.length > 20) {
      throw new Error('El teléfono no puede exceder 20 caracteres');
    }
  }

  /**
   * Valida el formato de un email
   */
  private esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Obtiene el nombre completo del usuario
   */
  public obtenerNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  /**
   * Verifica si el usuario está activo
   */
  public estaActivo(): boolean {
    return this.activo;
  }

  /**
   * Verifica si el usuario es administrador
   */
  public esAdmin(): boolean {
    return this.rol === 'admin';
  }

  /**
   * Verifica si el usuario es cliente
   */
  public esCliente(): boolean {
    return this.rol === 'cliente';
  }

  /**
   * Verifica si el usuario es vendedor
   */
  public esVendedor(): boolean {
    return this.rol === 'vendedor';
  }

  // ========== MÉTODOS DE GESTIÓN ==========
  /**
   * Actualiza el perfil del usuario
   */
  public actualizarPerfil(data: { nombre?: string; apellido?: string; telefono?: string; direccion?: string }): void {
    if (data.nombre) {
      if (data.nombre.length > 100) {
        throw new Error('El nombre no puede exceder 100 caracteres');
      }
      this.nombre = data.nombre;
    }

    if (data.apellido) {
      if (data.apellido.length > 100) {
        throw new Error('El apellido no puede exceder 100 caracteres');
      }
      this.apellido = data.apellido;
    }

    if (data.telefono !== undefined) {
      if (data.telefono && data.telefono.length > 20) {
        throw new Error('El teléfono no puede exceder 20 caracteres');
      }
      this.telefono = data.telefono;
    }

    if (data.direccion !== undefined) {
      this.direccion = data.direccion;
    }

    this.fechaActualizacion = new Date();
  }

  /**
   * Cambia el rol del usuario
   */
  public cambiarRol(nuevoRol: string): void {
    const rolesValidos = ['cliente', 'admin', 'vendedor'];
    if (!rolesValidos.includes(nuevoRol)) {
      throw new Error('El rol debe ser: cliente, admin o vendedor');
    }
    this.rol = nuevoRol;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE ACTIVACIÓN/DESACTIVACIÓN ==========
  /**
   * Activa el usuario
   */
  public activar(): void {
    this.activo = true;
    this.fechaActualizacion = new Date();
  }

  /**
   * Desactiva el usuario
   */
  public desactivar(): void {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte el usuario a un objeto plano (sin password)
   */
  public toJSON(): Omit<IUsuario, 'password'> {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      rol: this.rol,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Convierte el usuario a objeto con password (para base de datos)
   */
  public toDatabase(): IUsuario {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password,
      telefono: this.telefono,
      direccion: this.direccion,
      rol: this.rol,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de Usuario desde un objeto de base de datos
   */
  public static fromDB(data: any): Usuario {
    return new Usuario({
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: data.password,
      telefono: data.telefono,
      direccion: data.direccion,
      rol: data.rol,
      activo: data.activo,
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
