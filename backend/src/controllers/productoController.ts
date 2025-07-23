import { Request, Response } from "express";
import { ProductoService } from "../services/productoService";
import { asyncHandler } from "../middleware/errorHandler";

export class ProductoController {
  /**
   * @swagger
   * /api/productos:
   *   get:
   *     summary: Obtener todos los productos
   *     tags: [Productos]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Número de elementos por página
   *     responses:
   *       200:
   *         description: Lista de productos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await ProductoService.getAll(page, limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * @swagger
   * /api/productos/{id}:
   *   get:
   *     summary: Obtener un producto por ID
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     responses:
   *       200:
   *         description: Producto encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Producto no encontrado
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await ProductoService.getById(id);

    return res.status(200).json({
      success: true,
      data: producto,
    });
  });

  /**
   * @swagger
   * /api/productos:
   *   post:
   *     summary: Crear un nuevo producto
   *     tags: [Productos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProductoRequest'
   *     responses:
   *       201:
   *         description: Producto creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Datos inválidos
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const producto = await ProductoService.create(req.body);

    return res.status(201).json({
      success: true,
      data: producto,
    });
  });

  /**
   * @swagger
   * /api/productos/{id}:
   *   put:
   *     summary: Actualizar un producto
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProductoRequest'
   *     responses:
   *       200:
   *         description: Producto actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Producto no encontrado
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await ProductoService.update(id, req.body);

    return res.status(200).json({
      success: true,
      data: producto,
    });
  });

  /**
   * @swagger
   * /api/productos/{id}:
   *   delete:
   *     summary: Eliminar un producto
   *     tags: [Productos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del producto
   *     responses:
   *       200:
   *         description: Producto eliminado exitosamente
   *       404:
   *         description: Producto no encontrado
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await ProductoService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  });

  /**
   * @swagger
   * /api/productos/search:
   *   get:
   *     summary: Buscar productos
   *     tags: [Productos]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Término de búsqueda
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Número de elementos por página
   *     responses:
   *       200:
   *         description: Resultados de la búsqueda
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   */
  static search = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required",
      });
    }

    const result = await ProductoService.search(query, page, limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });
}
