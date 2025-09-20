"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.belongsTo(models.User, { foreignKey: "id_usuario" });
      Client.hasMany(models.Reservation, { foreignKey: "id_cliente" });
    }
  }
  Client.init(
    {
      documento_identidad: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING }
    },
    { sequelize, modelName: "Client", tableName: "clients", underscored: true }
  );
  return Client;
};
