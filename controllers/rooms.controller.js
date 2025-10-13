// backend/controllers/rooms.controller.js

// Helper para obtener modelos de forma segura
const getModels = (req) => {
  // intenta desde app, si no, importa directamente
  return (req && req.app && typeof req.app.get === "function" && req.app.get("models")) || require("../models");
};

// helpers de tipos
const toStringOrNull = (v) =>
  v === undefined || v === null || v === "" ? null : String(v);
const toIntOr = (v, fallback) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};
const toPriceOr = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const toBoolOr = (v, fallback) => {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v === "boolean") return v;
  return ["1", "true", "on", "yes"].includes(String(v).toLowerCase());
};

// GET /api/rooms
const getAllRooms = async (req, res, next) => {
  try {
    const { Room } = getModels(req);
    const rooms = await Room.findAll({ order: [["id", "ASC"]] });
    res.json(rooms);
  } catch (err) { next(err); }
};

// GET /api/rooms/:id
const getRoomById = async (req, res, next) => {
  try {
    const { Room } = getModels(req);
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });
    res.json(room);
  } catch (err) { next(err); }
};

// POST /api/rooms
// POST /api/rooms
const createRoom = async (req, res, next) => {
  try {
    const { Room } = getModels(req);

    const body = req.body || {}; // 👈 body seguro

    const numero_habitacion = toStringOrNull(
      body.numero_habitacion ?? body.number ?? body.roomNumber
    );

    const tipo = toStringOrNull(body.tipo ?? body.type);
    if (!tipo) return res.status(400).json({ message: "Falta 'tipo'" });

    const capacidad = toIntOr(body.capacidad ?? body.maxGuests, 1);

    const precio_noche = toPriceOr(body.precio_noche ?? body.price, null);
    if (precio_noche === null)
      return res.status(400).json({ message: "Falta 'precio_noche' o es inválido" });

    const descripcion = toStringOrNull(body.descripcion ?? body.description);
    const amenities = Array.isArray(body.amenities) ? body.amenities : [];
    const disponible = toBoolOr(body.disponible, true);

    const created = await Room.create({
      numero_habitacion,
      tipo: String(tipo).toLowerCase(),
      capacidad,
      precio_noche,
      descripcion,
      amenities,
      disponible,
      image_url: null,
    });

    res.status(201).json(created);
  } catch (err) { next(err); }
};

// PUT /api/rooms/:id
const updateRoom = async (req, res, next) => {
  try {
    const { Room } = getModels(req);
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });

    const body = req.body || {}; // 👈 body seguro

    const numero_habitacion =
      body.numero_habitacion !== undefined
        ? toStringOrNull(body.numero_habitacion)
        : room.numero_habitacion;

    const tipo =
      body.tipo !== undefined
        ? toStringOrNull(body.tipo)
        : room.tipo;

    const capacidad =
      body.capacidad !== undefined
        ? toIntOr(body.capacidad, room.capacidad)
        : room.capacidad;

    const precio_noche =
      body.precio_noche !== undefined
        ? toPriceOr(body.precio_noche, room.precio_noche)
        : room.precio_noche;

    const descripcion =
      body.descripcion !== undefined
        ? toStringOrNull(body.descripcion)
        : room.descripcion;

    const amenities =
      body.amenities !== undefined
        ? (Array.isArray(body.amenities) ? body.amenities : room.amenities)
        : room.amenities;

    const disponible =
      body.disponible !== undefined
        ? toBoolOr(body.disponible, room.disponible)
        : room.disponible;

    await room.update({
      numero_habitacion,
      tipo: tipo ? String(tipo).toLowerCase() : room.tipo,
      capacidad,
      precio_noche,
      descripcion,
      amenities,
      disponible,
    });

    res.json(room);
  } catch (err) { next(err); }
};


// DELETE /api/rooms/:id
const deleteRoom = async (req, res, next) => {
  try {
    const { Room } = getModels(req);
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });
    await room.destroy();
    res.json({ message: "Habitación eliminada" });
  } catch (err) { next(err); }
};

// POST /api/rooms/:id/image
const uploadImage = async (req, res, next) => {
  try {
    const { Room } = getModels(req);
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });
    if (!req.file) return res.status(400).json({ message: 'Falta archivo "image"' });

    const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const image_url = `${base}/uploads/rooms/${req.file.filename}`;

    await room.update({ image_url });
    res.json({ image_url, roomId: room.id });
  } catch (err) { next(err); }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadImage,
};
