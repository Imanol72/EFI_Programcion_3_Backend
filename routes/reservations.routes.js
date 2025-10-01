// backend/routes/reservations.routes.js
const express = require("express");
const { getAllReservations, getMyReservations, createReservation, updateReservation, deleteReservation } = require("../controllers/reservations.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["admin", "empleado"]), getAllReservations);
router.get("/mine", authMiddleware, roleMiddleware(["cliente"]), getMyReservations);
router.post("/", authMiddleware, roleMiddleware(["cliente"]), createReservation);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "empleado"]), updateReservation);
router.delete("/:id", authMiddleware, deleteReservation);

module.exports = router;
