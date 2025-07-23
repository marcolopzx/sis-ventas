import { Router } from "express";
import { ClienteController } from "../controllers/clienteController";
import {
  validateCreateCliente,
  validateUpdateCliente,
  validateClienteId,
  validatePagination,
} from "../middleware/validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         nombre:
 *           type: string
 *           description: Client name
 *         email:
 *           type: string
 *           format: email
 *           description: Client email
 *         telefono:
 *           type: string
 *           description: Client phone number
 *         direccion:
 *           type: string
 *           description: Client address
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreateClienteRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         telefono:
 *           type: string
 *         direccion:
 *           type: string
 *           maxLength: 200
 *     UpdateClienteRequest:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         telefono:
 *           type: string
 *         direccion:
 *           type: string
 *           maxLength: 200
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

// GET /api/clientes - Get all clients with pagination
router.get("/", validatePagination, ClienteController.getAll);

// GET /api/clientes/search - Search clients
router.get("/search", validatePagination, ClienteController.search);

// GET /api/clientes/:id - Get client by ID
router.get("/:id", validateClienteId, ClienteController.getById);

// POST /api/clientes - Create new client
router.post("/", validateCreateCliente, ClienteController.create);

// PUT /api/clientes/:id - Update client
router.put(
  "/:id",
  validateClienteId,
  validateUpdateCliente,
  ClienteController.update
);

// DELETE /api/clientes/:id - Delete client
router.delete("/:id", validateClienteId, ClienteController.delete);

export default router;
