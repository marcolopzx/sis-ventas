import { Router } from "express";
import { VentaController } from "../controllers/ventaController";
import { handleValidationErrors } from "../middleware/validation";
import { body, param } from "express-validator";

const router = Router();

// Validation schemas
const createVentaSchema = [
  body("cliente_id")
    .isInt({ min: 1 })
    .withMessage("cliente_id must be a positive integer"),
  body("detalles")
    .isArray({ min: 1 })
    .withMessage("detalles must be a non-empty array"),
  body("detalles.*.producto_id")
    .isInt({ min: 1 })
    .withMessage("producto_id must be a positive integer"),
  body("detalles.*.cantidad")
    .isInt({ min: 1 })
    .withMessage("cantidad must be a positive integer"),
  handleValidationErrors,
];

const updateVentaSchema = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  body("estado")
    .optional()
    .isIn(["pendiente", "completada", "cancelada"])
    .withMessage("Invalid estado"),
  handleValidationErrors,
];

const idParamSchema = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  handleValidationErrors,
];

const clienteIdParamSchema = [
  param("clienteId")
    .isInt({ min: 1 })
    .withMessage("clienteId must be a positive integer"),
  handleValidationErrors,
];

const estadoParamSchema = [
  param("estado")
    .isIn(["pendiente", "completada", "cancelada"])
    .withMessage("Invalid estado"),
  handleValidationErrors,
];

// Routes
router.get("/", VentaController.getAll);

router.get("/stats", VentaController.getStats);

router.get(
  "/cliente/:clienteId",
  clienteIdParamSchema,
  VentaController.getByClient
);

router.get("/estado/:estado", estadoParamSchema, VentaController.getByStatus);

router.get("/:id", idParamSchema, VentaController.getById);

router.post("/", createVentaSchema, VentaController.create);

router.put("/:id", updateVentaSchema, VentaController.update);

router.delete("/:id", idParamSchema, VentaController.delete);

export default router;
