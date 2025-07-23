import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  categoria_nombre?: string;
  created_at: string;
  updated_at: string;
}

export interface Venta {
  id?: number;
  cliente_id: number;
  cliente_nombre?: string;
  cliente_email?: string;
  fecha_venta?: string;
  total: number;
  estado: "pendiente" | "completada" | "cancelada";
  created_at?: string;
  updated_at?: string;
  total_productos?: number;
}

export interface DetalleVenta {
  id?: number;
  venta_id: number;
  producto_id: number;
  producto_nombre?: string;
  producto_precio?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Cliente API
export const clienteAPI = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<ApiResponse<Cliente[]>>("/clientes");
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<ApiResponse<Cliente>>(`/clientes/${id}`);
    return response.data.data!;
  },

  create: async (
    cliente: Omit<Cliente, "id" | "created_at" | "updated_at">
  ): Promise<Cliente> => {
    const response = await api.post<ApiResponse<Cliente>>("/clientes", cliente);
    return response.data.data!;
  },

  update: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.put<ApiResponse<Cliente>>(
      `/clientes/${id}`,
      cliente
    );
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};

// Categoria API
export const categoriaAPI = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get<ApiResponse<Categoria[]>>("/categorias");
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data.data!;
  },

  create: async (
    categoria: Omit<Categoria, "id" | "created_at" | "updated_at">
  ): Promise<Categoria> => {
    const response = await api.post<ApiResponse<Categoria>>(
      "/categorias",
      categoria
    );
    return response.data.data!;
  },

  update: async (
    id: number,
    categoria: Partial<Categoria>
  ): Promise<Categoria> => {
    const response = await api.put<ApiResponse<Categoria>>(
      `/categorias/${id}`,
      categoria
    );
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

// Producto API
export const productoAPI = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get<ApiResponse<Producto[]>>("/productos");
    return response.data.data || [];
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await api.get<ApiResponse<Producto>>(`/productos/${id}`);
    return response.data.data!;
  },

  create: async (
    producto: Omit<Producto, "id" | "created_at" | "updated_at">
  ): Promise<Producto> => {
    const response = await api.post<ApiResponse<Producto>>(
      "/productos",
      producto
    );
    return response.data.data!;
  },

  update: async (
    id: number,
    producto: Partial<Producto>
  ): Promise<Producto> => {
    const response = await api.put<ApiResponse<Producto>>(
      `/productos/${id}`,
      producto
    );
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },
};

// Venta API
export const ventaAPI = {
  getAll: async (): Promise<Venta[]> => {
    const response = await api.get<ApiResponse<Venta[]>>("/ventas");
    return response.data.data || [];
  },

  getById: async (id: number): Promise<VentaConDetalles> => {
    const response = await api.get<ApiResponse<VentaConDetalles>>(
      `/ventas/${id}`
    );
    return response.data.data!;
  },

  create: async (ventaData: CrearVentaRequest): Promise<VentaConDetalles> => {
    const response = await api.post<ApiResponse<VentaConDetalles>>(
      "/ventas",
      ventaData
    );
    return response.data.data!;
  },

  update: async (
    id: number,
    ventaData: ActualizarVentaRequest
  ): Promise<Venta> => {
    const response = await api.put<ApiResponse<Venta>>(
      `/ventas/${id}`,
      ventaData
    );
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/ventas/${id}`);
  },

  getByClient: async (clienteId: number): Promise<Venta[]> => {
    const response = await api.get<ApiResponse<Venta[]>>(
      `/ventas/cliente/${clienteId}`
    );
    return response.data.data || [];
  },

  getByStatus: async (estado: string): Promise<Venta[]> => {
    const response = await api.get<ApiResponse<Venta[]>>(
      `/ventas/estado/${estado}`
    );
    return response.data.data || [];
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<any>>("/ventas/stats");
    return response.data.data;
  },
};

// DetalleVenta API
export const detalleVentaAPI = {
  getAll: async (): Promise<DetalleVenta[]> => {
    const response = await api.get<ApiResponse<DetalleVenta[]>>(
      "/detalle-ventas"
    );
    return response.data.data || [];
  },

  getById: async (id: number): Promise<DetalleVenta> => {
    const response = await api.get<ApiResponse<DetalleVenta>>(
      `/detalle-ventas/${id}`
    );
    return response.data.data!;
  },

  create: async (
    detalle: Omit<DetalleVenta, "id" | "created_at">
  ): Promise<DetalleVenta> => {
    const response = await api.post<ApiResponse<DetalleVenta>>(
      "/detalle-ventas",
      detalle
    );
    return response.data.data!;
  },

  update: async (
    id: number,
    detalle: Partial<DetalleVenta>
  ): Promise<DetalleVenta> => {
    const response = await api.put<ApiResponse<DetalleVenta>>(
      `/detalle-ventas/${id}`,
      detalle
    );
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/detalle-ventas/${id}`);
  },
};

export default api;
