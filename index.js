// src/models/index.js o backend/models/index.js según tu estructura
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UsersModel from "./users.model.js";
import RoomsModel from "./rooms.model.js";

dotenv.config();

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

// Inicializar modelos
export const Users = UsersModel(sequelize);
export const Rooms = RoomsModel(sequelize);

// Sincronizar modelos con la base de datos (opcional en dev)
sequelize.sync();

export default sequelize;
