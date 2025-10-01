const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Rutas de autenticación
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Rutas de usuarios
const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);

// Rutas de habitaciones
const roomsRoutes = require("./routes/rooms.routes");
app.use("/api/rooms", roomsRoutes);

// Rutas de reservas
const reservationsRoutes = require("./routes/reservations.routes");
app.use("/api/reservations", reservationsRoutes);

// Sincronizar base de datos
db.sequelize.sync()
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((err) => console.error("❌ Error al sincronizar DB:", err));

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
