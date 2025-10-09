const express = require("express");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // por si envían form-urlencoded

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/rooms", require("./routes/rooms.routes"));
app.use("/api/clients", require("./routes/clients.routes"));
app.use("/api/reservations", require("./routes/reservations.routes"));

// Sincronizar DB y levantar servidor
const PORT = process.env.PORT || 3000;
db.sequelize.sync()
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ Error al sincronizar DB:", err));

// Handler global de errores
app.use((err, req, res, next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});
