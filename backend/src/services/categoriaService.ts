import { supabase } from "../config/supabase";
import { Categoria, ApiResponse, PaginatedResponse } from "../types";

export class CategoriaService {
  static async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Categoria>> {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from("categorias")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching categorias: ${error}`);
    }
  }

  static async getById(id: number): Promise<Categoria> {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Categoria not found");

      return data;
    } catch (error) {
      throw new Error(`Error fetching categoria: ${error}`);
    }
  }

  static async create(
    categoria: Omit<Categoria, "id" | "created_at" | "updated_at">
  ): Promise<Categoria> {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .insert([categoria])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error creating categoria: ${error}`);
    }
  }

  static async update(
    id: number,
    categoria: Partial<Categoria>
  ): Promise<Categoria> {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .update(categoria)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Categoria not found");

      return data;
    } catch (error) {
      throw new Error(`Error updating categoria: ${error}`);
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase.from("categorias").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Error deleting categoria: ${error}`);
    }
  }

  static async search(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Categoria>> {
    try {
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from("categorias")
        .select("*", { count: "exact" })
        .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error searching categorias: ${error}`);
    }
  }
}
