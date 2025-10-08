// controllers/clients.controller.js
const { User, Client, Reservation, Room } = require("../models");

async function getClients(req, res, next) {
  try {
    const clients = await Client.findAll({
      attributes: ["id", "documento_identidad", "telefono", "created_at", "updated_at", "id_usuario"],
      include: [
        { model: User, as: "usuario", attributes: ["id", "username"] },
        {
          model: Reservation,
          as: "reservas",
          attributes: ["id", "fecha_inicio", "fecha_fin", "estado", "id_habitacion", "id_usuario", "created_at", "updated_at"],
          include: [
            {
              model: Room,
              as: "habitacion",
              attributes: ["id", "numero_habitacion", "tipo", "precio_noche", "disponible", "created_at", "updated_at"],
            },
          ],
        },
      ],
    });

    res.json(clients);
  } catch (err) {
    next(err);
  }
}

module.exports = { getClients };
