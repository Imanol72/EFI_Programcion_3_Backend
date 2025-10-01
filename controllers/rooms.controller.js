// backend/controllers/rooms.controller.js
const { Rooms } = require("../models");

// GET todas las habitaciones
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.findAll();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener habitaciones", error: err.message });
  }
};

// GET una habitación por ID
const getRoomById = async (req, res) => {
  try {
    const room = await Rooms.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener habitación", error: err.message });
  }
};

// POST crear una habitación
const createRoom = async (req, res) => {
  try {
    const room = await Rooms.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Error al crear habitación", error: err.message });
  }
};

// PUT actualizar habitación
const updateRoom = async (req, res) => {
  try {
    const room = await Rooms.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });

    await room.update(req.body);
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar habitación", error: err.message });
  }
};

// DELETE eliminar habitación
const deleteRoom = async (req, res) => {
  try {
    const room = await Rooms.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Habitación no encontrada" });

    await room.destroy();
    res.json({ message: "Habitación eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar habitación", error: err.message });
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
