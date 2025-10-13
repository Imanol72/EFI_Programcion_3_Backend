require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// ⛔️ IMPORTANTE: una sola vez
const db = require("./models"); // Sequelize + modelos

const app = express();

// 👉 Inyectamos los modelos en la app (para req.app.get('models'))
app.set("models", db);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (para imágenes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health
app.get("/api/auth/health", (req, res) => res.json({ ok: true }));

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/rooms", require("./routes/rooms.routes"));
app.use("/api/clients", require("./routes/clients.routes"));
app.use("/api/reservations", require("./routes/reservations.routes"));

// Handler global de errores (debe ir antes del listen)
app.use((err, req, res, next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(err.status || 500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error al sincronizar DB:", err));
