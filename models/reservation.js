"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.Room, { foreignKey: "id_habitacion" });
      Reservation.belongsTo(models.Client, { foreignKey: "id_cliente" });
    }
  }
  Reservation.init(
    {
      fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
      fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
      total: { type: DataTypes.DECIMAL, allowNull: false },
      estado: { type: DataTypes.ENUM("confirmada", "cancelada"), defaultValue: "confirmada" }
    },
    { sequelize, modelName: "Reservation", tableName: "reservations", underscored: true }
  );
  return Reservation;
};
