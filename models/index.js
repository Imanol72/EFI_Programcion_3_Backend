"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};
  console.log('USER:', process.env.USERNAME);
console.log('PASS:', process.env.PASSWORD);
const sequelize = new Sequelize(
  process.env.DATABASE,
  'root',
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);
fs.readdirSync(__dirname)
  .filter((file) =>
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
