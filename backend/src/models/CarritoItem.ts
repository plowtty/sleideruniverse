// ============================================
// INTERFAZ DE CARRITO ITEM
// ============================================

export interface ICarritoItem {
  id?: number;
  carritoId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE CARRITO ITEM
// ============================================

export class CarritoItem implements ICarritoItem {
  // ========== PROPIEDADES ==========
  id?: number;
  carritoId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: ICarritoItem) {
    this.id = data.id;
    this.carritoId = data.carritoId;
    this.productoId = data.productoId;
    this.cantidad = data.cantidad;
    this.precioUnitario = data.precioUnitario;
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos del item del carrito
   */
  private validar(): void {
    if (!this.productoId || this.productoId <= 0) {
      throw new Error('El ID del producto es requerido y debe ser válido');
    }

    if (!this.cantidad || this.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (this.precioUnitario < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }
  }

  // ========== MÉTODOS DE CÁLCULO ==========
  /**
   * Calcula el subtotal del item (cantidad * precio unitario)
   */
  public calcularSubtotal(): number {
    return this.cantidad * this.precioUnitario;
  }

  // ========== MÉTODOS DE GESTIÓN ==========
  /**
   * Actualiza la cantidad del item
   */
  public actualizarCantidad(nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    this.cantidad = nuevaCantidad;
    this.fechaActualizacion = new Date();
  }

  /**
   * Aumenta la cantidad del item
   */
  public aumentarCantidad(cantidad: number = 1): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad a aumentar debe ser mayor a 0');
    }

    this.cantidad += cantidad;
    this.fechaActualizacion = new Date();
  }

  /**
   * Reduce la cantidad del item
   */
  public reducirCantidad(cantidad: number = 1): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad a reducir debe ser mayor a 0');
    }

    if (this.cantidad - cantidad <= 0) {
      throw new Error('La cantidad resultante debe ser mayor a 0. Use eliminar() si desea quitar el item');
    }

    this.cantidad -= cantidad;
    this.fechaActualizacion = new Date();
  }

  /**
   * Actualiza el precio unitario del item
   */
  public actualizarPrecio(nuevoPrecio: number): void {
    if (nuevoPrecio < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    this.precioUnitario = nuevoPrecio;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte el item a un objeto plano
   */
  public toJSON(): ICarritoItem {
    return {
      id: this.id,
      carritoId: this.carritoId,
      productoId: this.productoId,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de CarritoItem desde un objeto de base de datos
   */
  public static fromDB(data: any): CarritoItem {
    return new CarritoItem({
      id: data.id,
      carritoId: data.carrito_id || data.carritoId,
      productoId: data.producto_id || data.productoId,
      cantidad: parseInt(data.cantidad),
      precioUnitario: parseFloat(data.precio_unitario || data.precioUnitario),
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
