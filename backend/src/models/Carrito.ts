// ============================================
// INTERFAZ DE CARRITO
// ============================================

import { CarritoItem, ICarritoItem } from './CarritoItem';

export interface ICarrito {
  id?: number;
  usuarioId: number;
  items?: ICarritoItem[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE CARRITO
// ============================================

export class Carrito implements ICarrito {
  // ========== PROPIEDADES ==========
  id?: number;
  usuarioId: number;
  items: CarritoItem[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // ========== CONSTRUCTOR ==========
  constructor(data: ICarrito) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.items = data.items?.map(item => new CarritoItem(item)) || [];
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos del carrito
   */
  private validar(): void {
    if (!this.usuarioId || this.usuarioId <= 0) {
      throw new Error('El ID del usuario es requerido y debe ser válido');
    }
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Verifica si el carrito está vacío
   */
  public estaVacio(): boolean {
    return this.items.length === 0;
  }

  /**
   * Obtiene la cantidad total de items en el carrito
   */
  public obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Calcula el total del carrito
   */
  public calcularTotal(): number {
    return this.items.reduce((total, item) => total + item.calcularSubtotal(), 0);
  }

  /**
   * Busca un item por ID de producto
   */
  public buscarItem(productoId: number): CarritoItem | undefined {
    return this.items.find(item => item.productoId === productoId);
  }

  /**
   * Verifica si un producto está en el carrito
   */
  public tieneProducto(productoId: number): boolean {
    return this.items.some(item => item.productoId === productoId);
  }

  // ========== MÉTODOS DE GESTIÓN DE ITEMS ==========
  /**
   * Agrega un producto al carrito
   */
  public agregarItem(item: ICarritoItem): void {
    const itemExistente = this.buscarItem(item.productoId);

    if (itemExistente) {
      // Si ya existe, aumentar cantidad
      itemExistente.aumentarCantidad(item.cantidad);
    } else {
      // Si no existe, agregar nuevo item
      this.items.push(new CarritoItem(item));
    }

    this.fechaActualizacion = new Date();
  }

  /**
   * Actualiza la cantidad de un item
   */
  public actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    const item = this.buscarItem(productoId);

    if (!item) {
      throw new Error('El producto no existe en el carrito');
    }

    if (nuevaCantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    item.actualizarCantidad(nuevaCantidad);
    this.fechaActualizacion = new Date();
  }

  /**
   * Elimina un item del carrito
   */
  public eliminarItem(productoId: number): void {
    const index = this.items.findIndex(item => item.productoId === productoId);

    if (index === -1) {
      throw new Error('El producto no existe en el carrito');
    }

    this.items.splice(index, 1);
    this.fechaActualizacion = new Date();
  }

  /**
   * Vacía completamente el carrito
   */
  public vaciar(): void {
    this.items = [];
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE CÁLCULO ==========
  /**
   * Aplica un descuento porcentual al total del carrito
   */
  public calcularTotalConDescuento(porcentajeDescuento: number): number {
    if (porcentajeDescuento < 0 || porcentajeDescuento > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }

    const total = this.calcularTotal();
    return total - (total * porcentajeDescuento / 100);
  }

  /**
   * Obtiene un resumen del carrito
   */
  public obtenerResumen(): {
    cantidadItems: number;
    cantidadTotal: number;
    subtotal: number;
    total: number;
  } {
    return {
      cantidadItems: this.items.length,
      cantidadTotal: this.obtenerCantidadTotal(),
      subtotal: this.calcularTotal(),
      total: this.calcularTotal()
    };
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte el carrito a un objeto plano
   */
  public toJSON(): ICarrito {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      items: this.items.map(item => item.toJSON()),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de Carrito desde un objeto de base de datos
   */
  public static fromDB(data: any): Carrito {
    return new Carrito({
      id: data.id,
      usuarioId: data.usuario_id || data.usuarioId,
      items: data.items || [],
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
