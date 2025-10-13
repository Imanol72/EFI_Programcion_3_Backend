// backend/routes/rooms.routes.js
const express = require("express");
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require("../controllers/rooms.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllRooms);
router.get("/:id", authMiddleware, getRoomById);
router.post("/", authMiddleware, roleMiddleware(["admin", "empleado"]), createRoom);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "empleado"]), updateRoom);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteRoom);

module.exports = router;