import { Request, Response } from "express";
import { ClienteService } from "../services/clienteService";
import { CreateClienteRequest, UpdateClienteRequest } from "../types";

export class ClienteController {
  /**
   * @swagger
   * /api/clientes:
   *   get:
   *     summary: Get all clients with pagination
   *     tags: [Clientes]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: List of clients
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
   *                     $ref: '#/components/schemas/Cliente'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ClienteService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /api/clientes/{id}:
   *   get:
   *     summary: Get client by ID
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     responses:
   *       200:
   *         description: Client details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Cliente'
   *       404:
   *         description: Client not found
   */
  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await ClienteService.getById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /api/clientes:
   *   post:
   *     summary: Create a new client
   *     tags: [Clientes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateClienteRequest'
   *     responses:
   *       201:
   *         description: Client created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Cliente'
   *                 message:
   *                   type: string
   *       400:
   *         description: Validation error or email already exists
   */
  static async create(req: Request, res: Response) {
    try {
      const clienteData: CreateClienteRequest = req.body;
      const result = await ClienteService.create(clienteData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /api/clientes/{id}:
   *   put:
   *     summary: Update client
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateClienteRequest'
   *     responses:
   *       200:
   *         description: Client updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Cliente'
   *                 message:
   *                   type: string
   *       404:
   *         description: Client not found
   *       400:
   *         description: Validation error or email already exists
   */
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const clienteData: UpdateClienteRequest = req.body;
      const result = await ClienteService.update(id, clienteData);

      if (!result.success) {
        const statusCode = result.error === "Client not found" ? 404 : 400;
        return res.status(statusCode).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /api/clientes/{id}:
   *   delete:
   *     summary: Delete client
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Client ID
   *     responses:
   *       200:
   *         description: Client deleted successfully
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
   *         description: Client not found
   */
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await ClienteService.delete(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * @swagger
   * /api/clientes/search:
   *   get:
   *     summary: Search clients by name or email
   *     tags: [Clientes]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Search results
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
   *                     $ref: '#/components/schemas/Cliente'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  static async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: "Search query is required",
        });
      }

      const result = await ClienteService.search(query, page, limit);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
