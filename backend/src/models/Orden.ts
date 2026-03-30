// ============================================
// INTERFAZ DE ORDEN
// ============================================

import { OrdenItem, IOrdenItem } from './OrdenItem';

export interface IOrden {
  id?: number;
  usuarioId: number;
  total: number;
  estado: string;
  direccionEnvio: string;
  metodoPago: string;
  notas?: string;
  items?: IOrdenItem[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// ============================================
// CLASE ORDEN
// ============================================

export class Orden implements IOrden {
  // ========== PROPIEDADES ==========
  id?: number;
  usuarioId: number;
  total: number;
  estado: string;
  direccionEnvio: string;
  metodoPago: string;
  notas?: string;
  items: OrdenItem[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;

  // Estados válidos de una orden
  private static readonly ESTADOS_VALIDOS = [
    'pendiente',
    'procesando',
    'enviado',
    'entregado',
    'cancelado',
    'rechazado'
  ];

  // ========== CONSTRUCTOR ==========
  constructor(data: IOrden) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.total = data.total;
    this.estado = data.estado || 'pendiente';
    this.direccionEnvio = data.direccionEnvio;
    this.metodoPago = data.metodoPago;
    this.notas = data.notas;
    this.items = data.items?.map(item => new OrdenItem(item)) || [];
    this.fechaCreacion = data.fechaCreacion || new Date();
    this.fechaActualizacion = data.fechaActualizacion || new Date();

    this.validar();
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========
  /**
   * Valida los datos de la orden
   */
  private validar(): void {
    if (!this.usuarioId || this.usuarioId <= 0) {
      throw new Error('El ID del usuario es requerido y debe ser válido');
    }

    if (this.total < 0) {
      throw new Error('El total no puede ser negativo');
    }

    if (!this.direccionEnvio || this.direccionEnvio.trim().length === 0) {
      throw new Error('La dirección de envío es requerida');
    }

    if (!this.metodoPago || this.metodoPago.trim().length === 0) {
      throw new Error('El método de pago es requerido');
    }

    if (!Orden.ESTADOS_VALIDOS.includes(this.estado)) {
      throw new Error(`El estado debe ser uno de: ${Orden.ESTADOS_VALIDOS.join(', ')}`);
    }
  }

  // ========== MÉTODOS DE CONSULTA ==========
  /**
   * Verifica si la orden está pendiente
   */
  public estaPendiente(): boolean {
    return this.estado === 'pendiente';
  }

  /**
   * Verifica si la orden está procesando
   */
  public estaProcesando(): boolean {
    return this.estado === 'procesando';
  }

  /**
   * Verifica si la orden fue enviada
   */
  public fueEnviada(): boolean {
    return this.estado === 'enviado';
  }

  /**
   * Verifica si la orden fue entregada
   */
  public fueEntregada(): boolean {
    return this.estado === 'entregado';
  }

  /**
   * Verifica si la orden fue cancelada
   */
  public fueCancelada(): boolean {
    return this.estado === 'cancelado';
  }

  /**
   * Verifica si la orden fue rechazada
   */
  public fueRechazada(): boolean {
    return this.estado === 'rechazado';
  }

  /**
   * Verifica si la orden puede ser cancelada
   */
  public puedeCancelarse(): boolean {
    return this.estado === 'pendiente' || this.estado === 'procesando';
  }

  /**
   * Obtiene la cantidad total de items en la orden
   */
  public obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Calcula el total de la orden sumando los subtotales de los items
   */
  public calcularTotal(): number {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  // ========== MÉTODOS DE GESTIÓN DE ESTADO ==========
  /**
   * Cambia el estado de la orden
   */
  public cambiarEstado(nuevoEstado: string): void {
    if (!Orden.ESTADOS_VALIDOS.includes(nuevoEstado)) {
      throw new Error(`El estado debe ser uno de: ${Orden.ESTADOS_VALIDOS.join(', ')}`);
    }

    // Validar transiciones de estado
    if (this.fueCancelada() || this.fueRechazada()) {
      throw new Error('No se puede cambiar el estado de una orden cancelada o rechazada');
    }

    if (this.fueEntregada() && nuevoEstado !== 'entregado') {
      throw new Error('No se puede cambiar el estado de una orden ya entregada');
    }

    this.estado = nuevoEstado;
    this.fechaActualizacion = new Date();
  }

  /**
   * Marca la orden como procesando
   */
  public marcarProcesando(): void {
    if (!this.estaPendiente()) {
      throw new Error('Solo se pueden procesar órdenes pendientes');
    }
    this.cambiarEstado('procesando');
  }

  /**
   * Marca la orden como enviada
   */
  public marcarEnviada(): void {
    if (!this.estaProcesando()) {
      throw new Error('Solo se pueden enviar órdenes en procesamiento');
    }
    this.cambiarEstado('enviado');
  }

  /**
   * Marca la orden como entregada
   */
  public marcarEntregada(): void {
    if (!this.fueEnviada()) {
      throw new Error('Solo se pueden entregar órdenes enviadas');
    }
    this.cambiarEstado('entregado');
  }

  /**
   * Cancela la orden
   */
  public cancelar(): void {
    if (!this.puedeCancelarse()) {
      throw new Error('Esta orden no puede ser cancelada en su estado actual');
    }
    this.cambiarEstado('cancelado');
  }

  /**
   * Rechaza la orden
   */
  public rechazar(): void {
    if (!this.estaPendiente()) {
      throw new Error('Solo se pueden rechazar órdenes pendientes');
    }
    this.cambiarEstado('rechazado');
  }

  // ========== MÉTODOS DE GESTIÓN ==========
  /**
   * Actualiza la dirección de envío
   */
  public actualizarDireccionEnvio(nuevaDireccion: string): void {
    if (!this.puedeCancelarse()) {
      throw new Error('No se puede actualizar la dirección de una orden en proceso avanzado');
    }

    if (!nuevaDireccion || nuevaDireccion.trim().length === 0) {
      throw new Error('La dirección de envío no puede estar vacía');
    }

    this.direccionEnvio = nuevaDireccion;
    this.fechaActualizacion = new Date();
  }

  /**
   * Agrega o actualiza notas a la orden
   */
  public agregarNotas(notas: string): void {
    this.notas = notas;
    this.fechaActualizacion = new Date();
  }

  // ========== MÉTODOS DE INFORMACIÓN ==========
  /**
   * Obtiene un resumen de la orden
   */
  public obtenerResumen(): {
    id?: number;
    estado: string;
    cantidadItems: number;
    cantidadTotal: number;
    total: number;
    fecha: Date | undefined;
  } {
    return {
      id: this.id,
      estado: this.estado,
      cantidadItems: this.items.length,
      cantidadTotal: this.obtenerCantidadTotal(),
      total: this.total,
      fecha: this.fechaCreacion
    };
  }

  // ========== MÉTODOS DE SERIALIZACIÓN ==========
  /**
   * Convierte la orden a un objeto plano
   */
  public toJSON(): IOrden {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      total: this.total,
      estado: this.estado,
      direccionEnvio: this.direccionEnvio,
      metodoPago: this.metodoPago,
      notas: this.notas,
      items: this.items.map(item => item.toJSON()),
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * Crea una instancia de Orden desde un objeto de base de datos
   */
  public static fromDB(data: any): Orden {
    return new Orden({
      id: data.id,
      usuarioId: data.usuario_id || data.usuarioId,
      total: parseFloat(data.total),
      estado: data.estado,
      direccionEnvio: data.direccion_envio || data.direccionEnvio,
      metodoPago: data.metodo_pago || data.metodoPago,
      notas: data.notas,
      items: data.items || [],
      fechaCreacion: data.fecha_creacion || data.fechaCreacion,
      fechaActualizacion: data.fecha_actualizacion || data.fechaActualizacion
    });
  }
}
