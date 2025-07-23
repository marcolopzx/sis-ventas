// Cliente types
export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClienteRequest {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface UpdateClienteRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

// Categoria types
export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaRequest {
  nombre?: string;
  descripcion?: string;
}

// Producto types
export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
}

export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoria_id?: number;
}

// Venta types
export interface Venta {
  id?: number;
  cliente_id: number;
  total: number;
  estado: "pendiente" | "completada" | "cancelada";
  fecha_venta?: string;
  created_at?: string;
  updated_at?: string;
  cliente_nombre?: string;
  cliente_email?: string;
  total_productos?: number;
}

export interface DetalleVenta {
  id?: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
  producto_nombre?: string;
  producto_precio?: number;
}

export interface VentaConDetalles extends Venta {
  detalles: DetalleVenta[];
}

export interface CrearVentaRequest {
  cliente_id: number;
  detalles: {
    producto_id: number;
    cantidad: number;
  }[];
}

export interface ActualizarVentaRequest {
  estado?: "pendiente" | "completada" | "cancelada";
}

export interface CreateDetalleVentaRequest {
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
