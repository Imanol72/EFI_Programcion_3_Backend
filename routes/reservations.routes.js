// backend/routes/reservations.routes.js
const express = require("express");
const {
  listReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// todas requieren auth
router.get("/",    authMiddleware, listReservations);
router.get("/:id", authMiddleware, getReservation);

// crear/editar: admin o empleado
router.post("/",       authMiddleware, roleMiddleware(["admin", "empleado"]), createReservation);
router.put("/:id",     authMiddleware, roleMiddleware(["admin", "empleado"]), updateReservation);

// eliminar: solo admin
router.delete("/:id",  authMiddleware, roleMiddleware(["admin"]), deleteReservation);

module.exports = router;
