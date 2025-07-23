import { Request, Response } from "express";
import { CategoriaService } from "../services/categoriaService";
import { asyncHandler } from "../middleware/errorHandler";

export class CategoriaController {
  /**
   * @swagger
   * /api/categorias:
   *   get:
   *     summary: Obtener todas las categorías
   *     tags: [Categorias]
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
   *         description: Lista de categorías
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await CategoriaService.getAll(page, limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * @swagger
   * /api/categorias/{id}:
   *   get:
   *     summary: Obtener una categoría por ID
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la categoría
   *     responses:
   *       200:
   *         description: Categoría encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Categoría no encontrada
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await CategoriaService.getById(id);

    return res.status(200).json({
      success: true,
      data: categoria,
    });
  });

  /**
   * @swagger
   * /api/categorias:
   *   post:
   *     summary: Crear una nueva categoría
   *     tags: [Categorias]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCategoriaRequest'
   *     responses:
   *       201:
   *         description: Categoría creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: Datos inválidos
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const categoria = await CategoriaService.create(req.body);

    return res.status(201).json({
      success: true,
      data: categoria,
    });
  });

  /**
   * @swagger
   * /api/categorias/{id}:
   *   put:
   *     summary: Actualizar una categoría
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la categoría
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCategoriaRequest'
   *     responses:
   *       200:
   *         description: Categoría actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Categoría no encontrada
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await CategoriaService.update(id, req.body);

    return res.status(200).json({
      success: true,
      data: categoria,
    });
  });

  /**
   * @swagger
   * /api/categorias/{id}:
   *   delete:
   *     summary: Eliminar una categoría
   *     tags: [Categorias]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la categoría
   *     responses:
   *       200:
   *         description: Categoría eliminada exitosamente
   *       404:
   *         description: Categoría no encontrada
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await CategoriaService.delete(id);

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente",
    });
  });

  /**
   * @swagger
   * /api/categorias/search:
   *   get:
   *     summary: Buscar categorías
   *     tags: [Categorias]
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

    const result = await CategoriaService.search(query, page, limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });
}
