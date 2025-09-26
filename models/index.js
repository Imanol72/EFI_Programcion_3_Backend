// backend/models/index.js
"use strict";
const express = require("express");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const basename = path.basename(__filename);
const db = {};


// Middlewares
app.use(cors()); // ✅ habilita CORS para todos los orígenes en desarrollo
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Cargar todos los modelos automáticamente
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Ejecutar asociaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

