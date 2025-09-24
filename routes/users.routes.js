// routes/users.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models"); // Importa desde index.js de models

const router = express.Router();

// 📌 Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "created_at", "updated_at"],
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
      attributes: ["id", "username", "created_at", "updated_at"],
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
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      created_at: newUser.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      updated_at: user.updated_at,
    });
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
