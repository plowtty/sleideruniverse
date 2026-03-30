// ============================================
// INTERFAZ DE PRODUCTO
// ============================================

export interface IProducto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagenUrl?: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE PRODUCTO
// ============================================

export class Producto implements IProducto {
  // ========== PROPIEDADES ==========
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagenUrl?: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: IProducto) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.precio = data.precio;
    this.stock = data.stock;
    this.categoriaId = data.categoriaId;
    this.imagenUrl = data.imagenUrl;
    this.activo = data.activo ?? true;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos del producto
   */
  private validar(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }

    if (this.nombre.length > 200) {
      throw new Error('El nombre del producto no puede exceder 200 caracteres');
    }

    if (!this.descripcion || this.descripcion.trim().length === 0) {
      throw new Error('La descripción del producto es requerida');
    }

    if (this.precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (this.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (!this.categoriaId || this.categoriaId <= 0) {
      throw new Error('La categoría del producto es requerida');
    }
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Verifica si el producto está disponible para la venta
   */
  public estaDisponible(): boolean {
    return this.activo && this.stock > 0;
  }

  /**
   * Verifica si hay suficiente stock disponible
   */
  public tieneStock(cantidad: number): boolean {
    return this.stock >= cantidad;
  }

  // ========== MÉTODOS DE GESTIÓN DE STOCK ==========
  /**
   * Reduce el stock del producto
   */
  public reducirStock(cantidad: number): void {
    if (!this.tieneStock(cantidad)) {
      throw new Error(`Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${cantidad}`);
    }
    this.stock -= cantidad;
    this.fechaActualizacion = new Date();
  }

  /**
   * Aumenta el stock del producto
   */
  public aumentarStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    this.stock += cantidad;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE GESTIÓN DE PRECIO ==========
  /**
   * Actualiza el precio del producto
   */
  public actualizarPrecio(nuevoPrecio: number): void {
    if (nuevoPrecio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.precio = nuevoPrecio;
    this.fechaActualizacion = new Date();
  }

  /**
   * Calcula el precio con descuento
   */
  public calcularPrecioConDescuento(porcentajeDescuento: number): number {
    if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }
    return this.precio - (this.precio * porcentajeDescuento / 100);
  }

  // ========== MÉTODOS DE ACTIVACIÓN/DESACTIVACIÓN ==========
  /**
   * Activa el producto
   */
  public activar(): void {
    this.activo = true;
    this.fechaActualizacion = new Date();
  }

  /**
   * Desactiva el producto
   */
  public desactivar(): void {
    this.activo = false;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte el producto a un objeto plano para la base de datos
   */
  public toJSON(): IProducto {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
      categoriaId: this.categoriaId,
      imagenUrl: this.imagenUrl,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de Producto desde un objeto de base de datos
   */
  public static fromDB(data: any): Producto {
    return new Producto({
      id: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock),
      categoriaId: data.categoria_id || data.categoriaId,
      imagenUrl: data.imagen_url || data.imagenUrl,
      activo: data.activo,
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
