import { supabase } from "../config/supabase";
import { Producto, ApiResponse, PaginatedResponse } from "../types";

export class ProductoService {
  static async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Producto>> {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from("productos")
        .select(
          `
          *,
          categorias (
            id,
            nombre
          )
        `,
          { count: "exact" }
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match Producto interface
      const productos = (data || []).map((item) => ({
        ...item,
        categoria_nombre: item.categorias?.nombre,
      }));

      return {
        success: true,
        data: productos,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching productos: ${error}`);
    }
  }

  static async getById(id: number): Promise<Producto> {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(
          `
          *,
          categorias (
            id,
            nombre
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Producto not found");

      return {
        ...data,
        categoria_nombre: data.categorias?.nombre,
      };
    } catch (error) {
      throw new Error(`Error fetching producto: ${error}`);
    }
  }

  static async create(
    producto: Omit<
      Producto,
      "id" | "created_at" | "updated_at" | "categoria_nombre"
    >
  ): Promise<Producto> {
    try {
      const { data, error } = await supabase
        .from("productos")
        .insert([producto])
        .select(
          `
          *,
          categorias (
            id,
            nombre
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        categoria_nombre: data.categorias?.nombre,
      };
    } catch (error) {
      throw new Error(`Error creating producto: ${error}`);
    }
  }

  static async update(
    id: number,
    producto: Partial<Producto>
  ): Promise<Producto> {
    try {
      const { data, error } = await supabase
        .from("productos")
        .update(producto)
        .eq("id", id)
        .select(
          `
          *,
          categorias (
            id,
            nombre
          )
        `
        )
        .single();

      if (error) throw error;
      if (!data) throw new Error("Producto not found");

      return {
        ...data,
        categoria_nombre: data.categorias?.nombre,
      };
    } catch (error) {
      throw new Error(`Error updating producto: ${error}`);
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Error deleting producto: ${error}`);
    }
  }

  static async search(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Producto>> {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from("productos")
        .select(
          `
          *,
          categorias (
            id,
            nombre
          )
        `,
          { count: "exact" }
        )
        .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match Producto interface
      const productos = (data || []).map((item) => ({
        ...item,
        categoria_nombre: item.categorias?.nombre,
      }));

      return {
        success: true,
        data: productos,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error searching productos: ${error}`);
    }
  }
}
