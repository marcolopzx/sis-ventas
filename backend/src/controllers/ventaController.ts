import { Request, Response } from "express";
import { VentaService } from "../services/ventaService";
import { CrearVentaRequest, ActualizarVentaRequest } from "../types";

export class VentaController {
  /**
   * @swagger
   * /api/ventas:
   *   get:
   *     summary: Get all sales
   *     tags: [Ventas]
   *     responses:
   *       200:
   *         description: List of sales
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Venta'
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ventas = await VentaService.getAll();
      res.json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      console.error("Error in getAll ventas:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch ventas",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/{id}:
   *   get:
   *     summary: Get sale by ID
   *     tags: [Ventas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sale details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/VentaConDetalles'
   *       404:
   *         description: Sale not found
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID",
        });
        return;
      }

      const venta = await VentaService.getById(id);
      if (!venta) {
        res.status(404).json({
          success: false,
          error: "Venta not found",
        });
        return;
      }

      res.json({
        success: true,
        data: venta,
      });
    } catch (error) {
      console.error("Error in getById venta:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch venta",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas:
   *   post:
   *     summary: Create a new sale
   *     tags: [Ventas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - cliente_id
   *               - detalles
   *             properties:
   *               cliente_id:
   *                 type: integer
   *               detalles:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - producto_id
   *                     - cantidad
   *                   properties:
   *                     producto_id:
   *                       type: integer
   *                     cantidad:
   *                       type: integer
   *     responses:
   *       201:
   *         description: Sale created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/VentaConDetalles'
   *       400:
   *         description: Invalid data
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const ventaData: CrearVentaRequest = req.body;

      // Validation
      if (
        !ventaData.cliente_id ||
        !ventaData.detalles ||
        ventaData.detalles.length === 0
      ) {
        res.status(400).json({
          success: false,
          error: "cliente_id and detalles are required",
        });
        return;
      }

      // Validate each detail
      for (const detalle of ventaData.detalles) {
        if (
          !detalle.producto_id ||
          !detalle.cantidad ||
          detalle.cantidad <= 0
        ) {
          res.status(400).json({
            success: false,
            error: "Invalid detalle: producto_id and cantidad > 0 are required",
          });
          return;
        }
      }

      const venta = await VentaService.create(ventaData);
      res.status(201).json({
        success: true,
        data: venta,
        message: "Venta created successfully",
      });
    } catch (error) {
      console.error("Error in create venta:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create venta",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/{id}:
   *   put:
   *     summary: Update sale status
   *     tags: [Ventas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               estado:
   *                 type: string
   *                 enum: [pendiente, completada, cancelada]
   *     responses:
   *       200:
   *         description: Sale updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Venta'
   *       404:
   *         description: Sale not found
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID",
        });
        return;
      }

      const updateData: ActualizarVentaRequest = req.body;

      // Validate estado if provided
      if (
        updateData.estado &&
        !["pendiente", "completada", "cancelada"].includes(updateData.estado)
      ) {
        res.status(400).json({
          success: false,
          error:
            "Invalid estado. Must be 'pendiente', 'completada', or 'cancelada'",
        });
        return;
      }

      const venta = await VentaService.update(id, updateData);
      res.json({
        success: true,
        data: venta,
        message: "Venta updated successfully",
      });
    } catch (error) {
      console.error("Error in update venta:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update venta",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/{id}:
   *   delete:
   *     summary: Delete a sale
   *     tags: [Ventas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Sale deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Sale not found
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID",
        });
        return;
      }

      await VentaService.delete(id);
      res.json({
        success: true,
        message: "Venta deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete venta:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete venta",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/cliente/{clienteId}:
   *   get:
   *     summary: Get sales by client
   *     tags: [Ventas]
   *     parameters:
   *       - in: path
   *         name: clienteId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of sales for the client
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Venta'
   */
  static async getByClient(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = parseInt(req.params.clienteId);
      if (isNaN(clienteId)) {
        res.status(400).json({
          success: false,
          error: "Invalid cliente ID",
        });
        return;
      }

      const ventas = await VentaService.getByClient(clienteId);
      res.json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      console.error("Error in getByClient ventas:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch ventas by client",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/estado/{estado}:
   *   get:
   *     summary: Get sales by status
   *     tags: [Ventas]
   *     parameters:
   *       - in: path
   *         name: estado
   *         required: true
   *         schema:
   *           type: string
   *           enum: [pendiente, completada, cancelada]
   *     responses:
   *       200:
   *         description: List of sales with the specified status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Venta'
   */
  static async getByStatus(req: Request, res: Response): Promise<void> {
    try {
      const estado = req.params.estado;
      if (!["pendiente", "completada", "cancelada"].includes(estado)) {
        res.status(400).json({
          success: false,
          error:
            "Invalid estado. Must be 'pendiente', 'completada', or 'cancelada'",
        });
        return;
      }

      const ventas = await VentaService.getByStatus(estado);
      res.json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      console.error("Error in getByStatus ventas:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch ventas by status",
      });
    }
  }

  /**
   * @swagger
   * /api/ventas/stats:
   *   get:
   *     summary: Get sales statistics
   *     tags: [Ventas]
   *     responses:
   *       200:
   *         description: Sales statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalVentas:
   *                       type: integer
   *                     totalIngresos:
   *                       type: number
   *                     ventasCompletadas:
   *                       type: integer
   *                     ventasPendientes:
   *                       type: integer
   *                     ventasCanceladas:
   *                       type: integer
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await VentaService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getStats ventas:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch ventas stats",
      });
    }
  }
}
