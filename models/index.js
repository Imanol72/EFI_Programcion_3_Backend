"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const mysql2 = require("mysql2");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Resuelve credenciales desde DB_* o MYSQL_* o MYSQL_URL
function resolveDbConfig() {
  let host = process.env.DB_HOST || process.env.MYSQLHOST;
  let user = process.env.DB_USER || process.env.MYSQLUSER;
  let password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
  let database = process.env.DB_NAME || process.env.MYSQLDATABASE;
  let port = Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306;

  if ((!host || !user || !password || !database) && process.env.MYSQL_URL) {
    try {
      const u = new URL(process.env.MYSQL_URL);
      host = host || u.hostname;
      port = port || Number(u.port) || 3306;
      if (!user && u.username) user = decodeURIComponent(u.username);
      if (!password && u.password) password = decodeURIComponent(u.password);
      const pathname = u.pathname?.replace(/^\//, "");
      if (!database && pathname) database = pathname;
    } catch (e) {
      console.warn("⚠️ No se pudo parsear MYSQL_URL:", e.message);
    }
  }

  return { host, user, password, database, port };
}

const cfg = resolveDbConfig();

// 🔎 LOG (debe verse en Railway)
console.log("DB env ->", {
  host: cfg.host,
  user: cfg.user,
  name: cfg.database,
  port: cfg.port,
});

// Validación dura (si falta algo, fallá CLARO)
const missing = [];
if (!cfg.host) missing.push("host");
if (!cfg.user) missing.push("user");
if (!cfg.password) missing.push("password");
if (!cfg.database) missing.push("database");
if (!cfg.port) missing.push("port");
if (missing.length) {
  console.error("❌ Faltan datos de conexión:", missing);
  throw new Error(`Missing DB config: ${missing.join(", ")}`);
}

const sequelize = new Sequelize(cfg.database, cfg.user, cfg.password, {
  host: cfg.host,               // SIN fallback a "localhost"
  port: cfg.port,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: env === "development" ? false : false,
  define: { underscored: true, timestamps: true },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

const db = {};
fs.readdirSync(__dirname)
  .filter((f) => f.indexOf(".") !== 0 && f !== basename && f.endsWith(".js"))
  .forEach((f) => {
    const model = require(path.join(__dirname, f))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((name) => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
