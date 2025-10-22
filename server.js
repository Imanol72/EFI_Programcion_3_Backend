// Cargar .env SOLO en desarrollo (en Railway NO)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// 🔎 LOG ANTES de cargar models (para ver qué lee Railway)
console.log('ENV CHECK ->', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  MYSQLHOST: process.env.MYSQLHOST,
  MYSQLUSER: process.env.MYSQLUSER,
  MYSQLDATABASE: process.env.MYSQLDATABASE,
  MYSQLPORT: process.env.MYSQLPORT,
  MYSQL_URL: process.env.MYSQL_URL,
});

// ⛔️ IMPORTANTE: recién ahora cargo models
const db = require("./models");

app.set("models", db);

const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: origins.length ? origins : true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/auth/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/rooms", require("./routes/rooms.routes"));
app.use("/api/clients", require("./routes/clients.routes"));
app.use("/api/reservations", require("./routes/reservations.routes"));

app.use((err, req, res, next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(err.status || 500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error al sincronizar DB:", err);
    process.exit(1);
  }
})();
