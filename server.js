const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();

const app = express();

// CORS ANTES de las rutas
const FRONT_URL = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsOpts = {
  origin: FRONT_URL,                // NO uses '*'
  credentials: true,                // o false si no usás cookies
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

app.use(cors(corsOpts));
// ❌ NO pongas app.options("*", ...) en Express 5

app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/rooms", require("./routes/rooms.routes"));
app.use("/api/clients", require("./routes/clients.routes"));
app.use("/api/reservations", require("./routes/reservations.routes"));

// Sync + listen
db.sequelize.sync()
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch(err => console.error("❌ Error al sincronizar DB:", err));

const PORT = process.env.PORT || 3000;

// Handler de errores global (después de app.use de rutas)
app.use((err, req, res, next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});


app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
