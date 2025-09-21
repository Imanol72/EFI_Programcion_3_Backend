// backend/models/index.js
// backend/models/index.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Inicializar conexión
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

// Importar modelos
const User = require("./users")(sequelize, Sequelize.DataTypes);
const Room = require("./room")(sequelize, Sequelize.DataTypes);
const Client = require("./client")(sequelize, Sequelize.DataTypes);
const Reservation = require("./reservation")(sequelize, Sequelize.DataTypes);

// Agrupar modelos (en singular)
const db = { User, Room, Client, Reservation };

// Ejecutar asociaciones
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

// Debug
console.log("Modelos cargados:", Object.keys(db));

// Sincronizar modelos
sequelize.sync()
  .then(() => console.log("✅ Modelos sincronizados con la base de datos"))
  .catch(err => console.error("❌ Error al sincronizar modelos:", err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
