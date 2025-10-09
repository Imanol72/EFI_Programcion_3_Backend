const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res, next) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ message: "Todos los campos obligatorios: nombre, correo, contraseña" });
    }

    const exists = await User.findOne({ where: { correo } });
    if (exists) return res.status(409).json({ message: "Correo ya registrado" });

    const hash = await bcrypt.hash(contraseña, 10);

    // Si no envían rol, por defecto 'cliente'
    const user = await User.create({ 
      nombre, 
      correo, 
      contraseña: hash, 
      rol: rol || "cliente" 
    });

    const payload = { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user: payload, token });
  } catch (err) {
    next(err);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) return res.status(400).json({ message: "Faltan campos" });

    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(contraseña, user.contraseña);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const payload = { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login };