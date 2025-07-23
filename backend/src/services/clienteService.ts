import { supabase } from "../config/supabase";
import {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export class ClienteService {
  /**
   * Get all clients with pagination
   */
  static async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Cliente>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      // Get paginated data
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching clients: ${error}`);
    }
  }

  /**
   * Get client by ID
   */
  static async getById(id: number): Promise<ApiResponse<Cliente>> {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return {
            success: false,
            error: "Client not found",
          };
        }
        throw error;
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new Error(`Error fetching client: ${error}`);
    }
  }

  /**
   * Create new client
   */
  static async create(
    clienteData: CreateClienteRequest
  ): Promise<ApiResponse<Cliente>> {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .insert([clienteData])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return {
            success: false,
            error: "Email already exists",
          };
        }
        throw error;
      }

      return {
        success: true,
        data,
        message: "Client created successfully",
      };
    } catch (error) {
      throw new Error(`Error creating client: ${error}`);
    }
  }

  /**
   * Update client
   */
  static async update(
    id: number,
    clienteData: UpdateClienteRequest
  ): Promise<ApiResponse<Cliente>> {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .update(clienteData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return {
            success: false,
            error: "Client not found",
          };
        }
        if (error.code === "23505") {
          return {
            success: false,
            error: "Email already exists",
          };
        }
        throw error;
      }

      return {
        success: true,
        data,
        message: "Client updated successfully",
      };
    } catch (error) {
      throw new Error(`Error updating client: ${error}`);
    }
  }

  /**
   * Delete client
   */
  static async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from("clientes").delete().eq("id", id);

      if (error) {
        if (error.code === "PGRST116") {
          return {
            success: false,
            error: "Client not found",
          };
        }
        throw error;
      }

      return {
        success: true,
        message: "Client deleted successfully",
      };
    } catch (error) {
      throw new Error(`Error deleting client: ${error}`);
    }
  }

  /**
   * Search clients by name or email
   */
  static async search(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Cliente>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .or(`nombre.ilike.%${query}%,email.ilike.%${query}%`);

      if (countError) throw countError;

      // Get paginated data
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .or(`nombre.ilike.%${query}%,email.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      throw new Error(`Error searching clients: ${error}`);
    }
  }
}
