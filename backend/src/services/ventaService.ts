import { supabase } from "../config/supabase";
import {
  Venta,
  DetalleVenta,
  VentaConDetalles,
  CrearVentaRequest,
  ActualizarVentaRequest,
} from "../types";

export class VentaService {
  /**
   * Get all sales with client information
   */
  static async getAll(): Promise<Venta[]> {
    try {
      const { data, error } = await supabase
        .from("ventas_resumen")
        .select("*")
        .order("fecha_venta", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching ventas:", error);
      throw new Error("Failed to fetch ventas");
    }
  }

  /**
   * Get a sale by ID with details
   */
  static async getById(id: number): Promise<VentaConDetalles | null> {
    try {
      // Get sale with client info
      const { data: venta, error: ventaError } = await supabase
        .from("ventas_resumen")
        .select("*")
        .eq("id", id)
        .single();

      if (ventaError) throw ventaError;
      if (!venta) return null;

      // Get sale details with product info
      const { data: detalles, error: detallesError } = await supabase
        .from("detalles_venta")
        .select(
          `
          *,
          productos (
            id,
            nombre,
            precio
          )
        `
        )
        .eq("venta_id", id);

      if (detallesError) throw detallesError;

      // Transform the data
      const detallesTransformados =
        detalles?.map((detalle) => ({
          id: detalle.id,
          venta_id: detalle.venta_id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
          created_at: detalle.created_at,
          producto_nombre: detalle.productos?.nombre,
          producto_precio: detalle.productos?.precio,
        })) || [];

      return {
        ...venta,
        detalles: detallesTransformados,
      };
    } catch (error) {
      console.error("Error fetching venta by ID:", error);
      throw new Error("Failed to fetch venta");
    }
  }

  /**
   * Create a new sale with details
   */
  static async create(ventaData: CrearVentaRequest): Promise<VentaConDetalles> {
    try {
      // Start a transaction
      const { data: venta, error: ventaError } = await supabase
        .from("ventas")
        .insert({
          cliente_id: ventaData.cliente_id,
          total: 0, // Will be calculated
          estado: "pendiente",
        })
        .select()
        .single();

      if (ventaError) throw ventaError;

      let totalVenta = 0;
      const detalles: DetalleVenta[] = [];

      // Process each detail
      for (const detalle of ventaData.detalles) {
        // Get product info
        const { data: producto, error: productoError } = await supabase
          .from("productos")
          .select("precio, stock")
          .eq("id", detalle.producto_id)
          .single();

        if (productoError) throw productoError;
        if (!producto)
          throw new Error(`Producto ${detalle.producto_id} no encontrado`);
        if (producto.stock < detalle.cantidad) {
          throw new Error(
            `Stock insuficiente para el producto ${detalle.producto_id}`
          );
        }

        const subtotal = producto.precio * detalle.cantidad;
        totalVenta += subtotal;

        // Create sale detail
        const { data: detalleCreado, error: detalleError } = await supabase
          .from("detalles_venta")
          .insert({
            venta_id: venta.id,
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: producto.precio,
            subtotal: subtotal,
          })
          .select()
          .single();

        if (detalleError) throw detalleError;
        detalles.push(detalleCreado);
      }

      // Update sale total
      const { error: updateError } = await supabase
        .from("ventas")
        .update({ total: totalVenta })
        .eq("id", venta.id);

      if (updateError) throw updateError;

      // Get the complete sale with details
      const ventaCompleta = await this.getById(venta.id);
      if (!ventaCompleta) throw new Error("Failed to retrieve created sale");

      return ventaCompleta;
    } catch (error) {
      console.error("Error creating venta:", error);
      throw error;
    }
  }

  /**
   * Update sale status
   */
  static async update(
    id: number,
    updateData: ActualizarVentaRequest
  ): Promise<Venta> {
    try {
      const { data, error } = await supabase
        .from("ventas")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating venta:", error);
      throw new Error("Failed to update venta");
    }
  }

  /**
   * Delete a sale (cascade will delete details)
   */
  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting venta:", error);
      throw new Error("Failed to delete venta");
    }
  }

  /**
   * Get sales by client
   */
  static async getByClient(clienteId: number): Promise<Venta[]> {
    try {
      const { data, error } = await supabase
        .from("ventas_resumen")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("fecha_venta", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching ventas by client:", error);
      throw new Error("Failed to fetch ventas by client");
    }
  }

  /**
   * Get sales by status
   */
  static async getByStatus(estado: string): Promise<Venta[]> {
    try {
      const { data, error } = await supabase
        .from("ventas_resumen")
        .select("*")
        .eq("estado", estado)
        .order("fecha_venta", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching ventas by status:", error);
      throw new Error("Failed to fetch ventas by status");
    }
  }

  /**
   * Get sales statistics
   */
  static async getStats() {
    try {
      const { data, error } = await supabase
        .from("ventas_resumen")
        .select("total, estado, fecha_venta");

      if (error) throw error;

      const stats = {
        totalVentas: data?.length || 0,
        totalIngresos:
          data?.reduce((sum, venta) => sum + (venta.total || 0), 0) || 0,
        ventasCompletadas:
          data?.filter((v) => v.estado === "completada").length || 0,
        ventasPendientes:
          data?.filter((v) => v.estado === "pendiente").length || 0,
        ventasCanceladas:
          data?.filter((v) => v.estado === "cancelada").length || 0,
      };

      return stats;
    } catch (error) {
      console.error("Error fetching ventas stats:", error);
      throw new Error("Failed to fetch ventas stats");
    }
  }
}
