// ============================================
// INTERFAZ DE CATEGORIA
// ============================================

export interface ICategoria {
  id?: number;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  activo: boolean;
  orden?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE CATEGORIA
// ============================================

export class Categoria implements ICategoria {
  // ========== PROPIEDADES ==========
  id?: number;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  activo: boolean;
  orden?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: ICategoria) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.imagenUrl = data.imagenUrl;
    this.activo = data.activo ?? true;
    this.orden = data.orden ?? 0;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos de la categoría
   */
  private validar(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido');
    }

    if (this.nombre.length > 100) {
      throw new Error('El nombre de la categoría no puede exceder 100 caracteres');
    }

    if (!this.descripcion || this.descripcion.trim().length === 0) {
      throw new Error('La descripción de la categoría es requerida');
    }

    if (this.orden !== undefined && this.orden < 0) {
      throw new Error('El orden no puede ser negativo');
    }
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Verifica si la categoría está activa
   */
  public estaActiva(): boolean {
    return this.activo;
  }

  // ========== MÉTODOS DE ACTIVACIÓN/DESACTIVACIÓN ==========
  /**
   * Activa la categoría
   */
  public activar(): void {
    this.activo = true;
    this.fechaActualizacion = new Date();
  }

  /**
   * Desactiva la categoría
   */
  public desactivar(): void {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE GESTIÓN ==========
  /**
   * Actualiza el orden de visualización de la categoría
   */
  public actualizarOrden(nuevoOrden: number): void {
    if (nuevoOrden < 0) {
      throw new Error('El orden no puede ser negativo');
    }
    this.orden = nuevoOrden;
    this.fechaActualizacion = new Date();
  }

  /**
   * Actualiza el nombre de la categoría
   */
  public actualizarNombre(nuevoNombre: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido');
    }
    if (nuevoNombre.length > 100) {
      throw new Error('El nombre de la categoría no puede exceder 100 caracteres');
    }
    this.nombre = nuevoNombre;
    this.fechaActualizacion = new Date();
  }

  /**
   * Actualiza la descripción de la categoría
   */
  public actualizarDescripcion(nuevaDescripcion: string): void {
    if (!nuevaDescripcion || nuevaDescripcion.trim().length === 0) {
      throw new Error('La descripción de la categoría es requerida');
    }
    this.descripcion = nuevaDescripcion;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte la categoría a un objeto plano para la base de datos
   */
  public toJSON(): ICategoria {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagenUrl: this.imagenUrl,
      activo: this.activo,
      orden: this.orden,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de Categoria desde un objeto de base de datos
   */
  public static fromDB(data: any): Categoria {
    return new Categoria({
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagenUrl: data.imagen_url || data.imagenUrl,
      activo: data.activo,
      orden: data.orden ? parseInt(data.orden) : 0,
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
