// src/models/index.js o backend/models/index.js según tu estructura
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import UsersModel from "./users.model.js";
import RoomsModel from "./rooms.model.js";

dotenv.config();
  console.log(process.env.username);
  
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

// Inicializar modelos
export const Users = UsersModel(sequelize);
export const Rooms = RoomsModel(sequelize);

// Sincronizar modelos con la base de datos (opcional en dev)
sequelize.sync();

export default sequelize;
