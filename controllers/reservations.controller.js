// backend/controllers/reservations.controller.js
const { Op } = require("sequelize");

const ACTIVE_STATES = ["pendiente", "confirmada"]; // bloquean disponibilidad

// Normaliza a 'YYYY-MM-DD' usando UTC (evita corrimiento por timezone)
const toYMD = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Construye un Date fijo en UTC (medianoche UTC)
const dateAtUTC00 = (ymd) => new Date(`${ymd}T00:00:00Z`);

// días entre (sin contar horas), en UTC
const daysBetween = (start, end) => {
  const a = dateAtUTC00(start);
  const b = dateAtUTC00(end);
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
};

// convierte instancia a DTO amigable
const toDTO = (r) => {
  const base = r.toJSON ? r.toJSON() : r;
  const check_in = toYMD(base.fecha_inicio);
  const check_out = toYMD(base.fecha_fin);

  // total calculado en respuesta (si tenemos room.precio_noche)
  const precio = Number(base?.room?.precio_noche || 0);
  const noches = daysBetween(check_in, check_out);
  const total_calculado = noches * precio;

  return {
    ...base,
    check_in,
    check_out,
    total_calculado,
  };
};

const getModels = (req) => req.app.get("models") || {};

// Resuelve la habitación por ID o por numero_habitacion (también alias comunes)
async function resolveRoom(req, payload) {
  const { Room } = getModels(req);
  // Primero por ID (id_habitacion | room_id | roomId)
  const byId = payload.id_habitacion ?? payload.room_id ?? payload.roomId;
  if (byId !== undefined && byId !== null && String(byId).trim() !== "") {
    const id = Number(byId);
    if (!Number.isNaN(id)) {
      const room = await Room.findByPk(id);
      if (room) return room;
    }
  }
  // Luego por numero_habitacion (numero_habitacion | roomNumber | numero)
  const byNumber = payload.numero_habitacion ?? payload.roomNumber ?? payload.numero;
  if (byNumber !== undefined && byNumber !== null && String(byNumber).trim() !== "") {
    const room = await Room.findOne({ where: { numero_habitacion: String(byNumber) } });
    if (room) return room;
  }
  return null;
}

const listReservations = async (req, res, next) => {
  try {
    const { Reservation, Room, Client } = getModels(req);
    const { from, to, roomId, clientId, status } = req.query;

    const where = {};
    if (roomId) where.id_habitacion = Number(roomId);
    if (clientId) where.id_cliente = Number(clientId);
    if (status) where.estado = String(status).toLowerCase();

    // rango por intersección: [fi, ff) intersecta (from, to)
    if (from || to) {
      where[Op.and] = [];
      if (from) where[Op.and].push({ fecha_fin: { [Op.gt]: dateAtUTC00(from) } });
      if (to)   where[Op.and].push({ fecha_inicio: { [Op.lt]: dateAtUTC00(to) } });
    }

    const items = await Reservation.findAll({
      where,
      include: [
        { model: Room, as: "room" },
        { model: Client, as: "client" },
      ],
      order: [["fecha_inicio", "ASC"], ["id", "DESC"]],
    });

    res.json(items.map(toDTO));
  } catch (err) { next(err); }
};

const getReservation = async (req, res, next) => {
  try {
    const { Reservation, Room, Client } = getModels(req);
    const item = await Reservation.findByPk(req.params.id, {
      include: [
        { model: Room, as: "room" },
        { model: Client, as: "client" },
      ],
    });
    if (!item) return res.status(404).json({ message: "Reserva no encontrada" });
    res.json(toDTO(item));
  } catch (err) { next(err); }
};

