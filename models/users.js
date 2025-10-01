"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relación con Client
      if (models.Client) {
        User.hasOne(models.Client, { foreignKey: "id_usuario", as: "cliente" });
      }
      // Relación con Reservation
      if (models.Reservation) {
        User.hasMany(models.Reservation, { foreignKey: "id_usuario", as: "reservas" });
      }
    }
  }

  User.init(
    {
      nombre: DataTypes.STRING,
      correo: { type: DataTypes.STRING, unique: true, allowNull: false },
      contraseña: DataTypes.STRING,
      rol: DataTypes.ENUM("admin", "empleado", "cliente"),
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { 
      sequelize, 
      modelName: "User", 
      tableName: "users", 
      underscored: true 
    }
  );

  return User;
};

