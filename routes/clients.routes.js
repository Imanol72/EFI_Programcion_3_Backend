const express = require("express");
const router = express.Router();
const { Client } = require("../models");

// GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: ["User", "Reservations"], // opcional si querés traer relaciones
    });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching clients" });
  }
});

// GET client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: ["User", "Reservations"],
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching client" });
  }
});

module.exports = router;
