const express = require("express");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadImage,
} = require("../controllers/rooms.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const uploadRoomImage = require("../middlewares/uploadRoomImage");

// 👇 parser para multipart SIN archivos (sólo campos)
const multer = require("multer");
const parseForm = multer().none();

const router = express.Router();

router.get("/", authMiddleware, getAllRooms);
router.get("/:id", authMiddleware, getRoomById);

// 👉 acepta JSON o multipart/form-data (gracias a parseForm)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "empleado"]),
  parseForm,
  createRoom
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "empleado"]),
  parseForm,
  updateRoom
);

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteRoom);

// subir imagen (campo: "image")
router.post(
  "/:id/image",
  authMiddleware,
  roleMiddleware(["admin", "empleado"]),
  uploadRoomImage.single("image"),
  uploadImage
);

module.exports = router;
