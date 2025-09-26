// routes/users.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models"); // Importa desde index.js de models

const router = express.Router();

// 📌 Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "mail", "role", "is_active", "created_at", "updated_at"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "mail", "role", "is_active", "created_at", "updated_at"],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const { username, mail, password, role } = req.body;
    const existing = await User.findOne({ where: { mail } });
    if (existing) return res.status(400).json({ error: "Correo ya registrado" });
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, mail, password: hash, role: role || "cliente" });
    res.status(201).json({ id: newUser.id, username: newUser.username, mail: newUser.mail, role: newUser.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    const { username, mail, password, role, is_active } = req.body;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (mail) user.mail = mail;
    if (role) user.role = role;
    if (typeof is_active !== "undefined") user.is_active = is_active;
    await user.save();
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();
    res.json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
