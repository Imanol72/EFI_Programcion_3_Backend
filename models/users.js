"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relación con Client
      User.hasOne(models.Client, { 
        foreignKey: "id_usuario", 
        as: "cliente" 
      });

      // Relación con Reservation
      User.hasMany(models.Reservation, { 
        foreignKey: "id_usuario", 
        as: "reservas" 
      });
    }
  }

  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false }
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

