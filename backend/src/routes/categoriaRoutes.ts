import { Router } from "express";
import { CategoriaController } from "../controllers/categoriaController";
import {
  validateCreateCategoria,
  validateUpdateCategoria,
  validatePagination,
} from "../middleware/validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la categoría
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateCategoriaRequest:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           maxLength: 500
 *           description: Descripción de la categoría
 *     UpdateCategoriaRequest:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           maxLength: 500
 *           description: Descripción de la categoría
 */

// GET /api/categorias - Obtener todas las categorías
router.get("/", validatePagination, CategoriaController.getAll);

// GET /api/categorias/search - Buscar categorías
router.get("/search", validatePagination, CategoriaController.search);

// GET /api/categorias/:id - Obtener categoría por ID
router.get("/:id", CategoriaController.getById);

// POST /api/categorias - Crear nueva categoría
router.post("/", validateCreateCategoria, CategoriaController.create);

// PUT /api/categorias/:id - Actualizar categoría
router.put("/:id", validateUpdateCategoria, CategoriaController.update);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete("/:id", CategoriaController.delete);

export default router;
