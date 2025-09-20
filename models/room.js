"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Reservation, { foreignKey: "id_habitacion" });
    }
  }
  Room.init(
    {
      numero_habitacion: { type: DataTypes.INTEGER, unique: true, allowNull: false },
      tipo: { type: DataTypes.STRING, allowNull: false },
      precio_noche: { type: DataTypes.DECIMAL, allowNull: false },
      disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    { sequelize, modelName: "Room", tableName: "rooms", underscored: true }
  );
  return Room;
};
