// models/index.js
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

// ❌ No vuelvas a cargar dotenv acá. Ya lo carga server.js.
// require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

// Tomá las variables correctas del .env
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

// (opcional) Log mínimo para verificar (sin password)
console.log('[Sequelize] host:', DB_HOST, 'user:', DB_USER);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  dialect: "mysql",
  logging: false,
});

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
