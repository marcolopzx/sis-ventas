import { Router } from "express";
import { ProductoController } from "../controllers/productoController";
import {
  validateCreateProducto,
  validateUpdateProducto,
  validatePagination,
} from "../middleware/validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - stock
 *         - categoria_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           minimum: 0
 *           description: Precio del producto
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Cantidad en stock
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría
 *         categoria_nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     CreateProductoRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - stock
 *         - categoria_id
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           maxLength: 500
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           minimum: 0
 *           description: Precio del producto
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Cantidad en stock
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría
 *     UpdateProductoRequest:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           maxLength: 500
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           minimum: 0
 *           description: Precio del producto
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Cantidad en stock
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría
 */

// GET /api/productos - Obtener todos los productos
router.get("/", validatePagination, ProductoController.getAll);

// GET /api/productos/search - Buscar productos
router.get("/search", validatePagination, ProductoController.search);

// GET /api/productos/:id - Obtener producto por ID
router.get("/:id", ProductoController.getById);

// POST /api/productos - Crear nuevo producto
router.post("/", validateCreateProducto, ProductoController.create);

// PUT /api/productos/:id - Actualizar producto
router.put("/:id", validateUpdateProducto, ProductoController.update);

// DELETE /api/productos/:id - Eliminar producto
router.delete("/:id", ProductoController.delete);

export default router;
