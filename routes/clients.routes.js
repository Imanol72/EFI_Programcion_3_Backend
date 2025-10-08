const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const router = express.Router();
const { Client, User, Reservation, Room } = require("../models");

// (Opcional) si querés proteger rutas con JWT:
const ensureAuth = (req, res, next) => {
  // Descomentar si ya tenés JWT montado:
  // const auth = req.headers.authorization || "";
  // const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  // if (!token) return res.status(401).json({ message: "No autorizado" });
  // try { jwt.verify(token, process.env.JWT_SECRET); return next(); }
  // catch { return res.status(401).json({ message: "Token inválido" }); }
  return next(); // por ahora sin auth
};

// Helper para validar errores de express-validator
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * GET /api/clients
 * Soporta paginado simple ?page=1&limit=20
 */
router.get(
  "/",
  ensureAuth,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("page debe ser >= 1"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit 1..100"),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page || "1", 10);
      const limit = parseInt(req.query.limit || "50", 10);
      const offset = (page - 1) * limit;

      const { rows, count } = await Client.findAndCountAll({
        offset,
        limit,
        order: [["created_at", "DESC"]],
        include: [
          { model: User, as: "usuario", attributes: ["id", "username"] },
          {
            model: Reservation,
            as: "reservas",
            attributes: ["id", "fecha_inicio", "fecha_fin", "estado", "id_habitacion", "id_usuario", "created_at", "updated_at"],
            include: [
              { model: Room, as: "habitacion", attributes: ["id", "numero_habitacion", "tipo", "precio_noche", "disponible"] },
            ],
          },
        ],
      });

      res.json({
        data: rows,
        pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Error fetching clients" });
    }
  }
);

/**
 * GET /api/clients/:id
 */
router.get(
  "/:id",
  ensureAuth,
  [param("id").isInt().withMessage("id debe ser numérico")],
  handleValidation,
  async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id, {
        include: [
          { model: User, as: "usuario", attributes: ["id", "username"] },
          {
            model: Reservation,
            as: "reservas",
            include: [
              { model: Room, as: "habitacion", attributes: ["id", "numero_habitacion", "tipo", "precio_noche", "disponible"] },
            ],
          },
        ],
      });
      if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Error fetching client" });
    }
  }
);

/**
 * POST /api/clients
 * Body esperado: { documento_identidad: string, telefono?: string, id_usuario?: number }
 */
router.post(
  "/",
  ensureAuth,
  [
    body("documento_identidad").trim().notEmpty().withMessage("documento_identidad es requerido"),
    body("telefono").optional().isString().withMessage("telefono debe ser string"),
    body("id_usuario").optional().isInt().withMessage("id_usuario debe ser numérico"),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { documento_identidad, telefono, id_usuario } = req.body;

      // (Opcional) chequear duplicados por documento
      const exists = await Client.findOne({ where: { documento_identidad } });
      if (exists) return res.status(409).json({ message: "El documento ya existe" });

      const newClient = await Client.create({ documento_identidad, telefono, id_usuario });
      res.status(201).json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Error creating client" });
    }
  }
);

/**
 * PUT /api/clients/:id
 */
router.put(
  "/:id",
  ensureAuth,
  [
    param("id").isInt().withMessage("id debe ser numérico"),
    body("documento_identidad").optional().trim().notEmpty().withMessage("documento_identidad no puede ser vacío"),
    body("telefono").optional().isString().withMessage("telefono debe ser string"),
    body("id_usuario").optional().isInt().withMessage("id_usuario debe ser numérico"),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const client = await Client.findByPk(id);
      if (!client) return res.status(404).json({ message: "Cliente no encontrado" });

      // Evitar duplicados si cambiaron el documento
      if (req.body.documento_identidad && req.body.documento_identidad !== client.documento_identidad) {
        const dup = await Client.findOne({ where: { documento_identidad: req.body.documento_identidad } });
        if (dup) return res.status(409).json({ message: "El documento ya existe" });
      }

      await client.update(req.body);
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ message: "Error updating client" });
    }
  }
);

/**
 * DELETE /api/clients/:id
 */
router.delete(
  "/:id",
  ensureAuth,
  [param("id").isInt().withMessage("id debe ser numérico")],
  handleValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const client = await Client.findByPk(id, { include: [{ model: Reservation, as: "reservas" }] });
      if (!client) return res.status(404).json({ message: "Cliente no encontrado" });

      // (Opcional) evitar borrar si tiene reservas activas
      if (client.reservas && client.reservas.length > 0) {
        return res.status(409).json({ message: "No se puede borrar: el cliente tiene reservas asociadas" });
      }

      await client.destroy();
      res.json({ message: "Cliente eliminado" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: "Error deleting client" });
    }
  }
);

module.exports = router;
