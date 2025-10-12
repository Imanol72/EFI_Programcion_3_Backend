const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER: acepta { username, password } y opcional { role / rol }
const register = async (req, res, next) => {
  try {
    const username = req.body?.username ?? req.body?.nombre ?? req.body?.correo;
    const rawPass  = req.body?.password ?? req.body?.contraseña;
    const roleIn   = req.body?.role ?? req.body?.rol ?? "cliente";

    if (!username || !rawPass) {
      return res.status(400).json({ message: "Faltan campos: username y password" });
    }

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: "Usuario ya registrado" });

    const hash = await bcrypt.hash(rawPass, 10);

    const user = await User.create({
      username,
      password: hash,     // guardamos en 'password' (vieja). Si querés usar 'contraseña', cambiá acá y en el modelo.
      role: roleIn,
    });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({ user: payload, token });
  } catch (err) {
    next(err);
  }
};

// LOGIN (tu versión robusta)
const login = async (req, res, next) => {
  try {
    console.log("[AUTH] req.body =", req.body);

    const identifier = req.body?.username ?? req.body?.correo ?? req.body?.email;
    const password   = req.body?.password ?? req.body?.contraseña;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Faltan campos: username/email y password" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { correo: identifier }],
      },
      attributes: [
        "id","username","nombre","correo",
        "password","contraseña",
        "role","rol","is_active"
      ],
    });

    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const storedHash = user.contraseña || user.password;
    console.log("[AUTH] usando hash de:", user.contraseña ? "contraseña" : "password");
    if (!storedHash) {
      console.log("[AUTH] No hay hash en DB para el usuario");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, storedHash);
    console.log("[AUTH] bcrypt.compare =", ok);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const safeRole = user.rol || user.role || "cliente";
    const safeName = user.username || user.nombre || user.correo || "user";

    const payload = { id: user.id, username: safeName, role: safeRole };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login }; // 👈 ahora sí exportás ambos
