// ============================================
// INTERFAZ DE ORDEN ITEM
// ============================================

export interface IOrdenItem {
  id?: number;
  ordenId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  fechaCreacion?: Date;
}

// ============================================
// CLASE ORDEN ITEM
// ============================================

export class OrdenItem implements IOrdenItem {
  // ========== PROPIEDADES ==========
  id?: number;
  ordenId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  fechaCreacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: IOrdenItem) {
    this.id = data.id;
    this.ordenId = data.ordenId;
    this.productoId = data.productoId;
    this.cantidad = data.cantidad;
    this.precioUnitario = data.precioUnitario;
    this.subtotal = data.subtotal || this.calcularSubtotal();
    this.fechaCreacion = data.fechaCreacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos del item de la orden
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

    if (this.subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }

    // Verificar que el subtotal sea correcto
    const subtotalCalculado = this.calcularSubtotal();
    if (Math.abs(this.subtotal - subtotalCalculado) > 0.01) {
      throw new Error('El subtotal no coincide con el cálculo (cantidad * precio unitario)');
    }
  }

  // ========== MÉTODOS DE CÁLCULO ==========
  /**
   * Calcula el subtotal del item (cantidad * precio unitario)
   */
  public calcularSubtotal(): number {
    return this.cantidad * this.precioUnitario;
  }

  /**
   * Obtiene el precio promedio por unidad
   */
  public obtenerPrecioPromedio(): number {
    return this.precioUnitario;
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Verifica si el item es de un producto específico
   */
  public esDelProducto(productoId: number): boolean {
    return this.productoId === productoId;
  }

  /**
   * Obtiene información resumida del item
   */
  public obtenerResumen(): {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  } {
    return {
      productoId: this.productoId,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      subtotal: this.subtotal
    };
  }

  // ========== MÉTODOS DE COMPARACIÓN ==========
  /**
   * Compara este item con otro para verificar si son del mismo producto
   */
  public esMismoProducto(otroItem: OrdenItem): boolean {
    return this.productoId === otroItem.productoId;
  }

  /**
   * Compara precios con otro item
   */
  public tieneMismoPrecio(otroItem: OrdenItem): boolean {
    return Math.abs(this.precioUnitario - otroItem.precioUnitario) < 0.01;
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte el item a un objeto plano
   */
  public toJSON(): IOrdenItem {
    return {
      id: this.id,
      ordenId: this.ordenId,
      productoId: this.productoId,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      subtotal: this.subtotal,
      fechaCreacion: this.fechaCreacion
    };
  }

  /**
   * Crea una instancia de OrdenItem desde un objeto de base de datos
   */
  public static fromDB(data: any): OrdenItem {
    return new OrdenItem({
      id: data.id,
      ordenId: data.orden_id || data.ordenId,
      productoId: data.producto_id || data.productoId,
      cantidad: parseInt(data.cantidad),
      precioUnitario: parseFloat(data.precio_unitario || data.precioUnitario),
      subtotal: parseFloat(data.subtotal),
      fechaCreacion: data.fecha_creacion || data.fechaCreacion
    });
  }

  /**
   * Crea un OrdenItem desde un CarritoItem
   */
  public static fromCarritoItem(carritoItem: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }): OrdenItem {
    return new OrdenItem({
      productoId: carritoItem.productoId,
      cantidad: carritoItem.cantidad,
      precioUnitario: carritoItem.precioUnitario,
      subtotal: carritoItem.cantidad * carritoItem.precioUnitario
    });
  }
}
