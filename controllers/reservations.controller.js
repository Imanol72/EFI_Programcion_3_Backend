const { Reservation, Client, Room, User } = require("../models");

// GET todas (admin / empleado)
const getAllReservations = async (_req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: Client, as: "cliente" },
        { model: Room, as: "habitacion" },
        { model: User, as: "usuario" },
      ],
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservas", error: err.message });
  }
};

// GET mis reservas (cliente)
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { id_usuario: req.user.id },
      include: [{ model: Room, as: "habitacion" }],
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tus reservas", error: err.message });
  }
};

// POST crear
const createReservation = async (req, res) => {
  try {
    const { id_habitacion, fecha_inicio, fecha_fin, id_cliente, guests, price_per_night, nights, total } = req.body;

    const reservation = await Reservation.create({
      id_usuario: req.user.id,
      id_habitacion,
      id_cliente: id_cliente ?? null,
      fecha_inicio,
      fecha_fin,
      estado: "pendiente",
      guests, price_per_night, nights, total,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Error al crear reserva", error: err.message });
  }
};

// PUT actualizar (admin / empleado)
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

    await reservation.update(req.body);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar reserva", error: err.message });
  }
};

// DELETE cancelar (cliente: sólo las suyas / admin: cualquiera)
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

    if ((req.user.role || req.user.rol) === "cliente" && reservation.id_usuario !== req.user.id) {
      return res.status(403).json({ message: "No puedes cancelar reservas de otros usuarios" });
    }

    await reservation.destroy();
    res.json({ message: "Reserva cancelada" });
  } catch (err) {
    res.status(500).json({ message: "Error al cancelar reserva", error: err.message });
  }
};

module.exports = {
  getAllReservations,
  getMyReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
