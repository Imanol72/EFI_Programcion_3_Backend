// backend/controllers/clients.controller.js

// Lista todos los clientes con sus reservas y la habitación de cada reserva
const listClients = async (req, res, next) => {
  try {
    const { Client, Reservation, Room } = req.app.get("models");

    const items = await Client.findAll({
      include: [
        {
          model: Reservation,
          as: "reservas",
          include: [
            { model: Room, as: "room" }, // 👈 alias correcto (NO "habitacion")
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(items);
  } catch (err) {
    console.error("Error fetching clients:", err);
    next(err);
  }
};

// Trae un cliente por id
const getClient = async (req, res, next) => {
  try {
    const { Client, Reservation, Room } = req.app.get("models");

    const item = await Client.findByPk(req.params.id, {
      include: [
        {
          model: Reservation,
          as: "reservas",
          include: [
            { model: Room, as: "room" }, // 👈 alias correcto
          ],
        },
      ],
    });

    if (!item) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching client:", err);
    next(err);
  }
};

// Crea
const createClient = async (req, res, next) => {
  try {
    const { Client } = req.app.get("models");
    const created = await Client.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// Actualiza
const updateClient = async (req, res, next) => {
  try {
    const { Client } = req.app.get("models");
    const item = await Client.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Cliente no encontrado" });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// Borra
const deleteClient = async (req, res, next) => {
  try {
    const { Client } = req.app.get("models");
    const item = await Client.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Cliente no encontrado" });
    await item.destroy();
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
