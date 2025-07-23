import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  return next();
};

// Cliente validation rules
export const validateCreateCliente = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("telefono")
    .optional()
    .isMobilePhone("any")
    .withMessage("Must be a valid phone number"),
  body("direccion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Direccion must be less than 200 characters"),
  handleValidationErrors,
];

export const validateUpdateCliente = [
  param("id").isInt().withMessage("ID must be a valid integer"),
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre must be between 2 and 100 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("telefono")
    .optional()
    .isMobilePhone("any")
    .withMessage("Must be a valid phone number"),
  body("direccion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Direccion must be less than 200 characters"),
  handleValidationErrors,
];

export const validateClienteId = [
  param("id").isInt().withMessage("ID must be a valid integer"),
  handleValidationErrors,
];

// Categoria validation rules
export const validateCreateCategoria = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre must be between 2 and 50 characters"),
  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Descripcion must be less than 200 characters"),
  handleValidationErrors,
];

export const validateUpdateCategoria = [
  param("id").isInt().withMessage("ID must be a valid integer"),
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre must be between 2 and 50 characters"),
  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Descripcion must be less than 200 characters"),
  handleValidationErrors,
];

// Producto validation rules
export const validateCreateProducto = [
  body("nombre")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre must be between 2 and 100 characters"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Descripcion must be less than 500 characters"),
  body("precio")
    .isFloat({ min: 0 })
    .withMessage("Precio must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("categoria_id")
    .isInt()
    .withMessage("Categoria ID must be a valid integer"),
  handleValidationErrors,
];

export const validateUpdateProducto = [
  param("id").isInt().withMessage("ID must be a valid integer"),
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre must be between 2 and 100 characters"),
  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Descripcion must be less than 500 characters"),
  body("precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Precio must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("categoria_id")
    .optional()
    .isInt()
    .withMessage("Categoria ID must be a valid integer"),
  handleValidationErrors,
];

// Venta validation rules
export const validateCreateVenta = [
  body("cliente_id").isInt().withMessage("Cliente ID must be a valid integer"),
  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
  body("estado")
    .optional()
    .isIn(["pendiente", "completada", "cancelada"])
    .withMessage("Estado must be pendiente, completada, or cancelada"),
  handleValidationErrors,
];

// Pagination validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];