const createReservation = async (req, res, next) => {
  try {
    const { Reservation, Client } = getModels(req);
    const b = req.body || {};

    // admite ambos nombres de fechas
    const fi = b.fecha_inicio || b.check_in;
    const ff = b.fecha_fin    || b.check_out;
    const estado = (b.estado || "pendiente").toLowerCase();

    // Resolución robusta de habitación (por id o por numero_habitacion)
    const room = await resolveRoom(req, b);

    // Cliente OPCIONAL: si no existe, se guarda NULL (evita romper FK)
    let id_cliente = null;
    if (b.id_cliente != null && String(b.id_cliente).trim() !== "") {
      const parsed = Number(b.id_cliente);
      if (!Number.isNaN(parsed)) {
        const cli = await Client.findByPk(parsed);
        if (cli) id_cliente = cli.id; // sólo asignamos si existe
      }
    }

    if (!fi || !ff || !room) {
      return res.status(400).json({ message: !room ? "Habitación inválida" : "Faltan fechas" });
    }
    if (dateAtUTC00(ff) <= dateAtUTC00(fi)) {
      return res.status(400).json({ message: "La fecha_fin/check_out debe ser posterior a fecha_inicio/check_in" });
    }

    // solapamiento usando el ID real de la room encontrada
    const overlap = await Reservation.findOne({
      where: {
        id_habitacion: room.id,
        estado: { [Op.in]: ACTIVE_STATES },
        [Op.and]: [
          { fecha_inicio: { [Op.lt]: dateAtUTC00(ff) } },
          { fecha_fin:    { [Op.gt]: dateAtUTC00(fi) } },
        ],
      },
    });
    if (overlap) {
      return res.status(409).json({ message: "La habitación no está disponible en ese rango" });
    }

    const created = await Reservation.create({
      id_cliente, // puede ir NULL
      id_habitacion: room.id,
      // guardamos a medianoche UTC para que no cambie por TZ
      fecha_inicio: dateAtUTC00(fi),
      fecha_fin: dateAtUTC00(ff),
      estado,
    });

    // devolvemos DTO con total_calculado
    const withRoom = await Reservation.findByPk(created.id, {
      include: [{ model: getModels(req).Room, as: "room" }, { model: getModels(req).Client, as: "client" }],
    });
    res.status(201).json(toDTO(withRoom));
  } catch (err) { next(err); }
};

const updateReservation = async (req, res, next) => {
  try {
    const { Reservation, Room, Client } = getModels(req);
    const item = await Reservation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Reserva no encontrada" });

    const b = req.body || {};

    // si mandan info de habitación (id o numero), la resolvemos; si no, usamos la actual
    let room = null;
    const touchedRoomFields =
      b.id_habitacion !== undefined || b.room_id !== undefined || b.roomId !== undefined ||
      b.numero_habitacion !== undefined || b.roomNumber !== undefined || b.numero !== undefined;

    if (touchedRoomFields) {
      room = await resolveRoom(req, b);
      if (!room) return res.status(400).json({ message: "Habitación inválida" });
    } else {
      room = await Room.findByPk(item.id_habitacion);
    }

    // Cliente OPCIONAL
    let next_id_cliente = item.id_cliente;
    if (b.id_cliente !== undefined) {
      if (b.id_cliente === null || String(b.id_cliente).trim() === "") {
        next_id_cliente = null;
      } else {
        const parsed = Number(b.id_cliente);
        if (!Number.isNaN(parsed)) {
          const cli = await Client.findByPk(parsed);
          next_id_cliente = cli ? cli.id : null;
        } else {
          next_id_cliente = null;
        }
      }
    }

    const next = {
      id_cliente:    next_id_cliente, // puede quedar NULL
      id_habitacion: room.id,
      fecha_inicio:  dateAtUTC00(b.fecha_inicio || b.check_in  || toYMD(item.fecha_inicio)),
      fecha_fin:     dateAtUTC00(b.fecha_fin     || b.check_out || toYMD(item.fecha_fin)),
      estado:        (b.estado ?? item.estado)?.toLowerCase?.() ?? item.estado,
    };

    if (next.fecha_fin <= next.fecha_inicio) {
      return res.status(400).json({ message: "La fecha_fin/check_out debe ser posterior a fecha_inicio/check_in" });
    }

    const changedWindow =
      next.id_habitacion !== item.id_habitacion ||
      String(next.fecha_inicio.getTime()) !== String(new Date(item.fecha_inicio).getTime()) ||
      String(next.fecha_fin.getTime()) !== String(new Date(item.fecha_fin).getTime());

    if (changedWindow && ACTIVE_STATES.includes(next.estado)) {
      const overlap = await Reservation.findOne({
        where: {
          id_habitacion: next.id_habitacion,
          estado: { [Op.in]: ACTIVE_STATES },
          id: { [Op.ne]: item.id },
          [Op.and]: [
            { fecha_inicio: { [Op.lt]: next.fecha_fin } },
            { fecha_fin:    { [Op.gt]: next.fecha_inicio } },
          ],
        },
      });
      if (overlap) {
        return res.status(409).json({ message: "La habitación no está disponible en ese rango" });
      }
    }

    await item.update(next);

    const withRoom = await Reservation.findByPk(item.id, {
      include: [{ model: Room, as: "room" }, { model: getModels(req).Client, as: "client" }],
    });
    res.json(toDTO(withRoom));
  } catch (err) { next(err); }
};

const deleteReservation = async (req, res, next) => {
  try {
    const { Reservation } = getModels(req);
    const item = await Reservation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Reserva no encontrada" });
    await item.destroy();
    res.json({ message: "Reserva eliminada" });
  } catch (err) { next(err); }
};

module.exports = {
  listReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
