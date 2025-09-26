const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Sincronizar base de datos
db.sequelize.sync()
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((err) => console.error("❌ Error al sincronizar DB:", err));

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
