// backend/controllers/reservations.controller.js
const { Reservations, Clients, Rooms, Users } = require("../models");

// GET todas las reservas (solo admin/empleado)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.findAll({
      include: [
        { model: Clients, as: "cliente" },
        { model: Rooms, as: "habitacion" },
        { model: Users, as: "usuario" }
      ]
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservas", error: err.message });
  }
};

// GET reservas del usuario logueado (cliente)
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservations.findAll({
      where: { id_usuario: req.user.id },
      include: [{ model: Rooms, as: "habitacion" }]
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tus reservas", error: err.message });
  }
};

// POST crear reserva
const createReservation = async (req, res) => {
  try {
    const { id_habitacion, fecha_inicio, fecha_fin } = req.body;

    const reservation = await Reservations.create({
      id_usuario: req.user.id,
      id_habitacion,
      fecha_inicio,
      fecha_fin,
      estado: "pendiente"
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Error al crear reserva", error: err.message });
  }
};

// PUT actualizar reserva (solo admin/empleado)
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservations.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

    await reservation.update(req.body);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar reserva", error: err.message });
  }
};

// DELETE cancelar reserva (cliente solo las suyas / admin todas)
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservations.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

    if (req.user.rol === "cliente" && reservation.id_usuario !== req.user.id) {
      return res.status(403).json({ message: "No puedes cancelar reservas de otros usuarios" });
    }

    await reservation.destroy();
    res.json({ message: "Reserva cancelada" });
  } catch (err) {
    res.status(500).json({ message: "Error al cancelar reserva", error: err.message });
  }
};

module.exports = { getAllReservations, getMyReservations, createReservation, updateReservation, deleteReservation };
