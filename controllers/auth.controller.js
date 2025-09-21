const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const SECRET_KEY = process.env.JWT_SECRET || "mi_secreto_super_seguro";

// LOGIN
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await Users.findOne({ where: { correo } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// REGISTER
const register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { correo } });
    if (existingUser) return res.status(400).json({ message: "Correo ya registrado" });

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newUser = await Users.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: rol || "cliente" // default
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol: newUser.rol
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { login, register };
