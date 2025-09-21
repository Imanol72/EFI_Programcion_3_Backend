"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // Relación con Client
      Reservation.belongsTo(models.Client, { 
        foreignKey: "id_cliente", 
        as: "cliente" 
      });

      // Relación con Room
      Reservation.belongsTo(models.Room, { 
        foreignKey: "id_habitacion", 
        as: "habitacion" 
      });

      // Relación con User (quien registró la reserva)
      Reservation.belongsTo(models.User, { 
        foreignKey: "id_usuario", 
        as: "usuario" 
      });
    }
  }

  Reservation.init(
    {
      fecha_inicio: { type: DataTypes.DATE, allowNull: false },
      fecha_fin: { type: DataTypes.DATE, allowNull: false },
      estado: { type: DataTypes.STRING, defaultValue: "pendiente" }
    },
    { 
      sequelize, 
      modelName: "Reservation", 
      tableName: "reservations", 
      underscored: true 
    }
  );

  return Reservation;
};
